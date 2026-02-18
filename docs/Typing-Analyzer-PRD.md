# Product Requirements Document (PRD)
## Product: AI Typing Practice & Analysis Platform
## Version: 1.0 (Draft)
## Owner: Product + Engineering
## Date: 2026-02-18

---

## 1) Executive Summary
Build a web-based typing practice platform where a user pastes a paragraph on the left panel and retypes it in a controlled typing area on the right panel. The system uses AI-assisted analysis to evaluate typing speed, accuracy, punctuation handling, consistency, error patterns, and improvement trends. The product should provide immediate feedback at session end (and optionally live feedback), actionable coaching tips, and progress tracking over time.

**Core value proposition:**
- Convert any custom text into a structured typing exercise.
- Offer deeper feedback than basic WPM tools, including punctuation accuracy, sentence-level error heatmaps, and intelligent recommendations.
- Help users improve writing precision and typing fluency with measurable outcomes.

---

## 2) Problem Statement
Existing typing tools often:
- Focus only on WPM and gross accuracy.
- Use fixed passages that may not match user goals.
- Do not analyze punctuation, capitalization, rhythm, hesitation points, or recurring mistakes in detail.
- Provide generic feedback rather than personalized coaching.

Users need a tool where they can practice with their own text and receive nuanced AI-driven insights.

---

## 3) Goals & Non-Goals

### 3.1 Goals
1. Allow users to paste any paragraph as source text.
2. Capture typed text and keystroke timeline during a session.
3. Measure and display:
   - Speed (WPM, raw WPM, CPM)
   - Accuracy (character, word, and sentence level)
   - Punctuation and capitalization correctness
   - Backspace/correction behavior
   - Consistency over the session
4. Generate AI feedback with personalized improvement tips.
5. Provide historical progress view (session trends).
6. Design clean, responsive frontend for desktop-first and mobile support.

### 3.2 Non-Goals (v1)
- Multiplayer real-time competitions.
- External keyboard hardware diagnostics.
- Offline-first native app.
- Formal proctoring/anti-cheat guarantees.

---

## 4) Target Users & Personas

### Persona A: Student / Exam Prep User
- Needs high typing speed with strong accuracy.
- Practices from notes, sample essays, and exam passages.
- Cares about measurable weekly progress.

### Persona B: Professional Writer / Analyst
- Prioritizes punctuation and formatting fidelity.
- Practices domain-specific text.
- Values detailed error categorization.

### Persona C: Typing Beginner
- Needs basic coaching and confidence building.
- Benefits from simple UX and clear guidance.
- Needs motivational progress tracking.

---

## 5) Success Metrics (KPIs)

### Product KPIs
- **Activation Rate:** % users who complete first typing session within 10 minutes of signup.
- **Session Completion Rate:** % started sessions that are finished.
- **Day-7 Retention:** returning users after one week.
- **Average Sessions/User/Week.**

### Learning KPIs
- **Median net WPM improvement over 14 days.**
- **Median accuracy improvement over 14 days.**
- **Punctuation error reduction rate.**

### UX KPIs
- Time to start session after landing on dashboard.
- Drop-off per step in session creation flow.

---

## 6) Product Scope (v1)

### In Scope
- Authentication (optional guest mode for fast start).
- Session creation with custom pasted paragraph.
- Typing workspace with timer and controls.
- Real-time capture of typing activity.
- Session summary with detailed analytics.
- History dashboard and trend charts.
- AI-generated coaching suggestions.

### Out of Scope
- Collaborative live sessions.
- Voice dictation mode.
- Plugin marketplace.

---

## 7) Functional Requirements

### FR-1: Input Passage Management
- User can paste text into a source panel.
- Validate min/max character limits (e.g., 100 to 5,000 chars).
- Optional readability and length indicator before start.
- Sanitize and preserve punctuation/case.

### FR-2: Typing Session Controls
- Start, pause, resume, restart session.
- Optional countdown (3-2-1) and session timer.
- Prevent copy-paste into typing input during active session.
- Configurable modes:
  - Full passage mode
  - Timed mode (e.g., 1/3/5/10 min)

