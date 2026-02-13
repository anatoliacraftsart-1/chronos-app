export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Sistem Hatası: GEMINI_API_KEY bulunamadı. Lütfen Vercel ayarlarını kontrol edin." });
  }

  try {
    // Daha kararlı olan Gemini 1.5 Flash modelini kullanıyoruz
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: req.body.message || "Merhaba" }] 
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    const data = await response.json();

    // Hata ayıklama: Eğer API hata döndürürse detayını kullanıcıya göster
    if (data.error) {
      return res.status(200).json({ reply: `API Hatası: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const result = data.candidates[0].content.parts[0].text;
      res.status(200).json({ reply: result });
    } else {
      res.status(200).json({ reply: "Google API bağlantı kurdu ama yanıt oluşturamadı. Güvenlik filtrelerine takılmış olabilir." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası: " + error.message });
  }
}
