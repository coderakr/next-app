import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});

export function getAuthErrorMessage(error: unknown) {
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      if (error.message.trim().length > 0) {
        return error.message;
      }
    }

    if ("error" in error && error.error && typeof error.error === "object") {
      if (
        "message" in error.error &&
        typeof error.error.message === "string" &&
        error.error.message.trim().length > 0
      ) {
        return error.error.message;
      }
    }

    if ("statusText" in error && typeof error.statusText === "string") {
      if (error.statusText.trim().length > 0) {
        return error.statusText;
      }
    }
  }

  return "Something went wrong. Please try again.";
}
