/* 
   Web Designing Project (DCSE0152) - Capstone Showcase
   Group 08 | NIET Greater Noida
   Contact & Submission JavaScript (contact.js)
   Features:
   - Interactive Mode Switcher (Project Submission vs Mentor Inquiry Desk)
   - Real-time input validation & collegiate Roll No format check
   - Live character counter with visual progress rail for synopsis
   - Clickable hardware & software tech stack chip tag selector
   - Automatic local storage draft saving & restoration
   - Rich submission ledger with individual delete, export to JSON, and clear all
   - Sound synchronization with site audio
*/

document.addEventListener("DOMContentLoaded", function () {
  // Elements: Mode Switcher
  const modeBtnProject = document.getElementById("modeBtnProject");
  const modeBtnQuery = document.getElementById("modeBtnQuery");
  const projectForm = document.getElementById("capstoneSubmissionForm");
  const queryForm = document.getElementById("mentorInquiryForm");

  // Elements: Project Form Inputs
  const studentNameInput = document.getElementById("studentName");
  const erpIdInput = document.getElementById("erpId");
  const studentEmailInput = document.getElementById("studentEmail");
  const groupNoInput = document.getElementById("groupNo");
  const projectTitleInput = document.getElementById("projectTitle");
  const projectDomainSelect = document.getElementById("projectDomain");
  const repoUrlInput = document.getElementById("repoUrl");
  const demoUrlInput = document.getElementById("demoUrl");
  const abstractTextarea = document.getElementById("projectAbstract");
  const charCounter = document.getElementById("charCounter");
  const abstractProgressFill = document.getElementById("abstractProgressFill");
  const saveDraftManualBtn = document.getElementById("saveDraftManualBtn");
  const draftClearBtn = document.getElementById("draftClearBtn");
  const draftStatusText = document.getElementById("draftStatusText");

  // Elements: Tech Chips Selector
  const techChipButtons = document.querySelectorAll(".tech-chip-toggle");
  const selectedTagsList = document.getElementById("selectedTagsList");
  const selectedTagsHidden = document.getElementById("selectedTagsHidden");
  let selectedTags = [];

  // Elements: Alerts
  const submissionSuccessAlert = document.getElementById("submissionSuccessAlert");
  const submittedProjectTitle = document.getElementById("submittedProjectTitle");
  const submittedProjectRef = document.getElementById("submittedProjectRef");
  const inquirySuccessAlert = document.getElementById("inquirySuccessAlert");
  const submittedQuerySubject = document.getElementById("submittedQuerySubject");

  // Elements: Sidebar Submissions Ledger
  const localListContainer = document.getElementById("localSubmissionsList");
  const exportBtn = document.getElementById("exportSubmissionsBtn");
  const clearAllBtn = document.getElementById("clearAllSubmissionsBtn");

  // Elements: Mentor Query Form Inputs
  const queryStudentName = document.getElementById("queryStudentName");
  const queryErpId = document.getElementById("queryErpId");
  const queryEmail = document.getElementById("queryEmail");
  const queryCategory = document.getElementById("queryCategory");
  const queryMessage = document.getElementById("queryMessage");

  function playTick(vol) {
    if (window.siteAudio && window.siteAudio.playScrollTick) {
      window.siteAudio.playScrollTick(vol || 0.85);
    }
  }

  function playLatch() {
    if (window.siteAudio && window.siteAudio.playGlassTap) {
      window.siteAudio.playGlassTap();
    }
  }

  // =========================================================================
  // 1. Mode Switcher (Project Form vs Mentor Inquiry)
  // =========================================================================
  if (modeBtnProject && modeBtnQuery) {
    modeBtnProject.addEventListener("click", function () {
      playTick(0.9);
      modeBtnProject.classList.add("active");
      modeBtnProject.setAttribute("aria-selected", "true");
      modeBtnQuery.classList.remove("active");
      modeBtnQuery.setAttribute("aria-selected", "false");

      if (projectForm) {
        projectForm.classList.remove("contact-inactive-form");
        projectForm.classList.add("contact-active-form");
      }
      if (queryForm) {
        queryForm.classList.remove("contact-active-form");
        queryForm.classList.add("contact-inactive-form");
      }
      if (inquirySuccessAlert) inquirySuccessAlert.classList.remove("visible");
    });

    modeBtnQuery.addEventListener("click", function () {
      playTick(0.9);
      modeBtnQuery.classList.add("active");
      modeBtnQuery.setAttribute("aria-selected", "true");
      modeBtnProject.classList.remove("active");
      modeBtnProject.setAttribute("aria-selected", "false");

      if (queryForm) {
        queryForm.classList.remove("contact-inactive-form");
        queryForm.classList.add("contact-active-form");
      }
      if (projectForm) {
        projectForm.classList.remove("contact-active-form");
        projectForm.classList.add("contact-inactive-form");
      }
      if (submissionSuccessAlert) submissionSuccessAlert.classList.remove("visible");
    });
  }

  // =========================================================================
  // 2. Tech Stack Chips Palette
  // =========================================================================
  techChipButtons.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const tag = chip.getAttribute("data-tag");
      if (!tag) return;

      playTick(0.8);
      if (selectedTags.indexOf(tag) === -1) {
        selectedTags.push(tag);
        chip.classList.add("selected");
      } else {
        selectedTags = selectedTags.filter(function (t) { return t !== tag; });
        chip.classList.remove("selected");
      }
      updateSelectedTagsUI();
      autoSaveProjectDraft();
    });
  });

  function updateSelectedTagsUI() {
    if (!selectedTagsList) return;
    if (selectedTags.length === 0) {
      selectedTagsList.innerHTML = '<span class="tags-empty-note">None selected yet (click chips above)</span>';
      if (selectedTagsHidden) selectedTagsHidden.value = "";
      return;
    }

    let html = "";
    selectedTags.forEach(function (tag) {
      html += '<span class="selected-tag-item">';
      html += escapeHtml(tag);
      html += '<button type="button" class="selected-tag-remove" data-remove="' + escapeHtml(tag) + '" aria-label="Remove ' + escapeHtml(tag) + '">&times;</button>';
      html += '</span>';
    });
    selectedTagsList.innerHTML = html;

    if (selectedTagsHidden) {
      selectedTagsHidden.value = JSON.stringify(selectedTags);
    }

    // Attach remove handlers
    const removeBtns = selectedTagsList.querySelectorAll(".selected-tag-remove");
    removeBtns.forEach(function (rBtn) {
      rBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const tagToRemove = rBtn.getAttribute("data-remove");
        selectedTags = selectedTags.filter(function (t) { return t !== tagToRemove; });

        techChipButtons.forEach(function (c) {
          if (c.getAttribute("data-tag") === tagToRemove) {
            c.classList.remove("selected");
          }
        });

        playTick(0.75);
        updateSelectedTagsUI();
        autoSaveProjectDraft();
      });
    });
  }

  // =========================================================================
  // 3. Live Abstract Character Counter & Progress Bar
  // =========================================================================
  if (abstractTextarea) {
    abstractTextarea.addEventListener("input", function () {
      const len = abstractTextarea.value.length;
      const maxLen = 600;
      if (charCounter) {
        charCounter.textContent = len + " / " + maxLen + " characters";
        if (len >= 550) {
          charCounter.style.color = "#DC2626";
        } else if (len >= 400) {
          charCounter.style.color = "#C2410C";
        } else {
          charCounter.style.color = "var(--text-secondary)";
        }
      }

      if (abstractProgressFill) {
        const pct = Math.min(100, Math.round((len / maxLen) * 100));
        abstractProgressFill.style.width = pct + "%";
        if (len >= 550) {
          abstractProgressFill.style.backgroundColor = "#DC2626";
        } else {
          abstractProgressFill.style.backgroundColor = "var(--accent)";
        }
      }

      autoSaveProjectDraft();
    });
  }

  // =========================================================================
  // 4. Auto-Save Draft to LocalStorage
  // =========================================================================
  const projectInputs = [
    studentNameInput, erpIdInput, studentEmailInput, groupNoInput,
    projectTitleInput, projectDomainSelect, repoUrlInput, demoUrlInput
  ];

  projectInputs.forEach(function (inp) {
    if (inp) {
      inp.addEventListener("input", autoSaveProjectDraft);
      inp.addEventListener("change", autoSaveProjectDraft);
    }
  });

  function autoSaveProjectDraft() {
    try {
      const draft = {
        studentName: studentNameInput ? studentNameInput.value : "",
        erpId: erpIdInput ? erpIdInput.value : "",
        studentEmail: studentEmailInput ? studentEmailInput.value : "",
        groupNo: groupNoInput ? groupNoInput.value : "Group - 08",
        projectTitle: projectTitleInput ? projectTitleInput.value : "",
        projectDomain: projectDomainSelect ? projectDomainSelect.value : "",
        repoUrl: repoUrlInput ? repoUrlInput.value : "",
        demoUrl: demoUrlInput ? demoUrlInput.value : "",
        projectAbstract: abstractTextarea ? abstractTextarea.value : "",
        tags: selectedTags,
        savedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      // Only save if at least one meaningful field has content
      if (draft.studentName || draft.erpId || draft.projectTitle || draft.projectAbstract) {
        localStorage.setItem("capstone_project_draft", JSON.stringify(draft));
        if (draftStatusText) {
          draftStatusText.textContent = "Draft auto-saved at " + draft.savedAt + " (Local on this PC)";
        }
      }
    } catch (e) {
      // Storage unavailable or disabled
    }
  }

  function restoreProjectDraft() {
    try {
      const raw = localStorage.getItem("capstone_project_draft");
      if (!raw) return;
      const draft = JSON.parse(raw);

      if (studentNameInput && draft.studentName) studentNameInput.value = draft.studentName;
      if (erpIdInput && draft.erpId) erpIdInput.value = draft.erpId;
      if (studentEmailInput && draft.studentEmail) studentEmailInput.value = draft.studentEmail;
      if (groupNoInput && draft.groupNo) groupNoInput.value = draft.groupNo;
      if (projectTitleInput && draft.projectTitle) projectTitleInput.value = draft.projectTitle;
      if (projectDomainSelect && draft.projectDomain) projectDomainSelect.value = draft.projectDomain;
      if (repoUrlInput && draft.repoUrl) repoUrlInput.value = draft.repoUrl;
      if (demoUrlInput && draft.demoUrl) demoUrlInput.value = draft.demoUrl;
      if (abstractTextarea && draft.projectAbstract) {
        abstractTextarea.value = draft.projectAbstract;
        const len = draft.projectAbstract.length;
        if (charCounter) charCounter.textContent = len + " / 600 characters";
        if (abstractProgressFill) abstractProgressFill.style.width = Math.min(100, Math.round((len / 600) * 100)) + "%";
      }

      if (Array.isArray(draft.tags)) {
        selectedTags = draft.tags;
        techChipButtons.forEach(function (chip) {
          const t = chip.getAttribute("data-tag");
          if (selectedTags.indexOf(t) !== -1) {
            chip.classList.add("selected");
          } else {
            chip.classList.remove("selected");
          }
        });
        updateSelectedTagsUI();
      }

      if (draftStatusText && draft.savedAt) {
        draftStatusText.textContent = "Restored saved draft from " + draft.savedAt;
      }
    } catch (e) {}
  }

  // =========================================================================
  // 4b. Custom Accessible Dropdowns
  // =========================================================================
  function initCustomDropdowns() {
    const dropdowns = document.querySelectorAll(".custom-dropdown");

    dropdowns.forEach(function (container) {
      const selectId = container.getAttribute("data-select-id");
      const realSelect = document.getElementById(selectId);
      const trigger = container.querySelector(".custom-dropdown-trigger");
      const menu = container.querySelector(".custom-dropdown-menu");
      const options = container.querySelectorAll(".custom-dropdown-option");
      const triggerLabel = container.querySelector(".custom-dropdown-label");
      const triggerIcon = container.querySelector(".custom-dropdown-leading-icon");

      if (!realSelect || !trigger || !menu) return;

      const defaultPlaceholder = realSelect.options[0] ? realSelect.options[0].text : "Select option...";
      const defaultIconSvg = triggerIcon ? triggerIcon.innerHTML : "";

      function closeDropdown() {
        container.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }

      function openDropdown() {
        // Close all other open dropdowns first
        document.querySelectorAll(".custom-dropdown.is-open").forEach(function (d) {
          if (d !== container) {
            d.classList.remove("is-open");
            const t = d.querySelector(".custom-dropdown-trigger");
            if (t) t.setAttribute("aria-expanded", "false");
          }
        });
        container.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        const selectedOpt = container.querySelector(".custom-dropdown-option.is-selected");
        if (selectedOpt) {
          selectedOpt.scrollIntoView({ block: "nearest" });
        }
      }

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        playTick(0.8);
        if (container.classList.contains("is-open")) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      options.forEach(function (opt) {
        opt.addEventListener("click", function (e) {
          e.preventDefault();
          const val = opt.getAttribute("data-value") || "";
          selectValue(val, true);
        });
      });

      function selectValue(val, shouldTriggerEvents) {
        realSelect.value = val;

        let matchedOption = null;
        options.forEach(function (opt) {
          const optVal = opt.getAttribute("data-value") || "";
          if (val && optVal === val) {
            opt.classList.add("is-selected");
            opt.setAttribute("aria-selected", "true");
            matchedOption = opt;
          } else {
            opt.classList.remove("is-selected");
            opt.setAttribute("aria-selected", "false");
          }
        });

        if (matchedOption) {
          const labelEl = matchedOption.querySelector(".option-label");
          const iconEl = matchedOption.querySelector(".option-icon-box");
          if (triggerLabel && labelEl) {
            triggerLabel.textContent = labelEl.textContent.trim();
            triggerLabel.classList.remove("is-placeholder");
          }
          if (triggerIcon && iconEl) {
            triggerIcon.innerHTML = iconEl.innerHTML;
          }
        } else {
          if (triggerLabel) {
            triggerLabel.textContent = defaultPlaceholder;
            triggerLabel.classList.add("is-placeholder");
          }
          if (triggerIcon) {
            triggerIcon.innerHTML = defaultIconSvg;
          }
        }

        // Clear error style when user makes a selection
        trigger.classList.remove("input-error");
        realSelect.classList.remove("input-error");
        const errEl = document.getElementById(selectId + "Error");
        if (errEl) {
          errEl.classList.remove("visible");
          errEl.textContent = "";
        }

        closeDropdown();

        if (shouldTriggerEvents) {
          playLatch();
          realSelect.dispatchEvent(new Event("change", { bubbles: true }));
          realSelect.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }

      container._syncValue = function () {
        selectValue(realSelect.value, false);
      };

      trigger.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!container.classList.contains("is-open")) {
            openDropdown();
            const firstOpt = options[0];
            if (firstOpt) firstOpt.focus();
          }
        } else if (e.key === "Escape") {
          closeDropdown();
        }
      });

      menu.addEventListener("keydown", function (e) {
        const activeEl = document.activeElement;
        const optArray = Array.from(options);
        const currentIndex = optArray.indexOf(activeEl);

        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % optArray.length;
          optArray[nextIndex].focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + optArray.length) % optArray.length;
          optArray[prevIndex].focus();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (activeEl && activeEl.classList.contains("custom-dropdown-option")) {
            activeEl.click();
            trigger.focus();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeDropdown();
          trigger.focus();
        } else if (e.key === "Tab") {
          closeDropdown();
        }
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".custom-dropdown")) {
        document.querySelectorAll(".custom-dropdown.is-open").forEach(function (d) {
          d.classList.remove("is-open");
          const t = d.querySelector(".custom-dropdown-trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  function syncAllCustomDropdowns() {
    document.querySelectorAll(".custom-dropdown").forEach(function (c) {
      if (typeof c._syncValue === "function") {
        c._syncValue();
      }
    });
  }

  // Clear Draft button
  if (draftClearBtn) {
    draftClearBtn.addEventListener("click", function () {
      if (confirm("Clear the current draft fields?")) {
        playLatch();
        localStorage.removeItem("capstone_project_draft");
        if (projectForm) projectForm.reset();
        syncAllCustomDropdowns();
        selectedTags = [];
        techChipButtons.forEach(function (c) { c.classList.remove("selected"); });
        updateSelectedTagsUI();
        if (charCounter) charCounter.textContent = "0 / 600 characters";
        if (abstractProgressFill) abstractProgressFill.style.width = "0%";
        if (draftStatusText) draftStatusText.textContent = "Draft cleared. Offline Storage ready.";
        clearFormErrors();
      }
    });
  }

  if (saveDraftManualBtn) {
    saveDraftManualBtn.addEventListener("click", function () {
      autoSaveProjectDraft();
      playLatch();
      alert("Project draft saved to local browser storage!");
    });
  }

  // Initialize custom dropdowns & restore on page load
  initCustomDropdowns();
  restoreProjectDraft();
  syncAllCustomDropdowns();
  renderSavedProjects();

  // =========================================================================
  // 5. Project Form Validation & Submission
  // =========================================================================
  if (projectForm) {
    projectForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearFormErrors();

      const name = studentNameInput ? studentNameInput.value.trim() : "";
      const erp = erpIdInput ? erpIdInput.value.trim() : "";
      const email = studentEmailInput ? studentEmailInput.value.trim() : "";
      const group = groupNoInput ? groupNoInput.value.trim() : "Group - 08";
      const title = projectTitleInput ? projectTitleInput.value.trim() : "";
      const domain = projectDomainSelect ? projectDomainSelect.value : "";
      const repo = repoUrlInput ? repoUrlInput.value.trim() : "";
      const demo = demoUrlInput ? demoUrlInput.value.trim() : "";
      const abstractText = abstractTextarea ? abstractTextarea.value.trim() : "";

      let hasErrors = false;

      // Validate student name
      if (!name) {
        showFieldError("studentName", "Please enter the lead student developer name.");
        hasErrors = true;
      }

      // Validate Roll No / ERP ID
      if (!erp) {
        showFieldError("erpId", "Please enter your college Roll No or ERP ID.");
        hasErrors = true;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showFieldError("studentEmail", "Please enter a valid institutional email address.");
        hasErrors = true;
      }

      // Validate project title
      if (!title) {
        showFieldError("projectTitle", "Please provide a descriptive capstone project title.");
        hasErrors = true;
      }

      // Validate category selection
      if (!domain) {
        showFieldError("projectDomain", "Please select an engineering category.");
        hasErrors = true;
      }

      // Validate abstract length
      if (!abstractText || abstractText.length < 20) {
        showFieldError("projectAbstract", "Synopsis description must be at least 20 characters long.");
        hasErrors = true;
      }

      if (hasErrors) {
        playTick(0.65);
        const firstErr = document.querySelector(".input-error");
        if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Construct project entry
      const refId = "PRJ-" + Math.floor(1000 + Math.random() * 9000);
      const newProject = {
        id: refId,
        studentName: name,
        erpId: erp,
        email: email,
        groupNo: group || "Group - 08",
        projectTitle: title,
        projectDomain: domain,
        repoUrl: repo || "https://github.com/niet-iot-group08",
        demoUrl: demo || "",
        tags: selectedTags.slice(),
        projectAbstract: abstractText,
        submittedAt: new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      // Save into LocalStorage
      saveProjectLocally(newProject);
      localStorage.removeItem("capstone_project_draft");

      // Play success audio
      playLatch();

      // Show success alert
      if (submittedProjectTitle) submittedProjectTitle.textContent = title;
      if (submittedProjectRef) submittedProjectRef.textContent = "ID: " + refId;
      if (submissionSuccessAlert) {
        submissionSuccessAlert.classList.add("visible");
        submissionSuccessAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      // Reset form
      projectForm.reset();
      syncAllCustomDropdowns();
      selectedTags = [];
      techChipButtons.forEach(function (c) { c.classList.remove("selected"); });
      updateSelectedTagsUI();
      if (charCounter) charCounter.textContent = "0 / 600 characters";
      if (abstractProgressFill) abstractProgressFill.style.width = "0%";
      if (draftStatusText) draftStatusText.textContent = "Project successfully recorded. Ready for new submission.";

      renderSavedProjects();
    });
  }

  // =========================================================================
  // 6. Mentor Inquiry Form Validation & Submission
  // =========================================================================
  if (queryForm) {
    queryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearFormErrors();

      const qName = queryStudentName ? queryStudentName.value.trim() : "";
      const qErp = queryErpId ? queryErpId.value.trim() : "";
      const qEmail = queryEmail ? queryEmail.value.trim() : "";
      const qCat = queryCategory ? queryCategory.value : "";
      const qMsg = queryMessage ? queryMessage.value.trim() : "";

      let hasErrors = false;

      if (!qName) {
        showFieldError("queryStudentName", "Please enter your name.");
        hasErrors = true;
      }
      if (!qErp) {
        showFieldError("queryErpId", "Please enter your roll number.");
        hasErrors = true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!qEmail || !emailRegex.test(qEmail)) {
        showFieldError("queryEmail", "Please enter a valid email address.");
        hasErrors = true;
      }
      if (!qCat) {
        showFieldError("queryCategory", "Please select a query topic.");
        hasErrors = true;
      }
      if (!qMsg || qMsg.length < 10) {
        showFieldError("queryMessage", "Please write your query (at least 10 characters).");
        hasErrors = true;
      }

      if (hasErrors) {
        playTick(0.65);
        return;
      }

      playLatch();
      if (submittedQuerySubject) submittedQuerySubject.textContent = qCat;
      if (inquirySuccessAlert) {
        inquirySuccessAlert.classList.add("visible");
        inquirySuccessAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      queryForm.reset();
      syncAllCustomDropdowns();
    });
  }

  // =========================================================================
  // 7. Helpers: Error Rendering
  // =========================================================================
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const trigger = document.getElementById(fieldId + "Trigger");
    const errorEl = document.getElementById(fieldId + "Error");
    if (field) field.classList.add("input-error");
    if (trigger) trigger.classList.add("input-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("visible");
    }
  }

  function clearFormErrors() {
    const inputs = document.querySelectorAll(".form-input, .form-select, .form-textarea, .custom-dropdown-trigger");
    inputs.forEach(function (el) {
      el.classList.remove("input-error");
    });
    const errorMsgs = document.querySelectorAll(".field-error-msg");
    errorMsgs.forEach(function (el) {
      el.classList.remove("visible");
      el.textContent = "";
    });
  }

  // =========================================================================
  // 8. LocalStorage Submissions Manager
  // =========================================================================
  function saveProjectLocally(project) {
    try {
      const existing = JSON.parse(localStorage.getItem("student_showcase_projects") || "[]");
      existing.unshift(project);
      localStorage.setItem("student_showcase_projects", JSON.stringify(existing));
    } catch (err) {
      console.log("Storage error:", err);
    }
  }

  function renderSavedProjects() {
    if (!localListContainer) return;
    try {
      const list = JSON.parse(localStorage.getItem("student_showcase_projects") || "[]");
      if (list.length === 0) {
        localListContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.82rem; font-style:italic;">No project submissions archived on this browser yet.</p>';
        return;
      }

      let html = "";
      list.slice(0, 4).forEach(function (item, index) {
        html += '<div class="local-sub-item">';
        html += '  <div class="local-sub-header">';
        html += '    <strong class="local-sub-title">' + escapeHtml(item.projectTitle) + '</strong>';
        html += '    <span class="local-sub-badge">' + escapeHtml(item.id || "PRJ") + '</span>';
        html += '  </div>';
        html += '  <div class="local-sub-meta">';
        html += '    <span>' + escapeHtml(item.studentName) + ' (' + escapeHtml(item.erpId) + ')</span> &bull; ';
        html += '    <span>' + escapeHtml(item.projectDomain) + '</span>';
        if (Array.isArray(item.tags) && item.tags.length > 0) {
          html += '  <br><small style="color:var(--accent); font-family:var(--font-mono);">' + escapeHtml(item.tags.join(", ")) + '</small>';
        }
        html += '  </div>';
        html += '  <div class="local-sub-footer">';
        html += '    <span>' + escapeHtml(item.submittedAt) + '</span>';
        html += '    <button type="button" class="local-sub-del-btn" data-del-id="' + escapeHtml(item.id) + '">Remove</button>';
        html += '  </div>';
        html += '</div>';
      });

      localListContainer.innerHTML = html;

      // Attach delete item handlers
      const delBtns = localListContainer.querySelectorAll(".local-sub-del-btn");
      delBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const idToDelete = btn.getAttribute("data-del-id");
          if (confirm("Delete entry " + idToDelete + " from local browser records?")) {
            playTick(0.85);
            deleteSubmission(idToDelete);
          }
        });
      });
    } catch (err) {
      console.log("Error loading saved projects:", err);
    }
  }

  function deleteSubmission(idToDelete) {
    try {
      let list = JSON.parse(localStorage.getItem("student_showcase_projects") || "[]");
      list = list.filter(function (item) { return item.id !== idToDelete; });
      localStorage.setItem("student_showcase_projects", JSON.stringify(list));
      renderSavedProjects();
    } catch (e) {}
  }

  // Clear All button
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", function () {
      const list = JSON.parse(localStorage.getItem("student_showcase_projects") || "[]");
      if (list.length === 0) return;
      if (confirm("Clear all " + list.length + " saved submissions from this browser?")) {
        playLatch();
        localStorage.removeItem("student_showcase_projects");
        renderSavedProjects();
      }
    });
  }

  // Export JSON button
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      try {
        const list = JSON.parse(localStorage.getItem("student_showcase_projects") || "[]");
        if (list.length === 0) {
          alert("No saved projects to export yet. Submit a project first!");
          return;
        }

        playLatch();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "niet_capstone_submissions_group08.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      } catch (e) {
        alert("Export failed: " + e.message);
      }
    });
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
