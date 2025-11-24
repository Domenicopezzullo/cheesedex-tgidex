import { createEvent } from "seyfert";
import { SQLDatabase } from "../../database";

export default createEvent({
  data: { once: true, name: "botReady" },
  run(user, client) {
    client.db = new SQLDatabase("database.db");
    const channels = client.db.get_all_channels();
    for (const channel of channels) {
      client.logger.info(`Starting ball generation in channel ID: ${channel}`);
    }
    client.logger.info(`Bot started\nUsername: ${user.name}\nID: ${user.id}`);
  },
});
