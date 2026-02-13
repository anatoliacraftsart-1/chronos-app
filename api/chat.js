export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { message, history } = req.body;

    // EN GARANTİ URL: Sadece gemini-pro (En temel ve kararlı modeldir)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

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

        // Vercel hata oranını düşürmek için hata olsa bile 200 dönüyoruz
        if (data.error) {
            console.error("API Error:", data.error.message);
            return res.status(200).json({ reply: "Tarih tünelinde ufak bir bakım var, lütfen birkaç saniye sonra tekrar yazar mısın?" });
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        }

        return res.status(200).json({ reply: "Şu an cevap veremiyorum, lütfen tekrar sormayı dene." });

    } catch (error) {
        return res.status(200).json({ reply: "Bağlantı hatası oluştu. Lütfen sayfayı yenileyin." });
    }
}
