
/**
 * The possible values of a Token.
 */
export type TokenValue = string 
                | number 
                | Array<string>
                | Array<number>; 

/**
 * The type of a Token.
 */
export enum TokenType
{
    String,
    Space,
    Chain,
    Prefix
}

export class Token
{
    private _type: TokenType;
    
    public value: TokenValue;

    /**
     * Gets the type of the current Token.
     */
    get type()
    {
        return this._type;
    }

    constructor(type: TokenType, value: TokenValue)
    {
        this._type = type;
        this.value = value;
    }
}