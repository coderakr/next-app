"use client";

import { signUpSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient, getAuthErrorMessage } from "@/lib/auth-client";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

export default function SignUp() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof signUpSchema>>({
    resolver: standardSchemaResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  async function onSubmit(data: z.input<typeof signUpSchema>) {
    startTransition(async () => {
      try {
        const result = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
        });

        if (result.error) {
          toast.error(getAuthErrorMessage(result.error));
          return;
        }

        await authClient.getSession();
        toast.success("Account created successfully");
        window.location.replace("/");
      } catch (error) {
        toast.error(getAuthErrorMessage(error));
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Fill in the details to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="john@example.com"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    type="password"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>SignUp</span>
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
