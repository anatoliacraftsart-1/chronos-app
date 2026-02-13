export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(450).json({ error: 'Yalnızca POST istekleri kabul edilir' });
  }

  const { message, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: "Hata: API anahtarı (GEMINI_API_KEY) Vercel üzerinde tanımlanmamış." });
  }

  try {
    // Google Gemini API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [...(history || []), { role: "user", parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      console.error("API Hatası:", data);
      res.status(500).json({ reply: "API'den boş yanıt döndü. Lütfen anahtarınızı kontrol edin." });
    }
  } catch (error) {
    console.error("Bağlantı Hatası:", error);
    res.status(500).json({ reply: "Sunucu bağlantısı koptu. Lütfen internetinizi kontrol edin." });
  }
}
