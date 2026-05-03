# Classroom Engagement Monitor — AHCI Design Decisions

This document maps every design element in the application to the AHCI principle that justifies its existence. Nothing is decorative — every choice reduces cognitive load, prevents errors, or closes a gulf between the teacher's intention and the system's state.

**Total AHCI Concepts Applied: 15**

---

## 1. Fitts' Law

**Principle**: The time to acquire a target is a function of the distance to and size of the target. Larger, closer targets are faster to click.

| Design Element | Where | Justification |
|---|---|---|
| Oversized Quick-Action toolbar buttons (min-height: 48px, min-width: 120px) | Dashboard toolbar (`Toolbar.js`) | Teachers need to hit "Mark All Present", "Pause", or "End Class" instantly during live instruction. Large targets minimize movement time under time pressure. |
| 3 large engagement rating buttons per student card (min-height: 44px) | Student cards on Dashboard (`StudentCard.js`) | Mid-lesson engagement rating must be a sub-second action. Large buttons reduce error rate on rapid clicks. |
| Even larger rating buttons on profile page (min-height: 56px, full-width) | Student Profile screen (`student/[id]/page.js`) | When the teacher has navigated to a specific student, the rating action is primary — buttons are maximized to dominate the interaction area. |
| "Add Note" button with generous padding (min-height: 44px) | Student Profile notes section | Note-taking during class is time-sensitive. The button must be easy to hit without precise mouse targeting. |
| "Export CSV" and "Return to Dashboard" buttons (min-height: 48px) | Session Summary top bar | End-of-session actions should be immediately accessible. Oversized buttons ensure the teacher can wrap up quickly. |
| "Start Session" hero button (padding: 16px 36px, min-height: 56px) | Landing page | The primary call-to-action is the largest interactive element on the page, ensuring immediate acquisition. |

---

## 2. Hick-Hyman Law

**Principle**: Reaction time increases logarithmically with the number of choices (RT = a + b·log₂(n)). Fewer options = faster decisions.

| Design Element | Where | Justification |
|---|---|---|
| Exactly 3 engagement states: Engaged / Neutral / Lost | All screens | With log₂(3) ≈ 1.58 bits of information, teachers can classify students in under 2 seconds. A 5-point scale (log₂(5) ≈ 2.32) would be measurably slower with no practical benefit in a live classroom. |
| Icon-buttons instead of dropdown menus | Student cards, Profile page | Dropdowns require: click to open → scan options → click to select (3 actions). Buttons require: scan → click (1 action). Eliminates an entire interaction step. |
| Quick-Action toolbar limited to 3 actions | Dashboard toolbar | Only the 3 most critical session-level actions are exposed. Additional options (like "Add Student") are placed separately to avoid cluttering the decision space. |
| Landing page has a single primary action | Landing page | One button: "Start Session." No menu, no options, no decisions. The teacher's only choice is to begin. |

---

## 3. Miller's Law (7±2)

**Principle**: Working memory holds approximately 7 (±2) items at once. Exceeding this causes cognitive overload.

| Design Element | Where | Justification |
|---|---|---|
| Grid capped at 7 columns on wide screens (grid-template-columns: repeat(7, 1fr) at 1800px+) | Dashboard grid | Each visible row shows at most 7 student cards, keeping the scannable set within working memory limits. |
| Student Profile organized into exactly 3 sections (Profile / Engagement History / Teacher Notes) | Student Profile page | Three groups are well within the 7±2 range. Teachers can hold the full information architecture in mind without searching. |
| Engagement summary chips show exactly 3 counts | Dashboard top area | The teacher sees "X Engaged, Y Neutral, Z Lost" — three numbers, instantly parseable. |
| Heat map uses student names as row labels (max visible without scrolling ≈ 7-10) | Dashboard heat map | Limits the visual scan to a manageable number of rows at any glance. |
| Summary page shows exactly 4 stat cards | Session Summary | Four key metrics — within the 7±2 range. The teacher grasps the full session outcome without scrolling. |