### FR-3: Keystroke & Text Capture
- Track timestamps for each keystroke event.
- Track backspaces, deletions, cursor movement (if allowed).
- Compute interim stats in near real-time (<300ms update cycle target).

### FR-4: Accuracy & Error Analysis
- Character-level diff between source and typed output.
- Word-level mismatch detection.
- Punctuation/capitalization error classification.
- Omission/addition/substitution/transposition identification.

### FR-5: Speed Analysis
- Raw WPM = total typed chars / 5 / minutes.
- Net WPM = (total typed chars - penalty chars) / 5 / minutes.
- CPM and time-series speed graph (per 10-second bucket).

### FR-6: AI Feedback Engine
- Generate concise insights:
  - 3 strengths
  - 3 improvement areas
  - 3 actionable exercises
- Tone options: beginner-friendly / professional.
- Include recurring error patterns (e.g., comma omissions, wrong capitalization after period).

### FR-7: Session Summary Report
- Show score cards:
  - Net WPM
  - Accuracy %
  - Punctuation score
  - Consistency score
- Highlight error heatmap over source text.
- Download/share summary (PDF planned in v1.1; export JSON/CSV in v1).

### FR-8: History & Trends
- Session history table.
- Trend charts (WPM, accuracy, punctuation over time).
- Best performance and rolling average.

### FR-9: Settings & Preferences
- Theme (light/dark).
- Font size and dyslexia-friendly font option.
- Difficulty aids (highlight current word on/off).

---

## 8) Non-Functional Requirements

### Performance
- Initial dashboard load < 2.5s on broadband.
- Typing latency: visual update should feel instantaneous (< 50ms per keystroke rendering).
- Stats recalculation interval: <= 300ms.

### Reliability
- Session autosave every 5 seconds.
- Recover session after tab reload (if user allows local storage).

### Security & Privacy
- Encrypt user data in transit (TLS).
- Store minimal PII.
- Allow users to delete account and session history.
- Optional setting: “Do not use my text for model improvement/training.”

### Accessibility
- WCAG 2.1 AA baseline.
- Keyboard navigation support.
- Color contrast compliant score cards.
- Screen-reader labels for controls and metrics.

---

## 9) AI/Analytics Design

### 9.1 Metrics Formula Definitions
- **Character Accuracy %** = correct characters / total source characters × 100.
- **Word Accuracy %** = correctly matched words / total source words × 100.
- **Punctuation Accuracy %** = correctly typed punctuation marks / total punctuation marks in source × 100.
- **Consistency Score (0–100):** inverse normalized variance of WPM across time buckets.

### 9.2 Error Taxonomy
1. **Substitution:** wrong character typed.
2. **Omission:** missing character/word.
3. **Insertion:** extra character/word.
4. **Transposition:** swapped adjacent characters.
5. **Case Error:** uppercase/lowercase mismatch.
6. **Punctuation Error:** missing, extra, or incorrect punctuation symbol.
7. **Spacing Error:** extra/missing spaces.

### 9.3 AI Feedback Prompting Strategy
- Inputs to model:
  - Session metrics JSON
  - Error histogram
  - Top recurring mistakes with examples
  - User profile level (beginner/intermediate/advanced)
- Output schema:
  - `strengths[]`
  - `improvements[]`
  - `drills[]`
  - `next_session_target`
- Enforce max output length and safety filters.

### 9.4 Anti-Gaming Heuristics (Soft)
- Detect suspiciously high paste-like burst patterns.
- Flag impossible speed spikes.
- Mark session as “low-confidence analytics” instead of blocking.

---

## 10) Frontend Information Architecture

### Primary Navigation
1. Dashboard
2. New Session
3. Session Report
4. History
5. Settings

### Route Map
- `/` → Landing / Dashboard
- `/session/new` → Passage setup
- `/session/:id/live` → Typing interface
- `/session/:id/report` → Summary + AI feedback
- `/history` → Past sessions
- `/settings` → Preferences

