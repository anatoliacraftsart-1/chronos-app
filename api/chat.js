export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // Listendeki 'gemini-flash-latest' modelini v1beta üzerinden çağırıyoruz.
    // Bu model ücretsiz katmanda en yüksek limitlere sahiptir.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.message }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `Sistem Notu: ${data.error.message}` });
    }

    res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ reply: "Bağlantı hatası." });
  }
}
