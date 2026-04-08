<div align="center">

<br />

# lingua

**Learn any language, naturally.**

A mobile-first language learning app with AI-powered conversation practice, spaced repetition, and handwriting recognition — built with Next.js 14, Supabase, and Tailwind CSS.

<br />

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

<br />

</div>

---

## Features

| Module | Description |
|--------|-------------|
| 📖 **Reading** | Interactive passages with tap-to-reveal word translations and comprehension quizzes |
| 🎧 **Listening** | Audio playback with word-level highlighting and English dictation exercises |
| 🎤 **Speaking** | Phrase practice with live microphone transcription and accuracy scoring |
| 🗂 **Vocab** | SM-2 spaced repetition flashcards across JLPT levels N5–N1 |
| ✍️ **Tracing** | Canvas-based kana and kanji handwriting practice with SM-2 scheduling |
| 📝 **Assessment** | Custom kana quiz builder — select individual characters, rows, or full sets |

---

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router, Server Actions)
- **Auth & Database** — [Supabase](https://supabase.com) (email/password auth, SSR session management)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com), DM Sans + DM Serif Display
- **Language** — TypeScript throughout
- **Spaced Repetition** — SM-2 algorithm with `localStorage` persistence

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Micahscodingjourney/lingua.git
cd lingua
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then copy your credentials:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
lingua/
├── app/
│   ├── auth/               # Server actions (login, signup, signout) + callback route
│   ├── dashboard/
│   │   ├── page.tsx        # Home — greeting, streak, XP, word of the day, modules
│   │   ├── reading/        # Reading module
│   │   ├── listening/      # Listening module
│   │   ├── speaking/       # Speaking module
│   │   ├── vocab/          # Vocabulary flashcards (N5–N1)
│   │   ├── trace/          # Kana & kanji tracing
│   │   └── assess/         # Kana assessment builder
│   └── login/              # Login / signup page
├── components/
│   ├── BottomNav.tsx       # App-wide bottom navigation
│   ├── WordOfDayCard.tsx   # Word of the day card
│   └── ModuleCard.tsx      # Learning module card with XP bar
├── lib/
│   ├── supabase/           # Browser + server Supabase clients
│   ├── sm2.ts              # SM-2 spaced repetition algorithm
│   ├── vocab.ts            # JLPT N5–N1 vocabulary data
│   ├── trace-data.ts       # Hiragana, katakana, kanji N5 character sets
│   └── kana-data.ts        # Kana grouped by Main / Dakuten / Combination
└── middleware.ts            # Route protection (redirects unauthenticated users)
```

---

## Spaced Repetition

Lingua uses the **SM-2 algorithm** (the same one powering Anki) for both the vocab flashcards and kana tracing sessions.

- **Again** — resets the card's interval to 1 day, re-queues it 4 positions ahead in the current session
- **Got it / Nailed it** — interval grows: `1d → 6d → interval × ease factor (default 2.5)`
- Card state is persisted per level/set in `localStorage`
- Sessions only show cards that are actually due today

---

## Roadmap

- [ ] AI conversation practice (Claude API)
- [ ] Persistent XP + leaderboards (Supabase)
- [ ] Stroke order animations for kanji
- [ ] Multi-language support beyond Japanese
- [ ] Vercel deployment

---

<div align="center">

Built by [@Micahscodingjourney](https://github.com/Micahscodingjourney)

</div>
