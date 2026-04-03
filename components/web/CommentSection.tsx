"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import z from "zod";

export function CommentSection() {
  const commentPreviewLength = 100;
  const params = useParams<{ postId: string }>();
  const postId = params.postId;
  const data = useQuery(
    api.comments.getCommentsByPostId,
    postId ? { postId } : "skip",
  );

  const commentCount = data?.length ?? 0;
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  const [isPending, startTransition] = useTransition();
  const createComment = useMutation(api.comments.createComment);

  const form = useForm({
    resolver: standardSchemaResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: "",
    },
  });

  function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      if (!postId) {
        toast.error("Missing post information. Please refresh and try again.");
        return;
      }

      try {
        await createComment({
          ...data,
          postId,
        });
        form.reset();
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to create comment. Please try again.");
      }
    });
  }

  function toggleComment(commentId: string) {
    setExpandedComments((current) => ({
      ...current,
      [commentId]: !current[commentId],
    }));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          <h2 className="text-xl font-bold">Comments</h2>
        </div>
        <span className="border bg-muted/30 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {commentCount}
        </span>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Write your comment here..."
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>comment</span>
            )}
          </Button>
        </form>

        <section className="space-y-4 pt-6">
          {data === undefined ? (
            <div className="flex items-center justify-center gap-2 border border-dashed bg-muted/10 px-4 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span>Loading comments...</span>
            </div>
          ) : commentCount > 0 ? (
            data?.map((comment) => {
              const isExpanded = expandedComments[comment._id] ?? false;
              const isLongComment = comment.body.length > commentPreviewLength;
              const visibleBody =
                isExpanded || !isLongComment
                  ? comment.body
                  : `${comment.body.slice(0, commentPreviewLength).trimEnd()}...`;

              return (
                <div
                  key={comment._id}
                  className="border bg-muted/20 p-4 shadow-sm transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center border bg-background text-sm font-semibold uppercase tracking-wide text-foreground">
                      {comment.authorName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border/70 pb-3">
                        <p className="font-semibold tracking-tight text-foreground">
                          {comment.authorName}
                        </p>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          {new Date(comment._creationTime).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground/90">
                          {visibleBody}
                        </p>
                        {isLongComment ? (
                          <button
                            type="button"
                            className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => toggleComment(comment._id)}
                          >
                            {isExpanded ? "Show less" : "Read more..."}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="border border-dashed bg-muted/10 px-4 py-8 text-center">
              <p className="font-medium text-foreground">No comments yet</p>
              <p className="pt-1 text-sm text-muted-foreground">
                Be the first one to start the conversation.
              </p>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
