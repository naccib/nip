import { Expect, Test, TestFixture, TestCase } from "alsatian";
import { AnyArgument, StringArgument, UnknownArgument } from '../commands/arguments';
import { Command } from '../commands/command';
import { CommandClient } from '../commands/tokenParser';
import { MessageLike } from '../tokenizer/tokenizer';
import { Token } from '../tokenizer/token';

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

const testClient =
    new CommandClient('')
    .addCommand(new Command('jooj').argument('foo', 'any', '2'))
    .addCommand(new Command('big_ass_command'));

@TestFixture("Command Client Test")
export class CommandClientFixture {
    @Test('Test Token Parsing')
    @TestCase(createMessage('!jooj 3'), [ new AnyArgument('foo', false, '2', '3') ])
    public testTokenParsing(msg: MessageLike, expected:  Array<UnknownArgument>)
    {
        
    }
}
