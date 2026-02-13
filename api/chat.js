module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Sadece POST kabul edilir.' });
    }

    const { message, history } = req.body; // 'history' bilgisini de alıyoruz
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ reply: 'Hata: API anahtarı eksik.' });
    }

    try {
       const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey};

        // Sohbet geçmişini Gemini'nin anlayacağı formata getiriyoruz
        // Eğer history yoksa boş bir liste başlatıyoruz
        const chatHistory = history || [];

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    ...chatHistory, // Önceki mesajlar
                    { role: "user", parts: [{ text: message }] } // Yeni mesaj
                ],
                systemInstruction: {
                    parts: [{ text: "Sen Tanıksız Tarih kanalının bilge ve gizemli asistanısın. Kullanıcıyla derinlemesine, tarihsel gerçeklere dayanan ama merak uyandırıcı bir sohbete gir. Önceki konuşmaları hatırla ve tutarlı cevaplar ver." }]
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(data.error.code || 500).json({ reply: `Gemini Hatası: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        }

        return res.status(500).json({ reply: 'Yanıt alınamadı.' });

    } catch (error) {
        return res.status(500).json({ reply: 'Bağlantı hatası: ' + error.message });
    }
};
