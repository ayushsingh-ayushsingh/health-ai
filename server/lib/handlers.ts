import { Context } from "hono";
import { auth } from "./auth";

export function asyncHandler<
  C extends Context,
  R extends Response | Promise<Response>,
>(fn: (c: C) => R) {
  return async (c: C) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json(
        {
          message: "You are unauthenticated.",
          description: "Login to use the service",
        },
        401,
      );
    }

    try {
      return await fn(c);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Internal server error",
          error: "An unexpected error occurred",
        },
        500,
      );
    }
  };
}

export function protectedAsyncHandler<
  C extends Context,
  R extends Response | Promise<Response>,
>(fn: (c: C) => R) {
  return async (c: C) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json(
        {
          message: "You are unauthenticated.",
          description: "Login to use the service",
        },
        401,
      );
    }

    try {
      return await fn(c);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Internal server error",
          error: "An unexpected error occurred",
        },
        500,
      );
    }
  };
}
