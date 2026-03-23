'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, CheckCircle2, Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setDone(true);
      setTimeout(() => router.push('/scrape'), 2500);
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

        {done ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Password updated!</h1>
            <p className="text-muted-foreground mb-8">
              Your password has been changed. Redirecting you to the dashboard&hellip;
            </p>
            <Link href="/scrape" className={buttonVariants({ className: 'rounded-xl w-full' })}>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">Set new password</h1>
              <p className="text-muted-foreground text-lg">Choose a strong password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-base">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
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
                    <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                  </span>
                ) : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
