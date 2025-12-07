import { Declare, CommandContext, SubCommand } from "seyfert";
import { balls } from "../../../balls";

@Declare({
  name: "list",
  description: "List all your balls",
})
export class ListCommand extends SubCommand {
  override async run(context: CommandContext) {
    if (!context.member) return;
    const ballsFetch = context.client.db.get_user_balls(context.member.id) as {
      ball_id: number;
    }[];
    context.client.logger.info(ballsFetch);
    if (ballsFetch.length === 0) {
      await context.write({ content: "You have no balls!" });
      return;
    }
    const userBalls = ballsFetch.map(b => {
      const foundBall = balls.find((ball) => ball.id === b.ball_id);
      if (!foundBall) return `Unknown Ball (ID: ${b.ball_id})`;
      return `${foundBall.name} (Health: ${foundBall.health})`;
    });

    await context.write({
      content: `Your balls:\n\\- ${userBalls.join("\n\\- ")}`,
    });
  }
}
