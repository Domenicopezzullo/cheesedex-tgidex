import { ActionRow, Button, ComponentContext } from "seyfert";
import { ComponentCommand } from "seyfert";
import { ClaimModal } from "./ClaimModal";
import { ButtonStyle } from "seyfert/lib/types";

const ClaimButtonDisabled = new Button({
  custom_id: "claimbutton",
  disabled: true,
  label: "Catch me!",
  style: ButtonStyle.Primary,
});

const ClaimButton = new Button({
  custom_id: "claimbutton",
  label: "Catch me!",
  style: ButtonStyle.Primary,
});
export const ClaimButtonAR = new ActionRow<Button>().addComponents(ClaimButton);
export const ClaimButtonDisabledAR = new ActionRow<Button>().addComponents(
  ClaimButtonDisabled,
);

export default class ClaimButtonHandler extends ComponentCommand {
  componentType = "Button" as const;
  override filter(
    context: ComponentContext<typeof this.componentType>,
  ): Promise<boolean> | boolean {
    return context.customId == "claimbutton";
  }
  override run(context: ComponentContext<typeof this.componentType>) {
    context.modal(ClaimModal);
  }
}
