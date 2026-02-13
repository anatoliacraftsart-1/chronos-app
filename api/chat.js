export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { message, history } = req.body;

    // GOOGLE'IN EN ÇOK KABUL ETTİĞİ FORMAT: v1beta ve gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: message }]
                    }
                ]
            })
        });

        const data = await response.json();

        // Eğer hala hata gelirse, hatanın gerçek sebebinin ne olduğunu ekranda görelim
        if (data.error) {
            console.error("API ERROR:", data.error.message);
            return res.status(200).json({ reply: "Sistem Hatası: " + data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        }

        return res.status(200).json({ reply: "Tarihin derinliklerinde bir sorun var." });

    } catch (error) {
        return res.status(200).json({ reply: "Bağlantı koptu. Lütfen tekrar dene." });
    }
}
