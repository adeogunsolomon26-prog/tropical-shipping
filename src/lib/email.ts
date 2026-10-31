type Mail = { to: string; subject: string; text: string; replyTo?: string };

// SERVER ONLY. Sends an email through Resend. Never throws: returns ok or an error message.
export async function sendEmail({ to, subject, text, replyTo }: Mail): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return { ok: false, error: "Email is not configured" };

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text, reply_to: replyTo }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return { ok: false, error: j.message || "Email could not be sent" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Email could not be sent" };
  }
}