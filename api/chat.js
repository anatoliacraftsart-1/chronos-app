export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(200).json({ reply: "Sistem Hatası: API Anahtarı eksik." });

  try {
    // Listende gördüğümüz ve v1beta ile uyumlu olan en yeni model:
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          role: "user",
          parts: [{ text: req.body.message }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Eğer yine kota derse, Google bu modeli senin anahtarın için henüz 'aktif' etmemiştir.
      return res.status(200).json({ reply: `API Bilgisi: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Bağlantı başarılı ama veri akışı sağlanamadı." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası oluştu." });
  }
}
