import { Client } from "seyfert";
import { SQLDatabase } from "../database";
import type { ParseClient } from "seyfert";

const client = new Client();

client
  .start()
  .then(() => client.uploadCommands({ cachePath: "./commands.json" }));

export const database = new SQLDatabase("database.db");

declare module "seyfert" {
  interface UsingClient extends ParseClient<Client<true>> {} // Gateway
}
