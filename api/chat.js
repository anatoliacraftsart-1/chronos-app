export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Sistem Notu: API Anahtarı eksik!" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.message }] }]
      })
    });

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "Cevap üretilemedi.";
    
    res.status(200).json({ reply: result });
  } catch (error) {
    res.status(500).json({ reply: "Bağlantı sırasında bir sorun oluştu." });
  }
}
