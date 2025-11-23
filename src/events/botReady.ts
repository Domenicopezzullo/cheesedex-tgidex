import { createEvent } from "seyfert";
import { ballGenStart } from "../../utils";
import { database } from "..";

export default createEvent({
  data: { once: true, name: "botReady" },
  run(user, client) {
    const channels = database.get_all_channels();
    for (const channel of channels) {
      client.logger.info(`Starting ball generation in channel ID: ${channel}`);
      ballGenStart(client, channel);
    }
    client.logger.info(`Bot started\nUsername: ${user.name}\nID: ${user.id}`);
  },
});
