"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Globe, Sparkles, FileText, Play, CheckCircle2, Loader2, Download } from "lucide-react";

export default function ScrapePage() {
  const [status, setStatus] = useState<"idle" | "scraping" | "enriching" | "personalizing" | "done">("idle");
  const [jobName, setJobName] = useState("");
  const [maxLeads, setMaxLeads] = useState("100");
  const [persona, setPersona] = useState("default");
  const [completedJob, setCompletedJob] = useState<any | null>(null);

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!jobName) return alert("Please enter a Job Name");

    setStatus("scraping");

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobName, maxLeads, persona })
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.error);
        setStatus("idle");
        return;
      }

      // Poll for job completion
      let step = 0;
      const interval = setInterval(async () => {
        try {
          const orderRes = await fetch('/api/orders');
          const orders = await orderRes.json();
          const myJob = orders.find((j: any) => j.id === data.jobId);

          if (myJob) {
            if (myJob.status === "Completed") {
              setCompletedJob(myJob);
              setStatus("done");
              clearInterval(interval);
            } else if (myJob.status === "Failed") {
              alert("Job Failed: " + myJob.error);
              setStatus("idle");
              clearInterval(interval);
            } else {
              // Still pending. Mock transition through the visual steps every 3 seconds
              step++;
              if (step === 2) setStatus("enriching");
              if (step === 4) setStatus("personalizing");
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);

    } catch (err) {
      alert("Error starting scrape job. Check console.");
      console.error(err);
      setStatus("idle");
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1400px] mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">New Scrape Job</h1>
        <p className="text-muted-foreground text-sm">
          Extract leads, verify emails, and personalize outreach in one click.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Form */}
        <Card className="rounded-3xl border-border/50 bg-[#111111]/80 backdrop-blur-xl shadow-lg border-white/5 p-8">
          <form onSubmit={handleStart} className="space-y-6">

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-zinc-400">Job Name</Label>
              <Input value={jobName} onChange={(e) => setJobName(e.target.value)} placeholder="e.g. VP Sales Series A USA" className="bg-[#1A1A1A] border-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-zinc-400">Max Leads</Label>
                <Input type="number" value={maxLeads} onChange={(e) => setMaxLeads(e.target.value)} placeholder="100" className="bg-[#1A1A1A] border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-zinc-400">Persona Prompt</Label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl text-white px-4 py-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D2F835] appearance-none transition-colors"
                >
                  <option value="default">Default Icebreaker</option>
                  <option value="strictly-business">Strictly Business</option>
                  <option value="casual-value-add">Casual Value Add</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={status !== "idle" && status !== "done"}
                className="w-full h-12 rounded-full text-black bg-primary hover:bg-primary/90 font-bold transition-all text-base"
              >
                {status !== "idle" && status !== "done" ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
                ) : (
                  <span className="flex items-center gap-2"><Play className="w-5 h-5 fill-black" /> Run Workflow</span>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Right Column: Live Progress */}
        <Card className="rounded-3xl border-border/50 bg-[#111111]/80 backdrop-blur-xl shadow-lg border-white/5 p-8 relative overflow-hidden">
          <h2 className="text-xl font-bold mb-8 text-white">Live Progress</h2>

          <div className="space-y-0 relative pl-4">
            {/* The vertical connector line */}
            <div className="absolute top-[20px] bottom-[20px] left-[31px] w-[1px] bg-white/10 z-0"></div>

            <StepRow
              title="1. Apify Search Extraction"
              desc="Scraping profiles from LinkedIn"
              icon={<Database className="w-4 h-4" />}
              status={status === "idle" ? "pending" : status === "scraping" ? "active" : "done"}
              isLast={false}
            />

            <StepRow
              title="2. Anymailfinder Enrichment"
              desc="Finding and pinging professional emails"
              icon={<Globe className="w-4 h-4" />}
              status={status === "idle" || status === "scraping" ? "pending" : status === "enriching" ? "active" : "done"}
              isLast={false}
            />

            <StepRow
              title="3. AI Personalization Generation"
              desc="Running Anthropic Claude prompts"
              icon={<Sparkles className="w-4 h-4" />}
              status={status === "idle" || status === "scraping" || status === "enriching" ? "pending" : status === "personalizing" ? "active" : "done"}
              isLast={false}
            />

            <StepRow
              title="4. Completion & Output"
              desc="Compiling final CSV"
              icon={<FileText className="w-4 h-4" />}
              status={status === "done" ? "done" : "pending"}
              isLast={true}
            />
          </div>

          {status === "done" && (
            <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col items-center text-center animate-in slide-in-from-bottom-5 z-10 relative">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Workflow Complete</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Successfully extracted and personalized {completedJob?.leads ?? 0} leads ({completedJob?.verified ?? 0} valid).
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => completedJob && window.open(`/api/download/${completedJob.id}`, '_blank')}
                  className="rounded-full px-6 bg-primary text-black hover:bg-primary/90 font-medium"
                >
                  <Download className="mr-2 w-4 h-4" /> Download CSV
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StepRow({ title, desc, icon, status, isLast }: { title: string, desc: string, icon: React.ReactNode, status: "pending" | "active" | "done", isLast: boolean }) {
  const isActive = status === "active";
  const isDone = status === "done";

  return (
    <div className={`flex items-start gap-4 relative z-10 ${isLast ? '' : 'pb-10'}`}>
      <div className={`
        shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#1A1A1A] border mt-0.5
        ${isActive ? 'border-primary text-primary shadow-[0_0_10px_rgba(210,243,76,0.2)]' : isDone ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-muted-foreground'}
      `}>
        {isActive ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : isDone ? <CheckCircle2 className="w-4 h-4" /> : icon}
      </div>
      <div>
        <h4 className={`text-sm font-semibold mb-1 ${isActive || isDone ? 'text-white' : 'text-muted-foreground'}`}>{title}</h4>
        <p className={`text-xs ${isActive || isDone ? 'text-white/70' : 'text-muted-foreground/50'}`}>{desc}</p>
      </div>
    </div>
  );
}
