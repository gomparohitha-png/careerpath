# CareerPath: Plan • Learn • Grow

A personalized, year-wise career, skill, project, and placement roadmap platform for B.Tech engineering students with automated proof-of-work completion.

## Core Philosophy

- **Zero Self-Reported Checkboxes**: Progress is never manually checked off. Tasks are marked complete by the backend only when the student provides verifiable proof of work.
- **Honest Metrics**: Scores and streaks start strictly at 0. Points and streaks grow only through verified activity.
- **Personalized Adaptation**: When a student enters their branch, year, semester, career goal, and daily study time, the entire app (top navigation, focus tasks, roadmaps, and benchmarks) adapts.

---

## Key Features

1. **Onboarding Gate (First-Time Flow)**:
   - 7-step guided setup (Name/Email, Branch, Academic Year & Semester, Career Goal, Interests, Skills & Levels, Daily Study Time).
   - "Building your roadmap..." generative transition animation.
   - Profile stays editable and triggers instant curriculum re-adaptation.

2. **Personalized Navigation**:
   - Navigation links adapt dynamically based on branch and target goal (e.g. CSE + Software goal shows DSA Practice, Projects, Internships, Resume, Interview Prep; ECE shows Circuits & Embedded Projects; Government Jobs shows Aptitude & GATE; Higher Studies shows Exam Prep & Research Projects).
   - "What this does" interactive tooltip on every navigation tab.

3. **Collapsible Progress Sidebar**:
   - Profile mini-card with branch and academic year.
   - Verified streak counter with flame indicator (starts at 0 days).
   - Total score and level badge (`Starter`, `Explorer`, `Builder`, `Achiever`, `Placement Ready`).
   - Mon to Sun weekly activity dots (verified only).
   - Category score breakdown bars (Skills, Projects, Practice, Resume, Internships).
   - "Next best action" recommendation card.
   - Zero-state encouragement at 0 points.

4. **Year-Wise Engineering Roadmap**:
   - Year 1 Foundations, Year 2 Practical Skills, Year 3 Industry Experience, Year 4 Placement Prep.
   - Student's current academic year expanded by default.
   - Plain-language cards: "What you will learn", "Why it matters", Time needed, difficulty, resource link, and "How we will check it".
   - "This week's focus" widget calibrated to daily study time.

5. **Automated Verification Engine**:
   - **Learning Tasks**: Active reading tracker with window blur/visibility change pause detection (anti-cheat) + 5-question check quiz (>= 60% passing threshold).
   - **Practice Quizzes**: Timed technical & aptitude assessments graded server-side with instant explanations (+15 to +25 points).
   - **GitHub Milestones**: Public repository inspection checking commit logs (>= threshold) and README documentation (+30 to +100 points).
   - **Resume Builder**: Validates required sections (Education, >= 3 technical skills, >= 2 detailed projects) with print/PDF export (+50 points).
   - **Internship Tracker**: Validates application logs (Company, Role, Date) into student's pipeline (+20 points).
   - **Confetti Celebration Modal**: Fires rewarding celebration on every verified completion.

6. **Admin Governance & Audit Console**:
   - Role-based admin view to audit roadmap templates, verification thresholds, registered student counts, and live proof-of-work events.
   - Quick role switcher between Student and Admin.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend**: Node.js & Express (`tsx server.ts`) with Vite dev middleware.
- **Security & Data**: JWT token authentication, bcrypt password hashing, server-authoritative scoring & streak validation.
- **Color Palette**: Lavender (`#F3EEFF`, `#E6DBFF`), Deep Violet (`#3B2A6B`, `#2A1B4E`), Gold accents (`#D4A017`, `#F2C94C`).

---

## Running the Application

```bash
# Install dependencies
npm install

# Start development full-stack server on port 3000
npm run dev

# Build for production
npm run build
npm start
```
