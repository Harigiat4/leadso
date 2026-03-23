"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else if (data.session) {
      // Email confirmation disabled — go straight to app
      router.push("/scrape");
      router.refresh();
    } else {
      // Email confirmation required
      setConfirmation(true);
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white relative bg-black overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative z-10 w-full max-w-md px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 text-3xl">✉</div>
          <h1 className="text-3xl font-bold mb-3">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We sent a confirmation link to <span className="text-white font-medium">{email}</span>. Click it to activate your account.
          </p>
          <Link href="/login" className={buttonVariants({ className: "rounded-xl" })}>Back to Login</Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold tracking-tight mb-3">Create an account</h1>
          <p className="text-muted-foreground text-lg">Start your 14-day free trial, no credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-base">First Name</Label>
              <Input
                id="firstName"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-12 bg-white/5 border-white/10 text-white focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-base">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-12 bg-white/5 border-white/10 text-white focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Work Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
                <Loader2 className="w-5 h-5 animate-spin" /> Creating account...
              </span>
            ) : "Get Started"}
          </button>
        </form>

        <p className="mt-8 text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
