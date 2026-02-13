export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(200).json({ reply: "Sistem Hatası: API Anahtarı eksik." });

  try {
    // EN STABİL YOL: v1 sürümü ve gemini-1.5-flash ismi
    // Bu model ücretsiz katmanda dakikada 15 isteğe kadar izin verir.
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.message }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Eğer hala 'limit: 0' diyorsa, anahtarın bu modele henüz tanımlanmamış olabilir.
      return res.status(200).json({ reply: `Durum: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Bağlantı açık ama cevap gelmedi, tekrar dener misin?" });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası." });
  }
}
