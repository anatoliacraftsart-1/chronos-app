export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Sistem Hatası: API Anahtarı (GEMINI_API_KEY) bulunamadı." });
  }

  try {
    // ÖNEMLİ: v1beta ve gemini-1.5-flash-latest kombinasyonu şu an en kararlı olanıdır.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

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
      // Eğer yine hata verirse, buradaki mesaj bize her şeyi anlatacak.
      return res.status(200).json({ 
        reply: `API Yanıtı: ${data.error.message} (Hata Kodu: ${data.error.code})` 
      });
    }

    if (data.candidates && data.candidates[0].content) {
      const result = data.candidates[0].content.parts[0].text;
      res.status(200).json({ reply: result });
    } else {
      res.status(200).json({ reply: "Bağlantı başarılı, ancak içerik oluşturulamadı." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası: " + error.message });
  }
}
