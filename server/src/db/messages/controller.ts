import { Request, Response } from "express";
import { Message } from "./model";
import { Conversation } from "../conversations/model";
import getUserId from "../../lib/userId";
import crypto from "crypto";

export async function listMessages(req: Request, res: Response) {
  const { conversationId } = req.params;
  const userId = await getUserId(req, res);

  // Verify conversation ownership
  const convo = await Conversation.findOne({ _id: conversationId, userId });
  if (!convo) return res.status(404).json({ error: "Not found" });

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();

  // PARSE the stringified JSON back into objects for the frontend
  res.json(
    messages.map((m) => ({
      id: m.uiMessageId,
      role: m.role,
      status: m.status,
      ...JSON.parse(m.content),
    })),
  );
}

export async function createUserMessage(req: Request, res: Response) {
  const conversationId = req.params.conversationId as string;
  const { parts, metadata } = req.body;

  const msg = await Message.create({
    conversationId,
    uiMessageId: crypto.randomUUID(),
    role: "user",
    content: JSON.stringify({ parts, metadata }), // STRINGIFY
    status: "completed",
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    $set: { lastMessageAt: new Date() },
    $inc: { messageCount: 1 },
  });

  res.status(201).json(msg);
}

export async function createAssistantMessage(req: Request, res: Response) {
  const conversationId = req.params.conversationId as string;
  const { llmModel } = req.body;

  const msg = await Message.create({
    conversationId,
    uiMessageId: crypto.randomUUID(),
    role: "assistant",
    content: JSON.stringify({ parts: [] }), // Initial empty parts
    status: "streaming",
    llmModel,
  });

  res.status(201).json(msg);
}

export async function appendAssistantPart(req: Request, res: Response) {
  const { messageId } = req.params;
  const { part } = req.body;

  const msg = await Message.findById(messageId);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  // 1. Parse current content
  const data = JSON.parse(msg.content);
  // 2. Update data
  data.parts.push(part);
  // 3. Stringify and save
  msg.content = JSON.stringify(data);
  await msg.save();

  res.status(204).send();
}

export async function finalizeAssistantMessage(req: Request, res: Response) {
  const { messageId } = req.params;
  const { tokenCount } = req.body;

  const msg = await Message.findByIdAndUpdate(
    messageId,
    { $set: { status: "completed", tokenCount } },
    { new: true },
  );

  if (msg) {
    await Conversation.findByIdAndUpdate(msg.conversationId, {
      $inc: { messageCount: 1, tokenCount: tokenCount || 0 },
      $set: { lastMessageAt: new Date() },
    });
  }

  res.json(msg);
}
