import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const { messages, context } = await request.json();

  const systemPrompt = `Du bist ein einfühlsamer und kompetenter Assistent für Hinterbliebene in Deutschland.
Du hilfst dabei, den Nachlass zu regeln – mit fundiertem Wissen über deutsches Erbrecht, Behördenabläufe, Versicherungsrecht und praktische Schritte nach einem Todesfall.

AKTUELLER KONTEXT DES NUTZERS:
- Verstorbene Person: ${context.deceased || "unbekannt"}
- Sterbedatum: ${context.deathDate || "unbekannt"}
- Sterbeort/PLZ: ${context.deathPlace || "unbekannt"}
- Erledigte Aufgaben: ${context.completedCount || 0} von ${context.totalCount || 0}
- Offene Aufgaben (priorisiert):
${(context.pendingTasks || []).map((t: {title: string, category: string, description: string}) => `  • [${t.category === 'urgent' ? 'SOFORT' : 'DIESE WOCHE'}] ${t.title}: ${t.description}`).join('\n')}

WICHTIGE FRISTEN (immer beachten):
- Unfallversicherung: 48 Stunden Meldefrist bei Unfalltod
- Sterbeurkunde: 3 Werktage Pflichtfrist am Standesamt
- Erbschaft ausschlagen: 6 Wochen ab Kenntnis der Erbschaft
- Lebens-/Sterbegeldversicherung: 24–72 Stunden empfohlen
- Witwenrente: Antrag bei Deutschen Rentenversicherung stellen

DEINE VERHALTENSREGELN:
- Antworte immer auf Deutsch
- Sei einfühlsam, ruhig und handlungsorientiert
- Nenn konkrete nächste Schritte mit Fristen
- Halte Antworten prägnant (2–4 Sätze), außer bei komplexen Rechtsfragen
- Wenn du unsicher bist, empfehle professionelle Beratung (Notar, Fachanwalt)
- Nutze dein Wissen über § 564 BGB (Mietkündigung), § 1944 BGB (Ausschlagungsfrist), § 1922 ff. BGB (Erbrecht)`;

  const stream = anthropic.messages.stream({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
