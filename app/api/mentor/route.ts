import Anthropic from "@anthropic-ai/sdk";
import {
  MENTOR_LIMITS,
  mentorPrompt,
  parseMentorRequest,
  rateLimit,
  takeDailySlot,
  type MentorRequest,
} from "@/lib/mentor";

// Settings come from environment variables (on Render: the service's Environment tab):
//   ANTHROPIC_API_KEY    required; without it the mentor reports that it is not connected
//   MENTOR_MODEL         optional, defaults to claude-opus-5-5
//   MENTOR_EFFORT        optional, low | medium | high; defaults to low, which keeps
//                        replies quick, as a chat needs
//   MENTOR_DAILY_LIMIT   optional, answers per day for the whole site, defaults to 3000
//   MENTOR_MOCK=1        optional, answers with a canned text instead of calling the API,
//                        for trying the interface without a key
const MODEL = process.env.MENTOR_MODEL || "claude-opus-5-5";
const EFFORTS = ["low", "medium", "high"] as const;
const EFFORT =
  EFFORTS.find((e) => e === process.env.MENTOR_EFFORT) ?? ("low" as (typeof EFFORTS)[number]);
const DAILY_LIMIT = Number(process.env.MENTOR_DAILY_LIMIT) || 3000;
const MOCK = process.env.MENTOR_MOCK === "1";

// Written into the reply stream when the answer breaks off or the model declines; the
// browser shows a message instead. Must match components/MentorPanel.tsx.
const ERROR_MARK = "\u0000error";
const REFUSAL_MARK = "\u0000refusal";

const json = (body: object, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

// Lets the page know whether to offer the mentor at all.
export function GET() {
  return json({ enabled: MOCK || Boolean(process.env.ANTHROPIC_API_KEY) }, 200);
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !MOCK) return json({ error: "not_configured" }, 503);

  let request: MentorRequest | null = null;
  try {
    request = parseMentorRequest(await req.json());
  } catch {
    // Not JSON.
  }
  if (!request) return json({ error: "bad_request" }, 400);

  // One browser may ask 30 questions in 10 minutes; one network (a whole classroom behind
  // the same address) may ask 400.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const wait =
    rateLimit(`client:${request.client}`, 30, 10 * 60 * 1000) ||
    rateLimit(`ip:${ip}`, 400, 10 * 60 * 1000);
  if (wait) return json({ error: "rate_limited", retryAfter: wait }, 429, { "Retry-After": String(wait) });
  if (!takeDailySlot(DAILY_LIMIT)) return json({ error: "daily_limit" }, 429);

  const encoder = new TextEncoder();
  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Accel-Buffering": "no",
  };

  if (MOCK) return new Response(mockStream(request, encoder), { headers });

  const { system, messages } = mentorPrompt(request);
  const client = new Anthropic({ apiKey, maxRetries: 2, timeout: 60_000 });

  let upstream;
  try {
    upstream = await client.beta.messages.create(
      {
        model: MODEL,
        max_tokens: MENTOR_LIMITS.maxTokens,
        output_config: { effort: EFFORT },
        // If the model's safety checks decline a question, the API retries it on a
        // suitable fallback model within the same call instead of failing.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        // The rules are the same for everyone and the mission text is the same for every
        // question about it, so both are cached between questions.
        system: system.map((text, i) => ({
          type: "text" as const,
          text,
          ...(i === system.length - 1 ? { cache_control: { type: "ephemeral" as const } } : {}),
        })),
        messages,
        stream: true,
      },
      { signal: req.signal },
    );
  } catch (error) {
    return upstreamError(error);
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of upstream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          } else if (event.type === "message_delta") {
            if (event.delta.stop_reason === "max_tokens") controller.enqueue(encoder.encode("…"));
            // Even the fallback declined: tell the student instead of showing nothing.
            if (event.delta.stop_reason === "refusal") controller.enqueue(encoder.encode(REFUSAL_MARK));
          }
        }
      } catch (error) {
        if (!req.signal.aborted) {
          logError(error);
          controller.enqueue(encoder.encode(ERROR_MARK));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      upstream.controller.abort();
    },
  });
  return new Response(stream, { headers });
}

function upstreamError(error: unknown) {
  logError(error);
  if (error instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 503);
  return json({ error: "unavailable" }, 502);
}

// Logs what went wrong with the API call, never what the student wrote.
function logError(error: unknown) {
  if (error instanceof Anthropic.AuthenticationError) {
    console.error("[mentor] the API key was rejected: check ANTHROPIC_API_KEY");
  } else if (error instanceof Anthropic.APIError) {
    console.error(`[mentor] API error ${error.status ?? ""}: ${error.message}`);
  } else {
    console.error("[mentor] request failed:", error instanceof Error ? error.message : error);
  }
}

const MOCK_REPLY = {
  en: "This is a test reply (MENTOR_MOCK is on, so no AI is called). Start by comparing **what should happen** with **what actually happens**. Which part of the circuit or which line of `code` could cause exactly that difference?",
  kk: "Бұл — сынақ жауабы (MENTOR_MOCK қосулы, сондықтан ЖИ шақырылмайды). Алдымен **не болуы керегін** және **шын мәнінде не болатынын** салыстыр. Тізбектің қай бөлігі немесе `кодтың` қай жолы дәл осындай айырмашылық тудыра алады?",
  ru: "Это тестовый ответ (включён MENTOR_MOCK, ИИ не вызывается). Начни с того, что сравни **что должно происходить** и **что происходит на самом деле**. Какая часть схемы или какая строка `кода` могла бы дать именно такую разницу?",
};

function mockStream(request: MentorRequest, encoder: TextEncoder) {
  const words = MOCK_REPLY[request.lang].split(/(?<= )/);
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      controller.close();
    },
  });
}
