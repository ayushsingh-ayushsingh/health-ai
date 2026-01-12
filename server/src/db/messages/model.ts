import mongoose, { Document, Schema } from "mongoose";

export interface MessageDoc extends Document {
  conversationId: mongoose.Types.ObjectId;
  uiMessageId: string;
  role: "system" | "user" | "assistant";
  content: string;
  status: "streaming" | "completed" | "error";
  llmModel?: string;
  tokenCount?: number;
  createdAt: Date;
}

const MessageSchema = new Schema<MessageDoc>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    uiMessageId: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ["system", "user", "assistant"],
      required: true,
    },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["streaming", "completed", "error"],
      default: "completed",
    },
    llmModel: { type: String },
    tokenCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model<MessageDoc>("Message", MessageSchema);
