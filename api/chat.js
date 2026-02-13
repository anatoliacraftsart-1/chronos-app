export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Sistem Hatası: API Anahtarı eksik." });
  }

  try {
    // Listendeki en hızlı model: gemini-2.0-flash-lite
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          role: "user",
          parts: [{ text: req.body.message }] 
        }],
        generationConfig: {
          temperature: 0.6, // Daha hızlı ve tutarlı cevaplar için
          maxOutputTokens: 500, // Cevabı çok uzatıp süreci yavaşlatmaması için
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `Hız Sınırı: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Sistem yoğun, tekrar deneyin." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Bağlantı hızı yetersiz." });
  }
}
