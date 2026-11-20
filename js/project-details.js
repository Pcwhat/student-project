/* 
   Web Designing Project (DCSE0152) - Capstone Showcase
   Group 08 | NIET Greater Noida
   Project Details JavaScript (project-details.js)
   Features:
   - Tab switching between Overview, Architecture, Team, and Rubric
   - Smooth horizontal auto-scroll into view when tab is selected
   - Mouse wheel horizontal scroll support on the tabs container
*/

document.addEventListener("DOMContentLoaded", function () {
  const tabsContainer = document.querySelector(".case-study-tabs");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetTabId = btn.getAttribute("data-tab");

      // Set active button
      tabBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      // Smoothly ensure active tab is scrolled into view within the tabs container
      btn.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });

      // Show matching tab pane
      tabPanes.forEach(function (pane) {
        if (pane.id === targetTabId) {
          pane.classList.add("active");
        } else {
          pane.classList.remove("active");
        }
      });
    });
  });

  // Enable desktop mouse wheel horizontal scroll on the tabs bar
  if (tabsContainer) {
    tabsContainer.addEventListener("wheel", function (e) {
      if (e.deltaY !== 0 && tabsContainer.scrollWidth > tabsContainer.clientWidth) {
        e.preventDefault();
        tabsContainer.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
});
