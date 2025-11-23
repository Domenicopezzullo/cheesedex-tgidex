import { Declare, CommandContext, SubCommand } from "seyfert";
import { database } from "../..";
import { balls } from "../../../balls";

@Declare({
  name: "list",
  description: "List all your balls",
})
export class ListCommand extends SubCommand {
  override async run(context: CommandContext) {
    if (!context.member) return;
    const ballsFetch = database.get_user_balls(context.member.id) as {
      user_id: number;
      ball_id: number;
    }[];
    context.client.logger.info(ballsFetch);
    if (ballsFetch.length === 0) {
      await context.write({ content: "You have no balls!" });
      return;
    }
    const userBalls = ballsFetch.map((b) => {
      const found_ball = balls.find((ball) => ball.id === b.ball_id);
      return found_ball ? found_ball.name : `Unknown Ball (ID: ${b.ball_id})`;
    });
    await context.write({
      content: `Your balls: \n\\- ${userBalls.join("\n\\- ")}`,
    });
  }
}
