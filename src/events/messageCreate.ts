import { createEvent } from "seyfert";
import { spawnBall } from "../../utils";

function randomAmount() {
  return Math.floor(Math.random() * (72 - 25 + 1)) + 25;
}

export default createEvent({
  data: { once: false, name: "messageCreate" },
  async run(msg, client) {
    if (msg.author.bot) return;
    const channel = await msg.channel("rest");

    const amount = randomAmount();

    // case 1: goal already exists
    if (client.db.is_goal_present(channel.id)) {
      const goal = client.db.get_goal(channel.id);
      const current = client.db.get_message_count(channel.id) || 0;

      const updated = current + 1;
      client.db.set_message_count(channel.id, updated);

      if (updated >= goal) {
        spawnBall(client, channel.id);

        // reset message count
        client.db.set_message_count(channel.id, 0);

        // create new goal
        client.db.set_goal(channel.id, randomAmount());
      }

      return;
    }

    // case 2: no goal exists (create one)
    client.db.set_goal(channel.id, amount);
    const goal = client.db.get_goal(channel.id);
    client.logger.info(goal);
    console.log(goal);
    client.db.set_message_count(channel.id, 1);
  },
});
