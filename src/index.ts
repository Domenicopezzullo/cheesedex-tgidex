import { Client } from "seyfert";
import { SQLDatabase } from "../database";
import type { ParseClient } from "seyfert";

const client = new Client();

client
  .start()
  .then(() => client.uploadCommands({ cachePath: "./commands.json" }));

declare module "seyfert" {
  interface UsingClient extends ParseClient<Client<true>> {
    db: SQLDatabase;
  } // Gateway
}
