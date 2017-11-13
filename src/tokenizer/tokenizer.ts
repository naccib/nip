import { Message } from 'discord.js';
import { Token, TokenType, TokenValue } from './token';

/**
 * Handles Discord message parsing.
 */
export class Tokenizer
{
    /**
     * The parsed tokens.
     */
    private _tokens: Array<Token> = [];
    
    /**
     * The message to be parsed.
     */
    private message: MessageLike;

    /**
     * The parsing options.
     */
    private parsingOptions: IParsingOptions;

    /**
     * Represents the actual source code that will be parsed.
     */
    private source: string;

    /**
     * The position where the parser currently is.
     */
    private current: number = 0;

    /**
     * The position where the parser started parsing the current token.
     */
    private start: number = 0;

    /**
     * Returns `true` if we are at the end of the messages content.
     */
    private isAtEnd() : boolean
    {
        return this.current >= this.source.length;
    }

    /**
     * Gets the result of a parsing.
     */
    get tokens() : Array<Token>
    {
        return this._tokens;
    }

    /**
     * Creates a new `MessageParser` and parses a single `Message`.
     * @param message The message to be parsed.
     */
    constructor(message: MessageLike, options: IParsingOptions = defaultParsingOptions)
    {
        this.source = message.cleanContent;

        this.message = message;
        this.parsingOptions = options;

        this.parseMessage();
    }

    /**
     * Parses `this.message`.
     */
    private parseMessage() : void
    {
        if(!this.removePrefix())
            throw EvalError('Message does not starts with any identifier.');

        while(!this.isAtEnd())
        {
            this.start = this.current;
            this.scanToken();
        }
    }

    /**
     * Removes the prefix and returns it.
     */
    private removePrefix() : string
    {
        const foundPrefix = this.parsingOptions.Indentifiers
                                    .filter(identifier => this.source.startsWith(identifier))[0];
        
        // Don't even try to parse the message if we don't find a prefix.
        if(foundPrefix)
        {
            this.source = this.source.substring(foundPrefix.length, this.source.length - foundPrefix.length + 1);
            this.addToken(TokenType.Prefix, foundPrefix);
        }

        return foundPrefix;
    }

    /**
     * Scans the next token and adds it to the list.
     */
    private scanToken() : void
    {
        const c = this.advance();

        switch(c)
        {
            case this.parsingOptions.ChainLexeme:
                this.addToken(TokenType.Chain, undefined);
                break;

            case '"':
                this.quotedString();
                break;

            case ' ':
            case '\t':
                break;

            default:
                this.string();
                break;
        }
    }

    /**
     * Advances one character and returns it.
     */
    private advance() : string
    {
        this.current++;

        return this.source.charAt(this.current - 1);
    }

    /**
     * Pushes a new `Token` to our current parsed token list.
     * @param type The type of the token.
     * @param value The value (if any) of the token.
     */
    private addToken(type: TokenType, value?: TokenValue) : void
    {
        this._tokens.push(new Token(type, value));
    }

    /**
     * Peaks the next character of the source code.
     * If we are at the end of our code, returns `undefined`.
     */
    private peek()
    {
        if(this.isAtEnd())
            return undefined;

        return this.source[this.current];
    }

    /**
     * Parses a quoted string.
     */
    private quotedString()
    {
        while(this.peek() !== '"')
            this.advance();
        
        if(this.isAtEnd())
        {
            throw EvalError('Unclosed quoted string.');
        }
        
        this.advance(); // close the "

        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.String, value);
    }

    /**
     * Parses an unquoted string.
     */
    private string()
    {
        while(this.peek() !== ' ' && this.peek() !== undefined)
            this.advance();

        const value = this.source.substring(this.start, this.current);
        this.addToken(TokenType.String, value);
    }
}

/**
 * Commom parsing options.
 */
export interface IParsingOptions
{
    Indentifiers : Array<string>;
    ChainLexeme  : string;
}

/**
 * Common message interface.
 * Used to facilitate testing without a `Discord.Message`.
 */
export interface MessageLike
{
    cleanContent : string
}

/**
 * Default parsing options.
 */
const defaultParsingOptions = {
    Indentifiers: ['!'],
    ChainLexeme: '>'
} as IParsingOptions;