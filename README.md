# Task Management (Mocked API)

Modern React + TypeScript demo that showcases a complete auth + tasks workflow without a real backend. Authentication, task CRUD, and persistence are all simulated on the frontend via Mock Service Worker (MSW) while Redux Toolkit manages global state. Tailwind CSS keeps the UI responsive and polished (with a bonus dark mode toggle).

## Tech Stack
- React 19 (Vite) + TypeScript
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS
- Mock Service Worker (MSW)

## Demo Credentials
- `username: test`
- `password: test123`
- Or create your own account via the new Sign Up screen (stored in-memory)

## Features
- Mocked login/sign-up that returns a fake JWT and stores it in `localStorage`.
- Protected dashboard route with logout + redirect logic.
- Task list with filtering, inline stats, and optimistic UI updates.
- Create/edit form with validation + status selector.
- Delete confirmation + error and empty states.
- State persisted across reloads (`auth` + `tasks` use `localStorage`).
- Dark mode toggle (saved per user).

## Getting Started
```bash
npm install      # install dependencies
npm run dev      # start Vite dev server (MSW auto-starts in dev)
```
Visit `http://localhost:5173` and use the demo credentials above (or create a new account on the Sign Up page).

### Production build / local preview
```bash
npm run build    # emits static assets into dist/
npm run preview  # optional: serve the dist bundle locally
```

## Mock API Details
MSW intercepts network calls and returns realistic responses. The worker is registered automatically in `src/main.tsx` during development. Generated worker assets live under `public/mockServiceWorker.js`.

### Endpoints
| Method | URL              | Description                |
|--------|------------------|----------------------------|
| POST   | `/api/login`     | Validates credentials and returns `{ token, user }`. |
| POST   | `/api/signup`    | Creates a new in-memory user and returns `{ token, user }`. |
| GET    | `/api/tasks`     | Returns the in-memory task collection. Requires `Authorization: Bearer demo-jwt-token`. |
| POST   | `/api/tasks`     | Creates a task (`title`, `description`, `status`). |
| PUT    | `/api/tasks/:id` | Updates a task by id. |
| DELETE | `/api/tasks/:id` | Removes a task by id. |

All handlers live in `src/mocks/handlers.ts`, and sample data/in-memory operations live in `src/mocks/data.ts`.

## State Management & Persistence
- `src/features/auth/authSlice.ts` handles login/logout and persists the fake token/user in `localStorage`.
- `src/features/tasks/tasksSlice.ts` coordinates CRUD thunks and saves task snapshots locally so the UI survives reloads even before the mock API responds.

## UI Notes
- Tailwind is wired up via `src/style.css`.
- Components under `src/components` keep the dashboard modular (forms, headers, lists, banners, etc.).
- Dark mode is toggled by storing `tm_theme` in `localStorage` and toggling the `dark` class on the document root.

## Deployment
This repo includes `vercel.json` so Vercel automatically runs `npm run build` and serves `dist`.

### Deploy to Vercel
1. Push the project to a Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel, **New Project → Import Repo**.
3. Set:
   - **Framework Preset**: Vite (auto-detected).
   - **Build Command**: `npm run build` (default from `vercel.json`).
   - **Output Directory**: `dist`.
4. Deploy. Vercel will install dependencies, build, and host the static bundle.

No environment variables are required—the mock API and persistence live entirely in the browser. For local development you still use `npm run dev` (MSW worker only starts in dev; production uses the built assets without MSW).

## Further Ideas
- Add Formik + Yup to power richer validation flows.
- Expand the mock API to include comments or subtasks.
- Add automated tests with Vitest + React Testing Library.
- Wire up CI to run `npm run build` on pull requests.


