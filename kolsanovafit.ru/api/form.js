// api/form.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { name, email } = body;

    if (!name || !email)
      return res
        .status(400)
        .json({ ok: false, error: "name and email required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "invalid email" });
    }

    const text = `📝 Новая заявка
👤 Имя: ${name}
✉️ Email: ${email}
🕒 ${new Date().toLocaleString("ru-RU")}`;

    const r = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );
    const j = await r.json();
    if (!j.ok) throw new Error(j.description || "Telegram error");

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("api/form error:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
