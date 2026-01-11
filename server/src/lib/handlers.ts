import { auth } from "./auth";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
        error: "An unexpected error occurred",
      });
    }
  };
}

export function protectedAsyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      console.log("Session", session);

      if (!session) {
        return res.status(401).json({
          message: "You are unauthenticated.",
          description: "Login to use the service",
        });
      }

      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
        error: "An unexpected error occurred",
      });
    }
  };
}
