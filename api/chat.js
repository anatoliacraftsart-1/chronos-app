module.exports = async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    try {
        // Asistan yerine Google'dan senin hesabındaki modelleri listelemesini istiyoruz
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: `Hata: ${data.error.message}` });
        }

        // Hesabında çalışan modellerin listesini ekrana basıyoruz
        const modelNames = data.models.map(m => m.name).join(', ');
        return res.status(200).json({ 
            reply: `Senin hesabında çalışan modeller şunlar: ${modelNames}. Lütfen bu listeyi bana gönder.` 
        });

    } catch (error) {
        return res.status(500).json({ reply: 'Bağlantı kurulamadı: ' + error.message });
    }
};
