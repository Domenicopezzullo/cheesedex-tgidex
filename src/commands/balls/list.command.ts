import { Declare, Command, CommandContext } from "seyfert";
import { database } from "../..";
import { balls } from "../../../balls";

@Declare({
  name: "list",
  description: "List all your balls",
})
export class ListCommand extends Command {
  override async run(context: CommandContext) {
    if (!context.member) return;
    const ballsFetch = database.get_user_balls(Number(context.member.id));
    context.client.logger.info(ballsFetch);
    const ownedBalls = ballsFetch.map((b) => balls[b.ball_id]);
    const message = `Owned balls:\n${
      ownedBalls.map((b) => `- ${b.name}`).join("\n") ||
      "You don't own any balls yet."
    }`;
  }
}
