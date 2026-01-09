import { Context } from "hono";

import { z } from "zod";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
// import { groq } from "@ai-sdk/groq";

export default async function AiHandler(c: Context) {
  // const user = c.get("user");
  // if (!user) return c.body(null, 401);

  const { messages }: { messages: UIMessage[] } = await c.req.json();

  const result = streamText({
    model: openrouter.chat("nvidia/nemotron-3-nano-30b-a3b:free"),
    // model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
    messages: await convertToModelMessages(messages),
    system: `You are an AI assistant. When a tool returns a result, you must explain the result to the user.`,
    // "You are a Doctor by profession for last 32 years. Respond in proper Markdown format (But do not use Markdown code unless you are asked to). You must use Large headings wherever required.",
    maxRetries: 3,
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: "show the weather in a given city to the user",
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => {
          const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
          // const weatherOptions = ["snowy"];
          console.log("City", city);
          return {
            city,
            weather:
              weatherOptions[Math.floor(Math.random() * weatherOptions.length)],
          };
        },
      },
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: "Ask the user for confirmation.",
        inputSchema: z.object({
          message: z.string().describe("The message to ask for confirmation."),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          "Get the user location. Always ask for confirmation before using this tool.",
        inputSchema: z.object({}),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
