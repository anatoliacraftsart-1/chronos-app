export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { message, history } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Asistanın kişiliğini burada tanımlıyoruz
    const systemInstruction = "Sen 'Tanıksız Tarih' projesinin yapay zeka asistanısın. AnatoliaCrafts tarafından geliştirildin. Tarih konusunda uzman, nazik ve merak uyandırıcı bir dil kullanmalısın.";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: systemInstruction }] },
                    { role: "model", parts: [{ text: "Anlaşıldı, Tanıksız Tarih asistanı olarak görevime hazırım." }] },
                    ...(history || []).map(item => ({
                        role: item.role === "model" ? "model" : "user",
                        parts: [{ text: item.parts[0].text }]
                    })),
                    { role: "user", parts: [{ text: message }] }
                ]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ reply: "Tarihin tozlu sayfaları arasında bir bağlantı sorunu oldu, lütfen tekrar dener misin?" });

    } catch (error) {
        return res.status(200).json({ reply: "Bağlantı hatası: " + error.message });
    }
}
