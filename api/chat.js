
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Yalnızca POST istekleri kabul edilir.' });
    }

    const { message } = req.body;

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ reply: 'Hata: API anahtarı Vercel üzerinde tanımlanmamış.' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY.trim()}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Sen Tanıksız Tarih kanalının asistanısın. Gizemli ve bilge bir üslupla konuş.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 400
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: `OpenAI Hatası: ${data.error.message}` });
        }

        return res.status(200).json({ reply: data.choices[0].message.content });

    } catch (error) {
        return res.status(500).json({ reply: 'Bağlantı hatası: ' + error.message });
    }
}
