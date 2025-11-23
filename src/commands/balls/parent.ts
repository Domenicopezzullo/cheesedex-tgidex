import { Declare, Command, Options, AutoLoad, CommandContext } from "seyfert";
import { ListCommand } from "./list.command";
import { database } from "../..";

@Declare({
  name: "account",
  description: "account command",
})
// Being in the same folder with @AutoLoad() you can save this step
@AutoLoad()
export default class AccountCommand extends Command {}
