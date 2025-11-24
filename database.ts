import { Database } from "bun:sqlite";

export class SQLDatabase {
  private database: Database;

  constructor(path: string) {
    this.database = Database.open(path, { create: true });

    // Channels table
    this.database.run(`
    CREATE TABLE IF NOT EXISTS channels (
        channel_id TEXT PRIMARY KEY,
        guild_id TEXT,
        message_goal INTEGER,
        message_count INTEGER DEFAULT 0
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
                user_id TEXT,
                ball_id INTEGER,
                FOREIGN KEY(user_id) REFERENCES users(user_id)
            )
        `);
  }

  save_channel(guild_id: string, channel_id: string) {
    const stmt = this.database.prepare(`
            INSERT OR REPLACE INTO channels (guild_id, channel_id)
            VALUES (?, ?)
        `);
    return stmt.run(guild_id, channel_id);
  }

  set_goal(channel_id: string, message_goal: number) {
    // First, ensure the row exists
    const insertStmt = this.database.prepare(`
        INSERT OR IGNORE INTO channels (channel_id, message_count)
        VALUES (?, 0)
    `);
    insertStmt.run(channel_id);

    // Then update the goal
    const updateStmt = this.database.prepare(`
        UPDATE channels
        SET message_goal = ?
        WHERE channel_id = ?
    `);
    return updateStmt.run(message_goal, channel_id);
  }

  get_message_count(channel_id: string) {
    const stmt = this.database.prepare(`
            SELECT message_count FROM channels WHERE channel_id = ?
        `);
    const res = stmt.get(channel_id) as { message_count: number };
    return res?.message_count;
  }
  set_message_count(channel_id: string, message_count: number) {
    // First, ensure the row exists
    const insertStmt = this.database.prepare(`
        INSERT OR IGNORE INTO channels (channel_id, message_goal)
        VALUES (?, NULL)
    `);
    insertStmt.run(channel_id);

    // Then update the count
    const updateStmt = this.database.prepare(`
        UPDATE channels
        SET message_count = ?
        WHERE channel_id = ?
    `);
    return updateStmt.run(message_count, channel_id);
  }

  get_goal(channel_id: string) {
    const stmt = this.database.prepare(`
            SELECT message_goal FROM channels WHERE channel_id = ?
        `);
    const res = stmt.get(channel_id) as { message_goal: number };
    return res?.message_goal;
  }

  is_goal_present(channel_id: string) {
    const stmt = this.database.prepare(`
            SELECT 1 FROM channels WHERE channel_id = ? AND message_goal IS NOT NULL
        `);
    const res = stmt.get(channel_id);
    return !!res;
  }

  get_all_channels() {
    const channels = this.database.prepare("select * from channels").all() as {
      guild_id: string;
      channel_id: string;
    }[];
    return channels.map((c) => c.channel_id);
  }

  add_ball(user_id: string, ball_id: number) {
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

  get_user_balls(user_id: string) {
    return this.database
      .query("SELECT ball_id FROM balls WHERE user_id = ?")
      .all(user_id);
  }
}
