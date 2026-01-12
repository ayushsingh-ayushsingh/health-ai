import type { UIMessage } from "ai";
import { toastManager } from "@/components/ui/toast";

import { BASE_URL } from "./auth-client";

export const getConversations = async () => {
  const res = await fetch(BASE_URL + "/api/conversations", {
    credentials: "include",
  });
  const conversations = await res.json();

  return conversations;
};

export const handleDelete = async (conversationId: string) => {
  try {
    await fetch(BASE_URL + `/api/conversations/${conversationId}`, {
      method: "DELETE",
      credentials: "include",
    });
    toastManager.add({
      title: "Success",
      type: "success",
      description: "Conversation deleted successfully",
    });
  } catch (err) {
    toastManager.add({
      title: "Error",
      type: "error",
      description: err as string,
    });
  }
};

export const fetchMessages = async (convId: string): Promise<UIMessage[]> => {
  const res = await fetch(`${BASE_URL}/api/conversations/${convId}/messages`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

export const createConversation = async (title: string) => {
  const res = await fetch(`${BASE_URL}/api/conversations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
};
