export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Sadece POST kabul edilir.' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ reply: 'Hata: GEMINI_API_KEY Vercel üzerinde tanımlı değil.' });
    }

    try {
        // Gemini 1.5 Flash (Ücretsiz ve hızlı model)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Sen Tanıksız Tarih kanalının gizemli asistanısın. Kullanıcıya şu konuda bilgece cevap ver: ${message}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: `Gemini Hatası: ${data.error.message}` });
        }

        // Gemini'den gelen cevabı ayıkla
        const aiReply = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ reply: 'Bağlantı hatası: ' + error.message });
    }
}
