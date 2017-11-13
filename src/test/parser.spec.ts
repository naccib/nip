import { Expect, Test, TestFixture, TestCase } from "alsatian";

import { Tokenizer, MessageLike, IParsingOptions  } from '../tokenizer/tokenizer';
import { Token, TokenType, TokenValue } from '../tokenizer/token';

/**
 * Helper function to create messages with a given content.
 * @param content The content of the message.
 */
const createMessage = (content: string) : MessageLike =>
{
  return {
    cleanContent: content
  }
};

/**
 * Helper prefix token.
 */
const prefixToken = new Token(TokenType.Prefix, '!');
const stringToken = (value: string) : Token => new Token(TokenType.String, value);

@TestFixture("Parsing Test")
export class ExampleTestFixture {

  @Test("Test invalid messages.")
  @TestCase(createMessage(''))
  @TestCase(createMessage(' '))
  public invalidMessages(message: MessageLike) {    
    Expect(() => new Tokenizer(message)).toThrow();
  }

  @Test("Test valid messages.")
  @TestCase(createMessage('!'), [prefixToken])
  @TestCase(createMessage('!parser'), [prefixToken, new Token(TokenType.String, 'parser')])
  @TestCase(createMessage('!big_command_name argument1 "argument 2" 92.2'), [prefixToken, stringToken('big_command_name'), stringToken('argument1'), stringToken('argument 2'), stringToken('92.2')])
  public validMessages(message: MessageLike, expected: Array<Token>) {    
    Expect(new Tokenizer(message).tokens).toEqual(expected);
  }
}