import { Context } from "hono";

// import { z } from "zod";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { groq } from "@ai-sdk/groq";

export default async function AiHandler(c: Context) {
  const { messages }: { messages: UIMessage[] } = await c.req.json();

  // this prints complete chat between user and the bot
  console.log(JSON.stringify(messages, null, 2));

  // this prints the last message
  console.log(JSON.stringify(messages.at(-1), null, 2));

  const result = streamText({
    model:
      // openrouter.chat("xiaomi/mimo-v2-flash:free") ||
      openrouter.chat("nvidia/nemotron-nano-12b-v2-vl:free") ||
      openrouter.chat("nvidia/nemotron-3-nano-30b-a3b:free") ||
      openrouter.chat("mistralai/devstral-2512:free") ||
      groq("meta-llama/llama-4-scout-17b-16e-instruct"),

    messages: await convertToModelMessages(messages),
    system: `You are an AI assistant. When a tool returns a result, you must explain the result to the user.`,
    maxRetries: 3,

    onFinish({ response }) {
      const lastMessage = response.messages.at(-1);

      console.log("Final assistant message:");
      console.log(JSON.stringify(lastMessage, null, 2));
    },
  });

  return result.toUIMessageStreamResponse();
}

// tools: {
//   // server-side tool with execute function:
//   getWeatherInformation: {
//     description: "show the weather in a given city to the user",
//     inputSchema: z.object({ city: z.string() }),
//     execute: ({ city }: { city: string }) => {
//       const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
//       // const weatherOptions = ["snowy"];
//       console.log("City", city);
//       return {
//         city,
//         weather:
//           weatherOptions[Math.floor(Math.random() * weatherOptions.length)],
//       };
//     },
//   },
//   // client-side tool that starts user interaction:
//   askForConfirmation: {
//     description: "Ask the user for confirmation.",
//     inputSchema: z.object({
//       message: z.string().describe("The message to ask for confirmation."),
//     }),
//   },
//   // client-side tool that is automatically executed on the client:
//   getLocation: {
//     description:
//       "Get the user location. Always ask for confirmation before using this tool.",
//     inputSchema: z.object({}),
//   },
// },
