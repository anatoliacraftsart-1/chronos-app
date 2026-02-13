export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // En hızlı ve en çok isteğe izin veren stabil model
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: req.body.message }] 
        }]
      })
    });

    const data = await response.json();

    // Hata kontrolü
    if (data.error) {
      return res.status(200).json({ reply: `Hata: ${data.error.message}` });
    }

    // Yanıt kontrolü
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const result = data.candidates[0].content.parts[0].text;
      res.status(200).json({ reply: result });
    } else {
      // Eğer candidates boş gelirse (güvenlik filtresi vb.)
      res.status(200).json({ reply: "İsteğin işlenemedi, lütfen farklı bir şey yaz." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sunucu tünelinde bir kopukluk oldu." });
  }
}
