# Smart Boli — Multilingual Stutter Detection

A premium, minimalist speech-fluency practice tool that detects stuttering in real time. **Nepali-first** (the stutter model is trained on Nepali speech), with Hindi and English passages also available. Live chunk-based analysis flashes **green (fluent)** or **red (stuttered)** as you speak.

## ✨ Frontend

An Apple-style, scroll-driven marketing site + testing interface:

- **Lenis** — locomotive-style inertial smooth scrolling, synced to GSAP ScrollTrigger
- **GSAP ScrollTrigger** — masked word reveals, parallax, pinned horizontal “How it works”, scrubbed scale-on-scroll panels, count-up stats
- **Lottie** — self-hosted, hand-crafted animations (mic, waveform, loader, check, scroll cue) with dark-mode variants

## 🚀 Live Demo

- **Frontend:** https://stutterdetector.vercel.app/
- **Backend API:** https://smart-boli-backend.onrender.com

## 🏗️ Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite + TypeScript + Tailwind + GSAP + Lenis + Lottie | Premium minimalist UI, scroll-driven animations, on-device recorder |
| **Backend** | FastAPI + Python | ML inference (Random Forest, 13 MFCC features) |
| **Database** | Supabase (PostgreSQL) | Session history, fluent/stutter logging |
| **Deployment** | Vercel (frontend) + Render (backend) | Production hosting |

## 📁 Project Structure

```
smart-boli-frontend/       # Frontend (Vercel)
├── src/
│   ├── components/        # React components (sections, recorder, live detection)
│   ├── assets/lottie/     # Self-hosted Lottie animations
│   ├── data/              # Passages (NE/EN/HI)
│   ├── lib/               # Analysis engine, Supabase client, scroll + animation helpers
│   ├── App.tsx            # Root component
│   └── index.css          # Design system (tokens, glass, grain)
├── vercel.json            # Vercel config
└── package.json

smart-boli-backend/        # Backend (Render)
├── main.py                # FastAPI app
├── Dockerfile             # Container config
├── requirements.txt       # Python dependencies
└── nepali_stutter_model.pkl  # Trained ML model
```

## 🛡️ Security

- **CORS:** Restricted to known origins (Vercel + localhost)
- **Rate limiting:** 30 requests/minute per IP on `/predict`
- **File validation:** MIME type + size check (max 2MB) on uploads
- **Security headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Permissions-Policy`
- **Trusted hosts:** Middleware for host validation
- **Input sanitization:** Audio decoded and validated before ML inference

## 🔧 Local Development

### Frontend

```bash
cd smart-boli-frontend
cp .env.example .env
# Edit .env with your Supabase and API URLs
npm install
npm run dev
```

### Backend

```bash
cd smart-boli-backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Docker (Backend)

```bash
cd smart-boli-backend
docker build -t smart-boli-backend .
docker run -p 8000:8000 -e PORT=8000 smart-boli-backend
```

### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Copy your URL and anon key to `.env`

## 🌍 Supported Languages

| Language | Code | Native Name | Model |
|----------|------|-------------|-------|
| Nepali (primary) | `nepali` | नेपाली | ✅ Trained stutter model |
| English | `english` | English | 🔨 Dedicated model in development (browser analysis now) |
| Hindi | `hindi` | हिन्दी | Browser-based rhythm analysis |

## 📄 License

MIT License — see LICENSE file.

## ⚠️ Medical Disclaimer

This tool is for practice and research only. It is **not a medical device** and does not diagnose stuttering or any speech disorder. Consult a qualified speech-language professional for clinical concerns.
