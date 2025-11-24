import {
  Command,
  CommandContext,
  createChannelOption,
  Declare,
  Options,
} from "seyfert";

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
export default class SetChannelCommand extends Command {
  override run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    ctx.client.logger.info(ctx.options.channel.id);
    ctx.client.logger.info(ctx.guildId);
    ctx.client.db.save_channel(ctx.guildId, ctx.options.channel.id);
    return ctx.write({
      content: `Spawn channel set to <#${ctx.options.channel.id}>`,
    });
  }
}
