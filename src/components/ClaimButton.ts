import { ActionRow, Button, ComponentContext } from "seyfert";

export const ClaimButton = new Button({
  custom_id: "claimbutton",
  label: "Catch me!",
});
export const ClaimButtonAR = new ActionRow<Button>().addComponents(ClaimButton);

import { ComponentCommand } from "seyfert";
import { ClaimModal } from "./ClaimModal";

export default class ClaimButtonHandler extends ComponentCommand {
  componentType = "Button" as const;
  override filter(
    context: ComponentContext<typeof this.componentType>
  ): Promise<boolean> | boolean {
    return context.customId == "claimbutton";
  }
  override run(context: ComponentContext<typeof this.componentType>) {
    context.modal(ClaimModal);
  }
}
