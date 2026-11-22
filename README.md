# Student Project Showcase & Academic Evaluation Platform

> **A zero-dependency, high-performance academic web portal engineered to archive, evaluate, and showcase student engineering capstone projects.**
>
> **Department:** Department of Computer Science & Engineering (IoT)  
> **Institution:** Noida Institute of Engineering and Technology (NIET), Greater Noida (An Autonomous Institute)  
> **Course:** Web Designing (`DCSE0152`) | **Academic Year:** 2026-27  
> **Cohort:** Group 08 | **Viva Status:** Ongoing Evaluation  
> **Repository:** [https://github.com/Pcwhat/student-project](https://github.com/Pcwhat/student-project)

---

## 1. Project Abstract & Motivation

In university engineering curriculums, student capstone projects, term papers, and Project-Based Learning (PBL) deliverables have historically faced critical documentation and access challenges:

* **Lost Academic Archives:** Student projects are frequently submitted on isolated flash drives, physical binders, or scattered folders that disappear once the semester ends.
* **Idea Duplication:** Junior students (1st, 2nd, and 3rd-year undergraduates) often repeat duplicate project concepts due to a lack of a centralized, searchable institutional archive of past work.
* **Viva Evaluation Friction:** During end-semester lab exams and external viva defenses, examiners lose valuable time navigating disorganized files rather than evaluating technical architectures, rubrics, and source repositories.
* **Heavy Framework Overhead:** Modern web projects often rely on thousands of bloated npm dependencies, complex build pipelines, and slow load times for simple informational tasks.

### Our Solution
As First-Year B.Tech Computer Science & Engineering (IoT) students, **Group 08** designed and built the **Student Project Showcase & Evaluation Platform**. It is an ultra-fast, zero-dependency academic web application created purely with **Semantic HTML5, Modular CSS3, and Vanilla JavaScript (ES6+)**. The portal provides university faculties, external viva examiners, and students with an interactive, beautifully designed platform for archiving projects, conducting transparent rubric grading, reviewing technical case studies, and navigating engineering schematics.

---

## 2. Key Features (Detailed Breakdown)

### Feature 1: Center-Focused Floating Slider Navigation with Flywheel Physics
* **Precision Centered Active Item:** The top navigation bar operates on a custom circular physics slider that continuously centers the current page or focused section.
* **Tactile Inertial Scrolling:** Features kinetic momentum, velocity decay, and touch gesture handling (`touchstart`, `touchmove`, `touchend`) optimized for both mobile swiping and desktop mouse dragging.
* **Zero Layout Shift:** Lightweight calculations keep the floating pill positioned smoothly above page content with responsive backdrop blur (`backdrop-filter: blur(12px)`).

### Feature 2: Comprehensive Project Directory & Real-Time Word Highlighting
* **Live Search with DOM Highlighting:** An instant search engine filters projects by title, technology stack, student author, or keywords, highlighting matching character strings in real time without reloading the page.
* **Multi-Tier Student Year Filtering:** Filter projects by academic cohort: **First Year (1st)**, **2nd Year**, **3rd Year**, and **Final Year (4th)** with dedicated color-coded jewel badges.
* **Flywheel Category Slider:** A circular horizontal category bar allows instantaneous filtering across domains (Web Engineering, Automation, IoT & Hardware, Embedded Systems).

### Feature 3: Dual Presentation Modes (Card Grid vs. Academic Table)
* **3D Physical Card Grid:** Skeuomorphic physical cards with subtle elevated box shadows, top accent gradient sweeps on hover, and clear technology stack chips.
* **Structured Academic Table View:** An institutional tabular view formatted specifically for faculty and evaluators, displaying project title, academic year, tech stack, authors, viva evaluation status, and direct action links.
* **Instant Mode Switching:** Switches layouts dynamically while preserving active search queries and filter states.

### Feature 4: Case Study Deep-Dive Architecture (`project-details.html`)
* **Multi-Tab Academic View:** Structured tabbed interface dividing documentation into four logical sections:
  1. **Project Overview:** Problem statement, academic motivation, and engineering rationale.
  2. **System Architecture:** Component data flows, architectural block diagrams, and state management models.
  3. **Team Roles & Contributions:** Detailed breakdown of each student member's engineering responsibilities.
  4. **Viva Evaluation Rubric:** Criterion-by-criterion assessment table.
* **Direct GitHub Repository Integration:** Prominent hero action button and dedicated sidebar widget redirecting examiners directly to the official source code on GitHub (`https://github.com/Pcwhat/student-project`).
* **Curved Architectural Hero Container:** 12px rounded corner container with an accent gradient highlight bar and vertically centered action buttons.

### Feature 5: Transparent Academic Viva Evaluation Rubric
* **Criterion Matrix:** Breaks evaluation down across core university grading dimensions:
  * Problem Statement & Scope Definition
  * Architecture & Code Quality
  * Interactive UI/UX & Responsive Engineering
  * Defense, Presentation & Technical Q&A
* **Grading Criteria:** Clear performance descriptions (Exemplary, Proficient, Developing, Inadequate) ensuring objective grading for external examiners.

### Feature 6: Procedural Web Audio Synthesis (Mechanical Acoustics)
* **Zero External Audio Assets:** Uses the browser's native **Web Audio API** (`AudioContext`) to synthesize physical acoustic sounds dynamically using mathematical waveforms, oscillators, and white-noise buffers.
* **Hard Metal Latch Tap:** Synthesizes a crisp, high-frequency metallic click on button presses, filter toggles, and navigation clicks.
* **Mechanical Ratchet Tick:** Synthesizes low-latency mechanical tick sounds when scrolling through horizontal sliders or adjusting values.
* **Non-Blocking & Battery Friendly:** Context is warmed up on first interaction and sleeps when idle, eliminating audio lag with zero asset download overhead.

### Feature 7: Universal 3D Tactile Button Press Animation
* **Physical Hardware Depress:** Every button, tab, pill, slider notch, and navigation link across the website features a perceptible `translateY(2px) scale(0.97)` mechanical depress upon click/active state.
* **Inset Shadow Collapse:** Floating drop shadows collapse into physical inset casing shadows (`inset 0 2px 4px rgba(0,0,0,0.28)` in light mode; `inset 0 2px 6px rgba(0,0,0,0.65)` in dark mode).
* **Instantaneous Response:** Configured with a snappy `0.04s` cubic-bezier press transition for an unmistakable mechanical feel.

### Feature 8: Portal Settings & Personalization Engine
Accessible via the floating `Settings` button at the top-right of every page:
* **Strict Two-Theme System:**
  * **Light Theme (Default):** Warm Ivory Clay aesthetic (`#FAF7F2` background, `#FFFFFF` surfaces, rich earthy borders, deep charcoal typography).
  * **Dark Theme:** Obsidian & Charcoal Matte Black (`#0E1117` background, `#181C24` surfaces, `#2D3342` borders, electric amber `#FF7A1A` highlights).
* **Acoustics On/Off Switch:** Easily mute or re-enable mechanical sound feedback across the entire site (saved in `localStorage`).
* **Font Style Combination Selector:** Four hand-picked architectural typographic pairings:
  1. *Architectural Lab (Default):* DM Sans + Space Mono
  2. *Academic Archive:* Newsreader + JetBrains Mono
  3. *Collegiate Heritage:* Lora + Inter
  4. *Next-Gen Tech:* Outfit + Manrope
* **Horizontal Text Scale Slider:** Calibrate reading scale dynamically between `14px (-13%)` and `20px (+25%)` with instant live delta percentage badges, ruler notches, and stepper buttons.

### Feature 9: 3D Origami-Folded Interactive Footer
* **Folded Paper Aesthetic:** Styled as an architectural paper blueprint with creased borders, fold-corner effects, and physical drop shadows.
* **Interactive Expandable Flaps:** Expand individual accordion drawers for:
  * `01 / Project & Team`: Capstone cohort background and institutional affiliations.
  * `02 / Quick Links`: Direct links to all portal sub-pages.
  * `03 / College Info`: NIET Greater Noida autonomous credentials and course code.
* **High-Contrast Typography:** Optimized for 100% legibility in both light and dark modes with high-contrast text and crisp borders.

### Feature 10: Visual Schematics & Architecture Gallery (`gallery.html`)
* **Blueprint Inspection Window:** Interactive gallery for inspecting system architecture diagrams, user interaction flows, data pipelines, and responsive wireframes.
* **Lightbox Modal:** Fullscreen zoom modal with component specifications and tech stack details.

### Feature 11: Project Submission Portal (`contact.html`)
* **PBL Submission Form:** Allows student teams to submit their project details, abstract, members, and repository links.
* **LocalStorage Autosave Memory:** Automatically saves form drafts locally so students never lose typed data during accidental page reloads.
* **Interactive Telemetry:** Live character counts, validation status indicators, and submission confirmation feedback.

### Feature 12: Mobile-First Responsive Drawer Navigation
* **Vertical Nav Slider:** On viewports under 868px, navigation seamlessly transitions into a sleek vertical slider drawer.
* **Academic Credential Card:** Mobile drawer displays a dedicated institutional metadata card with autonomous college seal, department badge, mentor name, and cohort tag.
* **Zero Illegibility:** High-contrast text guarantees zero white-on-white text issues in both themes.

---

## 3. Technology Stack & Design Architecture

| Layer | Technologies & Techniques Used |
| :--- | :--- |
| **Markup** | HTML5 Semantic Elements (`<article>`, `<section>`, `<aside>`, `<nav>`, `<header>`, `<footer>`), WAI-ARIA Accessibility Attributes |
| **Styling** | Vanilla CSS3, CSS Custom Properties (Three-Tier Design Tokens), Flexbox & CSS Grid, 3D Skeuomorphic Depress Shadows, Media Queries (`@media`) |
| **Interactivity** | Vanilla JavaScript (ES6+), Event Delegation, DOM Mutation, HTML5 History & LocalStorage API |
| **Acoustics** | Native Web Audio API (`AudioContext`, `createOscillator`, `createDynamicsCompressor`, Procedural White-Noise Buffers) |
| **Dependencies** | **Zero External Libraries** (No React, No jQuery, No Tailwind, No npm packages required) |

---

## 4. Project Directory Structure

```text
student-project/
├── index.html              # Home page: Hero, Featured Capstone, Academic Rationale
├── projects.html           # Project Directory: Search, Filters, Grid & Table Views
├── project-details.html    # Case Study: Overview, Architecture, Team Roles, Viva Rubric
├── gallery.html            # Visual Gallery: Architecture Diagrams & Schematics
├── contact.html            # PBL Project Submission Portal & Draft Autosave
├── README.md               # Official Project Documentation
├── css/
│   ├── global.css          # Core design tokens, typography, settings modal, footer
│   ├── home.css            # Home page hero and telemetry styling
│   ├── projects.css        # Search filters, flywheel slider, card grid, table view
│   ├── project-details.css # Case study layout, sidebar widgets, rubric matrix
│   ├── gallery.css         # Schematic cards, blueprint viewer, lightbox modal
│   ├── contact.css         # Form layouts, validation states, submission cards
│   └── animation-lab.css   # Experimental micro-interaction tokens
└── js/
    ├── main.js             # Settings modal, theme engine, Web Audio acoustics, press effects
    ├── home.js             # Home page telemetry meters and search routing
    ├── projects.js         # Directory filtering, live word highlight, dual-view toggle
    ├── project-details.js  # Tab navigation, rubric accordion, smooth hash links
    ├── gallery.js          # Lightbox viewer and category filtering
    ├── contact.js          # Form validation, LocalStorage draft saving, clear actions
    └── animation-lab.js    # Interactive component physics
```

---

## 5. Group 08 Capstone Team Roster

| Student Name | College ERP ID | Academic Role | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Ashish Ranjan** | `0261CSIOT250` | **Team Lead & Architecture** | Systems architecture, Web Audio API synthesis, flywheel physics, and state management. |
| **Ashish Prajapati** | `0261CSIOT206` | **Frontend UI Lead** | CSS design tokens, responsive grid/flexbox layouts, card styling, and dual theme engine. |
| **Arunima Bhardwaj** | `0261CSIOT038` | **Technical Documentation** | Academic documentation, syllabus mapping, viva defense questionnaire, and rubric criteria. |
| **Aryan** | `0261CSIOT058` | **JS Interactivity Lead** | Live search with DOM highlighting, student year filtering logic, and tabbed view switching. |
| **Ashmit Tiwari** | `0261CSIOT219` | **Member** | Project asset collation, group discussion participation, and capstone peer evaluation support. |

* **Faculty Mentor:** Ms. Vishakha Rani (Assistant Professor, Department of CSE - IoT)
* **Academic Cohort:** First Year, B.Tech Computer Science & Engineering (IoT), 2026-27
* **Institute:** Noida Institute of Engineering and Technology (NIET), Greater Noida (Autonomous)

---

## 6. How to Run Locally

This project is built using 100% pure web standards. It does not require Node.js, npm, webpack, or any local build servers.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pcwhat/student-project.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd student-project
   ```

3. **Launch the project:**
   Simply double-click `index.html` or open it with any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

---

## 7. Institutional Notice & Academic Integrity

This project has been developed as an official undergraduate academic submission for Course **DCSE0152 (Web Designing)** under the Department of Computer Science & Engineering (IoT), NIET Greater Noida. All source code, design systems, and documentation have been authored from scratch by the students of **Group 08**.
