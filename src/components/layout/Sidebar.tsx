"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Database,
  History,
  Settings,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const mainNavItems = [
  { icon: Database, label: "Scrape Leads", href: "/scrape" },
  { icon: History, label: "Orders", href: "/orders" },
  { icon: Settings, label: "Configuration", href: "/config" },
  { icon: UserCircle, label: "Profile", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navContent = (
    <>
      {/* Logo */}
      <div className="px-8 mb-12">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 text-white"
        >
          <div className="w-8 h-8 rounded-lg bg-[#D2F835] flex items-center justify-center">
            <span className="text-black font-bold text-lg leading-none">L</span>
          </div>
          <span className="font-bold text-xl tracking-wide">Leadso</span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-4">
        {mainNavItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={index}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "w-full h-[46px] flex items-center px-4 font-medium transition-all text-sm relative",
                isActive
                  ? "bg-[#D2F835]/10 text-[#D2F835] border-l-2 border-[#D2F835] rounded-r-xl"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl border-l-2 border-transparent"
              )}
            >
              <item.icon className="w-[18px] h-[18px] mr-3" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full h-[46px] flex items-center px-4 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl border-l-2 border-transparent transition-all"
        >
          <LogOut className="w-[18px] h-[18px] mr-3" strokeWidth={2} />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile top bar ────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <div className="w-7 h-7 rounded-lg bg-[#D2F835] flex items-center justify-center">
            <span className="text-black font-bold text-sm leading-none">L</span>
          </div>
          Leadso
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ── Mobile backdrop ───────────────────────── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Sidebar panel ────────────────────────── */}
      <aside
        className={cn(
          // Base
          "flex flex-col py-8 bg-[#0B0B0B] border-r border-white/5",
          // Mobile: fixed overlay, slides in/out
          "fixed inset-y-0 left-0 z-50 w-[260px]",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always in layout flow
          "lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 lg:shrink-0"
        )}
      >
        {/* Mobile close button */}
        <button
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {navContent}
      </aside>
    </>
  );
}
