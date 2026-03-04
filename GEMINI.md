# Sanrogym: Project Context

## Project Overview
Sanrogym is a lightweight, mobile-friendly web application designed to track and gamify gym attendance for a specific group of friends. It features automated leaderboards, streak tracking, and data visualizations.

### Core Tech Stack
- **Framework:** Next.js 16 (App Router) with React Compiler enabled.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS v4 with `shadcn/ui` components.
- **Database:** 
  - **Local:** SQLite (`file:dev.db`).
  - **Production:** Turso (LibSQL) via `@prisma/adapter-libsql`.
- **ORM:** Prisma 7 with a custom LibSQL driver adapter.
- **Authentication:** Custom JWT-based session management (`jose`) with admin-only access for mutations.
- **Localization:** **Catalan (ca-ES)** is the primary and only supported language for the UI.
- **Visualizations:** Recharts for data visualization (Bar Charts) and Framer Motion for animations.

### Architecture Highlights
- **Server-First:** Strictly uses React Server Components (RSC) and Next.js Server Actions for all database mutations.
- **Environment-Aware Database:** `src/lib/prisma.ts` automatically switches between local SQLite and production Turso based on environment variables.
- **Relational Data:** Many-to-many relationship between `Participant` and `Session` models.
- **Security:** 
  - **Middleware/Proxy:** `src/proxy.ts` protects the `/roster` route.
  - **Server Actions:** All mutations in `participants.ts` and `sessions.ts` verify the admin session.
  - **Public Access:** Dashboard (`/`) and Sessions (`/sessions`) are public for viewing.
- **Mobile-First UI:** Bottom navigation for mobile, top navigation for desktop. Default dark theme with neon orange accents.

---

## Building and Running

### Development (Local)
1.  **Install Dependencies:** `npm install`
2.  **Initialize Local Database:** `npx prisma db push` (creates `dev.db`)
3.  **Run Dev Server:** `npm run dev` (available at `http://localhost:3000`)

### Production (Turso/Vercel)
1.  **Environment Variables:** Set the following in your deployment environment (e.g., Vercel):
    - `TURSO_DATABASE_URL`: Your Turso database URL (starts with `libsql://`).
    - `TURSO_AUTH_TOKEN`: Your Turso auth token.
    - `AUTH_SECRET`: Random string for JWT signing.
    - `ADMIN_PASSWORD`: Admin password (defaults to `sanrogym2026`).
2.  **Deploy Schema:** Run `npm run db:deploy:turso` (requires `turso` CLI authenticated).
3.  **Build Project:** `npm run build` (runs `prisma generate` then `next build`).

### Database Management
- **Prisma CLI:** Prisma 7 uses `prisma.config.ts`. CLI operations use `file:./dev.db` by default to avoid protocol conflicts with `libsql://`.
- **Schema Updates:** Update `prisma/schema.prisma` and run `npx prisma migrate dev`. Then run `npm run db:deploy:turso` to push changes to Turso.

---

## Development Conventions

### 1. Data Mutations (Server Actions)
All database operations (CRUD) must be implemented as Server Actions in `src/app/actions/`.
- Mutations MUST call `checkAuth()` to verify the admin session.

### 2. UI & Styling
- **Language:** All UI strings MUST be in **Catalan**.
- **Shadcn/UI:** All primitive components reside in `src/components/ui`.
- **Tailwind v4:** Uses CSS-based theme configuration in `src/app/globals.css`.

### 3. Database Access
- **Prisma Client:** Always import the singleton instance from `@/lib/prisma`.
- **Adapter:** The project uses `@prisma/adapter-libsql` for runtime compatibility with Turso.

### 4. Streak Logic
- Streak and leaderboard logic is centralized in `src/lib/streaks.ts`.
- **Hot Streak:** Consecutive group sessions attended starting from the most recent one.
- **Cold Streak:** Consecutive group sessions MISSED starting from the most recent one.
- **Longest Streak:** The all-time record for consecutive sessions.

---

## File Structure Overview
- `/src/app`: Routing, pages, and Server Actions.
- `/src/components`: UI primitives (`/ui`) and shared layout components (`/shared`).
- `/src/lib`: Database initialization (`prisma.ts`), auth logic (`auth.ts`), and core business logic (`streaks.ts`).
- `/src/proxy.ts`: Next.js 16 route protection (Middleware).
- `/prisma`: Database schema and configuration.
