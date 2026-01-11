import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import AiHandler from "./ai/aiHandler";
import "./lib/db";
import {
  createConversation,
  listConversations,
  getConversation,
  updateConversation,
  deleteConversation,
} from "./db/conversations/controller";
import {
  listMessages,
  createUserMessage,
  createAssistantMessage,
  appendAssistantPart,
  finalizeAssistantMessage,
} from "./db/messages/controller";
import { protectedAsyncHandler } from "./lib/handlers";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

// Auth routes must be before express.json()
app.all("/api/auth/*path", toNodeHandler(auth));

app.use(express.json());

// Basic route
app.get("/", (_req, res) => {
  return res.send("Hello Express!");
});

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  console.log("Session", session);
  return res.json(session);
});

// AI Chat route
app.post("/api/chat", protectedAsyncHandler(AiHandler));

// Conversation routes
app.post("/api/conversations", protectedAsyncHandler(createConversation));
app.get("/api/conversations", protectedAsyncHandler(listConversations));
app.get(
  "/api/conversations/:conversationId",
  protectedAsyncHandler(getConversation),
);
app.patch(
  "/api/conversations/:conversationId",
  protectedAsyncHandler(updateConversation),
);
app.delete(
  "/api/conversations/:conversationId",
  protectedAsyncHandler(deleteConversation),
);

app.get(
  "/api/conversations/:conversationId/messages",
  protectedAsyncHandler(listMessages),
);
app.post(
  "/api/conversations/:conversationId/messages/user",
  protectedAsyncHandler(createUserMessage),
);
app.post(
  "/api/conversations/:conversationId/messages/assistant",
  protectedAsyncHandler(createAssistantMessage),
);
app.patch(
  "/api/messages/:messageId/append",
  protectedAsyncHandler(appendAssistantPart),
);
app.patch(
  "/api/messages/:messageId/finalize",
  protectedAsyncHandler(finalizeAssistantMessage),
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