---

## 4. Preattentive Attributes

**Principle**: Certain visual properties (colour, motion, size) are processed by the visual system in under 250ms, before conscious attention is engaged.

| Design Element | Where | Justification |
|---|---|---|
| Green / Amber / Red colour coding on student cards | Dashboard student cards | Traffic-light metaphor is universally understood. Teachers perceive class-wide engagement state by glancing at the colour distribution — no reading required. |
| Matching colour-coded backgrounds with translucent fills | Student card backgrounds | Background + border creates a double-encoded colour signal with subtle translucency that works in both dark and light themes. |
| Pulsing red border animation (CSS @keyframes, 1.5s cycle) for >3 min disengagement | Dashboard student cards | Motion is the strongest preattentive attribute. A pulsing card is impossible to miss even when the teacher is looking elsewhere on the screen. The 3-minute threshold avoids false alarms from brief status changes. |
| Animated red dot on disengagement timer | Student card timer | A small pulsing dot next to the timer text draws the eye via motion, reinforcing urgency. |
| Colour-coded heat map cells with hover magnification | Dashboard heat map | Each cell is a single colour — engagement state is perceived without reading. Hover enlarges the cell (1.3x scale) for closer inspection. |
| Colour-coded summary chips with border accents | Dashboard content area | The teacher's first visual scan hits these chips. Border + background colour double-encoding ensures perception in both themes. |
| Colour-coded timeline segments in Session Summary | Summary page | Post-session review uses the same colour language, maintaining consistency and enabling instant pattern recognition. |
| Glowing box-shadows on current session bar | Summary comparison chart | The current session's bar glows blue, immediately distinguishing it from historical grey bars via luminance contrast. |

---

## 5. Gulf of Evaluation

**Principle**: The gulf of evaluation is the gap between the system's actual state and the user's perception of that state. Good design makes system state visible and unambiguous.

| Design Element | Where | Justification |
|---|---|---|
| Live disengagement timer on each student card (updates every second) | Dashboard student cards | The teacher always knows exactly how long a student has been disengaged — no mental arithmetic required. |
| Session timer in toolbar (HH:MM:SS format, updates every second) | Dashboard toolbar | The teacher always knows how long the session has been running. Enables time-aware pacing decisions. |
| Engagement summary chips (counts of Engaged/Neutral/Lost) | Dashboard top | Provides an at-a-glance class-wide state summary. The teacher perceives the overall engagement distribution without counting cards. |
| Engagement history mini-chart (canvas-drawn timeline) | Student Profile page | Shows the full engagement trajectory — when they became disengaged, how long they stayed, when they re-engaged. Theme-aware colours ensure readability in both dark and light modes. |
| Attention heat map (30-second interval snapshots) | Dashboard bottom | Provides temporal awareness — how engagement evolved over time. The teacher can see whether disengagement is recent or has been building. |
| Session comparison bar chart (current vs. last 5 sessions) | Summary page | Gives the teacher a benchmark. "Is this session worse than usual?" is answered visually without calculation. |
| Per-student engagement timeline bars | Summary page | Post-session, the full engagement story of each student is visible as a coloured horizontal bar. Patterns emerge naturally. |
| Toast notifications for every action | All screens | Every action (rating change, note added, session paused, CSV exported) produces an immediate toast notification confirming what happened. The teacher never wonders "did that work?" |

---

## 6. Gulf of Execution

**Principle**: The gulf of execution is the gap between the user's intention ("I want to do X") and the actions available in the system. Good design makes desired actions obvious and accessible.

