/* 
   Web Designing Project - Group 08 (NIET Greater Noida)
   Global JavaScript (main.js)
   Authors: Ashish Ranjan, Ashish Prajapati, Arunima Bhardwaj, Aryan, Ashmit Tiwari
   Features:
   - Smooth directional page-to-page glide transitions matching slider motion
   - True infinite circular center-focused slider navbar (Horizontal Desktop / Vertical Mobile)
   - Auto-snap to nearest text physics (never stops midway between two items)
   - Precision hard-metal / titanium acoustic synthesis via Web Audio API
   - Scroll reveal animation for sections and cards
*/

// =========================================================================
// 0. Smooth Page Entrance Glide (runs immediately before paint finishes)
// =========================================================================
(function initPageEntranceGlide() {
  try {
    const incomingDir = sessionStorage.getItem("navSlideDir");
    if (incomingDir === "next" || incomingDir === "prev") {
      const enterClass = incomingDir === "next" ? "page-enter-from-right" : "page-enter-from-left";
      document.body.classList.add(enterClass);
      sessionStorage.removeItem("navSlideDir");

      // Double requestAnimationFrame ensures browser commits starting offset before gliding to 0
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.body.classList.remove(enterClass);
        });
      });
    }
  } catch (e) {
    // Ignore if sessionStorage is unavailable
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  // Restore clean state if user returns via browser Back/Forward cache
  window.addEventListener("pageshow", function () {
    document.body.classList.remove("page-exit-next", "page-exit-prev", "page-enter-from-right", "page-enter-from-left");
  });

  // =========================================================================
  // 1. Web Audio API Razor-Crisp Hard Titanium / Steel Sound Synthesizer
  // Uses master DynamicsCompressor + inharmonic metallic modal frequencies
  // (1.9kHz - 9.8kHz) so every tick and latch hits like hardened steel.
  // =========================================================================
  let sharedAudioCtx = null;
  let masterCompressor = null;
  let cachedNoiseBuffer = null;
  let isSoundEnabled = localStorage.getItem("site_sound_enabled") !== "false";

  function setSoundEnabled(enabled) {
    isSoundEnabled = Boolean(enabled);
    try {
      localStorage.setItem("site_sound_enabled", isSoundEnabled ? "true" : "false");
    } catch (e) {}
  }

  // Instant Audio Pre-Warming (fires on touch/pointerdown 100-300ms before click, eliminating first-click latency)
  function warmUpAudioContext() {
    if (!isSoundEnabled) return;
    try {
      if (!sharedAudioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          sharedAudioCtx = new AudioContextClass();
          masterCompressor = sharedAudioCtx.createDynamicsCompressor();
          masterCompressor.threshold.setValueAtTime(-10, sharedAudioCtx.currentTime);
          masterCompressor.knee.setValueAtTime(12, sharedAudioCtx.currentTime);
          masterCompressor.ratio.setValueAtTime(6, sharedAudioCtx.currentTime);
          masterCompressor.attack.setValueAtTime(0.001, sharedAudioCtx.currentTime);
          masterCompressor.release.setValueAtTime(0.06, sharedAudioCtx.currentTime);
          masterCompressor.connect(sharedAudioCtx.destination);

          // Pre-generate shared metallic noise buffer once to avoid per-click buffer allocation
          const bufSize = Math.max(1, Math.floor(sharedAudioCtx.sampleRate * 0.05));
          cachedNoiseBuffer = sharedAudioCtx.createBuffer(1, bufSize, sharedAudioCtx.sampleRate);
          const data = cachedNoiseBuffer.getChannelData(0);
          for (let i = 0; i < bufSize; i++) {
            const env = Math.pow(1 - i / bufSize, 2.2);
            data[i] = (Math.random() * 2 - 1) * env;
          }
        }
      }
      if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
        sharedAudioCtx.resume().catch(function () {});
      }
    } catch (err) {}
  }

  // Attach non-blocking pre-warm listeners immediately
  window.addEventListener("pointerdown", warmUpAudioContext, { capture: true, passive: true, once: true });
  window.addEventListener("touchstart", warmUpAudioContext, { capture: true, passive: true, once: true });
  window.addEventListener("keydown", warmUpAudioContext, { capture: true, passive: true, once: true });

  function getAudioOutput() {
    if (!isSoundEnabled) return null;
    warmUpAudioContext();
    return sharedAudioCtx ? { ctx: sharedAudioCtx, dest: masterCompressor } : null;
  }

  // Helper: create a short high-frequency metallic noise spark burst using cached buffer
  function triggerMetalSpark(ctx, dest, startTime, durationSec, cutoffHz, gainAmount) {
    if (!cachedNoiseBuffer && ctx) {
      const bufSize = Math.max(1, Math.floor(ctx.sampleRate * 0.05));
      cachedNoiseBuffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = cachedNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        const env = Math.pow(1 - i / bufSize, 2.2);
        data[i] = (Math.random() * 2 - 1) * env;
      }
    }

    const src = ctx.createBufferSource();
    src.buffer = cachedNoiseBuffer;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(cutoffHz, startTime);

    const g = ctx.createGain();
    g.gain.setValueAtTime(gainAmount, startTime);
    g.gain.exponentialRampToValueAtTime(0.0008, startTime + durationSec);

    src.connect(hp);
    hp.connect(g);
    g.connect(dest);
    src.start(startTime);
    src.stop(startTime + durationSec + 0.002);
  }

  // Crisp steel ball-bearing ratchet tick while sliding continuously
  function playMetalRatchetTick(volumeScale) {
    try {
      const audio = getAudioOutput();
      if (!audio) return;

      const ctx = audio.ctx;
      const dest = audio.dest;
      const now = ctx.currentTime;
      const vol = typeof volumeScale === "number" ? volumeScale : 1.0;

      // Tiny natural pitch variation (+-3%) so rapid ticks sound like real machined gear teeth
      const jitter = 0.97 + Math.random() * 0.06;

      // 1. Razor-crisp steel pin strike
      const pinOsc = ctx.createOscillator();
      const pinGain = ctx.createGain();
      pinOsc.type = "sine";
      pinOsc.frequency.setValueAtTime(4600 * jitter, now);
      pinOsc.frequency.exponentialRampToValueAtTime(1950 * jitter, now + 0.009);

      pinGain.gain.setValueAtTime(0.32 * vol, now);
      pinGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.011);

      pinOsc.connect(pinGain);
      pinGain.connect(dest);
      pinOsc.start(now);
      pinOsc.stop(now + 0.013);

      // 2. High-register crystalline titanium ping
      const sheenOsc = ctx.createOscillator();
      const sheenGain = ctx.createGain();
      sheenOsc.type = "sine";
      sheenOsc.frequency.setValueAtTime(7900 * jitter, now);
      sheenOsc.frequency.exponentialRampToValueAtTime(5600 * jitter, now + 0.016);

      sheenGain.gain.setValueAtTime(0.18 * vol, now);
      sheenGain.gain.exponentialRampToValueAtTime(0.0006, now + 0.018);

      sheenOsc.connect(sheenGain);
      sheenGain.connect(dest);
      sheenOsc.start(now);
      sheenOsc.stop(now + 0.02);

      // 3. Crisp high-frequency metal contact spark (> 5200Hz)
      triggerMetalSpark(ctx, dest, now, 0.005, 5200, 0.28 * vol);
    } catch (err) {
      // Fail quietly if browser restricts audio playback
    }
  }

  // Helper: play a single clean damped tone
  function playTone(ctx, dest, type, startFreq, endFreq, startTime, durationSec, gainVal) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, startTime);
    if (endFreq !== startFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + durationSec);
    }
    g.gain.setValueAtTime(gainVal, startTime);
    g.gain.exponentialRampToValueAtTime(0.0006, startTime + durationSec);
    osc.connect(g);
    g.connect(dest);
    osc.start(startTime);
    osc.stop(startTime + durationSec + 0.004);
  }

  // Helper: play a crisp glass surface contact tap transient using cached buffer
  function playGlassContactClick(ctx, dest, startTime, durationSec, centerHz, qVal, gainVal) {
    if (!cachedNoiseBuffer && ctx) {
      const bufSize = Math.max(1, Math.floor(ctx.sampleRate * 0.05));
      cachedNoiseBuffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = cachedNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        const env = Math.pow(1 - i / bufSize, 2.2);
        data[i] = (Math.random() * 2 - 1) * env;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = cachedNoiseBuffer;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(centerHz, startTime);
    bp.Q.setValueAtTime(qVal, startTime);

    const g = ctx.createGain();
    g.gain.setValueAtTime(gainVal, startTime);
    g.gain.exponentialRampToValueAtTime(0.0008, startTime + durationSec);

    src.connect(bp);
    bp.connect(g);
    g.connect(dest);
    src.start(startTime);
    src.stop(startTime + durationSec + 0.003);
  }

  // Strong Solid Glass Tap Sound (Preset #9 enhanced for stronger, clearer tap-on-glass feel)
  function playHardMetalLatchSound() {
    try {
      const audio = getAudioOutput();
      if (!audio) return;

      const ctx = audio.ctx;
      const dest = audio.dest;
      const now = ctx.currentTime;

      // 1. Primary thick crystal glass resonance (strong, clear, smooth glass ring)
      playTone(ctx, dest, "sine", 1760, 1720, now, 0.058, 0.48);

      // 2. Clean 2nd & 3rd glass harmonic sparkle (authentic tempered glass clarity)
      playTone(ctx, dest, "sine", 3520, 3460, now, 0.036, 0.20);
      playTone(ctx, dest, "sine", 5220, 5140, now, 0.022, 0.08);

      // 3. Strong solid glass surface knock / impact body
      playTone(ctx, dest, "sine", 560, 270, now, 0.020, 0.48);

      // 4. Crisp initial fingertip/knuckle-on-glass strike transient
      playTone(ctx, dest, "sine", 2550, 1380, now, 0.008, 0.24);
      playGlassContactClick(ctx, dest, now, 0.005, 3600, 2.2, 0.24);
    } catch (err) {
      // Fail quietly if browser restricts audio playback
    }
  }

  // Share exact audio functions globally so other interactive sliders reuse the exact same sounds
  window.siteAudio = {
    wake: getAudioOutput,
    playScrollTick: playMetalRatchetTick,
    playGlassTap: playHardMetalLatchSound,
    isEnabled: function () {
      return isSoundEnabled;
    },
    setEnabled: setSoundEnabled
  };

  // =========================================================================
  // 2. Infinite Circular Center-Focused Interactive Slider Navigation
  // Uses a continuous unbounded virtualPos so scrolling/dragging loops
  // endlessly in both directions (last -> first and first -> last).
  // =========================================================================
  const mobileToggle = document.getElementById("mobileNavToggle");
  const mobileCurrentPageEl = document.getElementById("mobileCurrentPage");
  const navSliderNav = document.getElementById("navSliderNav");
  const viewport = document.getElementById("navSliderViewport");
  const centerPill = document.getElementById("navSliderCenterPill");
  const prevBtn = document.getElementById("navSliderPrev");
  const nextBtn = document.getElementById("navSliderNext");
  const sliderItems = Array.from(document.querySelectorAll(".nav-slider-item"));

  const totalItems = sliderItems.length;
  let initialPageIndex = 0;
  let virtualPos = 0; // Unbounded continuous position (0 = Home, 1 = Projects, ... 5 = Home, -1 = Contact)
  let isNavigating = false;

  // Store previous wrapped relative positions so seam-crossing items teleport invisibly behind edge mask
  const lastRelPositions = new Array(totalItems).fill(0);

  // Detect active page index from current URL
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  sliderItems.forEach(function (item, idx) {
    const pageName = item.getAttribute("data-page");
    if (pageName === currentPath || (currentPath === "" && pageName === "index.html")) {
      initialPageIndex = idx;
      virtualPos = idx;
    }
  });

  window.addEventListener("pageshow", function () {
    isNavigating = false;
    virtualPos = initialPageIndex;
    renderInfiniteSlider(virtualPos, false);
  });

  function isMobileMode() {
    return window.innerWidth <= 868;
  }

  // Pixel spacing per 1.0 slot unit
  function getSlotSpacing() {
    const mobile = isMobileMode();
    const vpWidth = (viewport && viewport.offsetWidth) || 540;
    const vpHeight = (viewport && viewport.offsetHeight) || 185;
    return {
      mobile: mobile,
      slotSize: mobile ? Math.round(vpHeight * 0.22) : Math.round(vpWidth * 0.23)
    };
  }

  // Wrap index cleanly into [0, totalItems - 1]
  function wrapIndex(n) {
    return ((n % totalItems) + totalItems) % totalItems;
  }

  // Continuous wrapped relative offset in [-totalItems/2, +totalItems/2) i.e. [-2.5, +2.5)
  function getWrappedRelativeOffset(itemIdx, vPos) {
    let rel = ((itemIdx - vPos) % totalItems + totalItems) % totalItems;
    if (rel >= totalItems / 2) {
      rel -= totalItems;
    }
    return rel;
  }

  // Smooth opacity curve that reaches 0 before the +-2.5 invisible wrap seam
  function getOpacityForRel(absRel) {
    if (absRel <= 1) {
      return 1 - absRel * 0.46; // 1.00 -> 0.54
    } else if (absRel <= 2) {
      return 0.54 - (absRel - 1) * 0.32; // 0.54 -> 0.22
    } else {
      return Math.max(0, 0.22 - (absRel - 2) * 0.65); // fades smoothly to 0 before +-2.35
    }
  }

  function getScaleForRel(absRel) {
    return Math.max(0.78, 1 - absRel * 0.08);
  }

  // Render all 5 items seamlessly along the infinite circular track
  function renderInfiniteSlider(vPos, shouldAnimate) {
    if (!viewport || totalItems === 0) return;

    const dims = getSlotSpacing();
    const mobile = dims.mobile;
    const slotSize = dims.slotSize;
    const nearestIdx = wrapIndex(Math.round(vPos));

    sliderItems.forEach(function (item, idx) {
      const rel = getWrappedRelativeOffset(idx, vPos);
      const prevRel = lastRelPositions[idx];
      lastRelPositions[idx] = rel;

      const absRel = Math.abs(rel);
      const pixelPos = rel * slotSize;
      const opacityVal = getOpacityForRel(absRel);
      const scaleVal = getScaleForRel(absRel);

      // If this item just crossed the invisible +-2.5 seam behind the mask, skip transition so it never flies across center
      const crossedSeam = Math.abs(rel - prevRel) > 2.4;

      if (shouldAnimate && !crossedSeam) {
        item.style.transition = "transform 0.26s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.26s ease, color 0.2s ease";
      } else {
        item.style.transition = "none";
      }

      if (mobile) {
        item.style.transform = "translate3d(-50%, calc(-50% + " + pixelPos.toFixed(1) + "px), 0) scale(" + scaleVal.toFixed(3) + ")";
      } else {
        item.style.transform = "translate3d(calc(-50% + " + pixelPos.toFixed(1) + "px), -50%, 0) scale(" + scaleVal.toFixed(3) + ")";
      }

      item.style.opacity = opacityVal.toFixed(2);

      // Highlight nearest centered item dynamically
      item.classList.remove("is-center", "is-neighbor-1", "is-neighbor-2");
      if (absRel < 0.45) {
        item.classList.add("is-center");
      } else if (absRel < 1.45) {
        item.classList.add("is-neighbor-1");
      } else {
        item.classList.add("is-neighbor-2");
      }
    });

    // Resize the center pill smoothly to match active text width on desktop
    if (centerPill && sliderItems[nearestIdx]) {
      if (mobile) {
        centerPill.style.width = "88%";
      } else {
        const textWidth = sliderItems[nearestIdx].offsetWidth;
        if (textWidth > 0) {
          centerPill.style.width = (textWidth + 16) + "px";
        }
      }
    }

    if (mobileCurrentPageEl && sliderItems[nearestIdx]) {
      mobileCurrentPageEl.textContent = sliderItems[nearestIdx].textContent.trim();
    }
  }

  // Smooth directional page exit & redirect matching slider motion
  function navigateWithSmoothGlide(targetIdx, directionSign) {
    if (isNavigating) return;

    const targetItem = sliderItems[targetIdx];
    const targetHref = targetItem ? targetItem.getAttribute("href") : null;
    if (!targetHref) return;

    isNavigating = true;
    const dirName = directionSign >= 0 ? "next" : "prev";

    try {
      sessionStorage.setItem("navSlideDir", dirName);
    } catch (e) {}

    // Smoothly glide the current page content out in the exact direction of the slider
    document.body.classList.add(dirName === "next" ? "page-exit-next" : "page-exit-prev");

    setTimeout(function () {
      window.location.href = targetHref;
    }, 130);
  }

  // Slide smoothly to a target virtual position (for direct clicks, arrows, keyboard)
  function slideToVirtualPos(targetVirtual, navigateAfterSlide, fromDragRelease) {
    if (isNavigating) return;

    const roundedTarget = Math.round(targetVirtual);
    const deltaSlots = roundedTarget - virtualPos;
    const directionSign = deltaSlots >= 0 ? 1 : -1;
    const stepsMoved = Math.max(1, Math.round(Math.abs(deltaSlots)));
    const targetIdx = wrapIndex(roundedTarget);

    virtualPos = roundedTarget;
    renderInfiniteSlider(virtualPos, true);

    if (fromDragRelease) {
      playHardMetalLatchSound();
    } else {
      playMetalRatchetTick(0.9);
      if (stepsMoved >= 2) {
        setTimeout(function () {
          playMetalRatchetTick(1.0);
        }, 42);
        setTimeout(function () {
          playHardMetalLatchSound();
        }, 95);
      } else {
        setTimeout(function () {
          playHardMetalLatchSound();
        }, 50);
      }
    }

    if (navigateAfterSlide && targetIdx !== initialPageIndex) {
      navigateWithSmoothGlide(targetIdx, directionSign);
    }
  }

  // Initial placement & infinite flywheel inertia physics
  if (viewport && totalItems > 0) {
    // Seed initial lastRelPositions cleanly so first paint has zero seam jump
    sliderItems.forEach(function (_, idx) {
      lastRelPositions[idx] = getWrappedRelativeOffset(idx, virtualPos);
    });
    renderInfiniteSlider(virtualPos, false);

    setTimeout(function () {
      renderInfiniteSlider(virtualPos, false);
    }, 60);

    // Block native browser link dragging so mouseup can NEVER be lost mid-drag
    viewport.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    // =======================================================================
    // Real-Life Flywheel Momentum & Inertia Physics Engine (60fps rAF)
    // =======================================================================
    let momentumRafId = null;
    let momentumVel = 0; // Slots per second
    let momentumPhase = "idle"; // "idle" | "coast" | "snap"
    let momentumSnapTarget = 0;
    let momentumLastTime = 0;
    let momentumDirSign = 1;
    let momentumPixelAccum = 0;
    let momentumLastSlot = Math.round(virtualPos);
    let momentumMovedAny = false;

    function stopMomentumSpin() {
      if (momentumRafId !== null) {
        cancelAnimationFrame(momentumRafId);
        momentumRafId = null;
      }
      momentumVel = 0;
      momentumPhase = "idle";
      momentumPixelAccum = 0;
    }

    function runMomentumFrame(timestamp) {
      if (isNavigating) {
        stopMomentumSpin();
        return;
      }

      const dt = Math.min(0.05, Math.max(0.001, (timestamp - momentumLastTime) / 1000));
      momentumLastTime = timestamp;

      const dims = getSlotSpacing();

      if (momentumPhase === "coast") {
        // Move slider by current flywheel velocity
        const deltaSlots = momentumVel * dt;
        virtualPos += deltaSlots;

        if (Math.abs(deltaSlots) > 0.0001) {
          momentumMovedAny = true;
          momentumDirSign = deltaSlots >= 0 ? 1 : -1;
        }

        // Play continuous steel ticks that naturally slow down as friction decelerates the wheel
        const tickStepPx = dims.mobile ? 14 : 18;
        momentumPixelAccum += Math.abs(deltaSlots) * dims.slotSize;
        if (momentumPixelAccum >= tickStepPx) {
          const speedVol = Math.min(1.05, Math.max(0.68, Math.abs(momentumVel) / 6));
          playMetalRatchetTick(speedVol);
          momentumPixelAccum = momentumPixelAccum % tickStepPx;
        }

        // Subtle detent emphasis whenever a new page text passes center
        const currentSlot = Math.round(virtualPos);
        if (currentSlot !== momentumLastSlot) {
          playMetalRatchetTick(1.08);
          momentumLastSlot = currentSlot;
        }

        // Realistic smooth exponential friction deceleration (slows down smoothly over time)
        const FRICTION_K = 3.2;
        momentumVel *= Math.exp(-FRICTION_K * dt);

        renderInfiniteSlider(virtualPos, false);

        // Once wheel slows down near halt, transition seamlessly into magnetic detent snap
        if (Math.abs(momentumVel) < 0.65) {
          momentumPhase = "snap";
          momentumSnapTarget = Math.round(virtualPos);
        }

        momentumRafId = requestAnimationFrame(runMomentumFrame);
      } else if (momentumPhase === "snap") {
        // Smooth magnetic pull directly into exact center of nearest page text
        const diff = momentumSnapTarget - virtualPos;
        virtualPos += diff * Math.min(1, dt * 16);

        if (Math.abs(momentumSnapTarget - virtualPos) < 0.004) {
          // Locked dead-center!
          virtualPos = momentumSnapTarget;
          renderInfiniteSlider(virtualPos, false);

          const stoppedIdx = wrapIndex(momentumSnapTarget);
          const dirToUse = momentumDirSign;
          const hadMotion = momentumMovedAny;

          stopMomentumSpin();

          if (stoppedIdx !== initialPageIndex) {
            playHardMetalLatchSound();
            navigateWithSmoothGlide(stoppedIdx, dirToUse);
          } else if (hadMotion) {
            playHardMetalLatchSound();
          }
          return;
        }

        renderInfiniteSlider(virtualPos, false);
        momentumRafId = requestAnimationFrame(runMomentumFrame);
      }
    }

    function launchMomentumSpin(initialVelSlotsPerSec, fallbackDirSign, hadDragMotion) {
      stopMomentumSpin();

      const MAX_VEL = 28;
      momentumVel = Math.max(-MAX_VEL, Math.min(MAX_VEL, initialVelSlotsPerSec));
      momentumDirSign = momentumVel !== 0 ? (momentumVel > 0 ? 1 : -1) : (fallbackDirSign || 1);
      momentumMovedAny = Boolean(hadDragMotion) || Math.abs(momentumVel) > 0.1;
      momentumPixelAccum = 0;
      momentumLastSlot = Math.round(virtualPos);
      momentumLastTime = performance.now();

      if (Math.abs(momentumVel) >= 0.7) {
        momentumPhase = "coast";
      } else {
        momentumPhase = "snap";
        momentumSnapTarget = Math.round(virtualPos);
      }

      momentumRafId = requestAnimationFrame(runMomentumFrame);
    }

    // Infinite Drag & Swipe State with Velocity Sampling
    let isPointerDown = false;
    let dragStartCoord = 0;
    let dragStartVirtualPos = 0;
    let lastTickCoord = 0;
    let lastSnappedSlot = Math.round(virtualPos);
    let lastRawDelta = 0;
    let hasDragged = false;
    let pointerSamples = [];

    function handleDragStart(clientX, clientY) {
      if (isNavigating) return;
      // Catch/stop any active flywheel spin immediately when user grabs the slider
      stopMomentumSpin();
      getAudioOutput();

      const nowMs = performance.now();
      const coord = isMobileMode() ? clientY : clientX;

      isPointerDown = true;
      hasDragged = false;
      lastRawDelta = 0;
      dragStartCoord = coord;
      dragStartVirtualPos = virtualPos;
      lastTickCoord = coord;
      lastSnappedSlot = Math.round(virtualPos);
      pointerSamples = [{ t: nowMs, coord: coord }];
      viewport.classList.add("is-dragging");
    }

    function handleDragMove(clientX, clientY, eventObj) {
      if (!isPointerDown || isNavigating) return;

      const dims = getSlotSpacing();
      const currentCoord = dims.mobile ? clientY : clientX;
      const rawDelta = currentCoord - dragStartCoord;
      const nowMs = performance.now();
      lastRawDelta = rawDelta;

      if (Math.abs(rawDelta) > 4) {
        hasDragged = true;
      }

      if (hasDragged && eventObj && eventObj.cancelable) {
        eventObj.preventDefault();
      }

      // Record recent pointer samples (last 95ms) to calculate true release throw velocity
      pointerSamples.push({ t: nowMs, coord: currentCoord });
      while (pointerSamples.length > 2 && nowMs - pointerSamples[0].t > 95) {
        pointerSamples.shift();
      }

      // Unbounded infinite scroll: drag left/up increases virtualPos forever, right/down decreases forever
      virtualPos = dragStartVirtualPos - (rawDelta / dims.slotSize);

      // Continuous steel ratchet ticks every few pixels of motion
      const tickStep = dims.mobile ? 12 : 16;
      if (Math.abs(currentCoord - lastTickCoord) >= tickStep) {
        playMetalRatchetTick(0.95);
        lastTickCoord = currentCoord;
      }

      // Tactile emphasis tick whenever a new page text crosses into the center pill
      const currentSlot = Math.round(virtualPos);
      if (currentSlot !== lastSnappedSlot) {
        playMetalRatchetTick(1.15);
        lastSnappedSlot = currentSlot;
      }

      renderInfiniteSlider(virtualPos, false);
    }

    // On Release: Launch smooth flywheel momentum based on throw speed, then auto-snap where it stops!
    function handleDragEnd() {
      if (!isPointerDown) return;
      isPointerDown = false;
      viewport.classList.remove("is-dragging");

      const dims = getSlotSpacing();
      const nowMs = performance.now();

      // Compute release velocity in slots/sec from recent pointer history
      let releaseVelSlotsPerSec = 0;
      if (pointerSamples.length >= 2) {
        const newest = pointerSamples[pointerSamples.length - 1];
        const oldest = pointerSamples[0];
        const dtSec = (newest.t - oldest.t) / 1000;
        const idleSinceLastMove = nowMs - newest.t;

        // If user did not pause completely before lifting hand, transfer momentum into flywheel!
        if (dtSec > 0.005 && idleSinceLastMove < 75) {
          const pxPerSec = (newest.coord - oldest.coord) / dtSec;
          releaseVelSlotsPerSec = -pxPerSec / dims.slotSize;
        }
      }

      const dirFallback = lastRawDelta <= 0 ? 1 : -1;
      const movedDuringDrag = hasDragged;
      pointerSamples = [];

      if (movedDuringDrag) {
        launchMomentumSpin(releaseVelSlotsPerSec, dirFallback, true);
      } else {
        virtualPos = Math.round(virtualPos);
        renderInfiniteSlider(virtualPos, true);
      }

      setTimeout(function () {
        hasDragged = false;
      }, 60);
    }

    // Mouse Drag Listeners
    viewport.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      handleDragStart(e.clientX, e.clientY);
    });

    window.addEventListener("mousemove", function (e) {
      if (!isPointerDown) return;
      handleDragMove(e.clientX, e.clientY, e);
    });

    window.addEventListener("mouseup", function () {
      handleDragEnd();
    });

    // Safety nets: if cursor leaves window or tab loses focus mid-drag, launch settle/snap cleanly
    window.addEventListener("blur", function () {
      handleDragEnd();
    });

    document.addEventListener("mouseleave", function () {
      handleDragEnd();
    });

    // Touch Swipe Listeners (attached to slider viewport so page vertical scrolling stays native 60fps!)
    viewport.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    viewport.addEventListener("touchmove", function (e) {
      if (!isPointerDown || e.touches.length !== 1) return;
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY, e);
    }, { passive: false });

    viewport.addEventListener("touchend", function () {
      handleDragEnd();
    });

    viewport.addEventListener("touchcancel", function () {
      handleDragEnd();
    });

    // Click on Faded Neighbor Items -> Stop any spin, slide along shortest path & glide page
    sliderItems.forEach(function (item, idx) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        if (hasDragged) return;

        stopMomentumSpin();
        const rel = getWrappedRelativeOffset(idx, Math.round(virtualPos));
        const targetVirtual = Math.round(virtualPos) + Math.round(rel);

        if (wrapIndex(targetVirtual) !== initialPageIndex) {
          slideToVirtualPos(targetVirtual, true, false);
        } else {
          virtualPos = Math.round(virtualPos);
          renderInfiniteSlider(virtualPos, true);
          playHardMetalLatchSound();
        }
      });
    });

    // Arrow Button Clicks (infinite loop both ways!)
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        stopMomentumSpin();
        slideToVirtualPos(Math.round(virtualPos) - 1, true, false);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        stopMomentumSpin();
        slideToVirtualPos(Math.round(virtualPos) + 1, true, false);
      });
    }

    // Horizontal Trackpad / Shift+Wheel Flywheel Inertia on Desktop Slider
    // Lets normal vertical page scrolling (deltaY) pass through untouched with zero glitch!
    viewport.addEventListener("wheel", function (e) {
      if (isMobileMode() || isNavigating) return;

      const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontalScroll && !e.shiftKey) {
        return; // Never hijack normal vertical page scrolling
      }

      e.preventDefault();

      const delta = isHorizontalScroll ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 1) return;

      getAudioOutput();

      const dir = delta > 0 ? 1 : -1;
      // Scale impulse cleanly for both notched mouse wheels (~100px) and smooth trackpads (small deltas)
      let impulse;
      if (Math.abs(delta) >= 50) {
        impulse = dir * 3.65;
      } else {
        impulse = dir * Math.max(0.7, Math.abs(delta) * 0.085);
      }

      const MAX_VEL = 28;
      const newVel = Math.max(-MAX_VEL, Math.min(MAX_VEL, momentumVel + impulse));

      if (momentumRafId !== null) {
        // Already spinning: smoothly inject extra momentum into the live flywheel!
        momentumVel = newVel;
        momentumPhase = "coast";
        momentumDirSign = dir;
        momentumMovedAny = true;
      } else {
        launchMomentumSpin(newVel, dir, true);
      }
    }, { passive: false });

    // Keyboard Arrow Navigation when focused (infinite loop both ways!)
    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        stopMomentumSpin();
        slideToVirtualPos(Math.round(virtualPos) - 1, true, false);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        stopMomentumSpin();
        slideToVirtualPos(Math.round(virtualPos) + 1, true, false);
      }
    });

    // Re-layout cleanly on resize (always snapping to exact integer slot)
    window.addEventListener("resize", function () {
      stopMomentumSpin();
      isPointerDown = false;
      virtualPos = Math.round(virtualPos);
      renderInfiniteSlider(virtualPos, false);
    });
  }

  // Mobile Menu Drawer Toggle
  if (mobileToggle && navSliderNav) {
    mobileToggle.addEventListener("click", function () {
      const isExpanded = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", !isExpanded);
      navSliderNav.classList.toggle("open");

      if (navSliderNav.classList.contains("open")) {
        playMetalRatchetTick(0.95);
        setTimeout(function () {
          renderInfiniteSlider(Math.round(virtualPos), false);
        }, 15);
      }
    });

    document.addEventListener("click", function (e) {
      if (
        !navSliderNav.contains(e.target) &&
        !mobileToggle.contains(e.target) &&
        navSliderNav.classList.contains("open")
      ) {
        navSliderNav.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =========================================================================
  // 3. Interactive 3D Origami-Folded Footer Controller
  // Single flap: smooth wide horizontal strip
  // Unfold All: smooth 3-column horizontal origami triptych footer (never a tall pyramid!)
  // =========================================================================
  function initOrigamiFooter() {
    const footer = document.getElementById("origamiFooter");
    if (!footer) return;

    const stage = footer.querySelector(".origami-stage");
    const flapButtons = Array.from(footer.querySelectorAll(".origami-flap-btn[data-flap]"));
    const singleFlapBtns = flapButtons.filter(function (b) { return b.getAttribute("data-flap") !== "all"; });
    const unfoldAllBtn = footer.querySelector('.origami-flap-btn[data-flap="all"]');
    const panels = Array.from(footer.querySelectorAll(".origami-panel[data-panel]"));

    if (!stage || panels.length === 0) return;

    let activeMode = "closed"; // "closed" | "single" | "all"
    let activeSingleKey = null;
    let cleanupTimer = null;
    let cascadeTimers = [];

    function clearPendingTimers() {
      if (cleanupTimer) {
        clearTimeout(cleanupTimer);
        cleanupTimer = null;
      }
      cascadeTimers.forEach(function (t) { clearTimeout(t); });
      cascadeTimers = [];
    }

    function updateButtonStates() {
      singleFlapBtns.forEach(function (btn) {
        const key = btn.getAttribute("data-flap");
        const isOpen = activeMode === "all" || (activeMode === "single" && activeSingleKey === key);
        btn.classList.toggle("is-open", isOpen);
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      if (unfoldAllBtn) {
        const isAll = activeMode === "all";
        unfoldAllBtn.classList.toggle("is-open", isAll);
        unfoldAllBtn.setAttribute("aria-expanded", isAll ? "true" : "false");
        const labelSpan = unfoldAllBtn.querySelector("span");
        if (labelSpan) {
          labelSpan.textContent = isAll ? "Fold All" : "Unfold All";
        }
      }
    }

    // Smoothly animate stage height from current rendered px to exact target px
    function animateStageToCurrentContent() {
      const startH = stage.offsetHeight;
      stage.style.transition = "none";
      stage.style.height = "auto";
      const targetH = stage.scrollHeight;
      stage.style.height = startH + "px";
      void stage.offsetHeight; // Force layout reflow so height transition always fires visibly
      stage.style.transition = "height 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
      stage.style.height = targetH + "px";
    }

    // Release explicit height to "auto" once opened so resizing stays fluid
    stage.addEventListener("transitionend", function (e) {
      if (e.propertyName === "height" && activeMode !== "closed") {
        stage.style.height = "auto";
      }
    });

    function closeFooterSmoothly() {
      clearPendingTimers();
      const startH = stage.offsetHeight;
      stage.style.height = startH + "px";
      void stage.offsetHeight;

      const wasAll = activeMode === "all";
      activeMode = "closed";
      activeSingleKey = null;
      updateButtonStates();

      if (wasAll) {
        // Reverse wave fold on the 3 horizontal columns
        panels.slice().reverse().forEach(function (p, idx) {
          const t = setTimeout(function () {
            p.classList.remove("is-unfolded");
            playMetalRatchetTick(0.8);
          }, idx * 45);
          cascadeTimers.push(t);
        });
      } else {
        panels.forEach(function (p) { p.classList.remove("is-unfolded"); });
        playMetalRatchetTick(0.85);
      }

      stage.style.transition = "height 0.38s cubic-bezier(0.22, 1, 0.36, 1)";
      stage.style.height = "0px";

      cleanupTimer = setTimeout(function () {
        footer.classList.remove("is-all-open");
        panels.forEach(function (p) {
          p.classList.remove("is-active-slot", "is-unfolded");
        });
      }, 410);
    }

    function openSingleFlap(key) {
      clearPendingTimers();
      activeMode = "single";
      activeSingleKey = key;
      footer.classList.remove("is-all-open");

      const targetPanel = footer.querySelector('.origami-panel[data-panel="' + key + '"]');
      if (!targetPanel) return;

      panels.forEach(function (p) {
        if (p === targetPanel) {
          p.classList.add("is-active-slot");
          p.classList.remove("is-unfolded");
        } else {
          p.classList.remove("is-active-slot", "is-unfolded");
        }
      });

      updateButtonStates();
      animateStageToCurrentContent();

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          targetPanel.classList.add("is-unfolded");
        });
      });

      playHardMetalLatchSound();
    }

    function openAllHorizontalFooter() {
      clearPendingTimers();
      activeMode = "all";
      activeSingleKey = null;
      footer.classList.add("is-all-open");

      panels.forEach(function (p) {
        p.classList.add("is-active-slot");
        p.classList.remove("is-unfolded");
      });

      updateButtonStates();
      animateStageToCurrentContent();

      // Smooth left-to-right origami triptych unfold wave across the 3 footer columns
      panels.forEach(function (p, idx) {
        const t = setTimeout(function () {
          p.classList.add("is-unfolded");
          if (idx === panels.length - 1) {
            playHardMetalLatchSound();
          } else {
            playMetalRatchetTick(0.8);
          }
        }, 30 + idx * 65);
        cascadeTimers.push(t);
      });
    }

    // Single flap button clicks
    singleFlapBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const key = btn.getAttribute("data-flap");
        if (activeMode === "single" && activeSingleKey === key) {
          closeFooterSmoothly();
        } else {
          openSingleFlap(key);
        }
      });
    });

    // Unfold All / Fold All button click
    if (unfoldAllBtn) {
      unfoldAllBtn.addEventListener("click", function () {
        if (activeMode === "all") {
          closeFooterSmoothly();
        } else {
          openAllHorizontalFooter();
        }
      });
    }
  }

  initOrigamiFooter();

  // =========================================================================
  // 4. Scroll Animation: Fade & Glide In Elements as User Scrolls Down
  // =========================================================================
  function initScrollAnimation() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targetSelectors = [
      ".home-hero > *",
      ".metrics-strip .metric-item",
      ".section-title-wrap",
      ".featured-capstone-card",
      ".problem-card",
      ".pillar-card",
      ".projects-filter-bar",
      ".gallery-filter-bar",
      ".project-card",
      ".gallery-card",
      ".academic-table-container",
      ".case-study-hero",
      ".tab-nav",
      ".architecture-spec-box",
      ".form-card",
      ".sidebar-widget",
      ".faq-item",
      "[data-reveal]",
      ".reveal-on-scroll"
    ];

    const elementsToReveal = [];
    targetSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (!elementsToReveal.includes(el)) {
          elementsToReveal.push(el);
        }
      });
    });

    if (elementsToReveal.length === 0) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elementsToReveal.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.04,
      rootMargin: "0px 0px -20px 0px"
    });

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    elementsToReveal.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      // Instantly reveal elements already visible in the viewport so initial page load is 100% smooth with 0ms lag
      if (rect.top < viewportHeight - 10) {
        el.classList.add("is-revealed");
      } else {
        if (!el.classList.contains("reveal-on-scroll")) {
          el.classList.add("reveal-on-scroll");
        }
        observer.observe(el);
      }
    });
  }

  // =========================================================================
  // Top-Right Site Settings & Theme Switcher
  // =========================================================================
  function initSiteSettings() {
    if (document.getElementById("siteSettingsBtn")) return;

    // Load initial preferences (Strictly 2 Themes: Light [Default] | Charcoal Black [Dark])
    let currentTheme = localStorage.getItem("site_theme") || "light";
    if (currentTheme === "grey") {
      currentTheme = "dark";
      try { localStorage.setItem("site_theme", "dark"); } catch (e) {}
    }
    if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      currentTheme = "light";
    }

    const currentFontSize = parseInt(localStorage.getItem("site_font_size") || "16", 10);
    if (currentFontSize && currentFontSize !== 16) {
      document.documentElement.setAttribute("data-font-size", String(currentFontSize));
      document.documentElement.style.fontSize = currentFontSize + "px";
    }

    const currentFontPreset = localStorage.getItem("site_font_preset") || "architectural-lab";
    if (currentFontPreset && currentFontPreset !== "architectural-lab") {
      document.documentElement.setAttribute("data-font-preset", currentFontPreset);
    }

    // Top-right Settings Trigger Button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "siteSettingsBtn";
    btn.className = "site-settings-btn";
    btn.setAttribute("aria-label", "Open Settings");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "siteSettingsOverlay");
    btn.innerHTML =
      '<span class="site-settings-icon" aria-hidden="true">' +
      '<svg class="svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="12" cy="12" r="3"></circle>' +
      '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
      '</svg>' +
      '</span>' +
      '<span class="site-settings-label">Settings</span>';

    const isLight = currentTheme !== "dark";
    const isDark = currentTheme === "dark";
    const isSoundOn = window.siteAudio ? window.siteAudio.isEnabled() : true;

    // Compact Centered Modal Window with Translucent Blurred Backdrop
    const overlay = document.createElement("div");
    overlay.id = "siteSettingsOverlay";
    overlay.className = "site-settings-modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Portal Settings");
    overlay.innerHTML =
      '<div class="site-settings-modal-window" id="siteSettingsWindow">' +
      '  <div class="settings-header">' +
      '    <div class="settings-title-wrap">' +
      '      <svg class="svg-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">' +
      '        <circle cx="12" cy="12" r="3"></circle>' +
      '        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
      '      </svg>' +
      '      <h3 class="settings-title">Portal Settings</h3>' +
      '    </div>' +
      '    <button type="button" class="settings-close-btn" id="settingsCloseBtn" aria-label="Close Settings">' +
      '      <svg class="svg-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">' +
      '        <line x1="18" y1="6" x2="6" y2="18"></line>' +
      '        <line x1="6" y1="6" x2="18" y2="18"></line>' +
      '      </svg>' +
      '    </button>' +
      '  </div>' +
      '  <div class="settings-body">' +
      '    <!-- Section 1: Visual Theme (Strictly 2 Themes: Light [Default] | Charcoal Black [Dark]) -->' +
      '    <div class="settings-section">' +
      '      <div class="settings-section-header">' +
      '        <div class="section-heading-group">' +
      '          <span class="settings-section-badge">Display</span>' +
      '          <h4 class="settings-section-title">Theme</h4>' +
      '        </div>' +
      '        <span class="settings-section-sub">Choose visual appearance across the portal</span>' +
      '      </div>' +
      '      <div class="theme-options-grid" role="radiogroup" aria-label="Theme Selection">' +
      '        <button type="button" class="theme-card-btn ' + (isLight ? "active" : "") + '" id="themeOptionLight" role="radio" aria-checked="' + (isLight ? "true" : "false") + '" data-theme-value="light">' +
      '          <div class="theme-card-icon-box light-icon-box" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">' +
      '              <circle cx="12" cy="12" r="5"></circle>' +
      '              <line x1="12" y1="1" x2="12" y2="3"></line>' +
      '              <line x1="12" y1="21" x2="12" y2="23"></line>' +
      '              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>' +
      '              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>' +
      '              <line x1="1" y1="12" x2="3" y2="12"></line>' +
      '              <line x1="21" y1="12" x2="23" y2="12"></line>' +
      '              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>' +
      '              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' +
      '            </svg>' +
      '          </div>' +
      '          <div class="theme-card-info">' +
      '            <span class="theme-card-name">Light</span>' +
      '            <span class="theme-card-desc">Warm Ivory Clay (Default)</span>' +
      '          </div>' +
      '          <span class="theme-card-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '              <polyline points="20 6 9 17 4 12"></polyline>' +
      '            </svg>' +
      '          </span>' +
      '        </button>' +
      '        <button type="button" class="theme-card-btn ' + (isDark ? "active" : "") + '" id="themeOptionDark" role="radio" aria-checked="' + (isDark ? "true" : "false") + '" data-theme-value="dark">' +
      '          <div class="theme-card-icon-box dark-icon-box" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">' +
      '              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' +
      '            </svg>' +
      '          </div>' +
      '          <div class="theme-card-info">' +
      '            <span class="theme-card-name">Dark</span>' +
      '            <span class="theme-card-desc">Charcoal Matte Black</span>' +
      '          </div>' +
      '          <span class="theme-card-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '              <polyline points="20 6 9 17 4 12"></polyline>' +
      '            </svg>' +
      '          </span>' +
      '        </button>' +
      '      </div>' +
      '    </div>' +
      '    <!-- Section 2: Mechanical Sound -->' +
      '    <div class="settings-section sound-section">' +
      '      <div class="sound-toggle-row">' +
      '        <div class="sound-toggle-info">' +
      '          <div class="section-heading-group">' +
      '            <span class="settings-section-badge">Acoustics</span>' +
      '            <h4 class="settings-section-title">Mechanical Sound</h4>' +
      '          </div>' +
      '          <span class="settings-section-sub">Hardware click feedback on sliders and taps</span>' +
      '        </div>' +
      '        <label class="sound-switch" for="siteSoundToggle" aria-label="Toggle Mechanical Sound">' +
      '          <input type="checkbox" id="siteSoundToggle" class="sound-switch-input" ' + (isSoundEnabled ? 'checked' : '') + ' />' +
      '          <span class="sound-switch-slider">' +
      '            <span class="sound-switch-thumb"></span>' +
      '          </span>' +
      '        </label>' +
      '      </div>' +
      '    </div>' +
      '    <!-- Section 3: Font Combination Presets -->' +
      '    <div class="settings-section font-preset-section">' +
      '      <div class="settings-section-header">' +
      '        <div class="section-heading-group">' +
      '          <span class="settings-section-badge">Typography</span>' +
      '          <h4 class="settings-section-title">Font Combination</h4>' +
      '        </div>' +
      '        <span class="settings-section-sub">Choose architectural typographic pairing</span>' +
      '      </div>' +
      '      <div class="font-presets-grid" role="radiogroup" aria-label="Font Combination Selection">' +
      '        <button type="button" class="font-preset-btn ' + (currentFontPreset === "architectural-lab" ? "active" : "") + '" data-font-preset="architectural-lab" role="radio" aria-checked="' + (currentFontPreset === "architectural-lab" ? "true" : "false") + '">' +
      '          <div class="font-preset-info">' +
      '            <span class="font-preset-title font-sample-architectural">Architectural Lab</span>' +
      '            <span class="font-preset-desc">Space Grotesk + DM Sans</span>' +
      '          </div>' +
      '          <span class="font-preset-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '              <polyline points="20 6 9 17 4 12"></polyline>' +
      '            </svg>' +
      '          </span>' +
      '        </button>' +
      '        <button type="button" class="font-preset-btn ' + (currentFontPreset === "academic-archive" ? "active" : "") + '" data-font-preset="academic-archive" role="radio" aria-checked="' + (currentFontPreset === "academic-archive" ? "true" : "false") + '">' +
      '          <div class="font-preset-info">' +
      '            <span class="font-preset-title font-sample-academic">Academic Archive</span>' +
      '            <span class="font-preset-desc">Newsreader + Jakarta</span>' +
      '          </div>' +
      '          <span class="font-preset-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '              <polyline points="20 6 9 17 4 12"></polyline>' +
      '            </svg>' +
      '          </span>' +
      '        </button>' +
      '        <button type="button" class="font-preset-btn ' + (currentFontPreset === "collegiate-heritage" ? "active" : "") + '" data-font-preset="collegiate-heritage" role="radio" aria-checked="' + (currentFontPreset === "collegiate-heritage" ? "true" : "false") + '">' +
      '          <div class="font-preset-info">' +
      '            <span class="font-preset-title font-sample-collegiate">Collegiate Heritage</span>' +
      '            <span class="font-preset-desc">Lora + Inter + Plex</span>' +
      '          </div>' +
      '          <span class="font-preset-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '              <polyline points="20 6 9 17 4 12"></polyline>' +
      '            </svg>' +
      '          </span>' +
      '        </button>' +
      '        <button type="button" class="font-preset-btn ' + (currentFontPreset === "nextgen-tech" ? "active" : "") + '" data-font-preset="nextgen-tech" role="radio" aria-checked="' + (currentFontPreset === "nextgen-tech" ? "true" : "false") + '">' +
      '          <div class="font-preset-info">' +
      '            <span class="font-preset-title font-sample-nextgen">Next-Gen Tech</span>' +
      '            <span class="font-preset-desc">Outfit + Manrope</span>' +
      '          </div>' +
      '          <span class="font-preset-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '              <polyline points="20 6 9 17 4 12"></polyline>' +
      '            </svg>' +
      '          </span>' +
      '        </button>' +
      '      </div>' +
      '    </div>' +
      '    <!-- Section 2: Mechanical Acoustics (Audio Feedback) -->' +
      '    <div class="settings-section sound-section">' +
      '      <div class="settings-section-header">' +
      '        <div class="section-heading-group">' +
      '          <span class="settings-section-badge">Audio</span>' +
      '          <h4 class="settings-section-title">Mechanical Sound</h4>' +
      '        </div>' +
      '        <span class="settings-section-sub">Tactile audio feedback on button clicks &amp; navigation</span>' +
      '      </div>' +
      '      <div class="sound-toggle-row">' +
      '        <div class="sound-toggle-info">' +
      '          <span class="theme-card-name" style="font-size:0.85rem;">Click &amp; Slider Acoustics</span>' +
      '          <span class="theme-card-desc" style="font-size:0.72rem;">Synthesized live via Web Audio API (Default: On)</span>' +
      '        </div>' +
      '        <label class="sound-switch" for="siteSoundToggle" aria-label="Toggle mechanical sound">' +
      '          <input type="checkbox" id="siteSoundToggle" class="sound-switch-input" ' + (isSoundOn ? 'checked' : '') + ' />' +
      '          <span class="sound-switch-slider">' +
      '            <span class="sound-switch-thumb"></span>' +
      '          </span>' +
      '        </label>' +
      '      </div>' +
      '    </div>' +
      '    <!-- Section 3: Font Pairings Combinations -->' +
      '    <div class="settings-section font-preset-section">' +
      '      <div class="settings-section-header">' +
      '        <div class="section-heading-group">' +
      '          <span class="settings-section-badge">Typography</span>' +
      '          <h4 class="settings-section-title">Font Combinations</h4>' +
      '        </div>' +
      '        <span class="settings-section-sub">Choose typeface combination across portal</span>' +
      '      </div>' +
      '      <div class="font-presets-grid" role="radiogroup" aria-label="Font Combination Selection">' +
      '        <button type="button" class="font-preset-btn ' + (currentFontPreset === 'architectural-lab' ? 'active' : '') + '" data-font-preset="architectural-lab" role="radio" aria-checked="' + (currentFontPreset === 'architectural-lab' ? 'true' : 'false') + '">'
      '          <div class="font-preset-info">' +
      '            <span class="font-preset-title">Architectural Lab</span>' +
      '            <span class="font-preset-desc">DM Sans &bull; Space Mono (Default)</span>' +
      '          </div>' +
      '          <span class="font-preset-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
      '          </span>' +
      '        </button>' +
      '        <button type="button" class="font-preset-btn ' + (currentFontPreset === 'academic-archive' ? 'active' : '') + '" data-font-preset="academic-archive" role="radio" aria-checked="' + (currentFontPreset === 'academic-archive' ? 'true' : 'false') + '">' +
      '          <div class="font-preset-info">' +
      '            <span class="font-preset-title">Academic Archive</span>' +
      '            <span class="font-preset-desc">Newsreader &bull; JetBrains</span>' +
      '          </div>' +
      '          <span class="font-preset-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
      '          </span>' +
      '        </button>' +
      '        <button type="button" class="font-preset-btn ' + (currentFontPreset === 'collegiate-heritage' ? 'active' : '') + '" data-font-preset="collegiate-heritage" role="radio" aria-checked="' + (currentFontPreset === 'collegiate-heritage' ? 'true' : 'false') + '">' +
      '          <div class="font-preset-info">' +
      '            <span class="font-preset-title">Collegiate Heritage</span>' +
      '            <span class="font-preset-desc">Lora &bull; Inter</span>' +
      '          </div>' +
      '          <span class="font-preset-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
      '          </span>' +
      '        </button>' +
      '        <button type="button" class="font-preset-btn ' + (currentFontPreset === 'nextgen-tech' ? 'active' : '') + '" data-font-preset="nextgen-tech" role="radio" aria-checked="' + (currentFontPreset === 'nextgen-tech' ? 'true' : 'false') + '">' +
      '          <div class="font-preset-info">' +
      '            <span class="font-preset-title">Next-Gen Tech</span>' +
      '            <span class="font-preset-desc">Outfit &bull; Manrope</span>' +
      '          </div>' +
      '          <span class="font-preset-check" aria-hidden="true">' +
      '            <svg class="svg-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
      '          </span>' +
      '        </button>' +
      '      </div>' +
      '    </div>' +
      '    <!-- Section 4: Whole Site Text Size Manual Custom Slide -->' +
      '    <div class="settings-section font-size-section">' +
      '      <div class="settings-section-header">' +
      '        <div class="section-heading-group">' +
      '          <span class="settings-section-badge">Typography</span>' +
      '          <h4 class="settings-section-title">Text Size</h4>' +
      '          <span class="font-size-live-value" id="fontSizeLiveValue">' + currentFontSize + 'px</span>' +
      '        </div>' +
      '        <span class="settings-section-sub">Scale all text across the website</span>' +
      '      </div>' +
      '      <div class="font-scale-slider-card">' +
      '        <!-- Numbers written above the line at fixed lengths -->' +
      '        <div class="font-scale-ticks-row" id="fontScaleTicksRow" aria-hidden="true">' +
      '          <button type="button" class="font-scale-tick-num" data-size="14">14</button>' +
      '          <button type="button" class="font-scale-tick-num" data-size="15">15</button>' +
      '          <button type="button" class="font-scale-tick-num" data-size="16">16</button>' +
      '          <button type="button" class="font-scale-tick-num" data-size="17">17</button>' +
      '          <button type="button" class="font-scale-tick-num" data-size="18">18</button>' +
      '          <button type="button" class="font-scale-tick-num" data-size="19">19</button>' +
      '          <button type="button" class="font-scale-tick-num" data-size="20">20</button>' +
      '        </div>' +
      '        <!-- Custom horizontal mechanical slide track -->' +
      '        <div class="font-scale-track-wrap">' +
      '          <div class="font-scale-notches-row" id="fontScaleNotchesRow" aria-hidden="true">' +
      '            <span class="font-scale-notch" data-notch="14"></span>' +
      '            <span class="font-scale-notch" data-notch="15"></span>' +
      '            <span class="font-scale-notch" data-notch="16"></span>' +
      '            <span class="font-scale-notch" data-notch="17"></span>' +
      '            <span class="font-scale-notch" data-notch="18"></span>' +
      '            <span class="font-scale-notch" data-notch="19"></span>' +
      '            <span class="font-scale-notch" data-notch="20"></span>' +
      '          </div>' +
      '          <input type="range" class="font-scale-slider" id="fontScaleSlider" min="14" max="20" step="1" value="' + currentFontSize + '" aria-label="Text Size Slider" aria-valuemin="14" aria-valuemax="20" aria-valuenow="' + currentFontSize + '" />' +
      '        </div>' +
      '        <!-- Quick Step & Reset Controls -->' +
      '        <div class="font-scale-meta-row">' +
      '          <button type="button" class="font-scale-stepper-btn" id="fontScaleDecBtn" aria-label="Decrease text size">' +
      '            <span class="stepper-label-small">A-</span>' +
      '            <span>Smaller</span>' +
      '          </button>' +
      '          <button type="button" class="font-scale-reset-btn" id="fontScaleResetBtn" aria-label="Reset text size to default 16px">' +
      '            Reset' +
      '          </button>' +
      '          <button type="button" class="font-scale-stepper-btn" id="fontScaleIncBtn" aria-label="Increase text size">' +
      '            <span>Larger</span>' +
      '            <span class="stepper-label-large">A+</span>' +
      '          </button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="settings-footer">' +
      '    <span class="settings-footnote">Saved automatically on this device</span>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(btn);
    document.body.appendChild(overlay);

    function openModal() {
      btn.classList.add("is-active");
      btn.setAttribute("aria-expanded", "true");
      overlay.classList.add("is-open");
      document.body.classList.add("settings-modal-open");
      if (window.siteAudio && window.siteAudio.playScrollTick) {
        window.siteAudio.playScrollTick(0.8);
      }
    }

    function closeModal() {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-expanded", "false");
      overlay.classList.remove("is-open");
      document.body.classList.remove("settings-modal-open");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (overlay.classList.contains("is-open")) {
        closeModal();
      } else {
        openModal();
      }
    });

    const closeBtn = overlay.querySelector("#settingsCloseBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeModal();
      });
    }

    overlay.addEventListener("click", function (e) {
      const win = overlay.querySelector("#siteSettingsWindow");
      if (win && !win.contains(e.target)) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeModal();
        btn.focus();
      }
    });

    // Theme Switcher Logic (Light [Default] | Charcoal Black)
    const lightOption = overlay.querySelector("#themeOptionLight");
    const darkOption = overlay.querySelector("#themeOptionDark");

    function setTheme(theme) {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
        theme = "light";
      }
      try {
        localStorage.setItem("site_theme", theme);
      } catch (e) {}

      var themeButtons = [
        { el: lightOption, val: "light" },
        { el: darkOption, val: "dark" }
      ];

      themeButtons.forEach(function (item) {
        if (!item.el) return;
        var isActive = item.val === theme;
        item.el.classList.toggle("active", isActive);
        item.el.setAttribute("aria-checked", isActive ? "true" : "false");
      });

      if (window.siteAudio && window.siteAudio.playGlassTap) {
        window.siteAudio.playGlassTap();
      }
    }

    if (lightOption) {
      lightOption.addEventListener("click", function () {
        setTheme("light");
      });
    }
    if (darkOption) {
      darkOption.addEventListener("click", function () {
        setTheme("dark");
      });
    }

    // Mechanical Sound Toggle Logic
    const soundToggle = overlay.querySelector("#siteSoundToggle");
    if (soundToggle) {
      soundToggle.addEventListener("change", function () {
        const enabled = soundToggle.checked;
        setSoundEnabled(enabled);
        if (enabled && window.siteAudio && window.siteAudio.playGlassTap) {
          window.siteAudio.playGlassTap();
        }
      });
    }

    // Font Combination Presets Selection Logic
    const fontPresetBtns = overlay.querySelectorAll(".font-preset-btn");
    function setFontPreset(presetKey) {
      if (presetKey && presetKey !== "architectural-lab") {
        document.documentElement.setAttribute("data-font-preset", presetKey);
      } else {
        document.documentElement.removeAttribute("data-font-preset");
      }
      try {
        localStorage.setItem("site_font_preset", presetKey);
      } catch (e) {}

      fontPresetBtns.forEach(function (pBtn) {
        const isAct = pBtn.getAttribute("data-font-preset") === presetKey;
        pBtn.classList.toggle("active", isAct);
        pBtn.setAttribute("aria-checked", isAct ? "true" : "false");
      });

      if (window.siteAudio && window.siteAudio.playGlassTap) {
        window.siteAudio.playGlassTap();
      }
    }

    fontPresetBtns.forEach(function (pBtn) {
      pBtn.addEventListener("click", function () {
        const key = pBtn.getAttribute("data-font-preset");
        setFontPreset(key);
      });
    });

    // Whole Site Text Size Custom Horizontal Mechanical Slider Logic
    const fontSlider = overlay.querySelector("#fontScaleSlider");
    const liveValueBadge = overlay.querySelector("#fontSizeLiveValue");
    const tickButtons = overlay.querySelectorAll(".font-scale-tick-num");
    const notchElements = overlay.querySelectorAll(".font-scale-notch");
    const decBtn = overlay.querySelector("#fontScaleDecBtn");
    const incBtn = overlay.querySelector("#fontScaleIncBtn");
    const resetBtn = overlay.querySelector("#fontScaleResetBtn");

    function applyFontSize(size, playTick) {
      const numSize = parseInt(size, 10);
      if (isNaN(numSize) || numSize < 14 || numSize > 20) return;

      // Update root typography across the whole site
      document.documentElement.setAttribute("data-font-size", String(numSize));
      document.documentElement.style.fontSize = numSize + "px";

      try {
        localStorage.setItem("site_font_size", String(numSize));
      } catch (e) {}

      // Update slider value
      if (fontSlider && parseInt(fontSlider.value, 10) !== numSize) {
        fontSlider.value = numSize;
      }
      if (fontSlider) {
        fontSlider.setAttribute("aria-valuenow", String(numSize));
      }

      // Update live badge text
      if (liveValueBadge) {
        let label = numSize + "px";
        if (numSize === 16) label += " (Default)";
        else if (numSize < 16) label += " (-" + Math.round((1 - numSize / 16) * 100) + "%)";
        else label += " (+" + Math.round((numSize / 16 - 1) * 100) + "%)";
        liveValueBadge.textContent = label;
      }

      // Update tick numbers and notches active highlight
      tickButtons.forEach(function (btnEl) {
        const btnVal = parseInt(btnEl.getAttribute("data-size"), 10);
        if (btnVal === numSize) {
          btnEl.classList.add("active");
        } else {
          btnEl.classList.remove("active");
        }
      });

      notchElements.forEach(function (notchEl) {
        const notchVal = parseInt(notchEl.getAttribute("data-notch"), 10);
        if (notchVal === numSize) {
          notchEl.classList.add("active");
        } else {
          notchEl.classList.remove("active");
        }
      });

      // Optional sound feedback
      if (playTick && window.siteAudio && window.siteAudio.playScrollTick) {
        window.siteAudio.playScrollTick(0.6);
      }
    }

    // Initialize highlight for current font size
    applyFontSize(currentFontSize, false);

    // Slider input event (live continuous response)
    if (fontSlider) {
      fontSlider.addEventListener("input", function () {
        applyFontSize(this.value, true);
      });
      fontSlider.addEventListener("change", function () {
        if (window.siteAudio && window.siteAudio.playGlassTap) {
          window.siteAudio.playGlassTap();
        }
      });
    }

    // Direct number click on the ruler above the line
    tickButtons.forEach(function (btnEl) {
      btnEl.addEventListener("click", function () {
        const targetSize = parseInt(this.getAttribute("data-size"), 10);
        applyFontSize(targetSize, true);
        if (window.siteAudio && window.siteAudio.playGlassTap) {
          window.siteAudio.playGlassTap();
        }
      });
    });

    // Steppers and Reset button
    if (decBtn) {
      decBtn.addEventListener("click", function () {
        const cur = parseInt(fontSlider ? fontSlider.value : "16", 10);
        if (cur > 14) {
          applyFontSize(cur - 1, true);
        }
      });
    }

    if (incBtn) {
      incBtn.addEventListener("click", function () {
        const cur = parseInt(fontSlider ? fontSlider.value : "16", 10);
        if (cur < 20) {
          applyFontSize(cur + 1, true);
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        applyFontSize(16, true);
        if (window.siteAudio && window.siteAudio.playGlassTap) {
          window.siteAudio.playGlassTap();
        }
      });
    }
  }


  // Universal Physical Click Acoustic Feedback on all buttons, tabs, pills, and interactive controls
  document.addEventListener("pointerdown", function (e) {
    if (!window.siteAudio || !window.siteAudio.isEnabled()) return;
    const btn = e.target.closest(
      "button, .btn, a.btn, input[type='button'], input[type='submit'], .year-filter-pill, .tab-btn, .origami-flap-btn, .font-preset-btn, .theme-card-btn, .font-scale-tick-num, .font-scale-stepper-btn, .font-scale-reset-btn, .mobile-toggle, .site-settings-btn, .nav-arrow, .cat-arrow"
    );
    if (btn) {
      window.siteAudio.playGlassTap();
    }
  }, { passive: true });

  initScrollAnimation();
  initSiteSettings();
});
