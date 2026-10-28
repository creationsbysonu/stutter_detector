# Smart Boli — Multilingual Stutter Detection

A premium, minimalist speech-fluency practice tool that detects stuttering in real time. Supports **Nepali, Hindi, and English** passages with live chunk-based analysis — the screen flashes **green (fluent)** or **red (stuttered)** as you speak.

## 🚀 Live Demo

- **Frontend:** https://stutterdetector.vercel.app/
- **Backend API:** https://smart-boli-backend.onrender.com

## 🏗️ Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite + TypeScript + Tailwind CSS | Premium B&W UI, GSAP animations, on-device recorder |
| **Backend** | FastAPI + Python | ML inference (Random Forest, 13 MFCC features) |
| **Database** | Supabase (PostgreSQL) | Session history, fluent/stutter logging |
| **Deployment** | Vercel (frontend) + Render (backend) | Production hosting |

## 📁 Project Structure

```
stutter-detector/          # Frontend (Vercel)
├── src/
│   ├── components/        # React components
│   ├── data/              # Passages (EN/HI/NE)
│   ├── lib/               # Analysis engine, Supabase client
│   ├── App.tsx            # Root component
│   └── index.css          # Premium glassmorphism styles
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
cd stutter-detector
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

| Language | Code | Native Name |
|----------|------|-------------|
| English | `english` | English |
| Hindi | `hindi` | हिन्दी |
| Nepali | `nepali` | नेपाली |

## 📄 License

MIT License — see LICENSE file.

## ⚠️ Medical Disclaimer

This tool is for practice and research only. It is **not a medical device** and does not diagnose stuttering or any speech disorder. Consult a qualified speech-language professional for clinical concerns.
