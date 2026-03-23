'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type Status = { type: 'success' | 'error'; message: string } | null;

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="rounded-3xl border-white/5 bg-[#111111]/80 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function StatusBanner({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4 border ${
      status.type === 'success'
        ? 'bg-primary/10 border-primary/20 text-primary'
        : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      {status.type === 'success'
        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />}
      {status.message}
    </div>
  );
}

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileStatus, setProfileStatus] = useState<Status>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<Status>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<Status>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      setCurrentEmail(user.email ?? '');
      setNewEmail(user.email ?? '');
      setFirstName(user.user_metadata?.first_name ?? '');
      setLastName(user.user_metadata?.last_name ?? '');
    });
  }, []);

  // --- Update name ---
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileStatus(null);
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
    });
    setProfileStatus(error
      ? { type: 'error', message: error.message }
      : { type: 'success', message: 'Name updated successfully.' }
    );
    setProfileLoading(false);
  };

  // --- Update email ---
  const handleEmailSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail === currentEmail) {
      setEmailStatus({ type: 'error', message: 'New email is the same as current email.' });
      return;
    }
    setEmailLoading(true);
    setEmailStatus(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEmailStatus(error
      ? { type: 'error', message: error.message }
      : { type: 'success', message: 'Confirmation sent to both addresses. Click the link in your new email to confirm.' }
    );
    setEmailLoading(false);
  };

  // --- Update password ---
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordStatus(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      setNewPassword('');
      setConfirmPassword('');
    }
    setPasswordStatus(error
      ? { type: 'error', message: error.message }
      : { type: 'success', message: 'Password updated successfully.' }
    );
    setPasswordLoading(false);
  };

  return (
    <div className="p-8 md:p-12 max-w-[860px] mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your account details and credentials.</p>
      </div>

      <div className="space-y-6">

        {/* Name */}
        <SectionCard title="Personal Info" icon={<User className="w-4 h-4" />}>
          <form onSubmit={handleProfileSave} className="space-y-5">
            <StatusBanner status={profileStatus} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-zinc-400">First Name</Label>
                <Input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="h-11 bg-[#1A1A1A] border-white/5 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-zinc-400">Last Name</Label>
                <Input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-11 bg-[#1A1A1A] border-white/5 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={profileLoading}
                className="h-10 px-6 rounded-xl bg-primary text-black font-semibold hover:bg-primary/90"
              >
                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Name'}
              </Button>
            </div>
          </form>
        </SectionCard>

        {/* Email */}
        <SectionCard title="Email Address" icon={<Mail className="w-4 h-4" />}>
          <form onSubmit={handleEmailSave} className="space-y-5">
            <StatusBanner status={emailStatus} />
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-zinc-400">Current Email</Label>
              <Input
                value={currentEmail}
                disabled
                className="h-11 bg-[#0f0f0f] border-white/5 text-white/40 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-zinc-400">New Email</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="new@company.com"
                required
                className="h-11 bg-[#1A1A1A] border-white/5 text-white"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={emailLoading}
                className="h-10 px-6 rounded-xl bg-primary text-black font-semibold hover:bg-primary/90"
              >
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Email'}
              </Button>
            </div>
          </form>
        </SectionCard>

        {/* Password */}
        <SectionCard title="Change Password" icon={<Lock className="w-4 h-4" />}>
          <form onSubmit={handlePasswordSave} className="space-y-5">
            <StatusBanner status={passwordStatus} />
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-zinc-400">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="h-11 bg-[#1A1A1A] border-white/5 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-zinc-400">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className="h-11 bg-[#1A1A1A] border-white/5 text-white"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={passwordLoading}
                className="h-10 px-6 rounded-xl bg-primary text-black font-semibold hover:bg-primary/90"
              >
                {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Change Password'}
              </Button>
            </div>
          </form>
        </SectionCard>

      </div>
    </div>
  );
}
