export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.message }] }],
        generationConfig: {
          temperature: 0.5, // Daha net ve hızlı kararlar için
          maxOutputTokens: 250, // Yanıtı kısa tutarak ağ trafiğini azaltır
          topP: 0.8,
          topK: 40
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Sistem meşgul, tekrar dene." });
    }
  } catch (error) {
    res.status(500).json({ reply: "Hız hatası." });
  }
}
