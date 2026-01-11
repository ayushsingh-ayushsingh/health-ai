import { auth } from "./auth";
import { Request, Response } from "express";

export default async function getUserId(req: Request, res: Response) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return null;
  }

  return session.user.id;
}