| Design Element | Where | Justification |
|---|---|---|
| One-click engagement rating (click button → state changes immediately) | All screens | The teacher's intention is "rate this student." The action is one click with immediate feedback. No forms, no save buttons, no multi-step workflows. |
| One-click note attachment with Enter key shortcut | Student Profile notes | Intention: "record an observation." Action: type, press Enter (or click Add Note). The note appears in the list immediately with timestamp. |
| Confirmation dialog before flagging a student | Student Profile page | Prevents the accidental consequence of a misclick during live instruction. The confirm dialog says exactly what will happen: "Are you sure you want to flag [Name] for follow-up?" |
| Confirmation dialog before ending session | Dashboard toolbar | "End Class" is irreversible and navigates away. The confirm dialog prevents accidental session termination. |
| Real-time form validation (red border + error message + toast on empty note) | Student Profile notes | If the teacher tries to submit an empty note, the system explains why via red border, inline message, AND a toast notification. Triple redundancy ensures the feedback is perceived. |
| Clear labelled buttons with icons (✓ Engaged, — Neutral, ✗ Lost) | All engagement buttons | Each button has both an icon and a text label. The teacher never has to guess what a button does. Icon provides fast recognition; label provides certainty. |
| "Back to Dashboard" button prominently placed at top-left | Student Profile page | The teacher's intention to return is always one click away, in the most visible position (following F-pattern reading). |
| CSV export as single-click download | Summary page | Intention: "save this data." Action: click "Export CSV" → file downloads. No file dialogs, no format selection. |

---

## 7. Gestalt Principle: Proximity

**Principle**: Elements that are close together are perceived as belonging to the same group. Spatial grouping communicates logical grouping.

| Design Element | Where | Justification |
|---|---|---|
| Student Profile divided into 3 bordered sections with icon-labelled headers | Student Profile page | Each section has a visible border, background-differentiated header with icon, and clear label. The teacher immediately understands: identity → trends → interventions. |
| Dashboard layout: toolbar → alert → summary chips → grid → heat map | Dashboard page | Vertical spatial progression creates a natural information hierarchy. Actions (toolbar) are separated from observation (content). Overview (chips) precedes detail (grid). |
| Note items grouped with timestamp + text in bordered containers | Student Profile notes list | Each note is a single visual unit (shared background, border, horizontal alignment). The timestamp and text are perceived as belonging together. |
| Heat map rows: label + cells as horizontal groups | Dashboard heat map | Each row is a student's engagement story. The name label and colour cells are perceived as one unit because of horizontal proximity. |
| Stat cards on Summary page | Summary page | Four stat cards in a responsive grid. Each card is a self-contained unit with a large value and a smaller label. Proximity within each card groups the number with its meaning. |

---

## 8. Situation Awareness (Endsley's Model)

**Principle**: Situation awareness has three levels: (1) perception of elements in the environment, (2) comprehension of their meaning, (3) projection of future state.

| Design Element | SA Level | Where | Justification |
|---|---|---|---|
| Auto-sorting student grid by engagement level (Lost → Neutral → Engaged) | Level 1 (Perception) | Dashboard grid | The most critical students (Lost) are always at the top-left — the teacher's eye naturally starts there. |
| Alert banner for students disengaged >3 minutes | Level 2 (Comprehension) | Dashboard top | Not just "who is lost" but "who has been lost for a concerning duration." Temporal context upgrades perception into comprehension. |
| Engagement summary chips (X Engaged / Y Neutral / Z Lost) | Level 2 (Comprehension) | Dashboard top | Aggregated counts give the teacher a class-level comprehension. |
| Session timer (elapsed time) | Level 3 (Projection) | Dashboard toolbar | Time context enables forward-looking decisions: "We're 30 minutes in and engagement is dropping." |
| Heat map (engagement over 30-second intervals) | Level 3 (Projection) | Dashboard bottom | Trend data enables projection: "Engagement has been declining — if I don't intervene, it will get worse." |
| Pulsing border animation for prolonged disengagement | Level 1 (Perception) | Dashboard cards | The motion cue ensures the teacher perceives critical students even when focused elsewhere. |

---

## 9. Affordance (Norman)

**Principle**: An affordance is a property of an object that suggests how it can be used. Visual affordances signal interactability without instruction.

