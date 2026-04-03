import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByPostId = query({
  args: {
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedPostId = ctx.db.normalizeId("posts", args.postId);
    if (!normalizedPostId) {
      return [];
    }

    const data = await ctx.db
      .query("comments")
      .withIndex("by_post_id", (q) => q.eq("postId", normalizedPostId))
      .order("desc")
      .collect();
    return data;
  },
});

export const createComment = mutation({
  args: {
    body: v.string(),
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const normalizedPostId = ctx.db.normalizeId("posts", args.postId);
    if (!normalizedPostId) {
      throw new ConvexError("Invalid post");
    }

    return await ctx.db.insert("comments", {
      postId: normalizedPostId,
      body: args.body,
      authorId: user._id,
      authorName: user.name,
    });
  },
});
