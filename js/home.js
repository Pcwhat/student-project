/* 
   Web Designing Project (DCSE0152) - Capstone Showcase
   Group 08 | NIET Greater Noida
   Home Page JavaScript (home.js)
*/

document.addEventListener("DOMContentLoaded", function () {
  // Quick Search Bar on Home Page
  const searchInput = document.getElementById("heroSearchInput");
  const searchBtn = document.getElementById("heroSearchBtn");

  function goToProjectsPage() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = "projects.html?q=" + encodeURIComponent(query);
    } else {
      window.location.href = "projects.html";
    }
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", goToProjectsPage);
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        goToProjectsPage();
      }
    });
  }
});
