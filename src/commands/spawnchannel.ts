import {
  Command,
  CommandContext,
  createChannelOption,
  Declare,
  Options,
} from "seyfert";
import { database } from "..";

const options = {
  channel: createChannelOption({
    description: "The channel",
    required: true,
  }),
};

@Declare({
  name: "setspawnchannel",
  description: "Set's the channel where the balls will spawn",
})
@Options(options)
export class SetChannelCommand extends Command {
  override run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    database.save_channel(Number(ctx.guildId), Number(ctx.options.channel.id));
  }
}
