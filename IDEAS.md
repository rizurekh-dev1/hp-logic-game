# Harry Potter Logic Game - Private Ideas & Roadmap

This file is ignored by Git and is for local brainstorming and private development notes.

## UX & Gameplay Improvements
- **Hermione's Hint System:** Add a "Help" button in each level.
  - 1st tap: Vague hint.
  - 2nd tap: Direct clue.
  - 3rd tap: Almost the answer (but with a point penalty?).
- **Story & Fun (The "Anti-Dull" Plan):**
  - Add character dialogues (Hagrid, Hermione, Dumbledore).
  - Use visual rewards (Collecting Chocolate Frogs or House Points).
  - Better transitions (e.g., the screen "burning away" into Level 3).
- **The Feedback Owl:**
  - Add a small floating "Owl" icon.
  - On click: Open a simple form (Rating 1-5 Stars + Comment).
  - Send feedback to PostHog or a simple backend.

## Student Profile & Monetization (Post-Level 5)
- **The Login Gate:** After defeating the final boss in Level 5, prompt the user to "Enroll at Hogwarts" to save their progress.
- **Student Profile:**
  - Track House Points across all levels.
  - Display "Magical Skill Levels" (Logic, Math, Spatial).
  - House Selection / Sorting Hat Ceremony integrated with login.
- **Payment Gateway:** Razorpay Integration (for India / UPI) to unlock "Year 2" (Level 6+).
- **Pricing:** INR 99 or INR 199 for full version.

## Level 5 Ideas (The Final Confrontation)
- **Concept:** Logic Duel with Professor Quirrell.
- **Mechanic:** Combined logic (Pattern + Math + Riddle).
- **Narrative:** "The Stone is in the Mirror. Only the one who wants to find the Stone, but not use it, will get it."

## Monetization & Expansion
- **Payment Gateway:** Razorpay Integration (for India / UPI).
- **Pricing:** INR 99 or INR 199 for full version.
- **Post-Level 5:** Unlock "The Chamber of Secrets" expansion pack.

## Technical Tasks
- [ ] Add `razorpay_key` to `.env` (Never commit this!)
- [ ] Implement success redirect for Razorpay.
- [ ] Create a "Save Game" feature using `localStorage`.

## Level 6+ Concepts
- **Chamber of Secrets:** Parseltongue Translator (Cryptography).
- **Prisoner of Azkaban:** Time-Turner Mechanic (Undo/Redo challenges).
- **Goblet of Fire:** The Maze (Pathfinding algorithm).
