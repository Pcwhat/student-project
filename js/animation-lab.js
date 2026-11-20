/**
 * Web Designing Project - UI Animation Lab Switcher
 * Group 08 | NIET Greater Noida (DCSE0152)
 * Allows real-time live previewing and testing of 10 distinct UI and animation
 * design variations on the Academic Masthead & UI elements.
 * 100% Light Academic Editorial Theme - Unified with the entire portal.
 * Zero Unicode Emojis - Pure Vanilla JS
 */

(function () {
  "use strict";

  const STORAGE_KEY = "student_showcase_masthead_anim_preset";

  // Catalog of 10 Light Theme UI & Motion Variations
  const PRESETS = [
    {
      id: "1",
      className: "anim-preset-1",
      name: "1. Executive Collegiate Ivory",
      subtitle: "Clean Structural Grid & Stately Accent Rail",
      uiDesign: "Crisp white (#FFFFFF) surface with warm stone border, terracotta hairline accent rail, minted terracotta crest seal with brass ring, ivory credential chips with subtle 3D shadow.",
      motion: "Smooth terracotta-amber accent rail flow (8s); calm 1.5px hover elevation; slow 3s breathing seal aura.",
      experiment: "Balanced, authoritative collegiate layout matching our primary hero card typography and stone border weights.",
      impact: "Official university department stature, stability, and scholarly dignity in pure light editorial style."
    },
    {
      id: "2",
      className: "anim-preset-2",
      name: "2. 3D Origami Creased Light Deck",
      subtitle: "Folded Paper Cards & Paper Bevels",
      uiDesign: "Directly echoes our 3D Origami Footer! Segmented with vertical fold score lines, folded paper card bevels (#FAF7F2), layered 3D paper steps (0 1px 0 #E7E2DA, 0 2px 0 #DFD8CE), terracotta fold tab marks.",
      motion: "Perspective 3D fold on hover (perspective 600px rotateX(-2deg)); tactile paper latch snap sound.",
      experiment: "Physical origami paper engineering bringing the footer's tactile folding concept into the light top header.",
      impact: "Unmistakable craftsmanship, physical engineering tangible feel, perfect top-to-bottom portal harmony."
    },
    {
      id: "3",
      className: "anim-preset-3",
      name: "3. Frosted Pearlescent Glass",
      subtitle: "Translucent White Glass & Rounded Pills",
      uiDesign: "Translucent frosted white glass (rgba(255, 255, 255, 0.88)), continuous 999px rounded pill capsules, delicate stone borders, soft diffused light shadow.",
      motion: "Magnetic spring levitation on hover (-3px); specular sunlight wave gliding across the rail; diffused warm shadow.",
      experiment: "Apple-style clean white frosted glassmorphism matching our floating rounded pill navbar.",
      impact: "Modern, fluid, welcoming, and high-end hardware luxury on clean white surfaces."
    },
    {
      id: "4",
      className: "anim-preset-4",
      name: "4. Engineered Spec Ledger",
      subtitle: "Parchment Tech Grid & Telemetry Scan",
      uiDesign: "Warm parchment (#F5F2EB) with subtle 16px engineering grid, monospace tags, corner bracket notches [ ], terracotta left-tab stroke.",
      motion: "Sweeping horizontal telemetry laser scan line; data packet bus stream along top rail; crisp border trace on hover.",
      experiment: "Transforms the academic header into an active IoT hardware register ledger on warm engineering paper.",
      impact: "Authentic hardware engineering lab, technical precision, and verifiable project telemetry."
    },
    {
      id: "5",
      className: "anim-preset-5",
      name: "5. Tactile Mechanical Stepper",
      subtitle: "Light Machine Bevels & Physical Button Press",
      uiDesign: "Physical warm ivory switchboard (#FDFBF7). Chips look like physical machined keys with top white highlight and bottom stone drop step (0 2.5px 0 #D6CEC2).",
      motion: "True physical button click on hover (+2px); discrete stepped rail snap increments (6 steps per cycle); tactile feedback.",
      experiment: "Physical computing interface mimicking lab breadboard switches and CNC-milled instrument panels in light stone.",
      impact: "Tangible machinery, physical IoT hardware reliability, and deeply satisfying tactile feedback."
    },
    {
      id: "6",
      className: "anim-preset-6",
      name: "6. Honors Convocation Ribbon",
      subtitle: "Gold Leaf & Parchment Prestige",
      uiDesign: "Warm ivory parchment surface with 24k gold leaf and terracotta accents, gold rimmed medallion crest, champagne gold chip borders.",
      motion: "Radiant gold specular beam gliding across top edge; seal pulses with a warm victory sunburst breathing glow.",
      experiment: "Celebratory graduation/viva honors aesthetic celebrating end-semester Capstone Grade A+ achievement.",
      impact: "Pride of accomplishment, faculty distinction, and academic victory."
    },
    {
      id: "7",
      className: "anim-preset-7",
      name: "7. Swiss Minimalist Editorial",
      subtitle: "Pure Georgia Typography & Hairline Restraint",
      uiDesign: "Stark pure white (#FFFFFF); 0px square corners; razor-thin hairlines; chips separated by clean vertical stone hairlines; pure Georgia serif.",
      motion: "Zero jumping or bouncing; elegant bottom terracotta underline expands on hover; subtle 0.2s buttery opacity transition.",
      experiment: "High-end Swiss editorial magazine restraint grounded in our warm paper and ink aesthetic.",
      impact: "Pure intellectual focus, senior engineering maturity, and serious academic rigor."
    },
    {
      id: "8",
      className: "anim-preset-8",
      name: "8. Connected IoT Node Mesh",
      subtitle: "Terracotta Circuit Bus & Telemetry Ping",
      uiDesign: "Light stone surface (#FAF7F2) with circuit micro-dots; visible terracotta circuit trace connecting the badges.",
      motion: "Every 4.5s, a bright terracotta-amber signal packet travels sequentially: Seal -> NIET -> DCSE -> Mentor -> Group 08!",
      experiment: "Visually animates the core theme of the curriculum: interconnected IoT sensor nodes communicating across a shared bus.",
      impact: "Educational, captivating, clearly communicates the Internet of Things specialization."
    },
    {
      id: "9",
      className: "anim-preset-9",
      name: "9. Warm Ivory Clay Neumorphic",
      subtitle: "Soft Embossed Dual-Light Tactile Depth",
      uiDesign: "Warm ivory stone clay (#F5F2EB); zero stroke borders; depth is sculpted purely through soft white highlight on top-left and warm stone shadow on bottom-right.",
      motion: "Soft pillowy tactile transition: elevates forward, softly indents into pressed detent on hover.",
      experiment: "Pure neumorphic soft-UI sculpted in our portal's warm stone clay rather than generic cold grey.",
      impact: "Organic, warm, incredibly smooth and satisfying to touch/hover."
    },
    {
      id: "10",
      className: "anim-preset-10",
      name: "10. Tabbed Archive Dossier",
      subtitle: "Stacked Library Index Cards",
      uiDesign: "Organized student PBL archive; chips are styled like stacked index-card tabs with top terracotta tab indicators, parchment borders, layered paper edges.",
      motion: "Active tab elevates forward on hover (-3px); casts warm terracotta shadow over adjacent tabs.",
      experiment: "Library / capstone archive card-catalog architecture matching our capstone project repository mission.",
      impact: "Structured, scholarly, orderly, feels like an official departmental archive."
    }
  ];

  let currentPresetIndex = 0;
  let isMinimized = false;

  function playAudioFeedback() {
    try {
      if (window.siteAudio && typeof window.siteAudio.playHardMetalLatchSound === "function") {
        window.siteAudio.playHardMetalLatchSound();
      } else if (window.siteAudio && typeof window.siteAudio.playMetalRatchetTick === "function") {
        window.siteAudio.playMetalRatchetTick(1.2);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  function applyPreset(index, saveToStorage) {
    if (index < 0) index = PRESETS.length - 1;
    if (index >= PRESETS.length) index = 0;
    currentPresetIndex = index;

    const preset = PRESETS[currentPresetIndex];

    // Remove any previous preset classes from body
    PRESETS.forEach(function (p) {
      document.body.classList.remove(p.className);
    });

    // Apply new preset class
    document.body.classList.add(preset.className);

    // Save to storage
    if (saveToStorage !== false) {
      try {
        localStorage.setItem(STORAGE_KEY, preset.id);
      } catch (e) {}
    }

    // Update UI widget elements
    updateWidgetUI(preset);
  }

  function updateWidgetUI(preset) {
    const select = document.getElementById("animLabSelect");
    if (select) {
      select.value = preset.id;
    }

    const countBadge = document.getElementById("animLabCounter");
    if (countBadge) {
      countBadge.textContent = (currentPresetIndex + 1) + " / " + PRESETS.length;
    }

    const minTitle = document.getElementById("animLabMiniTitle");
    if (minTitle) {
      minTitle.textContent = "Motion Lab: " + preset.name.split(". ")[1];
    }

    // Update Details Sections
    const uiEl = document.getElementById("animLabDescUI");
    if (uiEl) uiEl.textContent = preset.uiDesign;

    const motionEl = document.getElementById("animLabDescMotion");
    if (motionEl) motionEl.textContent = preset.motion;

    const expEl = document.getElementById("animLabDescExp");
    if (expEl) expEl.textContent = preset.experiment;

    const impactEl = document.getElementById("animLabDescImpact");
    if (impactEl) impactEl.textContent = preset.impact;
  }

  function renderDock() {
    if (document.getElementById("animLabDock")) return;

    const dock = document.createElement("aside");
    dock.id = "animLabDock";
    dock.className = "anim-lab-dock";
    dock.setAttribute("aria-label", "UI Animation Lab Switcher");

    // Header
    const header = document.createElement("div");
    header.className = "anim-lab-header";

    const titleWrap = document.createElement("div");
    titleWrap.className = "anim-lab-title-wrap";
    titleWrap.innerHTML =
      '<span class="anim-lab-badge" id="animLabCounter">1 / 10</span>' +
      '<span class="anim-lab-title" id="animLabMiniTitle">Family Motion Lab</span>';

    const actions = document.createElement("div");
    actions.className = "anim-lab-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "anim-lab-btn-icon";
    toggleBtn.id = "animLabToggleMin";
    toggleBtn.title = "Minimize / Expand Lab (Shortcut: \\)";
    toggleBtn.setAttribute("aria-label", "Minimize Animation Lab");
    toggleBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">' +
      '<polyline points="4 14 10 14 10 20"></polyline>' +
      '<polyline points="20 10 14 10 14 4"></polyline>' +
      '</svg>';

    actions.appendChild(toggleBtn);
    header.appendChild(titleWrap);
    header.appendChild(actions);
    dock.appendChild(header);

    // Body
    const body = document.createElement("div");
    body.className = "anim-lab-body";

    // Select dropdown
    const selectGroup = document.createElement("div");
    selectGroup.className = "anim-lab-select-group";

    const label = document.createElement("label");
    label.className = "anim-lab-label";
    label.setAttribute("for", "animLabSelect");
    label.textContent = "Select Light UI & Motion Variation:";

    const select = document.createElement("select");
    select.id = "animLabSelect";
    select.className = "anim-lab-select";

    PRESETS.forEach(function (p) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name + " (" + p.subtitle + ")";
      select.appendChild(opt);
    });

    selectGroup.appendChild(label);
    selectGroup.appendChild(select);
    body.appendChild(selectGroup);

    // Prev / Next Navigation Row
    const navRow = document.createElement("div");
    navRow.className = "anim-lab-nav-row";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.id = "animLabPrevBtn";
    prevBtn.className = "anim-lab-nav-btn";
    prevBtn.innerHTML = "&larr; Prev Style";

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.id = "animLabNextBtn";
    nextBtn.className = "anim-lab-nav-btn";
    nextBtn.innerHTML = "Next Style &rarr;";

    navRow.appendChild(prevBtn);
    navRow.appendChild(nextBtn);
    body.appendChild(navRow);

    // Details Card (UI, Motion, Experiment, Impact)
    const detailsCard = document.createElement("div");
    detailsCard.className = "anim-lab-details-card";
    detailsCard.innerHTML =
      '<div>' +
        '<div class="anim-lab-section-tag">UI Visual Architecture</div>' +
        '<div class="anim-lab-section-desc" id="animLabDescUI"></div>' +
      '</div>' +
      '<div>' +
        '<div class="anim-lab-section-tag">Motion &amp; Animation</div>' +
        '<div class="anim-lab-section-desc" id="animLabDescMotion"></div>' +
      '</div>' +
      '<div>' +
        '<div class="anim-lab-section-tag">Design Experiment</div>' +
        '<div class="anim-lab-section-desc" id="animLabDescExp"></div>' +
      '</div>' +
      '<div>' +
        '<div class="anim-lab-section-tag">Psychological Impact</div>' +
        '<div class="anim-lab-section-desc" id="animLabDescImpact"></div>' +
      '</div>';

    body.appendChild(detailsCard);

    // Footer tip with keyboard shortcuts
    const footerTip = document.createElement("div");
    footerTip.className = "anim-lab-footer-tip";
    footerTip.innerHTML =
      '<span>Keys: <kbd class="anim-lab-kbd">[</kbd> <kbd class="anim-lab-kbd">]</kbd> cycle</span>' +
      '<span><kbd class="anim-lab-kbd">\\</kbd> hide</span>';
    body.appendChild(footerTip);

    dock.appendChild(body);
    document.body.appendChild(dock);

    // Event Listeners
    select.addEventListener("change", function () {
      const idx = PRESETS.findIndex(function (p) {
        return p.id === select.value;
      });
      if (idx !== -1) {
        playAudioFeedback();
        applyPreset(idx, true);
      }
    });

    prevBtn.addEventListener("click", function () {
      playAudioFeedback();
      applyPreset(currentPresetIndex - 1, true);
    });

    nextBtn.addEventListener("click", function () {
      playAudioFeedback();
      applyPreset(currentPresetIndex + 1, true);
    });

    function toggleMinimize() {
      isMinimized = !isMinimized;
      dock.classList.toggle("is-minimized", isMinimized);
      toggleBtn.innerHTML = isMinimized
        ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>'
        : '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline></svg>';
    }

    toggleBtn.addEventListener("click", toggleMinimize);
    header.addEventListener("click", function (e) {
      if (isMinimized && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
        toggleMinimize();
      }
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", function (e) {
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (e.key === "[") {
        playAudioFeedback();
        applyPreset(currentPresetIndex - 1, true);
      } else if (e.key === "]") {
        playAudioFeedback();
        applyPreset(currentPresetIndex + 1, true);
      } else if (e.key === "\\") {
        toggleMinimize();
      }
    });
  }

  // Initialization
  document.addEventListener("DOMContentLoaded", function () {
    renderDock();

    // Check saved preference - Defaulting to user-selected permanent Option 9: Warm Ivory Clay Neumorphic
    let savedId = "9";
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      if (val) savedId = val;
    } catch (e) {}

    let initialIndex = PRESETS.findIndex(function (p) {
      return p.id === savedId;
    });
    if (initialIndex === -1) initialIndex = 0; // Default to Option 1

    applyPreset(initialIndex, false);
  });
})();
