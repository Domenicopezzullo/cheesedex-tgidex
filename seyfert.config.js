import { config } from "seyfert";

export default config.bot({
  locations: {
    base: "src",
    commands: "commands",
    events: "events",
    components: "components",
  },
  token: process.env.BOT_TOKEN || "",
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
});
