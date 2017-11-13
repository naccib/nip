import { UnknownArgument, Argument, AnyArgument, StringArgument } from './arguments';
 
type IdentifierType = string | Array<string>;

export class Command
{
    private _identifiers : Array<string>;
    public expectedArguments : Array<UnknownArgument> = [];

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
}