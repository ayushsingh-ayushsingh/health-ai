import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { config } from "dotenv";
import fs from "fs/promises";

config();

const { text } = await generateText({
  model: openrouter("bytedance-seed/seedream-4.5"),
  prompt: "A futuristic cityscape at sunset",
});

await fs.writeFile("./text.txt", text);
