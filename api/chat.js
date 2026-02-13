export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { message } = req.body;

    // v1beta sürümünde TAM MODEL ADI: gemini-1.5-flash-001
    // Genellikle 'is not found' hataları bu tam numara ile çözülür.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        // Hata varsa kullanıcıya tam teknik mesajı göster (çözmemiz için şart)
        if (data.error) {
            return res.status(200).json({ 
                reply: `Bağlantı Denemesi Başarısız. Hata Mesajı: ${data.error.message}` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ reply: "Modelden boş cevap döndü." });

    } catch (error) {
        return res.status(200).json({ reply: "Bağlantı hatası: " + error.message });
    }
}