| Design Element | Where | Justification |
|---|---|---|
| Buttons have shadows, borders, and hover-lift effects (translateY(-1px to -3px)) | All buttons across all screens | The visual depth (shadow) and movement on hover (lift) signal "I am clickable." No instructions needed. |
| Student cards have hover elevation and shadow increase | Dashboard grid | Cards lift on hover, signaling they are interactive elements that can be clicked for more detail. |
| Input fields have visible borders, background differentiation, and focus glow | Student Profile note input, Add Student modal | The recessed appearance (darker background, border) signals "I accept text input." Focus state adds a blue glow ring confirming the field is active. |
| Theme toggle rotates on hover | All screens (top bar) | The subtle rotation suggests the toggle is interactive and will change state — it "wants to be clicked." |
| "Start Session" button has gradient background and arrow icon | Landing page | The gradient creates visual weight (this is the primary action), and the arrow icon affords forward motion — "click me to proceed." The arrow slides right on hover, reinforcing the affordance. |

---

## 10. Feedback (Norman)

**Principle**: Every action should produce an immediate, visible response that confirms the action was received and shows its result.

| Design Element | Where | Justification |
|---|---|---|
| Toast notifications for engagement changes | Dashboard, Student Profile | Clicking "Engaged" immediately shows a green toast: "Ahmed Khan marked as Engaged." The teacher knows the action registered. |
| Toast notification for note submission | Student Profile | "Note added successfully" toast confirms the note was saved. |
| Toast notification for session actions | Dashboard toolbar | "All students marked as engaged," "Session paused," "Session ended" — every toolbar action is confirmed. |
| Toast notification for CSV export | Summary page | "CSV exported successfully" confirms the download was triggered. |
| Button press animation (scale(0.98) on :active) | All buttons | Micro-interaction: buttons visually "press down" when clicked, mimicking physical button depression. Confirms the click was registered before the action completes. |
| Input focus ring (blue glow) | All text inputs | When the teacher clicks an input field, the blue glow ring confirms the field is now active and accepting input. |
| Status badge updates immediately on engagement change | Student cards, Profile | The coloured badge text changes instantly — no loading state, no delay. The teacher sees the result the moment they act. |
| Card background colour transitions smoothly | Dashboard student cards | When engagement changes, the card background smoothly transitions to the new colour (CSS transition: all 0.2s ease), providing visual confirmation of the state change. |

---

## 11. Recognition over Recall (Nielsen)

**Principle**: Users should not have to remember information from one part of the interface to another. Make objects, actions, and options visible.

| Design Element | Where | Justification |
|---|---|---|
| Icon + text labels on all buttons (✓ Engaged, — Neutral, ✗ Lost, 🚩 Flag) | All screens | The teacher recognizes the meaning from the icon and confirms with the text. No need to recall what an unlabelled icon means. |
| Consistent colour language across all screens | Entire application | Green always means engaged, amber always means neutral, red always means lost. The teacher recognizes the meaning instantly on any screen without recalling a legend. |
| Section headers with icons (👤 Profile, 📊 Engagement History, 📝 Teacher Notes) | Student Profile | Icons provide visual landmarks. The teacher recognizes which section they're looking at from the icon before reading the text. |
| Breadcrumb-style "Back to Dashboard" navigation | Student Profile, Summary | The back button is always visible, always labelled. The teacher doesn't need to recall how to navigate — the path back is always shown. |
| Tooltips on heat map cells | Dashboard heat map | Hovering a cell shows "Student Name @ Time: Status." The teacher doesn't need to recall which row or column they're looking at. |
| Active state indicator on current engagement button | Dashboard cards, Profile | The currently-selected engagement state has a visible ring/shadow. The teacher recognizes the current state without recalling what they last clicked. |

---

## 12. Consistency & Standards (Nielsen)

**Principle**: Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.

