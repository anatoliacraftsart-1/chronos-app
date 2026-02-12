export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Sadece POST kabul edilir.' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ reply: 'Hata: GEMINI_API_KEY bulunamadı.' });
    }

    try {
        // "v1" versiyonu ve "gemini-pro" ismi en stabil olanıdır
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Sen Tanıksız Tarih kanalının asistanısın. Kısa ve bilgece cevap ver: ${message}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: `Gemini Hatası: ${data.error.message}` });
        }

        // Cevap yolunu daha güvenli kontrol edelim
        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        } else {
            return res.status(500).json({ reply: 'AI cevap üretemedi, lütfen tekrar dene.' });
        }

    } catch (error) {
        return res.status(500).json({ reply: 'Bağlantı hatası: ' + error.message });
    }
}
