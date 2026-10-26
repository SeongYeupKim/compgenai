# Multiple complementary sources with GenAI

Next.js study app. Every participant follows one path:

1. Sign in (Penn State email)
2. Informed consent
3. AIALI scale
4. Trust in GenAI scale
5. Prior knowledge test (17 multiple-choice + 3 short answers)
6. Case and task instructions
7. Three downloadable readings
8. Essay (550 words or fewer) with the chatbot beside it; the case, instructions, and PDFs stay on that page
9. Post knowledge test (same items)
10. Demographics
11. Submission guide: a PDF of the submitted essay and chat history, for upload to Canvas

Login, Firebase Auth, Firestore, the admin CSV export, and the server-side chat route are carried over from the earlier study app. Responses are stored in the `participants` collection so they stay separate from the task-framing `users` collection.

Chat turns keep `createdAt`. Phase entry and completion times, source downloads, and the Canvas-file download time are stored as well. The wide CSV from `/admin` includes those timestamps and `st_n` / `ai_n` turns.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in a **new** Firebase project plus `OPENAI_API_KEY`. Do not point this app at the task-framing Firebase project.
3. Enable Email/Password auth. Publish `firestore.rules` (the export account is `admin@psu.edu`).
4. `npm run dev`

Readings live in `public/readings/`.

The answer key for the knowledge test is not in this app.

## Deploy

Vercel project: `seongyeup-kims-projects/compgenai`. Connect the GitHub repo `SeongYeupKim/compgenai` and set the same environment variables there. The production domain is assigned when the first deployment succeeds.
