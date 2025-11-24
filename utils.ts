import { Message, type UsingClient } from "seyfert";
import { readFile } from "node:fs/promises";
import { balls } from "./balls";
import { write } from "bun";
import {
  ClaimButtonAR,
  ClaimButtonDisabledAR,
} from "./src/components/ClaimButton";
import { mkdir } from "node:fs/promises";
import { unlink } from "node:fs/promises";

// random delay between 30s and 90s
const randomDelay = () => Math.floor(Math.random() * 60000) + 30000 * 15;

function randomIntFromWeighted(weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;

  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    if (w === undefined) continue;
    if (r < w) return i;
    r -= w;
  }

  // fallback (should never happen)
  return weights.length - 1;
}

export const spawnBall = async (client: UsingClient, channel_id: string) => {
  const channel = await client.channels.fetch(channel_id);
  if (!channel?.isTextable()) return;
  await mkdir(`data/${channel.id}`, { recursive: true });
  const ball = balls[randomIntFromWeighted([1, 10, 3, 1.1, 0.4])];
  if (!ball) return;
  let buffer: ArrayBuffer = new ArrayBuffer(0);
  const res = await fetch(ball.file_link);
  buffer = await res.arrayBuffer();
  await write(`balls/${ball.name}.png`, Buffer.from(buffer));
  const message = await channel.messages
    .write({
      content: "A wild tgiball appeared!",
      files: [{ data: buffer, filename: ball.file }],
      components: [ClaimButtonAR],
    })
    .then(async (msg) => {
      await write(`data/${channel.id}/current_ball`, `${ball.id}|${msg.id}`);
      setTimeout(async () => {
        msg.edit({
          content: "A wild tgiball appeared!",
          components: [ClaimButtonDisabledAR],
        });
        await unlink(`data/${channel.id}/current_ball`);
      }, 15000);
    });
};
