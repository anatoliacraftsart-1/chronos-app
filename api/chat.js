export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Hata: GEMINI_API_KEY bulunamadı." });
  }

  try {
    // API'ye "Bana hangi modelleri kullanabileceğimi söyle" diyoruz
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `Sorgu Hatası: ${data.error.message}` });
    }

    // Gelen modelleri okunabilir bir liste haline getiriyoruz
    if (data.models) {
      const modelList = data.models
        .map(m => m.name.replace('models/', '')) // 'models/' kısmını temizle
        .join(', ');
      
      res.status(200).json({ 
        reply: `Erişebildiğin Modeller: ${modelList}. Lütfen bu listeden birini seçelim.` 
      });
    } else {
      res.status(200).json({ reply: "Hiçbir model listelenemedi. API anahtarında bir kısıtlama olabilir." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Sorgulama sırasında sunucu hatası: " + error.message });
  }
}

