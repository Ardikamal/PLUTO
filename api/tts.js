module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch(e) { body = {}; } }
    const { text } = body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;

    if (ELEVEN_KEY) {
      // ElevenLabs - Adam voice (deep male, human-like)
      const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Adam
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_KEY
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true }
        })
      });

      if (r.ok) {
        const buf = await r.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', buf.byteLength);
        return res.status(200).send(Buffer.from(buf));
      }
    }

    // Fallback: signal frontend to use Web Speech API
    return res.status(200).json({ fallback: true, text });

  } catch (err) {
    console.error('TTS Error:', err);
    return res.status(200).json({ fallback: true, text: req.body?.text || '' });
  }
};
