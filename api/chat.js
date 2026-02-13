export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Bu URL senin anahtarına açık olan tüm modelleri listeler
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ reply: "API Anahtarı Geçersiz: " + data.error.message });
        }

        // Modelleri bul ve isimlerini birleştir
        const modelList = data.models
            .map(m => m.name.replace('models/', ''))
            .join(', ');

        return res.status(200).json({ 
            reply: "Senin için uygun modeller şunlar: " + modelList + ". Lütfen bu listeyi bana gönder." 
        });

    } catch (error) {
        return res.status(200).json({ reply: "Liste alınamadı: " + error.message });
    }
}
