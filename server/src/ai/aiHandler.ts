import { Request, Response } from "express";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { groq } from "@ai-sdk/groq";
import crypto from "crypto";

import { Conversation } from "../db/conversations/model";
import { Message } from "../db/messages/model";

export default async function AiHandler(req: Request, res: Response) {
  try {
    const {
      messages,
      conversationId,
    }: { messages: UIMessage[]; conversationId: string } = req.body;

    console.log("Last message:", JSON.stringify(messages.at(-1), null, 2));

    if (!messages?.length || !conversationId) {
      return res
        .status(400)
        .json({ error: "Missing messages or conversationId" });
    }

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === "user") {
      await Message.findOneAndUpdate(
        { uiMessageId: lastUserMessage.id },
        {
          conversationId,
          uiMessageId: lastUserMessage.id || crypto.randomUUID(),
          role: "user",
          content: JSON.stringify({
            parts: lastUserMessage.parts,
            id: lastUserMessage.id,
            role: lastUserMessage.role,
          }),
          status: "completed",
        },
        { upsert: true, new: true },
      );
    }

    const result = streamText({
      model:
        openrouter.chat("nvidia/nemotron-nano-12b-v2-vl:free") ||
        openrouter.chat("nvidia/nemotron-3-nano-30b-a3b:free") ||
        openrouter.chat("mistralai/devstral-2512:free") ||
        groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      messages: await convertToModelMessages(messages),
      system: `You are an AI assistant. When a tool returns a result, you must explain the result to the user.`,
      maxRetries: 3,
      onFinish: async ({ response, usage }) => {
        try {
          const lastMessage = response.messages.at(-1);
          console.log("Final assistant message:");
          console.log(JSON.stringify(lastMessage, null, 2));

          await Message.create({
            conversationId,
            uiMessageId: crypto.randomUUID(),
            role: "assistant",
            content: JSON.stringify(lastMessage),
            status: "completed",
            tokenCount: usage.totalTokens,
          });

          await Conversation.updateOne(
            { _id: conversationId },
            {
              $inc: {
                messageCount: 2,
                tokenCount: usage.totalTokens,
              },
              $set: { lastMessageAt: new Date() },
            },
          );
        } catch (dbError) {
          console.error("Failed to save to database:", dbError);
        }
      },
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("AI Handler Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
