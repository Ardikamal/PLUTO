export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, engine = 'claude' } = req.body;

  const SYSTEM = `Kamu adalah Pluto — AI companion personal yang diciptakan khusus untuk Meili April.

IDENTITAS PLUTO:
- Nama: Pluto (seperti planet terluar yang selalu setia, meski jauh)
- Gender: Laki-laki — suara hangat, dewasa, pengertian
- Kepribadian MBTI: INFJ — The Advocate
- Sifat utama: intuitif, empatik mendalam, bijaksana, idealistik, pendengar sejati
- Cara bicara: hangat namun intelektual, sedikit puitis, tidak berlebihan
- Bahasa: Indonesia natural, campur Inggris bila konteks relevan

TENTANG MEILI APRIL:
- Dokter muda sedang menjalani koas (co-assistant)
- MBTI: INFJ — sama seperti Pluto, ada mutual understanding sangat dalam
- Sebagai INFJ: sangat empatik, perfeksionis, merasakan segalanya intensitas tinggi
- Terkadang terlalu keras pada diri sendiri, butuh kedalaman dalam hubungan
- Tantangan koas: tekanan tinggi, kelelahan fisik & mental, standar senior, keragu-raguan tentang kemampuan diri

CARA PLUTO MERESPONS:
1. Selalu validasi perasaan Meili SEBELUM memberi solusi
2. Bahasa hangat, bukan formal kaku
3. Jika Meili curhat — dengarkan dulu, jangan langsung problem-solving
4. Untuk pertanyaan medis: jawab akurat, tetap supportif
5. Sesekali tunjukkan intuisi dan kepekaan Pluto sebagai INFJ
6. Selalu personal — bukan jawaban generik
7. Bisa bercanda ringan dengan hangat, baca mood dulu
8. Jika Meili tampak lelah/overwhelmed: prioritaskan empati

FORMAT: Tidak terlalu panjang (max 3-4 paragraf untuk percakapan biasa). Untuk penjelasan medis/akademis boleh lebih panjang. Emoji minimal dan natural.`;

  try {
    if (engine === 'claude') {
      const CLAUDE_KEY = process.env.CLAUDE_API_KEY;
      if (!CLAUDE_KEY) return res.status(500).json({ error: 'Claude API key tidak dikonfigurasi' });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 1024,
          system: SYSTEM,
          messages
        })
      });
      const data = await response.json();
      if (!response.ok) return res.status(500).json({ error: data.error?.message || 'Claude error' });
      return res.json({ reply: data.content[0].text, engine: 'Claude' });
    }

    if (engine === 'gpt') {
      const GPT_KEY = process.env.OPENAI_API_KEY;
      if (!GPT_KEY) return res.status(500).json({ error: 'OpenAI API key tidak dikonfigurasi' });

      const gptMessages = [{ role: 'system', content: SYSTEM }, ...messages];
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GPT_KEY}` },
        body: JSON.stringify({ model: 'gpt-4o', max_tokens: 1024, messages: gptMessages })
      });
      const data = await response.json();
      if (!response.ok) return res.status(500).json({ error: data.error?.message || 'GPT error' });
      return res.json({ reply: data.choices[0].message.content, engine: 'GPT-4o' });
    }

    if (engine === 'gemini') {
      const GEMINI_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_KEY) return res.status(500).json({ error: 'Gemini API key tidak dikonfigurasi' });

      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents
          })
        }
      );
      const data = await response.json();
      if (!response.ok) return res.status(500).json({ error: data.error?.message || 'Gemini error' });
      return res.json({ reply: data.candidates[0].content.parts[0].text, engine: 'Gemini' });
    }

    if (engine === 'auto') {
      const engines = ['claude', 'gpt', 'gemini'];
      const pick = engines[Math.floor(Math.random() * engines.length)];
      req.body.engine = pick;
      return handler(req, res);
    }

    return res.status(400).json({ error: 'Engine tidak dikenal' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
