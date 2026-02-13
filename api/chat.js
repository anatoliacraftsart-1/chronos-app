export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // ÇALIŞAN VE KARARLI MODEL: v1/gemini-1.5-flash
    // Bu model hem hızlıdır hem de 'Not Found' hatası vermez.
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
                ],
                // Hız için eklenen yapılandırma:
                generationConfig: {
                    maxOutputTokens: 500, // Cevabı çok uzatmayıp hızı artırır
                    temperature: 0.7      // Daha doğal ama hızlı cevaplar
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("API Hatası:", data.error.message);
            return res.status(500).json({ reply: "Sistem geri yükleniyor, lütfen tekrar dene." });
        }

        if (data.candidates && data.candidates[0].content) {
            res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ reply: "Cevap üretilemedi." });
        }
    } catch (error) {
        res.status(500).json({ reply: "Bağlantı hatası: " + error.message });
    }
}
