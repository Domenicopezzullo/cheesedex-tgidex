import { Declare, Command, Options, AutoLoad, CommandContext } from "seyfert";
import { ListCommand } from "./list.command";
import { InfoCommand } from "./info.command";

@Declare({
  name: "balls",
  description: "balls",
})
// Being in the same folder with @AutoLoad() you can save this step
@Options([ListCommand, InfoCommand])
export default class AccountCommand extends Command {
  override async run(context: CommandContext) {
    await context.write({
      content: "Use subcommands to interact with balls.",
    });
  }
}
