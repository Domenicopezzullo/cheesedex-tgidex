import { Message, type UsingClient } from "seyfert";
import { readFile } from "node:fs/promises";
import { balls } from "./balls";
import { write } from "bun";
import {
  ClaimButtonAR,
  ClaimButtonDisabledAR,
} from "./src/components/ClaimButton";
import { mkdir } from "node:fs/promises";

// random delay between 30s and 90s
const randomDelay = () => Math.floor(Math.random() * 60000) + 30000;

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const ballGenStart = async (client: UsingClient, channel_id: string) => {
  const channel = await client.channels.fetch(channel_id);
  if (!channel?.isTextable()) return;
  await mkdir(`data/${channel.id}`, { recursive: true });
  const spawnBall = async () => {
    const ball = balls[randomIntFromInterval(0, 1)];
    if (!ball) return;
    let buffer: ArrayBuffer = new ArrayBuffer(0);
    const res = await fetch(ball.file_link);
    buffer = await res.arrayBuffer();
    await write(`balls/${ball.name}.png`, Buffer.from(buffer));
    await write(`data/${channel.id}/current_ball`, `${ball.id}`);
    const message = await channel.messages
      .write({
        content: "A wild tgiball appeared!",
        files: [{ data: buffer, filename: ball.file }],
        components: [ClaimButtonAR],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.edit({
            content: "A wild tgiball appeared!",
            components: [ClaimButtonDisabledAR],
          });
        }, 15000);
      });

    // schedule next spawn
    setInterval(spawnBall, randomDelay());
  };

  spawnBall();
};
