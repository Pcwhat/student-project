/* 
   Web Designing Project (DCSE0152) - Capstone Showcase
   Group 08 | NIET Greater Noida
   Gallery JavaScript (gallery.js)
   Features:
   - Infinite Mechanical Aperture Slider for Filtering (All, IoT, Web, Sensors)
   - Real-time diagram grid filtering with dynamic count badge
   - Flywheel momentum, dragging, wheel scroll, and synthesized ratchet sounds
   - Circuit component specification modal popup
*/

document.addEventListener("DOMContentLoaded", function () {
  const cards = Array.from(document.querySelectorAll(".gallery-card"));
  const counterEl = document.getElementById("galleryFilterCounter");
  const modalOverlay = document.getElementById("specModalOverlay");
  const modalTitle = document.getElementById("modalSpecTitle");
  const modalDesc = document.getElementById("modalSpecDesc");
  const modalStack = document.getElementById("modalSpecStack");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const triggerBtns = document.querySelectorAll(".spec-trigger-btn");

  // =========================================================================
  // 1. Mechanical Aperture Category Filter Slider
  // =========================================================================
  const viewport = document.getElementById("gallerySliderViewport");
  const centerPill = document.getElementById("gallerySliderCenterPill");
  const prevBtn = document.getElementById("gallerySliderPrev");
  const nextBtn = document.getElementById("gallerySliderNext");
  const sliderItems = Array.from(document.querySelectorAll(".gallery-slider-item"));

  const totalItems = sliderItems.length;
  let virtualPos = 0; // Unbounded position: 0="all", 1="iot", 2="web", 3="sensors"
  let currentActiveCategory = "all";
  const lastRelPositions = new Array(totalItems).fill(0);

  function playTick(vol) {
    if (window.siteAudio && window.siteAudio.playScrollTick) {
      window.siteAudio.playScrollTick(vol || 0.9);
    }
  }

  function playLatch() {
    if (window.siteAudio && window.siteAudio.playGlassTap) {
      window.siteAudio.playGlassTap();
    }
  }

  function wrapIndex(n) {
    return ((n % totalItems) + totalItems) % totalItems;
  }

  function getSlotSpacing() {
    const vpWidth = (viewport && viewport.offsetWidth) || 440;
    // Spacing between items on the circular track
    return Math.max(120, Math.round(vpWidth * 0.36));
  }

  function getWrappedRelativeOffset(itemIdx, vPos) {
    let rel = ((itemIdx - vPos) % totalItems + totalItems) % totalItems;
    if (rel >= totalItems / 2) {
      rel -= totalItems;
    }
    return rel;
  }

  function getOpacityForRel(absRel) {
    if (absRel <= 1) {
      return 1 - absRel * 0.48; // 1.00 -> 0.52
    } else {
      return Math.max(0, 0.52 - (absRel - 1) * 0.52); // fades to 0 before wrap seam
    }
  }

  function getScaleForRel(absRel) {
    return Math.max(0.82, 1 - absRel * 0.08);
  }

  // Filter gallery cards in real time
  function applyFilter(category) {
    if (category === currentActiveCategory) return;
    currentActiveCategory = category;

    let visibleCount = 0;
    cards.forEach(function (card) {
      const cardCat = card.getAttribute("data-category") || "";
      if (category === "all" || cardCat === category) {
        card.style.display = "flex";
        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";
        setTimeout(function () {
          card.style.transition = "opacity 0.28s ease, transform 0.28s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 15);
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (counterEl) {
      counterEl.textContent = "Showing " + visibleCount + (visibleCount === 1 ? " Diagram" : " Diagrams");
    }
  }

  function renderSlider(vPos, shouldAnimate) {
    if (!viewport || totalItems === 0) return;

    const slotSize = getSlotSpacing();
    const nearestIdx = wrapIndex(Math.round(vPos));

    sliderItems.forEach(function (item, idx) {
      const rel = getWrappedRelativeOffset(idx, vPos);
      const prevRel = lastRelPositions[idx];
      lastRelPositions[idx] = rel;

      const absRel = Math.abs(rel);
      const pixelPos = rel * slotSize;
      const opacityVal = getOpacityForRel(absRel);
      const scaleVal = getScaleForRel(absRel);

      const crossedSeam = Math.abs(rel - prevRel) > 1.9;

      if (shouldAnimate && !crossedSeam) {
        item.style.transition = "transform 0.25s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.25s ease, color 0.2s ease";
      } else {
        item.style.transition = "none";
      }

      item.style.transform = "translate3d(calc(-50% + " + pixelPos.toFixed(1) + "px), -50%, 0) scale(" + scaleVal.toFixed(3) + ")";
      item.style.opacity = opacityVal.toFixed(2);

      item.classList.remove("is-center", "is-neighbor-1", "is-neighbor-2");
      if (absRel < 0.45) {
        item.classList.add("is-center");
      } else if (absRel < 1.45) {
        item.classList.add("is-neighbor-1");
      } else {
        item.classList.add("is-neighbor-2");
      }
    });

    // Resize center highlight pill to fit centered label
    if (centerPill && sliderItems[nearestIdx]) {
      const textWidth = sliderItems[nearestIdx].offsetWidth;
      if (textWidth > 0) {
        centerPill.style.width = (textWidth + 24) + "px";
      }
    }
  }

  function slideTo(targetVirtual, playSound) {
    const roundedTarget = Math.round(targetVirtual);
    virtualPos = roundedTarget;
    renderSlider(virtualPos, true);

    if (playSound !== false) {
      playLatch();
    }

    const nearestIdx = wrapIndex(roundedTarget);
    const category = sliderItems[nearestIdx].getAttribute("data-filter") || "all";
    applyFilter(category);
  }

  if (viewport && totalItems > 0) {
    // Seed initial positions
    sliderItems.forEach(function (_, idx) {
      lastRelPositions[idx] = getWrappedRelativeOffset(idx, virtualPos);
    });
    renderSlider(virtualPos, false);
    setTimeout(function () {
      renderSlider(virtualPos, false);
    }, 60);

    // Arrow controls
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        playTick(1.0);
        slideTo(virtualPos - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        playTick(1.0);
        slideTo(virtualPos + 1);
      });
    }

    // Direct click on items
    sliderItems.forEach(function (item, idx) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        if (hasMovedDuringDrag) return;
        const rel = getWrappedRelativeOffset(idx, Math.round(virtualPos));
        if (Math.abs(rel) > 0.05) {
          playTick(0.95);
          slideTo(Math.round(virtualPos) + Math.round(rel));
        }
      });
    });

    // Mouse wheel horizontal rotation
    viewport.addEventListener("wheel", function (e) {
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 8) {
        e.preventDefault();
        const step = delta > 0 ? 1 : -1;
        playTick(0.85);
        slideTo(virtualPos + step);
      }
    }, { passive: false });

    // Keyboard navigation (ArrowLeft / ArrowRight)
    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        playTick(0.9);
        slideTo(virtualPos - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        playTick(0.9);
        slideTo(virtualPos + 1);
      }
    });

    // Pointer / Touch / Mouse Dragging with smooth inertia
    let isDragging = false;
    let hasMovedDuringDrag = false;
    let dragStartX = 0;
    let dragStartVirtual = 0;
    let lastDragX = 0;
    let lastDragTime = 0;
    let dragVelocity = 0;
    let lastTickX = 0;

    function onPointerDown(clientX) {
      isDragging = true;
      hasMovedDuringDrag = false;
      dragStartX = clientX;
      lastDragX = clientX;
      lastTickX = clientX;
      dragStartVirtual = virtualPos;
      lastDragTime = performance.now();
      dragVelocity = 0;
      viewport.classList.add("is-dragging");
    }

    function onPointerMove(clientX, eventObj) {
      if (!isDragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastDragTime);
      const dx = clientX - lastDragX;
      dragVelocity = (dx / dt) * 1000;
      lastDragX = clientX;
      lastDragTime = now;

      if (Math.abs(clientX - dragStartX) > 4) {
        hasMovedDuringDrag = true;
        if (eventObj && eventObj.cancelable) {
          eventObj.preventDefault();
        }
      }

      // Ratchet tick while dragging
      if (Math.abs(clientX - lastTickX) >= 18) {
        playTick(0.9);
        lastTickX = clientX;
      }

      const slotSize = getSlotSpacing();
      const totalMovedPx = clientX - dragStartX;
      virtualPos = dragStartVirtual - (totalMovedPx / slotSize);
      renderSlider(virtualPos, false);
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove("is-dragging");

      // Inertia flick calculation
      const slotSize = getSlotSpacing();
      const flickSlots = Math.max(-2, Math.min(2, Math.round(-dragVelocity / (slotSize * 3))));
      const targetVirtual = Math.round(virtualPos + flickSlots);
      slideTo(targetVirtual);

      setTimeout(function () {
        hasMovedDuringDrag = false;
      }, 60);
    }

    viewport.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      onPointerDown(e.clientX);
    });

    window.addEventListener("mousemove", function (e) {
      if (isDragging) onPointerMove(e.clientX, e);
    });

    window.addEventListener("mouseup", function () {
      if (isDragging) onPointerUp();
    });

    window.addEventListener("blur", function () {
      if (isDragging) onPointerUp();
    });

    document.addEventListener("mouseleave", function () {
      if (isDragging) onPointerUp();
    });

    // Touch support
    viewport.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener("touchmove", function (e) {
      if (isDragging && e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e);
      }
    }, { passive: false });

    window.addEventListener("touchend", function () {
      if (isDragging) onPointerUp();
    });

    window.addEventListener("touchcancel", function () {
      if (isDragging) onPointerUp();
    });

    // Prevent image / element native drag
    viewport.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    // Resize recalculation
    window.addEventListener("resize", function () {
      renderSlider(virtualPos, false);
    });
  }

  // =========================================================================
  // 2. Open specification modal popup
  // =========================================================================
  triggerBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const title = btn.getAttribute("data-title") || "Circuit Specification";
      const desc = btn.getAttribute("data-desc") || "Detailed circuit wiring and flow.";
      const stack = btn.getAttribute("data-stack") || "Hardware Components";

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalStack) modalStack.textContent = stack;

      if (modalOverlay) modalOverlay.classList.add("open");
    });
  });

  // =========================================================================
  // 3. Close modal popup
  // =========================================================================
  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener("click", function () {
      modalOverlay.classList.remove("open");
    });

    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove("open");
      }
    });
  }
});
