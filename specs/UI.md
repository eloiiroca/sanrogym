# UI/UX & Design Guidelines: Sanrogym

## 1. Design Philosophy
The app should feel like a premium fitness tracking dashboard. It must be mobile-first, as sessions will likely be logged at the gym from a phone. The aesthetic should be clean but energetic.

## 2. UI Libraries
* **Core Components:** shadcn/ui (Radix UI primitives + Tailwind).
* **Charts & Dashboards:** Tremor (React library for building dashboards).
* **Animations:** Framer Motion (used specifically for micro-interactions, streak celebrations, and smooth page transitions).
* **Icons:** Lucide React.

## 3. Theme & Styling
* **Color Palette:** Dark mode by default. Deep backgrounds (slate/zinc) with vibrant accent colors (e.g., neon orange or fiery red to represent streaks and energy).
* **Typography:** Next.js default `Geist` or `Inter` font for clean, modern readability.
* **Layout:** * Mobile: Bottom navigation bar or simple top hamburger menu. Stacked cards for stats.
    * Desktop: Sidebar navigation or top navbar. Grid layout for dashboard charts.

## 4. Key Screens
1.  **Dashboard (Home):** The focal point. Shows the top 3 leaderboard, current fire streaks (with animation), and a recent session feed.
2.  **Sessions:** A data table or list of cards showing all sessions. Includes a floating action button (FAB) or prominent button to "Log New Session".
3.  **Roster:** A simple grid showing all active friends in the Sanrogym group.