This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Recitation follow-along (Quran page)

The Quran reader (`/quran`) has a Tarteel-style follow-along mode: press the
mic button, recite, and the reader detects the ayah being recited, jumps to
its page, highlights it word-by-word and keeps scrolling with the reciter.

- Speech capture uses the browser's Web Speech API (Chrome/Edge/Safari;
  Arabic `ar-SA`). No audio leaves the app besides the browser's own speech
  service.
- Matching runs entirely client-side: the loaded mushaf data (per qiraat) is
  indexed word-by-word (`app/quran/recitation/indexer.ts`), speech is
  normalized to a diacritic-free skeleton that bridges Uthmani script and
  recognizer orthography (`arabic.ts`), and a tracker locks onto and follows
  the recitation, tolerating recognition noise, isti'adha/basmallah, and the
  Quran's many repeated phrases (`engine.ts`).
- The engine and indexer are covered by a test suite that runs against the
  real mushaf data:

```bash
pnpm test:recitation
```

For manual testing without a microphone, set `window.__qhFakeSpeechCtor` to a
scripted `SpeechRecognition` substitute before pressing the mic button (see
`app/quran/recitation/speech.ts`).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
