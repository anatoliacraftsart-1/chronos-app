export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // SADE VE NET: v1beta/models/gemini-pro
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    ...(history || []).map(item => ({
                        role: item.role === "model" ? "model" : "user",
                        parts: [{ text: typeof item.parts === 'string' ? item.parts : item.parts[0].text }]
                    })),
                    { role: "user", parts: [{ text: message }] }
                ]
            })
        });

        const data = await response.json();

        // Eğer hala "Bulunamadı" diyorsa hatayı detaylıca yakala
        if (data.error) {
            console.error("KRİTİK HATA:", data.error.message);
            // Hata mesajı "not found" ise alternatifi dene
            return res.status(200).json({ reply: `API Modeli Bağlanamadı. Lütfen Google AI Studio'dan API Key'inizi ve model yetkinizi kontrol edin. Hata: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(200).json({ reply: "Cevap formatı uyuşmadı." });
        }
    } catch (error) {
        res.status(500).json({ reply: "Bağlantı koptu: " + error.message });
    }
}
