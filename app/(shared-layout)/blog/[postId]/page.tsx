import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next/dist/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchAuthQuery } from "@/lib/auth-server";

interface PostIdRouteProps {
  params: Promise<{
    postId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: PostIdRouteProps) {
  const { postId } = await params;
  const currentUser = await fetchAuthQuery(api.auth.getCurrentUser);

  if (!currentUser) {
    redirect("/auth/login");
  }

  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500 relative">
        <Link className={buttonVariants({ variant: "ghost" })} href={"/blog"}>
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>

        <h1 className="text-2xl font-bold mt-4">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
        href={"/blog"}
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </Link>

      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={post.title}
          fill
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Posted on: {new Date(post._creationTime).toLocaleDateString("en-IN")}
        </p>
      </div>
      <Separator className="my-8" />
      <p className="text-lg leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>
      <Separator className="my-8" />

      <CommentSection />
    </div>
  );
}
