import { UnknownArgument, Argument, AnyArgument, StringArgument } from './arguments';
import { Message, Client, Guild, Channel } from 'discord.js';
 
type IdentifierType = string | Array<string>;

type CommandFunction = (args: Array<UnknownArgument>, context: IContext) => void;

/**
 * Context of a command call.
 */
interface IContext
{
    message: Message,
    client: Client,
    guild: Guild,
    channel: Channel
}

/**
 * Handles argument parsing and stores command information.
 */
export class Command
{
    private _identifiers : Array<string>;
    private _expectedArguments : Array<UnknownArgument> = [];
    private _onActivated : CommandFunction;

    /**
     * The identifiers associated with this command.
     */
    get identifiers() : Array<string>
    {
        return this._identifiers;
    }

    /**
     * The expected arguments associated with this command.
     */
    get expectedArguments() : Array<UnknownArgument>
    {
        return this._expectedArguments;
    }

    /**
     * The function to be called when the command is activated.
     */
    get onActivated() : CommandFunction
    {
        return this._onActivated;
    }

    /**
     * Creates a new command with a one or more identifiers (aliases).
     * @param identifiers The command identifiers.
     */
    constructor(identifiers: IdentifierType)
    {
        // TODO(naccib): make this more typescript-y.
        if(typeof identifiers === 'string')
            this._identifiers = [identifiers as string];
        else
            this._identifiers = identifiers;
    }

    /**
     * Creates a new argument and adds it to the expected argument list.
     * @param signature The signature of the argument. This may be `arg_name` for requried arguments or `[arg_name]` for optional arguments.
     * @param type The type of the argument. If none is provided, `'any'` will be used.
     * @param defaultValue The default value of the argument. This is required if the current argument is optional.
     */
    public argument(signature: string, type?: string, defaultValue?: string) : Command
    {
        const isOptional = signature.startsWith('[') && signature.endsWith(']');

        const name = isOptional ? signature.substr(1, signature.length - 2) : signature;
        const argType = type ? type : 'any';   
        
        var argument: UnknownArgument = undefined;

        switch(argType)
        {
            case 'any':
                argument = new AnyArgument(name, isOptional, defaultValue, undefined);
                break;

            case 'string':
                argument = new StringArgument(name, isOptional, defaultValue, undefined);
        }

        this.expectedArguments.push(argument);

        return this;
    }

    public action(onActivated: CommandFunction) : Command
    {
        this._onActivated = onActivated;

        return this;
    }
}