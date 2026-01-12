import mongoose, { Schema, Document } from "mongoose";

export interface ConversationDoc extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  llmModel: string;
  messageCount: number;
  tokenCount: number;
  lastMessageAt: Date;
}

const ConversationSchema = new Schema<ConversationDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, default: "New Chat" },
    llmModel: { type: String, default: "auto" },
    messageCount: { type: Number, default: 0 },
    tokenCount: { type: Number, default: 0 },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

ConversationSchema.index({ userId: 1, lastMessageAt: -1 });

export const Conversation = mongoose.model<ConversationDoc>(
  "Conversation",
  ConversationSchema,
);
