import { Client, ClientOptions, Message } from 'discord.js';

import { Token, TokenValue, TokenType } from '../tokenizer/token';
import { Tokenizer, IParsingOptions, MessageLike } from '../tokenizer/tokenizer'
import { Command } from './command';
import { Argument, UnknownArgument, AnyArgument, StringArgument } from './arguments';

export class CommandClient
{
    private _client: Client;
    private _commands: Array<Command> = [];

    get client() : Client
    {
        return this._client;
    }

    get commands() : Array<Command>
    {
        return this._commands;
    }

    constructor(token: string, opts?: ClientOptions)
    {
        this._client = new Client(opts);
    }

    /**
     * Connects to Discord.
     * @param token The token to be used to connect to Discord.
     */
    public async connect(token: string) : Promise<string>
    {
        const result = this._client.login(token);

        this.setupListeners();
        return result;
    }

     /**
     * Connects to Discord.
     * @param token The token to be used to connect to Discord.
     */
    public async login(token: string) : Promise<string>
    {
        return this.connect(token);
    }

    /**
     * Adds a new command.
     * @param cmd The command to be added.
     */
    public addCommand(cmd: Command) : CommandClient
    {
        if(cmd == undefined)
            throw Error("Can't add `undefined` command");

        this._commands.push(cmd);
        return this;
    }

    private setupListeners()
    {
        this._client.on('message', this.onMessage);
    }

    /**
     * Message callback.
     */
    public onMessage(msg: Message)
    {
        try
        {
            const tokens = new Tokenizer(msg).tokens;

            if(tokens.length === 0)
                return;

            const cmd = this.findCommand(tokens);

            if(cmd == undefined)
                return;

            const args = this.parseArguments(cmd, tokens);

            if(cmd.onActivated == undefined)
                throw Error('Undefined action function for command ' + cmd.identifiers[0]);

            cmd.onActivated(args, {
                message: msg,
                guild: msg.guild,
                channel: msg.channel,
                client: msg.client
            });
        }
        catch(e)
        {
            console.error(e);
            throw e;
        }
    }

    private findCommand(tokens: Array<Token>) : Command
    { 
        const identifier = tokens[1];
        return this._commands.find(cmd => cmd.identifiers.indexOf(identifier.value as string) !== -1);
    }

    private parseArguments(cmd: Command, tokens: Array<Token>) : Array<UnknownArgument>
    {
        const result : Array<UnknownArgument> = [];

        cmd.expectedArguments.forEach((arg, i) => {
            if(arg instanceof AnyArgument)
            {
                const parsedArg = this.createArgument<any, AnyArgument>(arg, tokens[i + 2]);

                result.push(parsedArg);
            }
        });

        return result;
    }

    private createArgument<T, ArgumentT extends Argument<T>>(argument: ArgumentT, token: Token) : ArgumentT
    {
        if(token.value == undefined && !argument.isOptional)
            throw Error('Undefined token in a non-optional argument named ' + argument.name);
        
        return argument.setValue(argument.convert(token.value)) as ArgumentT;
    }
}