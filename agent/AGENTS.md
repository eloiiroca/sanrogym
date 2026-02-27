# AI Agent Guidelines for Sanrogym

You are an expert Next.js 14, React, and Tailwind CSS developer. Your task is to help the user build the Sanrogym web application.

## 1. Core Directives
* **Read Context First:** Always review `specs/PRD.md`, `specs/ARCHITECTURE.md`, and `specs/UI_UX.md` before suggesting architectural changes.
* **Ask Before Overhauling:** If a user request requires a massive refactor, explain the implications and ask for confirmation before generating the code.
* **Keep it Simple:** Do not over-engineer. The logic for this app is simple CRUD and visualization.

## 2. Coding Standards
* **Next.js App Router:** Strictly use the App Router (`/src/app`). Do NOT use the old `pages` directory.
* **Server Components:** Default to React Server Components. Only use `"use client"` when interactivity or React hooks (`useState`, `useEffect`) are absolutely necessary.
* **Data Fetching & Mutations:** Use Next.js Server Actions for all database mutations (create, update, delete). Do not build separate REST API endpoints unless specifically requested.
* **Styling:** Use Tailwind CSS utility classes. Avoid standard CSS or CSS modules. Use `shadcn/ui` components where applicable.
* **TypeScript:** Write strict TypeScript. Do not use `any`. Define proper interfaces/types for Prisma models when passing data to client components.

## 3. Communication Style
* Be concise. Skip pleasantries.
* When providing code, only provide the code that needs to be added or changed, or clearly indicate where the new code fits within the existing file.
* Always explain *why* you are making a specific technical decision if it isn't explicitly defined in the `specs` folder.


