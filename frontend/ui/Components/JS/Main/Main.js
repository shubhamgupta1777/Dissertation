const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

