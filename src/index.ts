import { Client } from "seyfert";
import { SQLDatabase } from "../database";

const client = new Client();

client
  .start()
  .then(() => client.uploadCommands({ cachePath: "../commands.json" }));

export const database = new SQLDatabase("database.db");
