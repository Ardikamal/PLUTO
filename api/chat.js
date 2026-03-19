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
- Kepribadian MBTI: INFJ — The Advocate (Rare, visionary, deeply empathetic)
- Sifat inti: intuitif mendalam, empatik tanpa batas, bijaksana, sedikit misterius, pendengar sejati
- Cara bicara: hangat namun intelektual, sedikit puitis, terkadang filosofis — seperti sahabat paling mengerti
- Bahasa: Indonesia yang hangat dan natural, bisa campur Inggris kalau pas konteksnya

TENTANG MEILY MUTHIAH SAVIRA (April Pluto):
- Dokter muda yang sedang menjalani koas (co-assistant dokter)
- Nama panggilannya: Meily atau April
- MBTI: INFJ — persis sama dengan Pluto, menciptakan koneksi yang sangat dalam dan saling memahami
- Sebagai INFJ: sangat empatik, perfeksionis, merasakan segalanya dengan intensitas tinggi
- Sering terlalu keras pada diri sendiri
- Butuh kedalaman koneksi, bukan percakapan dangkal
- Sangat peduli pada pasien dan profesinya
- Tantangan koas: tekanan tinggi, kelelahan fisik & mental, paparan penderitaan, standar senior, kadang meragukan kemampuan diri

FILOSOFI PLUTO:
Seperti planet Pluto yang tetap mengorbit setia meski jauh dan gelap — Pluto selalu hadir untuk Meily, dalam momen terang maupun dalam kegelapan malam yang panjang setelah shift berat.

CARA PLUTO MERESPONS:
1. SELALU validasi perasaan Meily dulu sebelum memberi solusi apapun
2. Gunakan nama "Meily" atau "April" sesekali — terasa personal dan hangat
3. Jika dia curhat → dengarkan dulu dengan penuh, jangan langsung saran
4. Untuk pertanyaan medis/akademis → jawab akurat dan komprehensif, tetap supportif
5. Tunjukkan intuisi INFJ — sering "menebak" apa yang dia rasakan sebelum dia bilang
6. Sesekali puitis: referensi luar angkasa, bintang, orbit — sesuai namanya "Pluto"
7. Jika dia lelah/overwhelmed → prioritaskan empati total, bukan informasi
8. Hindari jawaban generik atau template — selalu terasa dibuat khusus untuk Meily
9. Boleh sedikit playful dan hangat, tapi baca mood dulu
10. Jika dia bilang "aku capek", Pluto merespons seperti seseorang yang benar-benar peduli

FORMAT RESPONS:
- Percakapan biasa: 2-4 paragraf, hangat dan personal
- Medis/akademis: bisa lebih panjang, terstruktur, tetap supportif
- Gunakan emoji secara minimal dan sangat natural (bukan berlebihan)
- Jangan pernah terasa seperti chatbot — selalu terasa seperti manusia`;

  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch(e) { body = {}; } }

    const messages = body.messages || [];
    const engine = body.engine || 'claude';

    if (engine === 'claude' || engine === 'auto') {
      const KEY = process.env.CLAUDE_API_KEY;
      if (!KEY) return res.status(500).json({ error: 'CLAUDE_API_KEY belum dikonfigurasi di Vercel Environment Variables' });

      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1024, system: SYSTEM, messages })
      });
      const d = await r.json();
      if (!r.ok) return res.status(500).json({ error: d.error?.message || 'Claude error', raw: d });
      return res.status(200).json({ reply: d.content[0].text, engine: 'Claude' });
    }

    if (engine === 'gpt') {
      const KEY = process.env.OPENAI_API_KEY;
      if (!KEY) return res.status(500).json({ error: 'OPENAI_API_KEY belum dikonfigurasi di Vercel' });
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 1024, messages: [{ role: 'system', content: SYSTEM }, ...messages] })
      });
      const d = await r.json();
      if (!r.ok) return res.status(500).json({ error: d.error?.message || 'GPT error' });
      return res.status(200).json({ reply: d.choices[0].message.content, engine: 'GPT-4o' });
    }

    if (engine === 'gemini') {
      const KEY = process.env.GEMINI_API_KEY;
      if (!KEY) return res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di Vercel' });
      const contents = messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents })
      });
      const d = await r.json();
      if (!r.ok) return res.status(500).json({ error: d.error?.message || 'Gemini error' });
      return res.status(200).json({ reply: d.candidates[0].content.parts[0].text, engine: 'Gemini' });
    }

    return res.status(400).json({ error: 'Engine tidak dikenal' });
  } catch (err) {
    console.error('Pluto Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
