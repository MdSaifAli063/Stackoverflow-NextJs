# Stack_OverFlow Ques & Ans (NextJs + Appwrite)

A lightweight StackOverflow-like Q&A web application built with Next.js and Appwrite as the backend platform.

## Features

- Ask and answer questions
- User authentication via Appwrite
- CRUD operations for questions and answers
- Server-side code interacting with Appwrite SDK
- Minimal, extendable UI (Next.js + React)

## Tech stack

- Frontend: Next.js (React)
- Backend / API: Appwrite (self-hosted or cloud)
- Language: TypeScript / JavaScript
- Optional: Tailwind CSS, Prisma, or other libs depending on your fork

## Prerequisites

- Node.js 18+ (or the version compatible with your Next.js version)
- npm or yarn
- An Appwrite project (endpoint, project ID and API key)

## Environment variables

Create a `.env.local` file in the project root (do NOT commit secrets). Example variables used by this project:

```env
# filepath: d:\stackoverflow-appwrite\.env.example
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://[YOUR_APPWRITE_ENDPOINT]   # public endpoint for client SDK
NEXT_PUBLIC_APPWRITE_PROJECT_ID=[YOUR_PROJECT_ID]               # Appwrite project ID
APPWRITE_API_KEY=[YOUR_SERVER_API_KEY]                          # server-side admin key (keep secret)
```

Notes:

- Use NEXT*PUBLIC* prefix for variables that must be exposed to client-side code.
- Keep server-only secrets (like APPWRITE*API_KEY) without NEXT_PUBLIC* so they are not bundled to the browser.

## Local setup

1. Install dependencies:

   - npm: `npm install`
   - yarn: `yarn install`

2. Add `.env.local` using the variables described above.

3. Run the dev server:

   - npm: `npm run dev`
   - yarn: `yarn dev`

4. Build and start:
   - Build: `npm run build`
   - Start: `npm start`

## Common issues & troubleshooting

- Error: "Cannot read properties of undefined (reading 'endpoint')"

  - Cause: Appwrite environment variables are not set or not available where the code expects them (server vs client).
  - Fix:
    1. Ensure `.env.local` has the correct keys (see the example above).
    2. Server-side code should read server-only env vars (no NEXT*PUBLIC* prefix) and client code should use NEXT*PUBLIC* variables.
    3. Restart the dev server after changing `.env.local`.
    4. If the error points to a file like `models/server/config.ts`, ensure that file accesses process.env properly, e.g.:
       - process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT for client usage
       - process.env.APPWRITE_API_KEY for server-only usage
    5. For local testing, you can log `process.env` in a safe place to verify variables are loaded.

- Next.js warning: "The 'middleware' file convention is deprecated. Please use 'proxy' instead."
  - Action: Follow the Next.js docs to migrate middleware usage to proxy routes. This is unrelated to Appwrite config but good to address before upgrading Next.js.

## Deploy

- When deploying (Vercel, Netlify, or custom), set the same environment variables in your platform's dashboard.
- Avoid exposing APPWRITE_API_KEY on the client; keep the admin key only on server/runtime.