| Design Element | Where | Justification |
|---|---|---|
| Same button styles across all 4 screens | Entire application | Green buttons always mean positive/confirm actions, red buttons always mean destructive/critical actions, blue buttons always mean informational/navigation actions. |
| Same colour-coded engagement representation everywhere | Cards, badges, charts, heat map, timelines | Whether the teacher is on the dashboard, profile, or summary, engagement is always represented the same way: green/amber/red with the same shade palette. |
| Dark/light theme maintains identical layout and interaction patterns | Theme toggle | Switching themes changes only colours and shadows — never layout, never button positions, never interaction patterns. The teacher's muscle memory transfers perfectly between themes. |
| Same section container pattern (bordered box with header) | Student Profile, Summary | Both screens use identical visual containers for grouping information. The teacher learns the pattern once and recognizes it everywhere. |
| Same toast notification system across all screens | Entire application | Success is always green, error is always red, warning is always amber, info is always blue. The toast format, position, and dismiss behaviour are identical everywhere. |

---

## 13. Error Prevention (Nielsen)

**Principle**: Even better than good error messages is a design that prevents errors from occurring in the first place.

| Design Element | Where | Justification |
|---|---|---|
| Disabled buttons when session is ended | Dashboard toolbar | After ending a session, "Mark All Present" and "Pause" are greyed out and unclickable. The teacher cannot accidentally modify a finished session. |
| Confirmation dialog before ending session | Dashboard toolbar | "Are you sure?" prevents the most common catastrophic error: accidentally ending a session mid-class. |
| Confirmation dialog before flagging a student | Student Profile | Flagging is a significant action visible in the summary. Requiring confirmation prevents casual misclicks from having lasting consequences. |
| Form validation prevents empty note submission | Student Profile notes | The "Add Note" button checks for empty input before submitting. An empty note would be meaningless data — the system prevents it from entering the record. |
| Disabled state visual cues (opacity: 0.4, cursor: not-allowed) | Disabled buttons | Disabled buttons are visually distinct — dimmed and with a "not-allowed" cursor. The teacher perceives they cannot interact before attempting to click. |
| Modal overlay click-to-dismiss | Add Student modal | Clicking outside the modal closes it. This prevents the teacher from being "trapped" in a modal they didn't intend to open. |

---

## 14. Progressive Disclosure

**Principle**: Show only the information and actions relevant to the current context. Reveal complexity gradually as the user navigates deeper.

| Design Element | Where | Justification |
|---|---|---|
| Landing page → Dashboard → Student Profile (3 levels of detail) | Navigation flow | The landing page shows nothing but a "Start Session" button. The dashboard shows an overview of all students. The student profile reveals full detail. Information complexity increases only when the teacher asks for it. |
| Student cards show summary; clicking reveals full profile | Dashboard → Profile | Cards show name, status, and timer — enough to decide if action is needed. Full engagement history, notes, and charting are revealed only when the teacher clicks through. |
| Heat map starts empty, fills over time | Dashboard | The heat map begins with a "loading" message and fills with data every 30 seconds. The teacher isn't overwhelmed with a full grid at session start. |
| Notes section shows count in header, full list in body | Student Profile | The section header shows "Teacher Notes (3)" — the count is visible without expanding. The full list of notes is visible in the body, but only after navigating to this specific student. |
| Summary page reveals session-wide patterns only at end | Session Summary | Per-student timelines, class averages, and comparison charts are shown only when the session ends. During live instruction, the teacher focuses on real-time data, not retrospective analysis. |

---

## 15. Aesthetic-Usability Effect

**Principle**: Users perceive aesthetically pleasing designs as more usable. Visual polish increases trust and tolerance for minor usability issues.

