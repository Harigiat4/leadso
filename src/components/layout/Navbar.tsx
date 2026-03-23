"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight z-10">
            <div className="w-8 h-8 rounded-lg bg-primary text-black flex items-center justify-center font-bold">
              L
            </div>
            Leadso
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-6 text-sm font-medium text-muted-foreground z-0">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#resources" className="hover:text-foreground transition-colors">Resources</Link>
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4 z-10">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/signup" className={buttonVariants({ variant: "default", className: "rounded-full font-semibold" })}>
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors z-10"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`md:hidden fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-1">
          <Link href="#features" onClick={() => setMobileOpen(false)} className="py-3 text-base font-medium text-muted-foreground hover:text-white transition-colors border-b border-white/5">
            Features
          </Link>
          <Link href="#pricing" onClick={() => setMobileOpen(false)} className="py-3 text-base font-medium text-muted-foreground hover:text-white transition-colors border-b border-white/5">
            Pricing
          </Link>
          <Link href="#resources" onClick={() => setMobileOpen(false)} className="py-3 text-base font-medium text-muted-foreground hover:text-white transition-colors border-b border-white/5">
            Resources
          </Link>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="py-2 text-base font-medium text-muted-foreground hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)} className={buttonVariants({ className: "rounded-full font-semibold w-full text-center" })}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
