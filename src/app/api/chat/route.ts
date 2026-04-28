import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "Der KI-Assistent ist nicht konfiguriert. Bitte ANTHROPIC_API_KEY in .env.local (lokal) bzw. in den Vercel-Umgebungsvariablen setzen.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  let body: { messages: { role: string; content: string }[]; context: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return new Response("Ungültiger Request-Body.", { status: 400 });
  }

  const { messages, context } = body;
  const ctx = context || {};

  const systemPrompt = `Du bist ein einfühlsamer und kompetenter Assistent für Hinterbliebene in Deutschland.
Du hilfst dabei, den Nachlass zu regeln – mit fundiertem Wissen über deutsches Erbrecht, Behördenabläufe, Versicherungsrecht und praktische Schritte nach einem Todesfall.

AKTUELLER KONTEXT DES NUTZERS:
- Verstorbene Person: ${ctx.deceased || "unbekannt"}
- Sterbedatum: ${ctx.deathDate || "unbekannt"}
- Sterbeort/PLZ: ${ctx.deathPlace || "unbekannt"}
- Erledigte Aufgaben: ${ctx.completedCount || 0} von ${ctx.totalCount || 0}
- Offene Aufgaben (priorisiert):
${((ctx.pendingTasks as { title: string; category: string; description: string }[]) || []).map((t) => `  • [${t.category === "urgent" ? "SOFORT" : "DIESE WOCHE"}] ${t.title}: ${t.description}`).join("\n")}

WICHTIGE FRISTEN (immer beachten):
- Unfallversicherung: 48 Stunden Meldefrist bei Unfalltod
- Sterbeurkunde: 3 Werktage Pflichtfrist am Standesamt
- Erbschaft ausschlagen: 6 Wochen ab Kenntnis der Erbschaft
- Lebens-/Sterbegeldversicherung: 24–72 Stunden empfohlen

DEINE VERHALTENSREGELN:
- Antworte immer auf Deutsch
- Sei einfühlsam, ruhig und handlungsorientiert
- Nenn konkrete nächste Schritte mit Fristen
- Halte Antworten prägnant (2–4 Sätze), außer bei komplexen Rechtsfragen
- Wenn du unsicher bist, empfehle professionelle Beratung (Notar, Fachanwalt)
- Nutze dein Wissen über § 564 BGB (Mietkündigung), § 1944 BGB (Ausschlagungsfrist), § 1922 ff. BGB (Erbrecht)`;

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const stream = anthropic.messages.stream({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: (messages || []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
          controller.enqueue(encoder.encode(`\n\n[Fehler vom KI-Dienst: ${msg}]`));
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
    return new Response(`KI-Dienst nicht erreichbar: ${msg}`, { status: 502 });
  }
}
