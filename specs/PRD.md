# Product Requirements Document (PRD): Sanrogym

## 1. Project Overview
Sanrogym is a lightweight, mobile-friendly web application designed to track and gamify gym attendance for a specific group of friends. It replaces a manual text-based tracking system, providing automated leaderboards, streak tracking, and data visualization to keep the group motivated.

## 2. Goals & Non-Goals
* **Goals:** * Provide an easy way to log gym sessions and who attended.
    * Display engaging, gamified visualizations (streaks, rankings).
    * Deliver a highly polished, premium feeling UI/UX on both mobile and desktop.
* **Non-Goals:** * Complex user authentication (the app is for a trusted group of friends; a simple global password or open access is sufficient for V1).
    * Monetization or complex business logic.
    * Tracking specific workouts or weights lifted (strictly attendance).

## 3. Core Features
### 3.1. Participant Management (CRUD)
* **Create:** Add a new friend to the Sanrogym roster.
* **Read:** View the list of all participants.
* **Update:** Edit a participant's name.
* **Delete:** Remove a participant (soft delete or cascade remove from sessions).

### 3.2. Session Management (CRUD)
* **Create:** Log a new session. Requires: Session Number (generated incrementally starting from 1), Date, and a multi-select list of Participants who attended.
* **Read:** View a history of all past sessions.
* **Update:** Edit a past session (e.g., if someone was forgotten).
* **Delete:** Remove a session entered by mistake.

### 3.3. Dashboard & Data Visualization
* **All-Time Leaderboard:** Ranking of participants by total sessions attended.
* **Streaks:** Calculate and display the "Current Streak" (who is currently on fire) and "Longest Streak" (all-time record).
* **Monthly Recap:** Chart showing attendance volume month over month.