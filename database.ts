import { Database } from "bun:sqlite";

export class SQLDatabase {
  get_all_channels() {
    const channels = this.database.prepare("select * from channels").all() as {
      guild_id: number;
      channel_id: number;
    }[];
    return channels.map((e) => e.channel_id);
  }
  private database: Database;

  constructor(path: string) {
    this.database = Database.open(path, { create: true });

    // Channels table
    this.database.run(`
            CREATE TABLE IF NOT EXISTS channels (
                guild_id INTEGER PRIMARY KEY,
                channel_id INTEGER
            )    
        `);

    // Users table
    this.database.run(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY
            )
        `);

    // Balls table: each row is one ball owned by a user
    this.database.run(`
            CREATE TABLE IF NOT EXISTS balls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                ball_id INTEGER,
                FOREIGN KEY(user_id) REFERENCES users(user_id)
            )
        `);
  }

  save_channel(guild_id: number, channel_id: number) {
    const stmt = this.database.prepare(`
            INSERT OR REPLACE INTO channels (guild_id, channel_id)
            VALUES (?, ?)
        `);
    return stmt.run(guild_id, channel_id);
  }

  add_ball(user_id: number, ball_id: number) {
    // Ensure user exists
    this.database
      .prepare(
        `
            INSERT OR IGNORE INTO users (user_id) VALUES (?)
        `
      )
      .run(user_id);

    // Add the ball
    const stmt = this.database.prepare(`
            INSERT INTO balls (user_id, ball_id) VALUES (?, ?)
        `);
    return stmt.run(user_id, ball_id);
  }

  get_user_balls(user_id: number) {
    return this.database
      .query("SELECT ball_id FROM balls WHERE user_id = ?")
      .all(user_id);
  }
}
