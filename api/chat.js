export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Sistem Hatası: API Anahtarı eksik!" });
  }

  try {
    // Sürüm karmaşasını önlemek için v1 endpoint'i üzerinden gidiyoruz
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: req.body.message || "Merhaba" }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Eğer model bulunamazsa hata mesajında hangi modellerin mevcut olduğunu söyleyecek
      return res.status(200).json({ 
        reply: `API Bilgisi: ${data.error.message} (Lütfen Vercel Logs üzerinden desteklenen modelleri kontrol edin.)` 
      });
    }

    if (data.candidates && data.candidates[0].content) {
      const result = data.candidates[0].content.parts[0].text;
      res.status(200).json({ reply: result });
    } else {
      res.status(200).json({ reply: "Bağlantı başarılı, veri bekleniyor..." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası: " + error.message });
  }
}
