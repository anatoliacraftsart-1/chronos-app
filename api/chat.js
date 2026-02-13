export default async function handler(req, res) {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // KİMLİK: Görsel oluşturma yeteneğini buraya ekliyoruz
    const systemInstruction = "Sen Tanıksız Tarih asistanısın. Eğer kullanıcı bir savaş veya tarihi olay görseli/resmi isterse, cevabının en sonuna tam olarak şu formatta ekle: [IMAGE: sahne açıklaması]. Örnek: [IMAGE: Roma lejyonları Galya savaşında]";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: systemInstruction }] },
                    { role: "model", parts: [{ text: "Anlaşıldı." }] },
                    ...(history || []).map(item => ({
                        role: item.role === "model" ? "model" : "user",
                        parts: [{ text: item.parts[0].text }]
                    })),
                    { role: "user", parts: [{ text: message }] }
                ]
            })
        });

        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ reply: aiReply });
    } catch (error) {
        return res.status(200).json({ reply: "Bağlantı hatası." });
    }
}
