import Anthropic from '@anthropic-ai/sdk';
import { PERSONA_PROMPTS } from './constants';

function getAnthropicClient(apiKey: string) {
  if (!apiKey) throw new Error("Anthropic API Key is missing");
  return new Anthropic({ apiKey });
}

async function generateCompletion(systemPrompt: string, userMessage: string, apiKey: string): Promise<string> {
  if (apiKey) {
    try {
      const anthropic = getAnthropicClient(apiKey);
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });
      // @ts-ignore
      return response.content[0].text;
    } catch (e: any) {
      console.error("Anthropic failed:", e);
      throw new Error(e.message || "Anthropic inference failed");
    }
  }

  throw new Error("No Anthropic API key available. Please configure it in Settings.");
}

export async function generateApifyPayload(jobName: string, maxItems: number, anthropicKey: string) {
  const systemPrompt = `You are a helpful assistant that translates a user's B2B target audience description (Job Name) into a strict JSON payload for a LinkedIn Leads scraper.

You must return valid JSON ONLY. No markdown wrapping. No explanatory text.

Available keys you can use:
- "personTitle" (ARRAY of strings — job titles to search for, e.g. ["CEO", "VP Sales", "Founder"])
- "seniority" (ARRAY of strings — seniority levels: "c-suite", "director", "manager", "senior", "entry")
- "companyIndustry" (ARRAY of strings — industry names, e.g. ["saas", "software", "financial services"])
- "companyKeyword" (ARRAY of strings — search for names/desc keywords like ["nature reserve", "ai", "hydrogen"])
- "personCountry" (ARRAY of strings — countries like ["United States"], ["United Kingdom"])

IMPORTANT: Return ONLY the JSON object.

Example input: "Founders of Nature Reserves in Saudi Arabia"
Example output:
{
  "personTitle": ["CEO", "Founder", "Director General", "Executive Director"],
  "seniority": ["c-suite", "director"],
  "companyKeyword": ["nature reserve", "royal reserve", "environment agency"],
  "personCountry": ["Saudi Arabia"]
}

Example input: "VP Sales Series A USA"
Example output:
{
  "personTitle": ["VP Sales", "Vice President of Sales", "VP of Sales", "Head of Sales"],
  "seniority": ["director", "c-suite"],
  "companyIndustry": ["software", "saas"],
  "personCountry": ["United States"]
}

Example input: "CEO Fintech India"
Example output:
{
  "personTitle": ["CEO", "Chief Executive Officer", "Founder", "Co-Founder"],
  "seniority": ["c-suite"],
  "companyIndustry": ["financial services", "fintech"],
  "personCountry": ["India"]
}`;

  const userMessage = `Generate the scraper payload for this Job Name: "${jobName}"`;

  const rawJson = await generateCompletion(systemPrompt, userMessage, anthropicKey);

  try {
    let cleanedJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanedJson = jsonMatch[0];

    const payload = JSON.parse(cleanedJson);

    // Add properties specific to the new Apify Actor
    payload.totalResults = Math.max(1, Math.min(maxItems, 50000));
    payload.hasEmail = false;
    payload.hasPhone = false;

    console.log("Apify payload generated:", JSON.stringify(payload, null, 2));
    return payload;
  } catch (e) {
    console.error("Failed to parse AI payload generator output:", rawJson);
    throw new Error(`Failed to generate a valid configuration for Apify. AI Response: ${rawJson}`);
  }
}

export async function generateIcebreaker(lead: any, persona: string = 'default', anthropicKey: string): Promise<{ verdict: string, icebreaker: string, shortenedCompanyName: string }> {
  const leadInfo = `${lead.firstName || lead.firstDomain || ''} ${lead.lastName || ''}, ${lead.title || lead.jobTitle || ''} - ${lead.companyName || lead.organizationName || ''}, ${lead.industry || ''}, ${lead.location || lead.city || ''}, ${lead.country || ''}`;

  const prompt = PERSONA_PROMPTS[persona] ?? PERSONA_PROMPTS['default'];
  const rawResponse = await generateCompletion(prompt, leadInfo, anthropicKey);

  try {
    let cleanedResponse = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanedResponse = jsonMatch[0];
    return JSON.parse(cleanedResponse);
  } catch (e) {
    console.error("Failed to parse Icebreaker JSON:", rawResponse);
    return { verdict: "false", icebreaker: "AI Error", shortenedCompanyName: "" };
  }
}
