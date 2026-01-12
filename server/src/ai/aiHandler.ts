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

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === "user") {
      await Message.findOneAndUpdate(
        { uiMessageId: lastUserMessage.id },
        {
          conversationId,
          uiMessageId: lastUserMessage.id || crypto.randomUUID(),
          role: "user",
          content: JSON.stringify(lastUserMessage),
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
    });

    result.pipeUIMessageStreamToResponse(res, {
      sendReasoning: true, // Send reasoning parts if available
      sendSources: true, // Send source parts if available
      onFinish: async ({ messages }) => {
        try {
          console.log("Final assistant UIMessage:");
          const aiResponse = messages[messages.length - 1];

          console.log(JSON.stringify(aiResponse, null, 2));

          // Save the response message to database
          await Message.create({
            conversationId,
            uiMessageId: crypto.randomUUID(),
            role: "assistant",
            content: JSON.stringify(aiResponse),
            status: "completed",
            tokenCount: 0,
          });

          // Update conversation
          await Conversation.updateOne(
            { _id: conversationId },
            {
              $inc: {
                messageCount: 2,
              },
              $set: { lastMessageAt: new Date() },
            },
          );
        } catch (dbError) {
          console.error("Failed to save to database:", dbError);
        }
      },
    });
  } catch (error) {
    console.error("AI Handler Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
