import { Expect, Test, TestFixture, TestCase } from "alsatian";
import { AnyArgument, StringArgument, UnknownArgument } from '../commands/arguments';
import { Command } from '../commands/command';


@TestFixture("Argument Parsing Test")
export class ArgumentParsingFixture {
    @Test('Test valid commands')
    @TestCase('arg_name', 'any', 'nothing', new AnyArgument('arg_name', false, 'nothing'))
    @TestCase('[jooj]', 'string', 'boo', new StringArgument('jooj', true, 'boo'))
    public validCommands(signature: string, type: string, defaultValue: string, expected: UnknownArgument)
    {
        Expect(new Command('jooj')
            .argument(signature, type, defaultValue)
            .expectedArguments[0]).toEqual(expected);
    }
}