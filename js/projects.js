/* 
   Web Designing Project (DCSE0152) - Capstone Showcase
   Group 08 | NIET Greater Noida
   Projects Directory JavaScript (projects.js)
   Features:
   - Live search with instant word highlight effect in Grid & Table views
   - Infinite circular flywheel category slider (100% clear text, zero fade)
   - Uses shared mechanical scroll tick & strong glass tap sounds from main.js
   - View switching between Card Grid and Table View
*/

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("directorySearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const tableRows = Array.from(document.querySelectorAll(".academic-table tbody tr"));
  const resultsCounter = document.getElementById("resultsCounter");
  const emptyState = document.getElementById("emptyResultsBox");

  const gridViewBtn = document.getElementById("gridViewBtn");
  const tableViewBtn = document.getElementById("tableViewBtn");
  const gridContainer = document.getElementById("projectsGridView");
  const tableContainer = document.getElementById("projectsTableView");

  let currentCategory = "all";
  let currentStudentYear = "all";
  let searchQuery = "";

  // Helper: safely play shared audio sounds from main.js
  function wakeAudio() {
    if (window.siteAudio && window.siteAudio.wake) {
      window.siteAudio.wake();
    }
  }

  function playScrollTick(vol) {
    if (window.siteAudio && window.siteAudio.playScrollTick) {
      window.siteAudio.playScrollTick(vol);
    }
  }

  function playGlassTap() {
    if (window.siteAudio && window.siteAudio.playGlassTap) {
      window.siteAudio.playGlassTap();
    }
  }

  // =========================================================================
  // 1. Live Search Word Highlighting Helpers
  // =========================================================================
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Save original plain text on all highlightable elements once on load
  const cardHighlightSelectors = [
    ".project-heading",
    ".project-synopsis",
    ".pill-badge",
    ".student-year-badge",
    ".stack-mini-pill",
    ".author-meta-box strong",
    ".author-meta-box span"
  ];

  const cardHighlightNodes = [];
  projectCards.forEach(function (card) {
    const nodes = [];
    cardHighlightSelectors.forEach(function (sel) {
      card.querySelectorAll(sel).forEach(function (el) {
        el.dataset.originalText = el.textContent;
        nodes.push(el);
      });
    });
    cardHighlightNodes.push(nodes);
  });

  const rowHighlightNodes = [];
  tableRows.forEach(function (row) {
    const nodes = [];
    const selectors = [
      "td:nth-child(1) strong",
      "td:nth-child(2) .pill-badge",
      "td:nth-child(3) .student-year-badge",
      "td:nth-child(4)",
      "td:nth-child(5)",
      "td:nth-child(6) span"
    ];
    selectors.forEach(function (sel) {
      const el = row.querySelector(sel);
      if (el) {
        el.dataset.originalText = el.textContent;
        nodes.push(el);
      }
    });
    rowHighlightNodes.push(nodes);
  });

  // Highlight all matching search words inside a list of text elements
  function applyHighlightsToNodes(nodes, terms) {
    if (!terms || terms.length === 0) {
      nodes.forEach(function (el) {
        el.textContent = el.dataset.originalText || "";
        el.classList.remove("has-match");
      });
      return;
    }

    // Sort longest terms first so partial matches don't break longer matches
    const sortedTerms = terms.slice().sort(function (a, b) { return b.length - a.length; });
    const pattern = new RegExp("(" + sortedTerms.map(escapeRegex).join("|") + ")", "gi");

    nodes.forEach(function (el) {
      const original = el.dataset.originalText || "";
      const escaped = escapeHtml(original);
      let matched = false;

      const highlighted = escaped.replace(pattern, function (match) {
        matched = true;
        return '<mark class="search-highlight">' + match + "</mark>";
      });

      el.innerHTML = highlighted;
      if (el.classList.contains("stack-mini-pill")) {
        el.classList.toggle("has-match", matched);
      }
    });
  }

  // Check if there is a search term in the URL query string (e.g. ?q=iot)
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q");
  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
    searchQuery = initialQuery.toLowerCase().trim();
  }

  // Toggle between Grid View and Table View
  if (gridViewBtn && tableViewBtn && gridContainer && tableContainer) {
    gridViewBtn.addEventListener("click", function () {
      gridViewBtn.classList.add("active");
      tableViewBtn.classList.remove("active");
      gridContainer.style.display = "grid";
      tableContainer.style.display = "none";
      playGlassTap();
    });

    tableViewBtn.addEventListener("click", function () {
      tableViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
      gridContainer.style.display = "none";
      tableContainer.style.display = "block";
      playGlassTap();
    });
  }

  // =========================================================================
  // 2. Filter & Highlight Function (Grid Cards + Table Rows)
  // =========================================================================
  function filterProjects() {
    let visibleCount = 0;
    const terms = searchQuery ? searchQuery.split(/\s+/).filter(Boolean) : [];

    // Filter & highlight project cards in grid view
    projectCards.forEach(function (card, cardIdx) {
      const category = card.getAttribute("data-category") || "";
      const year = card.getAttribute("data-year") || "";
      const nodes = cardHighlightNodes[cardIdx];

      // Build searchable combined text from saved original text
      let combinedText = "";
      nodes.forEach(function (el) {
        combinedText += (el.dataset.originalText || "").toLowerCase() + " ";
      });

      const matchCategory = (currentCategory === "all") || (category === currentCategory);
      const matchYear = (currentStudentYear === "all") || (year === currentStudentYear);
      const matchSearch = terms.length === 0 || terms.every(function (word) {
        return combinedText.includes(word);
      });

      if (matchCategory && matchYear && matchSearch) {
        card.style.display = "flex";
        visibleCount++;
        applyHighlightsToNodes(nodes, terms);
      } else {
        card.style.display = "none";
        applyHighlightsToNodes(nodes, []);
      }
    });

    // Filter & highlight table rows in table view
    tableRows.forEach(function (row, rowIdx) {
      const category = row.getAttribute("data-category") || "";
      const year = row.getAttribute("data-year") || "";
      const nodes = rowHighlightNodes[rowIdx];

      let combinedText = "";
      nodes.forEach(function (el) {
        combinedText += (el.dataset.originalText || "").toLowerCase() + " ";
      });

      const matchCategory = (currentCategory === "all") || (category === currentCategory);
      const matchYear = (currentStudentYear === "all") || (year === currentStudentYear);
      const matchSearch = terms.length === 0 || terms.every(function (word) {
        return combinedText.includes(word);
      });

      if (matchCategory && matchYear && matchSearch) {
        row.style.display = "";
        applyHighlightsToNodes(nodes, terms);
      } else {
        row.style.display = "none";
        applyHighlightsToNodes(nodes, []);
      }
    });

    // Update results counter text
    if (resultsCounter) {
      let summary = "Showing " + visibleCount + " project" + (visibleCount === 1 ? "" : "s");
      if (currentStudentYear !== "all") {
        const yearLabels = { "1": "1st Year", "2": "2nd Year", "3": "3rd Year", "4": "Final Year" };
        summary += " (" + (yearLabels[currentStudentYear] || currentStudentYear) + ")";
      }
      if (terms.length > 0) {
        summary += ' matching "' + searchInput.value.trim() + '"';
      }
      resultsCounter.textContent = summary;
    }

    // Show empty state if no project matches
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = "block";
        if (gridContainer) gridContainer.style.display = "none";
        if (tableContainer) tableContainer.style.display = "none";
      } else {
        emptyState.style.display = "none";
        if (gridViewBtn && gridViewBtn.classList.contains("active") && gridContainer) {
          gridContainer.style.display = "grid";
        } else if (tableViewBtn && tableViewBtn.classList.contains("active") && tableContainer) {
          tableContainer.style.display = "block";
        }
      }
    }
  }

  // Handle Student Year filter pills
  const yearFilterPills = document.querySelectorAll(".year-filter-pill");
  if (yearFilterPills.length > 0) {
    yearFilterPills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        const targetYear = pill.getAttribute("data-year") || "all";
        if (targetYear === currentStudentYear) return;
        currentStudentYear = targetYear;
        yearFilterPills.forEach(function (p) {
          const isActive = p === pill;
          p.classList.toggle("active", isActive);
          p.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        playGlassTap();
        filterProjects();
      });
    });
  }

  // Handle typing in the search box
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      searchQuery = e.target.value.toLowerCase().trim();
      filterProjects();
    });
  }

  // =========================================================================
  // 3. Infinite Clear-Text Category Slider (Same Flywheel Physics & Sound)
  // Zero fade, zero distance shrink — every category text stays 100% clear!
  // =========================================================================
  const catViewport = document.getElementById("categorySliderViewport");
  const catCenterPill = document.getElementById("categoryCenterPill");
  const catPrevBtn = document.getElementById("catSliderPrev");
  const catNextBtn = document.getElementById("catSliderNext");
  const catItems = Array.from(document.querySelectorAll(".category-slider-item"));
  const totalSlots = catItems.length; // 8 slots (2 seamless cycles of 4 categories)

  let catVirtualPos = 0; // Unbounded continuous position
  const catLastRel = new Array(totalSlots).fill(0);
  let catResetToAllFn = null;

  if (catViewport && totalSlots > 0) {
    function wrapSlot(n) {
      return ((n % totalSlots) + totalSlots) % totalSlots;
    }

    function getCatSlotSize() {
      const vpW = catViewport.offsetWidth || 560;
      return vpW < 380 ? 136 : 154;
    }

    // Wrapped offset in [-totalSlots/2, +totalSlots/2) i.e. [-4, +4)
    function getCatWrappedRel(slotIdx, vPos) {
      let rel = ((slotIdx - vPos) % totalSlots + totalSlots) % totalSlots;
      if (rel >= totalSlots / 2) {
        rel -= totalSlots;
      }
      return rel;
    }

    // Apply live filter whenever the centered category changes
    function syncCategoryFromPos(vPos) {
      const centerSlot = wrapSlot(Math.round(vPos));
      const newCat = catItems[centerSlot] ? (catItems[centerSlot].getAttribute("data-filter") || "all") : "all";
      if (newCat !== currentCategory) {
        currentCategory = newCat;
        filterProjects();
      }
    }

    // Render all 8 category slots cleanly — 100% clear opacity, NO fade, NO distance shrink!
    function renderCategorySlider(vPos, shouldAnimate) {
      const slotSize = getCatSlotSize();
      const nearestSlot = wrapSlot(Math.round(vPos));

      catItems.forEach(function (item, idx) {
        const rel = getCatWrappedRel(idx, vPos);
        const prevRel = catLastRel[idx];
        catLastRel[idx] = rel;

        const pixelX = rel * slotSize;
        const crossedSeam = Math.abs(rel - prevRel) > (totalSlots / 2 - 0.6);

        if (shouldAnimate && !crossedSeam) {
          item.style.transition = "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), color 0.18s ease";
        } else {
          item.style.transition = "none";
        }

        // Keep scale(1) and opacity: 1 always — crisp, clear, uniform text
        item.style.transform = "translate3d(calc(-50% + " + pixelX.toFixed(1) + "px), -50%, 0)";
        item.classList.toggle("is-center", Math.abs(rel) < 0.45);
      });

      if (catCenterPill && catItems[nearestSlot]) {
        const w = catItems[nearestSlot].offsetWidth;
        if (w > 0) {
          catCenterPill.style.width = (w + 10) + "px";
        }
      }
    }

    // Seed initial positions cleanly
    catItems.forEach(function (_, idx) {
      catLastRel[idx] = getCatWrappedRel(idx, catVirtualPos);
    });
    renderCategorySlider(catVirtualPos, false);
    setTimeout(function () {
      renderCategorySlider(catVirtualPos, false);
    }, 60);

    catViewport.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    // Flywheel Inertia / Momentum Loop (identical feel to nav slider!)
    let momRafId = null;
    let momVel = 0;
    let momPhase = "idle"; // "idle" | "coast" | "snap"
    let momSnapTarget = 0;
    let momLastTime = 0;
    let momPixelAccum = 0;
    let momLastSlot = Math.round(catVirtualPos);
    let momHadMotion = false;

    function stopCatMomentum() {
      if (momRafId !== null) {
        cancelAnimationFrame(momRafId);
        momRafId = null;
      }
      momVel = 0;
      momPhase = "idle";
      momPixelAccum = 0;
    }

    function runCatMomentumFrame(timestamp) {
      const dt = Math.min(0.05, Math.max(0.001, (timestamp - momLastTime) / 1000));
      momLastTime = timestamp;

      const slotSize = getCatSlotSize();

      if (momPhase === "coast") {
        const deltaSlots = momVel * dt;
        catVirtualPos += deltaSlots;

        if (Math.abs(deltaSlots) > 0.0001) {
          momHadMotion = true;
        }

        const tickStepPx = 18;
        momPixelAccum += Math.abs(deltaSlots) * slotSize;
        if (momPixelAccum >= tickStepPx) {
          const speedVol = Math.min(1.05, Math.max(0.68, Math.abs(momVel) / 6));
          playScrollTick(speedVol);
          momPixelAccum = momPixelAccum % tickStepPx;
        }

        const currentSlot = Math.round(catVirtualPos);
        if (currentSlot !== momLastSlot) {
          playScrollTick(1.08);
          momLastSlot = currentSlot;
          // Note: Only play acoustics during coasting; do not trigger DOM reflow/re-filtering
          // until momentum settles into snapTarget to prevent scroll jitter and viewport jumping.
        }

        // Smooth real-life friction slowdown
        momVel *= Math.exp(-3.2 * dt);
        renderCategorySlider(catVirtualPos, false);

        if (Math.abs(momVel) < 0.65) {
          momPhase = "snap";
          momSnapTarget = Math.round(catVirtualPos);
        }

        momRafId = requestAnimationFrame(runCatMomentumFrame);
      } else if (momPhase === "snap") {
        const diff = momSnapTarget - catVirtualPos;
        catVirtualPos += diff * Math.min(1, dt * 16);

        if (Math.abs(momSnapTarget - catVirtualPos) < 0.004) {
          catVirtualPos = momSnapTarget;
          renderCategorySlider(catVirtualPos, false);
          syncCategoryFromPos(catVirtualPos);

          const shouldTap = momHadMotion;
          stopCatMomentum();
          if (shouldTap) {
            playGlassTap();
          }
          return;
        }

        renderCategorySlider(catVirtualPos, false);
        momRafId = requestAnimationFrame(runCatMomentumFrame);
      }
    }

    function launchCatMomentum(initialVel, hadMotion) {
      stopCatMomentum();
      const MAX_VEL = 28;
      momVel = Math.max(-MAX_VEL, Math.min(MAX_VEL, initialVel));
      momHadMotion = Boolean(hadMotion) || Math.abs(momVel) > 0.1;
      momPixelAccum = 0;
      momLastSlot = Math.round(catVirtualPos);
      momLastTime = performance.now();

      if (Math.abs(momVel) >= 0.7) {
        momPhase = "coast";
      } else {
        momPhase = "snap";
        momSnapTarget = Math.round(catVirtualPos);
      }

      momRafId = requestAnimationFrame(runCatMomentumFrame);
    }

    function slideCategoryTo(targetVirtual, playSounds) {
      stopCatMomentum();
      const roundedTarget = Math.round(targetVirtual);
      const steps = Math.max(1, Math.round(Math.abs(roundedTarget - catVirtualPos)));
      catVirtualPos = roundedTarget;
      renderCategorySlider(catVirtualPos, true);
      syncCategoryFromPos(catVirtualPos);

      if (playSounds !== false) {
        playScrollTick(0.9);
        if (steps >= 2) {
          setTimeout(function () { playScrollTick(1.0); }, 42);
          setTimeout(function () { playGlassTap(); }, 92);
        } else {
          setTimeout(function () { playGlassTap(); }, 48);
        }
      }
    }

    // Pointer Drag & Touch Swipe with velocity sampling
    let isDraggingCat = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let lastTickX = 0;
    let lastSlotDragged = Math.round(catVirtualPos);
    let hasCatDragged = false;
    let dragSamples = [];

    function onCatDragStart(clientX) {
      stopCatMomentum();
      wakeAudio();
      const nowMs = performance.now();
      isDraggingCat = true;
      hasCatDragged = false;
      dragStartX = clientX;
      dragStartPos = catVirtualPos;
      lastTickX = clientX;
      lastSlotDragged = Math.round(catVirtualPos);
      dragSamples = [{ t: nowMs, x: clientX }];
      catViewport.classList.add("is-dragging");
    }

    function onCatDragMove(clientX, eventObj) {
      if (!isDraggingCat) return;

      const rawDelta = clientX - dragStartX;
      const nowMs = performance.now();
      const slotSize = getCatSlotSize();

      if (Math.abs(rawDelta) > 4) {
        hasCatDragged = true;
      }
      if (hasCatDragged && eventObj && eventObj.cancelable) {
        eventObj.preventDefault();
      }

      dragSamples.push({ t: nowMs, x: clientX });
      while (dragSamples.length > 2 && nowMs - dragSamples[0].t > 95) {
        dragSamples.shift();
      }

      catVirtualPos = dragStartPos - (rawDelta / slotSize);

      if (Math.abs(clientX - lastTickX) >= 16) {
        playScrollTick(0.95);
        lastTickX = clientX;
      }

      const curSlot = Math.round(catVirtualPos);
      if (curSlot !== lastSlotDragged) {
        playScrollTick(1.12);
        lastSlotDragged = curSlot;
        syncCategoryFromPos(catVirtualPos);
      }

      renderCategorySlider(catVirtualPos, false);
    }

    function onCatDragEnd() {
      if (!isDraggingCat) return;
      isDraggingCat = false;
      catViewport.classList.remove("is-dragging");

      const slotSize = getCatSlotSize();
      const nowMs = performance.now();
      let releaseVel = 0;

      if (dragSamples.length >= 2) {
        const newest = dragSamples[dragSamples.length - 1];
        const oldest = dragSamples[0];
        const dtSec = (newest.t - oldest.t) / 1000;
        const idleMs = nowMs - newest.t;
        if (dtSec > 0.005 && idleMs < 75) {
          releaseVel = -((newest.x - oldest.x) / dtSec) / slotSize;
        }
      }

      const moved = hasCatDragged;
      dragSamples = [];

      if (moved) {
        launchCatMomentum(releaseVel, true);
      } else {
        catVirtualPos = Math.round(catVirtualPos);
        renderCategorySlider(catVirtualPos, true);
      }

      setTimeout(function () {
        hasCatDragged = false;
      }, 60);
    }

    // Mouse listeners
    catViewport.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      onCatDragStart(e.clientX);
    });

    window.addEventListener("mousemove", function (e) {
      if (!isDraggingCat) return;
      onCatDragMove(e.clientX, e);
    });

    window.addEventListener("mouseup", onCatDragEnd);
    window.addEventListener("blur", onCatDragEnd);
    document.addEventListener("mouseleave", onCatDragEnd);

    // Touch listeners (scoped to slider viewport so normal page scrolling never blocks compositor thread)
    catViewport.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        onCatDragStart(e.touches[0].clientX);
      }
    }, { passive: true });

    catViewport.addEventListener("touchmove", function (e) {
      if (!isDraggingCat || e.touches.length !== 1) return;
      onCatDragMove(e.touches[0].clientX, e);
    }, { passive: false });

    catViewport.addEventListener("touchend", onCatDragEnd);
    catViewport.addEventListener("touchcancel", onCatDragEnd);

    // Direct click on any category item -> slides smoothly to center & filters
    catItems.forEach(function (item, idx) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        if (hasCatDragged) return;

        const base = Math.round(catVirtualPos);
        const rel = getCatWrappedRel(idx, base);
        const targetVirtual = base + Math.round(rel);

        if (targetVirtual !== base) {
          slideCategoryTo(targetVirtual, true);
        } else {
          catVirtualPos = base;
          renderCategorySlider(catVirtualPos, true);
          playGlassTap();
        }
      });
    });

    // Arrow buttons
    if (catPrevBtn) {
      catPrevBtn.addEventListener("click", function () {
        slideCategoryTo(Math.round(catVirtualPos) - 1, true);
      });
    }

    if (catNextBtn) {
      catNextBtn.addEventListener("click", function () {
        slideCategoryTo(Math.round(catVirtualPos) + 1, true);
      });
    }

    // Horizontal Trackpad / Shift+Wheel Flywheel Momentum
    // Lets normal vertical page scrolling pass through cleanly without accidentally switching categories!
    catViewport.addEventListener("wheel", function (e) {
      const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontalScroll && !e.shiftKey) {
        return; // Never hijack normal vertical page scroll
      }

      e.preventDefault();
      const delta = isHorizontalScroll ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 1) return;

      wakeAudio();
      const dir = delta > 0 ? 1 : -1;
      const impulse = Math.abs(delta) >= 50 ? dir * 3.65 : dir * Math.max(0.7, Math.abs(delta) * 0.085);
      const newVel = Math.max(-28, Math.min(28, momVel + impulse));

      if (momRafId !== null) {
        momVel = newVel;
        momPhase = "coast";
        momHadMotion = true;
      } else {
        launchCatMomentum(newVel, true);
      }
    }, { passive: false });

    // Keyboard Arrow navigation
    catViewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        slideCategoryTo(Math.round(catVirtualPos) - 1, true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        slideCategoryTo(Math.round(catVirtualPos) + 1, true);
      }
    });

    // Resize recalculation
    window.addEventListener("resize", function () {
      stopCatMomentum();
      isDraggingCat = false;
      catVirtualPos = Math.round(catVirtualPos);
      renderCategorySlider(catVirtualPos, false);
    });

    // Expose smooth reset to "All Projects" for the Clear Search button
    catResetToAllFn = function () {
      const base = Math.round(catVirtualPos);
      // Find nearest "all" slot across all cycles (0, 4, 8, ...)
      let shortestRel = getCatWrappedRel(0, base);
      for (let i = 4; i < totalSlots; i += 4) {
        const candidate = getCatWrappedRel(i, base);
        if (Math.abs(candidate) < Math.abs(shortestRel)) {
          shortestRel = candidate;
        }
      }
      slideCategoryTo(base + Math.round(shortestRel), true);
    };
  }

  // Reset search button inside empty state box
  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", function () {
      searchInput.value = "";
      searchQuery = "";
      currentCategory = "all";
      if (catResetToAllFn) {
        catResetToAllFn();
      }
      filterProjects();
      searchInput.focus();
    });
  }

  // Run initial filter & highlight on page load (handles ?q=... links from home page too!)
  filterProjects();
});
