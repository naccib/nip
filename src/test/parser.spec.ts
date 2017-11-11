import { Expect, Test, TestFixture, TestCase } from "alsatian";

import { MessageParser, MessageLike } from '../parser/parser';
import { Token, TokenType } from '../parser/token';

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

@TestFixture("Parsing Test")
export class ExampleTestFixture {

  @Test("Test invalid messages.")
  @TestCase(createMessage(''))
  @TestCase(createMessage(' '))
  public invalidMessages(message: MessageLike) {    
    Expect(() => new MessageParser(message)).toThrow();
  }

  @Test("Test valid messages.")
  @TestCase(createMessage('!'), [prefixToken])
  @TestCase(createMessage('!parser'), [prefixToken, new Token(TokenType.String, 'parser')])
  public validMessages(message: MessageLike, expected: Array<Token>) {    
    Expect(new MessageParser(message).tokens).toEqual(expected);
  }
}