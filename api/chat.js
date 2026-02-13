export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Yalnızca POST kabul edilir.' });
    }

    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // En güncel ve doğru URL yapısı budur:
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    // Geçmiş mesajları düzgün formatta gönderiyoruz
                    ...(history || []).map(item => ({
                        role: item.role,
                        parts: item.parts
                    })),
                    { role: "user", parts: [{ text: message }] }
                ]
            })
        });

        const data = await response.json();
        
        // Google'dan gelen hata mesajını doğrudan yakala
        if (data.error) {
            console.error("Google API Hatası:", data.error.message);
            return res.status(500).json({ reply: "API Hatası: " + data.error.message });
        }

        if (data.candidates && data.candidates.length > 0) {
            const reply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply });
        } else {
            res.status(500).json({ reply: "Model cevap dönmedi, içerik filtrelenmiş olabilir." });
        }
    } catch (error) {
        res.status(500).json({ reply: "Bağlantı hatası: " + error.message });
    }
}
