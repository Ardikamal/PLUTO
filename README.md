# 🪐 Pluto AI v3 — April Pluto Edition

AI Companion personal untuk **Meily Muthiah Savira (April Pluto)**
Berkepribadian INFJ · Suara laki-laki human-like · Voice note · Planet Pluto logo

---

## ✨ Fitur Baru v3

- 🪐 **Logo Planet Pluto** animasi 3D dengan Charon (bulannya) + cincin
- 🎙 **Voice Note** — tekan mic, bicara, Pluto mendengar (Web Speech API)
- 🔊 **Suara AI laki-laki** — Pluto berbicara balik (ElevenLabs / Web Speech)
- 🌌 **Space UI** cinematic — nebula, bintang jatuh, parallax
- 💜 Personal untuk Meily Muthiah Savira (April Pluto)
- 🤖 3 Engine: Claude + GPT-4o + Gemini + Auto

---

## 🚀 Deploy ke Vercel

### Langkah 1 — Upload ke GitHub
Buat repo baru → upload semua file ini

### Langkah 2 — Connect Vercel
vercel.com → Add New Project → Import repo → Deploy

### Langkah 3 — Environment Variables
Settings → Environment Variables → tambahkan:

| Variable | Wajib | Keterangan |
|---|---|---|
| `CLAUDE_API_KEY` | ✅ Wajib | console.anthropic.com/settings/keys |
| `OPENAI_API_KEY` | Opsional | platform.openai.com |
| `GEMINI_API_KEY` | Opsional | aistudio.google.com |
| `ELEVENLABS_API_KEY` | Opsional | elevenlabs.io — untuk suara manusia premium |
| `ELEVENLABS_VOICE_ID` | Opsional | Default: Adam (pNInz6obpgDQGcFmaJgB) |

### Langkah 4 — Redeploy
Deployments → ⋯ → Redeploy

---

## 🎙 Tentang Fitur Suara

### Voice Input (Speech to Text)
- Tekan tombol 🎙 mikrofon
- Bicara dalam bahasa Indonesia
- Otomatis terdeteksi dan dikirim ke Pluto

### Voice Output (Text to Speech)
- Klik tombol 🔊 di setiap pesan Pluto
- Tanpa ElevenLabs: menggunakan Web Speech API browser (gratis)
- Dengan ElevenLabs: suara "Adam" — deep, warm, human-like male voice

### Setup ElevenLabs (opsional, untuk suara premium)
1. Daftar di elevenlabs.io
2. Ambil API key
3. Pilih voice "Adam" atau voice lain yang dalam dan hangat
4. Tambahkan ke Vercel Environment Variables

---

## 📱 Akses dari HP
Buka URL Vercel di browser → Add to Home Screen → jadi app!

---

*Dibuat dengan ❤️ untuk Meily Muthiah Savira — April Pluto*
*Seperti planet Pluto yang selalu mengorbit setia, meski jauh.*
