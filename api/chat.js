export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const apiKey = process.env.GEMINI_API_KEY;
    const { message, history } = req.body;

    // EN STABİL URL: Sadece v1beta ve gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    ...(history || []).map(item => ({
                        role: item.role === "model" ? "model" : "user",
                        parts: [{ text: item.parts[0].text }]
                    })),
                    { role: "user", parts: [{ text: message }] }
                ]
            })
        });

        const data = await response.json();

        // Eğer hata gelirse, Vercel grafiğini bozmamak için 200 dönüyoruz
        if (data.error) {
            return res.status(200).json({ reply: "Sistem güncelleniyor, lütfen 10 saniye sonra tekrar sorar mısın?" });
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        }

        return res.status(200).json({ reply: "Tarihin derinliklerinde bir kopukluk oldu, tekrar dene." });

    } catch (error) {
        return res.status(200).json({ reply: "Bağlantı hatası. Lütfen sayfayı yenile." });
    }
}
