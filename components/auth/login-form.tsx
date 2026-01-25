"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/funds");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 invert text-white mix-blend-difference", className)} {...props}>
      <div className="flex flex-col text-center">
        <p className="text-xl font-serif">Sign in to manage your workspace</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-background/40 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50 transition-all"
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="ml-auto inline-block text-xs font-medium underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-background/40 backdrop-blur-sm border-white/30 text-white focus-visible:ring-white/50 transition-all"
            />
          </div>
          
          {error && (
            <div className="bg-destructive/20 text-destructive-foreground text-sm p-3 rounded-md font-bold border border-destructive/50">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 mt-4 font-bold bg-white text-black hover:bg-gray-200 border-none" 
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Login</>
            ) : "Login"}
          </Button>
        </div>
        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-bold underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}