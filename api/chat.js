export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Yalnızca POST kabul edilir.' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { message } = req.body;

    // LİSTENDEN SEÇİLEN GERÇEK MODEL: gemini-2.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ 
                reply: "Model eşleşme hatası: " + data.error.message 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ reply: "Tarih tüneli şu an boş dönüyor." });

    } catch (error) {
        return res.status(200).json({ reply: "Bağlantı hatası: " + error.message });
    }
}
