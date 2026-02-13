export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Sistem Hatası: API Anahtarı bulunamadı." });
  }

  try {
    // Listendeki en stabil ve yeni model: gemini-2.5-flash
   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          role: "user",
          parts: [{ text: req.body.message || "Merhaba" }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `API Hatası: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content) {
      const result = data.candidates[0].content.parts[0].text;
      res.status(200).json({ reply: result });
    } else {
      res.status(200).json({ reply: "Modelden yanıt alınamadı, lütfen tekrar deneyin." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası: " + error.message });
  }
}
