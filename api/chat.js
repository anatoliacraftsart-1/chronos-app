export default async function handler(req, res) {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // ÖNEMLİ: Linkin başında ve sonunda ` (backtick) işareti olduğundan emin ol
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`;

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

        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ reply: "Bağlantı tünelinde bir sorun oluştu." });
    }
}
