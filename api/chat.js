export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Sistem: API Anahtarı eksik." });
  }

  try {
    // Modern 'fetch' yapısı - Kütüphane gerektirmez, hata riskini azaltır
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: req.body.message }] }],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      // Kota hatası mı yoksa başka bir şey mi olduğunu net göreceğiz
      return res.status(200).json({ reply: `Bilgi: ${data.error.message}` });
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Mesaj ulaştı ama yanıt boş döndü." });
    }
  } catch (error) {
    res.status(500).json({ reply: "Bağlantı tünelinde teknik bir aksama oldu." });
  }
}
