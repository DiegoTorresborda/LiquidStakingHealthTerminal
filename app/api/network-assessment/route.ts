import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestPayload = {
  projectName?: unknown;
  website?: unknown;
  email?: unknown;
  telegram?: unknown;
};

const DESTINATION_EMAIL = "diego@protofire.io";

function normalizeString(value: unknown, maxLength = 240): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  return trimmed.slice(0, maxLength);
}

function isValidWebsite(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as RequestPayload | null;

  const projectName = normalizeString(payload?.projectName, 120);
  const website = normalizeString(payload?.website, 320);
  const email = normalizeString(payload?.email, 180);
  const telegram = normalizeString(payload?.telegram, 180);

  if (!projectName) {
    return NextResponse.json({ ok: false, error: "Project name is required." }, { status: 400 });
  }

  if (!website || !isValidWebsite(website)) {
    return NextResponse.json({ ok: false, error: "A valid website URL is required." }, { status: 400 });
  }

  if (!email && !telegram) {
    return NextResponse.json(
      { ok: false, error: "Provide an email or Telegram account for contact." },
      { status: 400 }
    );
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Email format is invalid." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.NETWORK_ASSESSMENT_FROM ?? "LST Radar <onboarding@resend.dev>";

  if (!resendApiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Email service is not configured (missing RESEND_API_KEY)."
      },
      { status: 500 }
    );
  }

  const textLines = [
    "New Network Assessment Request",
    "",
    `Project: ${projectName}`,
    `Website: ${website}`,
    `Email: ${email || "N/A"}`,
    `Telegram: ${telegram || "N/A"}`,
    "",
    `Submitted At: ${new Date().toISOString()}`
  ];

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [DESTINATION_EMAIL],
      subject: `Network Assessment Request · ${projectName}`,
      text: textLines.join("\n"),
      ...(email ? { reply_to: email } : {})
    })
  });

  if (!resendResponse.ok) {
    const errorPayload = (await resendResponse.json().catch(() => null)) as
      | { message?: string; error?: { message?: string } }
      | null;

    const detail = errorPayload?.error?.message ?? errorPayload?.message ?? "Resend request failed.";

    return NextResponse.json(
      {
        ok: false,
        error: `Could not send request email: ${detail}`
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