| Design Element | Where | Justification |
|---|---|---|
| Dark theme with carefully tuned colour palette | Entire application | The dark theme uses a deep blue-grey base (#0F1117) with muted accent borders and translucent colour fills. This creates a professional, modern appearance that signals competence and reliability to the teacher. |
| Smooth CSS transitions on all interactive elements (0.2s ease) | All buttons, cards, inputs | Every hover, focus, and state change is animated smoothly. The interface feels responsive and polished rather than jarring. |
| Gradient accent on primary CTA and heading | Landing page | The blue-to-purple gradient on "Engagement Monitor" and the "Start Session" button creates visual interest and draws attention without being distracting. |
| Background glow effects on landing page | Landing page | Subtle, blurred radial gradients in blue, purple, and green create depth and atmosphere. The teacher's first impression is of a polished, professional tool. |
| Consistent border-radius (10px standard, 16px for cards) | Entire application | Rounded corners throughout create a cohesive visual language. Sharp edges would feel clinical; the rounded aesthetic feels approachable. |
| Custom scrollbar styling | Entire application | The thin, styled scrollbar matches the theme palette. The default browser scrollbar would break the visual cohesion. |
| Backdrop blur on toolbars | Dashboard, Profile, Summary top bars | Frosted-glass effect on sticky headers adds visual depth and ensures content scrolling behind the toolbar doesn't create harsh contrast. |
| `::selection` colour matches theme accent | Entire application | Even text selection uses the theme's blue accent colour, maintaining visual consistency in the smallest interaction details. |
| Fade-in and slide-up animations on page content | All screens | Content animates in on page load (fadeIn 0.4s, slideUp 0.3s), creating a sense of intentional choreography rather than abrupt rendering. |

---

## Cross-Cutting Design Decisions

### Colour System
A consistent green/amber/red palette is used across all screens and both themes. In dark mode, colours use higher-saturation variants (e.g., #34D399 green) for visibility against dark backgrounds. In light mode, colours use deeper variants (e.g., #16A34A green) for contrast against white. This adaptive colour system leverages preattentive attributes while supporting situation awareness and closing the gulf of evaluation. One design system serves multiple AHCI principles.

### Theme System
The dark/light toggle demonstrates **Consistency & Standards** (same layout, same interactions regardless of theme), **Affordance** (the toggle button rotates on hover, suggesting interactability), and **Aesthetic-Usability Effect** (both themes are carefully tuned for visual polish). Theme preference persists via localStorage — the system remembers the teacher's choice across sessions.

### Typography Hierarchy
- **Bold, large values (2rem+)** for stats and key numbers (high information density elements)
- **Monospace font with letter-spacing** for timers and timestamps (fixed-width numbers don't shift layout)
- **Muted text colour** for labels and metadata (reduces visual noise, keeps primary content dominant)
- **Uppercase + letter-spacing** for category labels (signals metadata, not content)

### Responsive Grid Constraints
The grid uses `auto-fill, minmax(270px, 1fr)` to ensure cards never become too small to click (Fitts' Law) while keeping rows within the 7-item limit (Miller's Law) on standard displays. The 270px minimum guarantees that engagement buttons remain usable click targets.

### No Dropdowns, No Modals for Primary Actions
Every primary action (rating engagement, adding notes, navigating) is a single-click operation. Modals are used only for secondary actions (adding a new student) and confirmation dialogs (flagging, ending session). This minimizes the gulf of execution for the teacher's most frequent tasks.

### Toast Notification Architecture
All toasts follow a consistent pattern:
- **Success (green)**: Positive confirmations — "Note added," "CSV exported"
- **Warning (amber)**: Caution states — "Session paused," "Student flagged"
- **Error (red)**: Failures or critical states — "Note cannot be empty," "Student marked as Lost"
- **Info (blue)**: Neutral information — "Session resumed"

Toasts auto-dismiss after 3 seconds and can be clicked to dismiss early. They stack from the bottom-right, following the convention of notification systems the teacher already uses.

### Session State Architecture
All state lives in React Context with a reducer pattern. This means:
- State changes are immediate (no loading spinners, no async delays)
- The teacher sees the effect of every action instantly (gulf of evaluation)
- Toast feedback is synchronous with state changes (feedback principle)
- The pseudo-database is extensible — adding students is a single function call
