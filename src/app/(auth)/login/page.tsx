"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/scrape");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative bg-black overflow-hidden">
      {/* Green glow — matches homepage */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-8 flex flex-col">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-lg bg-primary text-black flex items-center justify-center font-black text-lg">
              L
            </div>
            Leadso
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome back</h1>
          <p className="text-muted-foreground text-lg">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-white/5 border-white/10 text-white focus-visible:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={buttonVariants({ className: "w-full h-12 text-lg font-semibold rounded-xl mt-4" })}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
