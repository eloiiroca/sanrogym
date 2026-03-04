# Sanrogym 🏋️‍♂️

Sanrogym is a lightweight, mobile-friendly web application designed to track and gamify gym attendance for a specific group of friends. It replaces manual text-based tracking with automated leaderboards, streak tracking, and data visualizations to keep the group motivated.

## ✨ Features

- **All-Time Leaderboard:** Ranking of participants by total sessions attended.
- **Fire Streaks:** Automated calculation of "Current Streak" and "Longest Streak" for every participant.
- **Monthly Recap:** Interactive bar charts showing attendance volume month over month.
- **Session Logging:** Easy mobile-first interface to log group sessions with multi-select participant attendance.
- **Roster Management:** Simple CRUD for managing the friend group.
- **Premium UI:** Dark-mode first design with neon accents, smooth animations, and a polished dashboard.

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) with React Compiler.
- **Language:** TypeScript.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/).
- **Database:** SQLite (local) via [LibSQL](https://libsql.org/).
- **ORM:** [Prisma 7](https://www.prisma.io/) with Driver Adapters.
- **Charts:** [Recharts](https://recharts.org/) for responsive data visualization.
- **Animations:** [Framer Motion](https://www.framer.com/motion/).

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn/pnpm)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sanrogym
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Database Deployment (Turso)

1.  **Generate Migration Locally:**
    ```bash
    npx prisma migrate dev
    ```
    *This creates a new migration file in `prisma/migrations`.*

2.  **Deploy to Turso:**
    ```bash
    npm run db:deploy:turso
    ```
    *This pushes the latest migration to your Turso database.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗 Architecture

The project follows a "Server-First" philosophy:
- **Server Components:** Most pages and components are React Server Components for performance and SEO.
- **Server Actions:** All data mutations (create, update, delete) are handled via Next.js Server Actions in `src/app/actions/`.
- **Streaks Engine:** Custom logic for calculating streaks is centralized in `src/lib/streaks.ts`.
- **Database Adapter:** Uses `@prisma/adapter-libsql` to ensure the Prisma Client works seamlessly with the SQLite environment.

## 🤝 Contributing

This project is for a private group of friends, but suggestions and feedback are always welcome!
