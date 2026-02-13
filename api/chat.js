export default async function handler(req, res) {
    // Vercel'in yeni sürümlerinde fetch zaten tanımlıdır, extra import'a gerek kalmayabilir
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // En kararlı model ismi: gemini-1.5-flash
   const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [...(history || []), { role: "user", parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ reply: "API Hatası: " + data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply });
        } else {
            res.status(500).json({ reply: "Asistan cevap üretemedi, lütfen tekrar dene." });
        }
    } catch (error) {
        res.status(500).json({ reply: "Bağlantı hatası: " + error.message });
    }
}
