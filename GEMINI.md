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
- **Visualizations:** Recharts for data visualization (Bar Charts) and Framer Motion for animations.

### Architecture Highlights
- **Server-First:** Strictly uses React Server Components (RSC) and Next.js Server Actions for all database mutations.
- **Environment-Aware Database:** `src/lib/prisma.ts` automatically switches between local SQLite and production Turso based on environment variables.
- **Relational Data:** Many-to-many relationship between `Participant` and `Session` models.
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
2.  **Build Project:** `npm run build`
3.  **Start Server:** `npm run start`

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
- **Charts:** Use **Recharts** with `ResponsiveContainer` for all charts. Avoid Tremor due to Tailwind v4 compatibility issues.

### 3. Database Access
- **Prisma Client:** Always import the singleton instance from `@/lib/prisma`.
- **Adapter:** The project uses `@prisma/adapter-libsql` for compatibility with SQLite/LibSQL in a Next.js environment.

### 4. Streak Logic
- Streak and leaderboard logic is centralized in `src/lib/streaks.ts`.
- **Hot Streak:** Consecutive group sessions attended starting from the most recent one.
- **Cold Streak:** Consecutive group sessions MISSED starting from the most recent one.
- **Longest Streak:** The all-time record for consecutive sessions.

### 5. Monthly Ranking
- Groups sessions by month and calculates attendance per person.
- Identifies "Monthly MVPs" based on highest attendance within a specific month.

---

## File Structure Overview
- `/src/app`: Routing, pages, and Server Actions.
- `/src/components`: UI primitives (`/ui`) and shared layout components (`/shared`).
- `/src/lib`: Database initialization (`prisma.ts`) and core business logic (`streaks.ts`).
- `/prisma`: Database schema and migrations.
- `/specs`: Product requirements, architecture, and UI/UX design documents.