---

## 11) Frontend Screen Designs (UX Specs)

## Screen A: Dashboard
**Purpose:** quick overview and CTA to start practice.

**Sections:**
- Top bar (logo, streak, profile).
- KPI cards (last WPM, last accuracy, weekly average).
- Trend mini-chart.
- “Start New Session” primary button.
- Recent sessions list.

**States:**
- Empty state (no sessions yet).
- Returning user state.

---

## Screen B: New Session (Paste Passage)
**Layout:** two-column on desktop, stacked on mobile.

**Left panel:**
- Textarea for source paragraph.
- Character and word count.
- Validation hints.

**Right panel:**
- Mode selection (full/timed).
- Timer presets.
- Difficulty toggles:
  - highlight current word
  - strict punctuation scoring
- Start button.

**Validation:**
- Disable start if passage too short/long or empty.

---

## Screen C: Live Typing Workspace
**Desktop Layout:** split view.
- Left: source text display with sentence grouping.
- Right: typing input area.
- Top stats bar: timer, WPM, accuracy, errors.
- Bottom controls: pause/resume, restart, finish.

**Interaction details:**
- Current word highlight (optional).
- Color coded typed characters:
  - correct: green
  - incorrect: red
  - pending: neutral
- Accessible error message region for screen readers.

**Edge states:**
- Paused overlay.
- Connection issue banner (if syncing enabled).

---

## Screen D: Session Report
**Header cards:**
- Net WPM
- Accuracy
- Punctuation score
- Consistency

**Body sections:**
1. Speed-over-time chart.
2. Error distribution donut/bar.
3. Source text heatmap with inline highlights.
4. AI Coach Panel:
   - strengths
   - weaknesses
   - practice drills
   - target for next session

**Actions:**
- Save note.
- Retry same passage.
- Start new session.

---

## Screen E: History & Trends
- Filter by date range and mode.
- Session table with sortable columns.
- Trend graphs (WPM, accuracy, punctuation).
- Comparison view: last 7 vs previous 7 sessions.

---

## Screen F: Settings
- Profile and skill level.
- Theme and accessibility preferences.
- Scoring preferences.
- Privacy controls (text retention / AI processing consent).

---

## 12) Component-Level Frontend Structure

### Core Components
- `TopNav`
- `KpiCard`
- `TrendChart`
- `PassageInput`
- `SessionConfigPanel`
- `TypingPane`
- `SourcePane`
- `LiveMetricsBar`
- `ErrorHeatmap`
- `AiFeedbackCard`
- `HistoryTable`

### State Management (suggested)
- Local UI state: component state/hooks.
- Session runtime state: centralized store (e.g., Zustand/Redux).
- Server state: React Query/SWR.

---

## 13) Data Model (High Level)

### Entity: User
- `id`
- `email`
- `name`
- `skill_level`
- `created_at`

### Entity: Session
- `id`
- `user_id`
- `source_text`
- `typed_text`
- `mode`
- `started_at`
- `ended_at`
- `duration_sec`

### Entity: SessionMetrics
- `session_id`
- `raw_wpm`
- `net_wpm`
- `accuracy_char`
- `accuracy_word`
- `punctuation_accuracy`
- `consistency_score`
- `backspace_count`

### Entity: ErrorEvent
- `id`
- `session_id`
- `timestamp_ms`
- `error_type`
- `source_index`
- `typed_value`

### Entity: AiFeedback
- `session_id`
- `strengths_json`
- `improvements_json`
- `drills_json`
- `target_json`

---

## 14) API Contracts (Draft)

### POST `/api/sessions`
Create session with source text and config.

### POST `/api/sessions/:id/events`
Ingest keystroke/events batch.

### POST `/api/sessions/:id/finish`
Finalize session and compute metrics.

### GET `/api/sessions/:id/report`
Return metrics, error map, AI feedback.

### GET `/api/history?range=30d`
Return historical sessions and trend aggregates.

