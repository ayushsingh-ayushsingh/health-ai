import { Request, Response } from "express";
import { Conversation } from "./model";
import { Message } from "../messages/model";
import getUserId from "../../lib/userId";

export async function createConversation(req: Request, res: Response) {
  const userId = await getUserId(req, res);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const convo = await Conversation.create({
    userId: userId as string,
    title: "New Conversation",
  });
  res.status(201).json(convo);
}

export async function listConversations(req: Request, res: Response) {
  const userId = await getUserId(req, res);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const list = await Conversation.find({ userId })
    .sort({ lastMessageAt: -1 })
    .limit(20)
    .lean();

  res.json(list);
}

export async function getConversation(req: Request, res: Response) {
  const { conversationId } = req.params;
  const userId = await getUserId(req, res);

  const convo = await Conversation.findOne({
    _id: conversationId,
    userId,
  }).lean();
  if (!convo) return res.status(404).json({ error: "Not found" });

  // Get messages and parse the stringified JSON content back into objects
  const rawMessages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();
  const messages = rawMessages.map((m) => ({
    ...m,
    content: JSON.parse(m.content), // Convert string back to Object for the frontend
  }));

  res.json({ ...convo, messages });
}

export async function updateConversation(req: Request, res: Response) {
  const { conversationId } = req.params;
  const userId = await getUserId(req, res);
  const { title } = req.body;

  const convo = await Conversation.findOneAndUpdate(
    { _id: conversationId, userId },
    { $set: { title } },
    { new: true },
  );

  res.json(convo);
}

export async function deleteConversation(req: Request, res: Response) {
  const { conversationId } = req.params;
  const userId = await getUserId(req, res);

  const deleted = await Conversation.findOneAndDelete({
    _id: conversationId,
    userId,
  });
  if (deleted) {
    await Message.deleteMany({ conversationId });
  }

  res.status(204).send();
}
