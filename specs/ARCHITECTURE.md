# Architecture & Tech Stack: Sanrogym

## 1. Tech Stack
* **Framework:** Next.js (App Router) with React Compiler enabled.
* **Language:** TypeScript.
* **Styling:** Tailwind CSS.
* **Database:** Vercel Postgres.
* **ORM:** Prisma.
* **Deployment:** Vercel.

## 2. Data Model (Relational)
We are using a many-to-many relationship between Sessions and Participants.

* **Model: Participant**
    * `id`: String (UUID, Primary Key)
    * `name`: String
    * `createdAt`: DateTime
    * *Relation:* `sessions` (Implicit many-to-many with Session)

* **Model: Session**
    * `id`: String (UUID, Primary Key)
    * `sessionNumber`: Int (Unique)
    * `date`: DateTime
    * `createdAt`: DateTime
    * *Relation:* `attendees` (Implicit many-to-many with Participant)

## 3. Project Structure
* `/src/app`: Next.js routing, pages, and API/Server Actions.
    * `/src/app/actions`: Centralized Next.js Server Actions for database CRUD.
* `/src/components`: 
    * `/ui`: shadcn/ui primitive components.
    * `/shared`: Custom layout components (Navbar, Footer).
    * `/charts`: Tremor visualization components.
* `/src/lib`: Utility functions, Prisma client initialization (`prisma.ts`).
* `/specs`: AI context and project documentation.

## 4. State Management & Data Fetching
* No external state management library (like Redux) is needed.
* Data fetching will be handled server-side in Next.js Server Components.
* Mutations will be handled via Next.js Server Actions.