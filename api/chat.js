export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(200).json({ reply: "Sistem: API Anahtarı bulunamadı." });

  try {
    // En geniş kotalı ve senin listende de çalışan 'latest' sürümü
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.message }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Hala kota hatası verirse, tek sorun anahtarın çok fazla istek görmüş olmasıdır.
      return res.status(200).json({ reply: `Durum: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Sistem yanıt veremedi, lütfen tekrar deneyin." });
    }
  } catch (error) {
    res.status(500).json({ reply: "Bağlantı koptu." });
  }
}
