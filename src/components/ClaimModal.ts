import { Label, Modal, ModalCommand, ModalContext, TextInput } from "seyfert";
import { TextInputStyle } from "seyfert/lib/types";
import { balls } from "../../balls";
import { database } from "..";
import { unlink } from "node:fs/promises";

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
    const text = await Bun.file("data/" + channel.id + "/current_ball").text();
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
      database.add_ball(Number(context.member.id), found_ball.id);
      await unlink(`data/${channel.id}/current_ball`);
    }
  }
}
