import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { auth } from "../lib/auth";
import AiHandler from "./ai/aiHandler";

const app = new Hono();
app.use(logger());

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

const route = app
  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .basePath("/api")
  .post("/protected", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    console.log(session);

    if (!session) {
      return c.json(
        {
          message: "You are unauthenticated.",
          description: "Login to use the service",
        },
        401,
      );
    }

    return c.json({
      message: "This route should be protected",
    });
  })
  .post("/chat", AiHandler);

export default app;
export type AppType = typeof route;

serve({
  fetch: app.fetch,
  port: 3000,
});
