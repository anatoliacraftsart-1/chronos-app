export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Yalnızca POST kabul edilir.' });
    }

    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // v1 sürümü + flash-8b-latest kombinasyonu en yüksek başarı oranına sahiptir.
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-8b-latest:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    ...(history || []).map(item => ({
                        role: item.role === "model" ? "model" : "user",
                        parts: item.parts
                    })),
                    { role: "user", parts: [{ text: message }] }
                ]
            })
        });

        const data = await response.json();
        
        // Google'dan gelen hata mesajını loglarda görebilmek için:
        if (data.error) {
            console.error("Gemini Error:", data.error.message);
            return res.status(data.error.code || 500).json({ reply: "API Hatası: " + data.error.message });
        }

        if (data.candidates && data.candidates.length > 0) {
            const reply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply });
        } else {
            res.status(500).json({ reply: "Cevap üretilemedi, lütfen tekrar deneyin." });
        }
    } catch (error) {
        res.status(500).json({ reply: "Bağlantı hatası: " + error.message });
    }
}
