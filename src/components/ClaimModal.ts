import { Label, Modal, ModalCommand, ModalContext, TextInput } from "seyfert";
import { TextInputStyle } from "seyfert/lib/types";
import { balls } from "../../balls";
import { unlink } from "node:fs/promises";
import { ClaimButtonDisabledAR } from "./ClaimButton";

const nameText = new TextInput({
  style: TextInputStyle.Short,
  custom_id: "nameofdaball",
});

const nameTextLabel = new Label({
  label: "Name of the ball",
}).setComponent(nameText);

export const ClaimModal = new Modal({
  custom_id: "claimmodal",
  title: "Catch da ball",
}).setComponents([nameTextLabel]);

export default class ClaimModalHandler extends ModalCommand {
  override filter(context: ModalContext): Promise<boolean> | boolean {
    return context.customId == "claimmodal";
  }
  override async run(context: ModalContext) {
    if (!context.channel) return;
    if (!context.member) return;
    const channel = await context.channel("rest");
    const name = context.interaction.getInputValue("nameofdaball") as string;
    const text = (
      await Bun.file("data/" + channel.id + "/current_ball").text()
    ).split("|")[0];
    if (!text) return;
    const found_ball = balls.find((b) => b.id == Number(text));
    if (
      found_ball === undefined ||
      found_ball.name.toLowerCase() != name.toLowerCase()
    ) {
      await context.write({
        content: "Wrong name! try again!",
      });
    } else {
      await context.write({ content: `You caught a ${found_ball.name} 🎉` });
      context.client.db.add_ball(context.member.id, found_ball.id);
      const msg_id = (
        await Bun.file("data/" + channel.id + "/current_ball").text()
      ).split("|")[1];
      if (!msg_id) return;
      const msg = await context.client.messages.fetch(msg_id, channel.id);
      await msg.edit({
        components: [ClaimButtonDisabledAR],
      });
      await unlink(`data/${channel.id}/current_ball`);
    }
  }
}
