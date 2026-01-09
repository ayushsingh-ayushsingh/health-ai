import { Context } from "hono";

export function asyncHandler<
  C extends Context,
  R extends Response | Promise<Response>,
>(fn: (c: C) => R) {
  return async (c: C) => {
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
    const user = c.get("user");

    if (!user)
      return c.json(
        {
          message: "Signin to continue",
          error: "You are unauthenticated",
        },
        401,
      );

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