---

## 15) Data Flow (End-to-End)

1. User pastes paragraph in New Session screen.
2. Frontend validates and sends create-session request.
3. Backend returns `session_id` and accepted config.
4. During typing, frontend:
   - updates local metrics for instant UI
   - batches events every N seconds to backend
5. On finish:
   - frontend sends final typed text + remaining events
   - backend computes official metrics + error map
   - AI analysis service generates coaching insights
6. Report screen fetches consolidated result payload.
7. History service stores session summary for trend charts.

### Real-Time vs Final Scoring
- Real-time scoring is provisional for UX responsiveness.
- Final scoring is authoritative from backend processing.

---

## 16) Event & Analytics Tracking

Track frontend events:
- `session_started`
- `session_paused`
- `session_resumed`
- `session_finished`
- `report_viewed`
- `retry_clicked`

Track metadata:
- device type
- viewport
- session mode
- text length bucket

---

## 17) Validation Rules & Edge Cases

### Validation
- Empty passage not allowed.
- Repeated whitespace normalized only for metric computation (retain raw for display).
- Language support starts with English in v1.

### Edge Cases
- User reloads tab mid-session.
- Very long passages (>5,000 chars).
- Mobile keyboard auto-correct interference.
- Network drop during event upload.
- User pastes into typing field (must detect and block in strict mode).

---

## 18) Release Plan

### Milestone 1: MVP (4–6 weeks)
- New Session + Live Typing + Basic Report.
- Metrics: WPM, char accuracy, backspace count.

### Milestone 2: Advanced Analytics (2–3 weeks)
- Punctuation scoring.
- Error taxonomy and heatmap.
- AI feedback panel.

### Milestone 3: Progress Intelligence (2 weeks)
- Trends dashboard.
- Goal targets and personalized drills.

---

## 19) Acceptance Criteria (Sample)

1. User can paste source text and start typing in under 20 seconds.
2. System computes and displays final WPM and accuracy within 2 seconds of finishing.
3. Punctuation accuracy is shown when source includes punctuation.
4. AI feedback returns structured recommendations for 95%+ completed sessions.
5. History page lists latest session within 5 seconds after completion.

---

## 20) Risks & Mitigations

- **Risk:** AI feedback hallucinations.
  - **Mitigation:** strict schema + constrained prompt + post-validation.
- **Risk:** Performance degradation for long text.
  - **Mitigation:** incremental diff and throttled recompute.
- **Risk:** User privacy concerns with pasted sensitive text.
  - **Mitigation:** clear consent and deletion controls.

---

## 21) Open Questions
1. Should guest users keep local-only session history?
2. Should punctuation scoring be optional or always-on?
3. Do we support multilingual text in v1.1 or later?
4. Should cursor movement/editing be allowed in strict mode?

---

## 22) PDF Doc-Ready Structure (for handoff)
Use this document hierarchy when exporting to PDF:

1. Cover Page (Product Name, Version, Date)
2. Executive Summary
3. Problem & Opportunity
4. Goals / Non-goals
5. Personas
6. Feature Requirements
7. UX Screen Specs
8. Data Model & API
9. AI Analysis Method
10. Data Flow & Architecture
11. NFRs (Performance, Security, Accessibility)
12. Milestones & Acceptance Criteria
13. Risks, Open Questions
14. Appendix

### Suggested PDF Formatting
- Font: Inter / Roboto, 11pt body, 16/20pt headings.
- Margins: 1 inch.
- Page numbering and version footer.
- Keep each screen spec on a new page for design reviews.

---

## 23) Appendix: Low-Fidelity Wireframe Notes

### A) New Session (Desktop)
- Left 60%: source textarea
- Right 40%: session settings + start CTA

### B) Live Session
- Top horizontal metrics strip
- Two equal panes for source and typed text
- Sticky bottom controls

### C) Report
- Four KPI cards at top
- Two-column body: charts left, AI insights right

These wireframes are intentionally implementation-agnostic and can be translated into Figma components directly.

