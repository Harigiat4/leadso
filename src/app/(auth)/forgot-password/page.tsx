'use client';

import { useState } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative bg-black overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-8 flex flex-col">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-lg bg-primary text-black flex items-center justify-center font-black text-lg">L</div>
            Leadso
          </Link>
          <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Check your email</h1>
            <p className="text-muted-foreground mb-8">
              We sent a password reset link to <span className="text-white font-medium">{email}</span>. Click it to set a new password.
            </p>
            <Link href="/login" className={buttonVariants({ className: 'rounded-xl w-full' })}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight mb-3">Forgot password?</h1>
              <p className="text-muted-foreground text-lg">Enter your email and we&apos;ll send you a reset link.</p>
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
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={buttonVariants({ className: 'w-full h-12 text-lg font-semibold rounded-xl' })}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                  </span>
                ) : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
