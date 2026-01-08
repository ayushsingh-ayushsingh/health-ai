import { Hono } from "hono";
import { auth } from "../lib/auth"; // path to your auth file
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { serve } from "@hono/node-server";

export const maxDuration = 300;

const app = new Hono();

const route = app
  .use(logger())
  .use(
    "/api/auth/*", // or replace with "*" to enable cors for all routes
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"], // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath("/api")
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .post("/chat", async (c) => {
    const {
      messages,
      model,
      webSearch,
    }: {
      messages: UIMessage[];
      model: string;
      webSearch: boolean;
    } = await c.req.json();

    const result = streamText({
      model: webSearch ? "perplexity/sonar" : model,
      messages: convertToModelMessages(messages),
      system:
        "You are a helpful assistant that can answer questions and help with tasks",
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  });

export default app;
export type AppType = typeof route;

serve({
  fetch: app.fetch,
  port: 3000,
});
