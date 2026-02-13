export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Sistem Hatası: GEMINI_API_KEY bulunamadı." });
  }

  try {
    // Endpoint'i v1 sürümüne ve model ismini en kararlı hale getiriyoruz
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
      // Hata devam ederse buradaki detay her şeyi açıklayacak
      return res.status(200).json({ reply: `API Detay Hatası: ${data.error.message} (Kod: ${data.error.code})` });
    }

    if (data.candidates && data.candidates[0].content) {
      const result = data.candidates[0].content.parts[0].text;
      res.status(200).json({ reply: result });
    } else {
      res.status(200).json({ reply: "Bağlantı başarılı ancak içerik üretilemedi." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası: " + error.message });
  }
}

 
