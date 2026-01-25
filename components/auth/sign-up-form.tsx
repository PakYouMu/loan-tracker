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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col text-white invert mix-blend-difference", className)} {...props}>
      <div className="flex flex-col text-center mb-4">
        <p className="text-xl font-serif">Join La Clair Ligña</p>
      </div>

      <form onSubmit={handleSignUp}>
        <div className="flex flex-col gap-4">
          
          {/* Email Input */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-background/40 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50 transition-all"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="font-semibold">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-background/40 backdrop-blur-sm border-white/30 text-white focus-visible:ring-white/50 transition-all"
            />
          </div>

          {/* Repeat Password Input */}
          <div className="grid gap-2">
            <Label htmlFor="repeat-password" className="font-semibold">Repeat Password</Label>
            <Input
              id="repeat-password"
              type="password"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="h-11 bg-background/40 backdrop-blur-sm border-white/30 text-white focus-visible:ring-white/50 transition-all"
            />
          </div>

          {/* Error Box */}
          {error && (
            <div className="bg-destructive/20 text-destructive-foreground text-sm p-3 rounded-md font-bold border border-destructive/50">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full h-11 mt-4 font-bold bg-white text-black hover:bg-gray-200 border-none" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}