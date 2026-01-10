import { createAuthClient } from "better-auth/react";
import { toastManager } from "@/components/ui/toast";

export const CLIENT_URL = "http://localhost:5173";
export const BASE_URL = "http://localhost:3000";
export const REDIRECT_URL = CLIENT_URL + "/dashboard";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: BASE_URL,
});

export const logOut = async () => {
  const logout = await authClient.signOut();
  if (logout.data?.success) {
    toastManager.add({
      type: "info",
      title: "Logged out successfully",
      timeout: 2500,
      description: "Redirecting to Homepage",
    });
  } else {
    toastManager.add({
      type: "error",
      title: "Error occurred",
      timeout: 2500,
      description: logout.error?.message || "Try again",
    });
  }
};
