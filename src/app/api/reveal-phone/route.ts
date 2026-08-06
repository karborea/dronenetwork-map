import { headers } from "next/headers";
import { getPilotBySlug } from "@/lib/pilots";

/**
 * POST /api/reveal-phone
 *
 * Server-side proxy in front of WordPress. It exists so DN_LEAD_SECRET stays
 * on the server: the browser must never hold a credential that can pull member
 * phone numbers.
 *
 * Body: { slug, lang?, name?, phone?, message? }
 * Returns: { phone, sms } | { error }
 */

type RevealBody = {
  slug?: unknown;
  lang?: unknown;
  name?: unknown;
  phone?: unknown;
  message?: unknown;
};

const str = (v: unknown, max: number): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: RevealBody;
  try {
    body = (await request.json()) as RevealBody;
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const slug = str(body.slug, 120);
  if (!slug) {
    return Response.json({ error: "missing_slug" }, { status: 400 });
  }

  const lang = body.lang === "en" ? "en" : "fr";

  // Vercel puts the visitor IP first in x-forwarded-for; WordPress only sees
  // this server's address, so it has to be forwarded for rate limiting to mean
  // anything.
  const h = await headers();
  const clientIp =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "";

  const wpUrl = process.env.WP_API_URL?.replace(/\/$/, "");
  const secret = process.env.DN_LEAD_SECRET;

  // Local dev against mock data: no WordPress to ask, so serve the mock number
  // and report that no SMS went out rather than failing the UI.
  if (!wpUrl) {
    const pilot = await getPilotBySlug(slug);
    if (!pilot?.phone) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }
    return Response.json({ phone: pilot.phone, sms: "dry-run" });
  }

  // WordPress is configured but the shared secret isn't: that is a deployment
  // gap, not a missing member. Say so loudly in the log instead of 404-ing.
  if (!secret) {
    console.error("[reveal-phone] DN_LEAD_SECRET is not set; cannot reach WordPress.");
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${wpUrl}/wp-json/dn/v1/reveal-phone`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-DN-Secret": secret,
      },
      body: JSON.stringify({
        slug,
        lang,
        client_ip: clientIp,
        client_name: str(body.name, 80),
        client_phone: str(body.phone, 40),
        client_message: str(body.message, 400),
      }),
    });

    const data = (await res.json()) as { phone?: string; sms?: string; code?: string };

    if (!res.ok) {
      // Surface the rate limit distinctly so the UI can say something useful.
      const status = res.status === 429 ? 429 : res.status === 404 ? 404 : 502;
      return Response.json({ error: data.code ?? "upstream_error" }, { status });
    }

    return Response.json({ phone: data.phone, sms: data.sms ?? "unknown" });
  } catch (err) {
    console.error("[reveal-phone] WP call failed:", err);
    return Response.json({ error: "upstream_unreachable" }, { status: 502 });
  }
}
