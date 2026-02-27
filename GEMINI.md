# Sanrogym: Project Context

## Project Overview
Sanrogym is a lightweight, mobile-friendly web application designed to track and gamify gym attendance for a specific group of friends. It features automated leaderboards, streak tracking, and data visualizations.

### Core Tech Stack
- **Framework:** Next.js 16 (App Router) with React Compiler enabled.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS v4 with `shadcn/ui` components.
- **Database:** SQLite (local development) via `@libsql/client`.
- **ORM:** Prisma 7 with a custom LibSQL driver adapter.
- **Visualizations:** Tremor for charts and Framer Motion for animations.

### Architecture Highlights
- **Server-First:** Strictly uses React Server Components (RSC) and Next.js Server Actions for all database mutations.
- **Relational Data:** Many-to-many relationship between `Participant` and `Session` models.
- **Mobile-First UI:** Bottom navigation for mobile, top navigation for desktop. Default dark theme with neon orange accents.

---

## Building and Running

### Development
- **Install Dependencies:** `npm install`
- **Initialize Database:** `npx prisma db push` (generates `dev.db` locally)
- **Run Dev Server:** `npm run dev` (available at `http://localhost:3000`)

### Production
- **Build Project:** `npm run build`
- **Start Server:** `npm run start`

### Database Management
- **Prisma Client Generation:** `npx prisma generate`
- **Schema Updates:** Update `prisma/schema.prisma` and run `npx prisma db push`.

---

## Development Conventions

### 1. Data Mutations (Server Actions)
All database operations (CRUD) must be implemented as Server Actions in `src/app/actions/`.
- `participants.ts`: CRUD for group members.
- `sessions.ts`: CRUD for gym sessions, including auto-incrementing `sessionNumber` and attendee linking.

### 2. UI & Styling
- **Shadcn/UI:** All primitive components reside in `src/components/ui`. Use `npx shadcn@latest add <component>` to add new ones.
- **Tailwind v4:** Uses CSS-based theme configuration in `src/app/globals.css`. Prefer utility classes over custom CSS.
- **Navigation:** Use the responsive `Navbar` component in `src/components/shared/navbar.tsx`.

### 3. Database Access
- **Prisma Client:** Always import the singleton instance from `@/lib/prisma`.
- **Adapter:** The project uses `@prisma/adapter-libsql` for compatibility with SQLite/LibSQL in a Next.js environment.

### 4. Streak Logic
- Streak and leaderboard logic is centralized in `src/lib/streaks.ts`.
- **Current Streak:** Consecutive group sessions attended starting from the most recent one.
- **Longest Streak:** The all-time record for consecutive sessions.

---

## File Structure Overview
- `/src/app`: Routing, pages, and Server Actions.
- `/src/components`: UI primitives and shared layout components.
- `/src/lib`: Database initialization and core business logic (streaks).
- `/prisma`: Database schema and migrations.
- `/specs`: Product requirements, architecture, and UI/UX design documents.
