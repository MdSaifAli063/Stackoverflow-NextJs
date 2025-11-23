# 🧠 StackOverflow-like Q&A (Next.js + Appwrite)

<p align="left">
  <a href="https://nextjs.org" target="_blank"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white"></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white"></a>
  <a href="https://appwrite.io/" target="_blank"><img alt="Appwrite" src="https://img.shields.io/badge/Appwrite-Cloud-f02e65?logo=appwrite&logoColor=white"></a>
  <a href="https://tailwindcss.com/" target="_blank"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss&logoColor=white"></a>
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green">
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
</p>

A modern, lightweight StackOverflow-style Q&A application built with Next.js and Appwrite. It supports asking questions, answering, voting, and commenting with user authentication and a polished UI.


## ✨ Features
- 🔐 Authentication (Appwrite Account)
- ❓ Ask questions with tags and optional attachments
- 💬 Answers and threaded comments
- 👍👎 Voting on questions and answers
- 🏷️ Tag-based filtering and search entry
- 👤 User profiles with reputation placeholder
- 🖼️ Avatar generation via Appwrite Avatars
- 🗃️ Appwrite Databases + Storage setup via middleware bootstrap
- 🧭 Clean navigation and responsive UI with Tailwind CSS


## 🧰 Tech Stack
- ⚛️ Next.js 16 (App Router)
- 🟦 TypeScript
- 🧱 Appwrite (node-appwrite and appwrite SDKs)
- 🎨 Tailwind CSS v4
- 🗃️ Zustand (Auth/session store)
- 🧩 Radix UI (Label) and custom UI components
- 🖼️ Lucide/Tabler icons


## 📁 Project Structure
Key folders and files (non-exhaustive):
- app/
  - (auth)/login, (auth)/register
  - api/answer, api/vote
  - questions/, users/
  - layout.tsx, page.tsx, middleware.ts
- components/
  - QuestionForm, QuestionCard, Answers, Comments, VoteButtons
  - ui/ (floating-navbar, input, label, hero-parallax, etc.)
  - magicui/ (visual effects and buttons)
- models/
  - client/config.ts (browser SDK init)
  - server/{answer,comment,question,vote}.collection.ts (DB schema)
  - server/{dbSetup,storageSetup}.ts (bootstrap)
  - name.ts (IDs and constants)
- store/Auth.ts (Zustand auth store)
- utils/ (slugify, relative time)


## 🗝️ Environment Variables
Create a .env file in the project root. The server config reads multiple fallbacks to be safe, but set these explicitly:

- NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
- NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
- APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
- APPWRITE_PROJECT_ID=your-project-id
- APPWRITE_API_KEY=your-api-key-with-database-and-storage-perms

Note:
- Public SDK (browser) uses NEXT_PUBLIC_* values from models/client/config.ts.
- Server/edge-safe loader (models/server/config.ts) supports both node-appwrite and appwrite packages and gracefully stubs when env or SDK is missing.


## 🧪 Collections & Storage
The Appwrite database and storage are created/verified automatically via middleware on first request:
- Database: main-stackflow
- Collections:
  - questions: title, content, authorId, tags[], attachmentId; indices on title/content
  - answers: content, questionId, authorId
  - comments: content, type[answer|question], typeId, authorId
  - votes: type[question|answer], typeId, voteStatus[upvoted|downvoted], votedById
- Storage:
  - Bucket: question-attachment

Permissions are created to allow reasonable access patterns (see server collection files for exact rules).


## 🚀 Getting Started
1) Install dependencies
- npm install

2) Configure environment
- Copy .env.example to .env (create if missing) and fill values

3) Run development server
- npm run dev
- Open http://localhost:3000

On first run, middleware will try to connect/create DB and storage (requires APPWRITE_API_KEY in env).


## 🧭 App Overview
- Home: Latest questions feed with hero and top contributor sections
- Questions:
  - Create: Auth required, supports tags and optional image/file attachment
  - View: Vote, answer, and comment
  - Edit/Delete: Author-only operations
- Users:
  - Profile, questions, answers, votes, edit profile
- Voting:
  - Upvote/downvote toggles with optimistic UI updates


## 🔐 Auth Flow
- Zustand store in store/Auth.ts keeps session, jwt, and user state
- Client SDK (Account) handles login/register
- Components conditionally render actions based on user presence


## 🧩 Important Scripts
- dev: next dev
- build: next build
- start: next start
- lint: eslint


## 🧱 Notable Components
- components/QuestionForm.tsx: create/update questions with attachment
- components/QuestionCard.tsx: list view with author avatar and tag chips
- components/Answers.tsx: answer list and create answer
- components/Comments.tsx: threaded comments with author link and delete
- components/VoteButtons.tsx: vote state management and API integration
- components/ui/* and components/magicui/*: UI primitives and effects


## 🔌 API Routes
- app/api/answer/route.ts
  - POST: create answer
  - DELETE: delete answer
- app/api/vote/route.ts
  - POST: toggle upvote/downvote for question/answer


## 📦 Appwrite Client Setup
- Browser: models/client/config.ts uses appwrite SDK (Client, Account, Avatars, Databases, Storage)
- Server/Edge: models/server/config.ts provides safe stubs and initializes node-appwrite when available


## 🧹 Linting, Types, and Config
- TypeScript config: tsconfig.json
- ESLint: eslint.config.mjs + eslint-config-next
- Next.js config: next.config.ts
- Tailwind CSS: postcss.config.mjs, Tailwind v4 runtime


## 🧭 Routing Highlights
- Public routes: /, /questions, /questions/[id]/[slug]
- Auth routes: /(auth)/login, /(auth)/register
- User routes: /users/[userId]/[userSlug]/(questions|answers|votes|edit)


## 🛡️ Notes on Security
- Ensure APPWRITE_API_KEY has least-privilege necessary for collection creation and document operations used by the app
- Review collection Permission rules and adapt for production
- Consider server-side validation for API routes and stricter checks on authorId


## 🐛 Troubleshooting
- SDK not initialized: models/server/config.ts will warn and provide stubs if env or SDK missing
- DB/storage missing: ensure APPWRITE_API_KEY and endpoint/project ID are set, and first request triggers middleware bootstrap
- 401/403 on document ops: verify user session and collection permissions


## 🧾 License
MIT


## 🙌 Acknowledgements
- Appwrite for backend services
- Next.js team for the App Router
- Radix UI, Lucide, Tabler, and Tailwind for the UI building blocks
