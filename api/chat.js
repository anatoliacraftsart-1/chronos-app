export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { message, history } = req.body;

    // LİSTENDEN SEÇTİĞİMİZ EN GÜNCEL MODEL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // GEMINI'YE GÖRSEL ÜRETMESİNİ SÖYLEYEN SİSTEM TALİMATI
    const systemInstruction = `
        Sen Tanıksız Tarih projesinin uzman yapay zeka asistanısın. 
        Tarih konularında derin bilgiye sahipsin. 
        Kritik Kural: Eğer kullanıcı senden bir savaş sahnesi, tarihi bir mekan veya bir karakterin görselini/resmini isterse, 
        cevabının en sonuna tam olarak şu formatta bir kod ekle: [IMAGE: sahne açıklaması].
        Örnek: "İşte İstanbul'un fethi sahnesi: [IMAGE: 1453 Ottoman siege of Constantinople, giant cannons, cinematic lighting]"
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: systemInstruction }] },
                    { role: "model", parts: [{ text: "Anlaşıldı, Tanıksız Tarih asistanı olarak görsel komutlarını [IMAGE: prompt] şeklinde ileteceğim." }] },
                    ...(history || []).map(item => ({
                        role: item.role === "model" ? "model" : "user",
                        parts: [{ text: item.parts[0].text }]
                    })),
                    { role: "user", parts: [{ text: message }] }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("API Hatası:", data.error.message);
            return res.status(200).json({ reply: "Tarih tünelinde bir sistemsel hata oluştu: " + data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        }

        return res.status(200).json({ reply: "Şu an bağlantı kurulamıyor, lütfen tekrar dener misin?" });

    } catch (error) {
        return res.status(200).json({ reply: "Sunucu hatası: " + error.message });
    }
}
