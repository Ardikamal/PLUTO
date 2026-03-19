# 🪐 Pluto AI — Companion untuk Meili April

AI Assistant personal dengan kepribadian INFJ, terintegrasi Claude + GPT-4o + Gemini.

---

## 🚀 Deploy ke Vercel (5 menit)

### Langkah 1 — Upload ke GitHub
1. Buat repo baru di github.com (misal: `pluto-ai`)
2. Upload semua file ini ke repo tersebut

### Langkah 2 — Connect ke Vercel
1. Buka [vercel.com](https://vercel.com) → Login
2. Klik **"Add New Project"**
3. Import repo GitHub tadi
4. Klik **Deploy** (biarkan setting default)

### Langkah 3 — Tambahkan API Keys
Di Vercel dashboard → **Settings → Environment Variables**, tambahkan:

| Variable | Value | Keterangan |
|---|---|---|
| `CLAUDE_API_KEY` | `sk-ant-...` | Dari console.anthropic.com |
| `OPENAI_API_KEY` | `sk-...` | Dari platform.openai.com |
| `GEMINI_API_KEY` | `AIza...` | Dari aistudio.google.com |

> Minimal cukup `CLAUDE_API_KEY` saja untuk memulai.

### Langkah 4 — Redeploy
Setelah menambah env variables, klik **Redeploy**.

Selesai! Pluto sudah online di `https://nama-project.vercel.app` 🎉

---

## 📁 Struktur File

```
pluto-ai/
├── api/
│   └── chat.js          ← Backend proxy (Claude + GPT + Gemini)
├── public/
│   └── index.html       ← Frontend UI
├── vercel.json          ← Konfigurasi Vercel
└── package.json
```

---

## 📱 Akses dari iPhone / Android

Buka URL Vercel di browser HP → klik **"Add to Home Screen"** → Pluto jadi app icon!

---

## ✨ Fitur

- 🤖 3 AI Engine: Claude, GPT-4o, Gemini (pilih atau Auto)
- 💜 Kepribadian INFJ yang memahami Meili sebagai dokter koas
- 🌙 Greeting dinamis berubah sesuai waktu (pagi/siang/sore/malam)
- 📱 Responsive — laptop, tablet, HP semua mulus
- 🪐 Animasi orb yang hidup saat Pluto berpikir
- ⚡ Ringan — pure HTML/CSS/JS, no framework
