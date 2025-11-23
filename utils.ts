import { type UsingClient } from "seyfert";
import { readFile } from "node:fs/promises";
import { balls } from "./balls";
import { write } from "bun";
import { ClaimButtonAR } from "./src/components/ClaimButton";
import { mkdir } from "node:fs/promises";

// random delay between 30s and 90s
const randomDelay = () => Math.floor(Math.random() * 60000) + 30000;

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const ballGenStart = async (client: UsingClient, channel_id: number) => {
  const channel = await client.channels.fetch(String(channel_id));
  if (!channel?.isTextable()) return;
  await mkdir(`data/${channel.id}`, { recursive: true });

  const spawnBall = async () => {
    const image = await readFile("balls/image.png");
    const ball = balls[randomIntFromInterval(0, 1)];
    if (!ball) return;
    await write(`data/${channel.id}/current_ball`, `${ball.id}`);
    await channel.messages.write({
      content: "🎉 A new ball has appeared!",
      files: [{ data: image, filename: "balls/image.png" }],
      components: [ClaimButtonAR],
    });

    // schedule next spawn
    setTimeout(spawnBall, randomDelay());
  };

  spawnBall();
};
