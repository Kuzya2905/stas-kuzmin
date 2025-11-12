// api/form.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const { name, email } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ ok: false, error: "Missing fields" });
  }

  const message = `📝 Новая заявка с сайта:\n👤 Имя: ${name}\n✉️ Почта: ${email}`;

  try {
    const tgResp = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const tgData = await tgResp.json();
    if (!tgData.ok) throw new Error(tgData.description);

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Telegram error:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
