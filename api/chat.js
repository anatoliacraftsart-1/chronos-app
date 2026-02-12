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
        // v1beta ve tam model yolu kullanımı (En güncel ve sorunsuz adres)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Sen Tanıksız Tarih kanalının gizemli asistanısın. Kısa ve bilgece cevap ver: ${message}` }]
                }]
            })
        });

        const data = await response.json();

        // Eğer hala hata varsa, hatanın detayını görelim
        if (data.error) {
            return res.status(500).json({ reply: `Gemini Hatası (${data.error.code}): ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        } else {
            return res.status(500).json({ reply: 'AI şu an yanıt veremiyor, lütfen tekrar dene.' });
        }

    } catch (error) {
        return res.status(500).json({ reply: 'Bağlantı hatası: ' + error.message });
    }
}
