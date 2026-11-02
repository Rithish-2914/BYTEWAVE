# 🌊 BYTEWAVE — Kochi Metro InfoSync

> **An AI-powered document intelligence and automated routing workflow system designed for transit authorities (Kochi Metro Rail Limited). Built with Next.js 15, Google Genkit AI, Firebase, and Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Google Genkit](https://img.shields.io/badge/Genkit-Google%20AI-4285F4.svg)](https://firebase.google.com/docs/genkit)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Overview

**BYTEWAVE (InfoSync)** streamlines enterprise document ingestion, analysis, and inter-departmental dispatching for Kochi Metro Rail Limited (KMRL). By combining Google Genkit with multi-modal LLMs, BYTEWAVE automatically classifies incoming engineering drawings, regulatory compliance certificates, vendor tenders, and HR directives into structured workflows with urgency ranking, bilingual summarization (English & Malayalam), and full audit logging.

---

## ✨ Features

- **📑 Smart Ingestion & Categorization**: Handles PDFs, images, and office documents with automated department tagging (Engineering, Operations, HR, Finance, Safety).
- **🤖 Genkit AI Assistant**: Interactive document assistant capable of contextual Q&A, clause extraction, and bilingual summarization.
- **⚡ Urgency Tagging & Routing**: Auto-assigns low, medium, or high urgency levels with deadline tracking and notifications.
- **🌐 Bilingual UI & Analytics**: Full interface support for English and Malayalam with real-time status dashboards and resolution tracking.
- **🛡️ Enterprise Access Control**: Role-based access governance with department-level document isolation and audit trails.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **AI Framework** | Google Genkit (`@genkit-ai/googleai`, `@genkit-ai/next`) |
| **Backend & Auth** | Firebase Authentication, Cloud Firestore |
| **UI Components** | Radix UI, Tailwind CSS, Lucide Icons, Class Variance Authority |
| **Analytics** | Recharts, Date-fns |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node 20 recommended)
- A Google Gemini API Key
- A Firebase project

### 1. Clone the Repository
```bash
git clone https://github.com/Rithish-2914/BYTEWAVE.git
cd BYTEWAVE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your `GEMINI_API_KEY` and Firebase credentials.

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) in your browser.

To run Genkit AI flows locally:
```bash
npm run genkit:dev
```

---

## 📂 Project Structure

```
BYTEWAVE/
├── docs/
│   └── blueprint.md         # Product architecture and UX specification
├── src/
│   ├── ai/                  # Genkit flows, prompts, and document analysis tools
│   ├── app/
│   │   ├── (app)/           # Protected dashboard, documents, search, upload routes
│   │   ├── globals.css      # Core styling and color tokens
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable UI primitives (dialogs, tables, drawers)
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Firebase initialization and utility helpers
├── .env.example             # Template for API keys
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
