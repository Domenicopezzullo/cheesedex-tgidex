import { Declare, Command, AutoLoad, CommandContext } from "seyfert";

@Declare({
  name: "balls",
  description: "balls",
})
// Being in the same folder with @AutoLoad() you can save this step
@AutoLoad()
export default class AccountCommand extends Command {
  override async run(context: CommandContext) {
    await context.write({
      content: "Use subcommands to interact with balls.",
    });
  }
}
