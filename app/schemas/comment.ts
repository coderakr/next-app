import { z } from "zod/v4";

export const commentSchema = z.object({
  body: z.string().min(3),
  postId: z.string(),
});
