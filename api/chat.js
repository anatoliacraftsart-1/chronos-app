export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(200).json({ reply: "Sistem Hatası: API Anahtarı eksik." });

  try {
    // 'latest' takısı, o anki en stabil ve kotası en yüksek modeli otomatik seçer.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.message }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      // Eğer limit: 0 hatası devam ederse, bu modelin henüz aktifleşmesini beklememiz gerekecek.
      return res.status(200).json({ reply: `Kota Durumu: ${data.error.message}` });
    }

    if (data.candidates) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Sistem şu an cevap üretemiyor, lütfen 30 saniye bekleyin." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası oluştu." });
  }
}
