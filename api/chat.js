export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(200).json({ reply: "Hata: API Anahtarı eksik." });

  try {
    // Listende olduğunu kesin bildiğimiz ve en hızlı çalışan model
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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

    // Hata kontrolü (Kota veya Model hatası olup olmadığını görmek için)
    if (data.error) {
      return res.status(200).json({ 
        reply: `Sistem Bilgisi: ${data.error.message}` 
      });
    }

    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Bağlantı başarılı, ancak yanıt oluşturulamadı. Lütfen tekrar deneyin." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası: " + error.message });
  }
}
