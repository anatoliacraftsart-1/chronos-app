export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Hata: API Anahtarı eksik." });
  }

  try {
    // Kütüphane gerektirmeyen modern yerel fetch yapısı
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
      // Eğer hala kota hatası verirse, sorun sadece Google'ın bekleme süresidir.
      return res.status(200).json({ reply: `Bilgi: ${data.error.message}` });
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Sistem mesajı aldı ama yanıt oluşturamadı, lütfen 1 dakika bekleyip tekrar deneyin." });
    }
  } catch (error) {
    res.status(500).json({ reply: "Bağlantı tünelinde bir aksama oldu." });
  }
}
