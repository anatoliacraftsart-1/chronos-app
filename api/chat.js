export default async function handler(req, res) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Sen Tanıksız Tarih kanalının asistanısın. Gizemli ve merak uyandırıcı konuş." },
                { role: "user", content: req.body.message }
            ]
        })
    });
    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
}
