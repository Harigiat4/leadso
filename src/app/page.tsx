"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { CheckCircle2, Chrome, Mail, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [aiPromptEnabled, setAiPromptEnabled] = useState(true);
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
      
      <Navbar />

      <main className="pt-32 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center max-w-4xl pt-10 pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/30 rounded-full text-sm font-medium mb-8 text-primary shadow-[0_0_15px_-3px_rgba(210,243,76,0.2)]">
            Trusted by 2M+ professionals worldwide
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Build High-Converting Lead Lists for{" "}
            <span className="text-primary italic block sm:inline">Outbound Cold Email</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Leadso is your go-to modern tool to search, verify, and export business emails so you can scale your cold outreach and book more meetings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className={buttonVariants({ size: "lg", className: "rounded-full px-8 h-12 text-black bg-primary hover:bg-primary/90 text-lg font-bold w-full sm:w-auto" })}>
              Start for free &rarr;
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> No credit card required. 100 free credits upon sign up.
          </p>
        </section>

        {/* Built for Performance Section */}
        <section id="features" className="py-24 container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Performance</h2>
            <p className="text-muted-foreground">A complete suite for end-to-end modern B2B prospecting.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-[1200px] mx-auto auto-rows-fr">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-full border border-primary/30 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Access 200M+ Contacts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tap into a continuously refreshed database of over 200M professionals and 20M+ verified companies worldwide.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-full border border-primary/30 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">High-Quality Database</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tired of bounced emails? Our database is rigorously maintained to ensure you only outreach to high-intent, active leads.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-full border border-primary/30 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deep Data Enrichment</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Uncover buying roles, seniority, recent news, and rich metadata to fully contextualize your campaigns.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-full border border-primary/30 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="w-5 h-5 rounded-full border-[3px] border-primary flex items-center justify-center"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div></div>
              </div>
              <h3 className="text-xl font-bold mb-3">Built for Simplicity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No complex setups. Find target accounts and decision-makers in just a few clicks with our intuitive interface.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-full border border-primary/30 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Unbeatable Affordability</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scale your outreach without breaking the bank. Get premium, verified leads at an average of just $0.05 per credit.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-full border border-primary/30 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verify with 97% Accuracy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Protect your sender reputation. Our engine detects personal, disposable, and invalid emails with incredibly high confidence.
              </p>
            </div>
          </div>
        </section>

        {/* AI Personalization Section */}
        <section className="py-24 container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium mb-8 bg-[#1a1c12]">
                <SparklesIcon className="w-4 h-4" /> AI Personalization
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                See the Full Picture Behind Every Lead
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Leadso's AI Fields bring more intelligence to your data — revealing each lead's buying role, seniority, and generating hyper-personalized icebreakers for your cold outreach.
              </p>
              <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border border-primary/50 flex flex-shrink-0 items-center justify-center text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-white">Custom LLM-based column generation</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border border-primary/50 flex flex-shrink-0 items-center justify-center text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-white">Role & Intent Classification</span>
                </li>
              </ul>
            </div>
            
            {/* Right Column (Code UI) */}
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 lg:p-10 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-medium text-white/50">AI Personalization Prompt</span>
                <button
                  onClick={() => setAiPromptEnabled(v => !v)}
                  className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors duration-400 ${aiPromptEnabled ? 'bg-primary shadow-[0_0_20px_-2px_rgba(210,243,76,0.5)]' : 'bg-white/15'}`}
                  style={{ transition: 'background-color 350ms ease, box-shadow 350ms ease' }}
                >
                  <motion.div
                    className="absolute top-1 w-5 h-5 rounded-full shadow-md"
                    style={{ background: aiPromptEnabled ? '#111111' : '#555555' }}
                    animate={{ x: aiPromptEnabled ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  />
                </button>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 mb-5 font-mono text-sm text-gray-400 leading-relaxed shadow-inner">
                &quot;Generate a 2-sentence icebreaker mentioning the lead&apos;s recent funding round at {'{{company}}'} and their role as {'{{title}}'}.&quot;
              </div>
              <div className="bg-[#1a1c12] border-l-2 border-primary rounded-r-xl p-5 font-mono text-sm text-primary leading-relaxed shadow-[0_0_20px_-5px_rgba(210,243,76,0.2)]">
                Output: &quot;Congrats on raising Series A at Acme Corp! As Head of Sales, you must be looking to scale...&quot;
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Average $0.05 per credit. 1 credit = 1 verified email. Scale your outreach with discounted volume plans.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Tier 1 */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground mb-6">For individual prospectors</p>
              <div className="mb-6 flex items-baseline">
                <span className="text-5xl font-extrabold">$49</span><span className="text-muted-foreground ml-1">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>1,000 Credits</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Chrome Extension</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Basic AI Fields</span></li>
              </ul>
              <Link href="/signup" className={buttonVariants({ className: "w-full rounded-full h-12 text-black bg-white hover:bg-gray-200 font-bold transition-all" })}>Get Started</Link>
            </div>
            {/* Tier 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1a1c12] to-[#111111] border border-primary/50 flex flex-col h-full relative transform md:-translate-y-4 shadow-[0_10px_40px_-10px_rgba(210,243,76,0.2)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-[0_0_20px_-5px_rgba(210,243,76,0.5)]">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2 mt-2">Growth</h3>
              <p className="text-muted-foreground mb-6">For growing sales teams</p>
              <div className="mb-6 flex items-baseline">
                <span className="text-5xl font-extrabold">$99</span><span className="text-muted-foreground ml-1">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>2,500 Credits <span className="text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full ml-1 font-medium border border-primary/20">$0.04/credit</span></span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Chrome Extension</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Advanced AI Personalization</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Export to CSV/CRM</span></li>
              </ul>
              <Link href="/signup" className={buttonVariants({ className: "w-full rounded-full h-12 text-black bg-primary hover:bg-primary/90 font-bold transition-all shadow-[0_0_20px_-5px_rgba(210,243,76,0.3)]" })}>Get Started</Link>
            </div>
            {/* Tier 3 */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Scale</h3>
              <p className="text-muted-foreground mb-6">For volume outbound</p>
              <div className="mb-6 flex items-baseline">
                <span className="text-5xl font-extrabold">$249</span><span className="text-muted-foreground ml-1">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>10,000 Credits <span className="text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full ml-1 font-medium border border-primary/20">$0.025/credit</span></span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Chrome Extension</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Dedicated Account Manager</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Full API Access</span></li>
              </ul>
              <Link href="/signup" className={buttonVariants({ className: "w-full rounded-full h-12 text-black bg-white hover:bg-gray-200 font-bold transition-all" })}>Get Started</Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white/[0.02] border-y border-white/10 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-16">What our customers say</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { name: "Sophia Georgeo", role: "B2B Account Executive, Dashlane", body: "It delivers as expected - if all you need is email, this plug in is great. Also like that there doesn't seem to have limitations on how many emails I can extract." },
                { name: "Yoni Lebovits", role: "Business Development, Albert Scott", body: "Skrapp is the greatest tool a salesperson can have. I can consistently send out emails to qualified leads by using LinkedIn to determine my audience." },
                { name: "Riz A", role: "Director of Demand Generation, Edifecs", body: "Skrapp really helps us find target contacts via LinkedIn. We looked at many of the competing solutions, So far, and we found Skrapp to be easier and more accurate." }
              ].map((t, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-[#111] border border-white/5 text-left flex flex-col justify-between">
                  <p className="text-lg text-muted-foreground italic mb-6">"{t.body}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold">{t.name}</h4>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to scale your revenue?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Find professional emails and key company data in a matter of seconds.
          </p>
          <Link href="/signup" className={buttonVariants({ size: "lg", className: "rounded-full px-10 h-16 text-xl font-bold shadow-[0_0_40px_-10px_rgba(230,255,0,0.5)]" })}>
            Get started today <CheckCircle2 className="ml-2 w-5 h-5" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#050505]">
        {/* Main footer grid */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-black text-sm">L</div>
                Leadso
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The modern B2B lead intelligence platform. Search, verify, and personalize at scale.
              </p>
              <div className="flex items-center gap-3">
                {/* Twitter/X */}
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                {/* GitHub */}
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="container mx-auto px-4 max-w-6xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 Leadso. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
