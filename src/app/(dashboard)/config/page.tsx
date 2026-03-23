"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon, Save, CheckCircle2, Bot } from "lucide-react";

export default function ConfigPage() {
  const [saved, setSaved] = useState(false);
  const [apifyKey, setApifyKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [anymailfinderKey, setAnymailfinderKey] = useState("");

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setApifyKey(data.apifyKey || "");
          setAnthropicKey(data.anthropicKey || "");
          setAnymailfinderKey(data.anymailfinderKey || "");
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apifyKey,
        anthropicKey,
        anymailfinderKey
      })
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 md:p-12 max-w-[1400px] mx-auto w-full">
      <form onSubmit={handleSave}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Workspace Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your API integrations and personalization rules.
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="rounded-full px-6 h-10 text-black bg-primary hover:bg-primary/90 font-medium transition-all"
          >
            {saved ? (
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved</span>
            ) : (
              <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
            )}
          </Button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          
          {/* Column 1: API Integrations */}
          <Card className="rounded-3xl border-border/50 bg-[#111111]/80 backdrop-blur-xl shadow-lg border-white/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
                <LinkIcon className="w-5 h-5 text-muted-foreground" /> API Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="apify" className="text-xs text-muted-foreground">Apify API Token (Required for scraping)</Label>
                <Input id="apify" type="password" value={apifyKey} onChange={(e) => setApifyKey(e.target.value)} placeholder="apify_api_..." className="h-11 bg-[#0c0c0c] border-white/5 rounded-xl text-white placeholder:text-muted-foreground/30 focus-visible:ring-primary/50" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anthropic" className="text-xs text-muted-foreground">Anthropic API Key (Claude 3.5 Sonnet)</Label>
                <Input id="anthropic" type="password" value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} placeholder="sk-ant-..." className="h-11 bg-[#0c0c0c] border-white/5 rounded-xl text-white placeholder:text-muted-foreground/30 focus-visible:ring-primary/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anymailfinder" className="text-xs text-muted-foreground">Anymailfinder API Key (Required for verification)</Label>
                <Input id="anymailfinder" type="password" value={anymailfinderKey} onChange={(e) => setAnymailfinderKey(e.target.value)} placeholder="..................................." className="h-11 bg-[#0c0c0c] border-white/5 rounded-xl text-white placeholder:text-muted-foreground/30 focus-visible:ring-primary/50" />
              </div>
            </CardContent>
          </Card>

          {/* Column 2: Prompt Engineering */}
          <div className="space-y-4">
            <Card className="rounded-2xl border-border/50 bg-[#111111]/80 backdrop-blur-xl shadow-lg border-white/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
                  <div className="w-8 h-8 rounded-lg bg-[#D2F835]/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#D2F835]" />
                  </div>
                  Prompt Engineering
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  Define the rules Leadso should follow when generating the {'{{personalization}}'} column for each lead.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="systemPrompt" className="text-[13px] font-medium text-white/80">System Prompt</Label>
                  <textarea 
                    id="systemPrompt" 
                    className="w-full flex min-h-[460px] rounded-xl border border-white/5 bg-[#0A0A0A] px-5 py-4 text-sm font-medium text-white/90 shadow-inner placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 resize-none leading-relaxed whitespace-pre-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    defaultValue={`System: You are a helpful, intelligent writing assistant.

User: Your task is to take, as input, a bunch of information about a prospect, and then generate a customized, one-line email icebreaker to imply that the rest of my communique is personalized.
You'll return your icebreakers in the following JSON format:
{"verdict":"true or false, string","icebreaker":"Hey {firstName}. Love {thing}—also work in {paraphrasedIndustry}. Wanted to run something by you.", "shortenedCompanyName":"Shortened version of company name (more on this in a moment)"}

Rules:
- Write in a spartan/laconic tone of voice.
- Make sure to use the above format when constructing your icebreakers.
- Sometimes, the data provided will not be of a person. Instead, it will be of a company. If this is the case, return a "false" string for "verdict"`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-[#D2F835]/20 bg-[#D2F835]/5 shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[#D2F835] font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Prompt Variables Injected
                  </div>
                  <p className="text-sm text-white/80 font-mono">
                    {`{first name}, {last name}, {headline} {industry}, {organization_name}, {location}, {email}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </form>
    </div>
  );
}
