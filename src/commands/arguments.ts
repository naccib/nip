/**
 * Contains methods shared by all arguments.
 */
export abstract class UnknownArgument
{
    /**
     * The name of the argument.
     */
    public name: string;

    /**
     * The default value of the argument.
     */
    public defaultValue?: string;

    public isOptional?: boolean;

    /**
     * The convert function.
     */
    abstract convert(rawValue: string);

    constructor(name: string, isOptional: boolean = false, defaultValue?: string)
    {
        this.name = name;
        this.defaultValue = this.convert(defaultValue);
        this.isOptional = isOptional;
    }
}

/**
 * Base class for a required argument of type T.
 */
export abstract class Argument<T> extends UnknownArgument
{
    public value: T;

    constructor(name: string, isOptional, defaultValue?: string, value?: T)
    {
        super(name, isOptional, defaultValue);

        this.value = value;
    }

    public setValue(value: T) : Argument<T>
    {
        if(value == undefined)
            throw Error("Can't set `undefined` as a value to a argument.");

        this.value = value;
        return this;
    }
}

/**
 * Represents a required argument with any type.
 */
export class AnyArgument extends Argument<any>
{
    public convert(rawValue: string) : any
    {
        return rawValue;
    }
}

/**
 * Represents a required `string` argument.
 */
export class StringArgument extends Argument<string>
{
    public convert(rawValue: string) : string
    {
        return rawValue;
    }
}