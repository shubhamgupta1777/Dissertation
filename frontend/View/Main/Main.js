// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  r.classList.toggle("collapse");
});



// Calender
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const monthYear = document.getElementById("monthYear");
const daysContainer = document.getElementById("daysContainer");

let currentDate = new Date();

function renderCalendar() {
  let firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  let lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  let firstDayOfWeek = firstDayOfMonth.getDay();

  monthYear.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  daysContainer.innerHTML = "";

  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("empty");
    daysContainer.appendChild(emptyDay);
  }

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const day = document.createElement("div");
    day.textContent = i;
    day.classList.add("day");
    if (
      currentDate.getFullYear() === new Date().getFullYear() &&
      currentDate.getMonth() === new Date().getMonth() &&
      i === new Date().getDate()
    ) {
      day.classList.add("today");
    }
    day.addEventListener("click", () => {
      showEventModal(
        `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`
      );
    });
    daysContainer.appendChild(day);
  }
}

renderCalendar();

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});
