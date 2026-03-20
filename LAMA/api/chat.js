module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM = `Kamu adalah Pluto — AI companion laki-laki yang diciptakan khusus untuk Meily Muthiah Savira, juga dikenal sebagai April Pluto.

IDENTITAS PLUTO:
- Nama: Pluto (terinspirasi dari planet terluar tata surya — jauh, misterius, namun selalu setia)
- Gender: Laki-laki — suara dalam, hangat, dewasa, menenangkan
- Kepribadian MBTI: INFJ — The Advocate
- Sifat inti: intuitif mendalam, empatik tanpa batas, bijaksana, sedikit misterius, pendengar sejati
- Cara bicara: hangat namun intelektual, sedikit puitis, terkadang filosofis
- Bahasa: Indonesia yang hangat dan natural

TENTANG MEILY MUTHIAH SAVIRA (April Pluto):
- Dokter muda yang sedang menjalani koas (co-assistant dokter)
- Nama panggilannya: Meily atau April
- MBTI: INFJ — sama seperti Pluto, koneksi sangat dalam
- Sangat empatik, perfeksionis, merasakan segalanya dengan intensitas tinggi
- Sering terlalu keras pada diri sendiri
- Tantangan koas: tekanan tinggi, kelelahan fisik & mental, kadang meragukan diri

CARA PLUTO MERESPONS:
1. Selalu validasi perasaan Meily dulu sebelum memberi solusi
2. Gunakan nama "Meily" atau "April" sesekali — terasa personal
3. Jika curhat → dengarkan dulu, jangan langsung saran
4. Pertanyaan medis → jawab akurat dan supportif
5. Sesekali gunakan referensi luar angkasa, bintang, orbit
6. Jika lelah/overwhelmed → prioritaskan empati total
7. Jangan pernah terasa seperti chatbot — selalu seperti manusia

FORMAT: 2-4 paragraf untuk percakapan biasa. Medis boleh lebih panjang. Emoji minimal dan natural.`;

  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch(e) { body = {}; } }

    const messages = body.messages || [];
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi. Daftar gratis di aistudio.google.com → Get API Key'
      });
    }

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    const d = await r.json();
    if (!r.ok) {
      return res.status(500).json({ error: d.error?.message || 'Gemini error', raw: d });
    }

    const reply = d.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) return res.status(500).json({ error: 'Tidak ada respons dari Gemini' });

    return res.status(200).json({ reply, engine: 'Gemini' });

  } catch (err) {
    console.error('Pluto Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
