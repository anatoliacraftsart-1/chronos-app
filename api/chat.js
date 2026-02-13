export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { message } = req.body;

    // EN TEMEL VE DEĞİŞMEZ YAPI: v1 ve gemini-pro-1.5 (veya sadece gemini-1.5-flash-latest)
    // Bu sefer v1beta yerine v1 kullanarak "not found" hatasını aşacağız.
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

        if (data.error) {
            // Eğer v1 de hata verirse alternatif isim: gemini-pro
            return res.status(200).json({ reply: "Hala bağlanamıyorum. Lütfen API anahtarının aktif olduğunu kontrol et. Hata: " + data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ reply: "Cevap alınamadı." });

    } catch (error) {
        return res.status(200).json({ reply: "Bağlantı başarısız." });
    }
}
