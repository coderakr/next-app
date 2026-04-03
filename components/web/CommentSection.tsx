"use client";

import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export function CommentSection() {
  const form = useForm({
    resolver: standardSchemaResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: "",
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">5 Comments</h2>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
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

          <Button>Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
