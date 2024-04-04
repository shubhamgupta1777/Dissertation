// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");
const user = JSON.parse(localStorage.getItem("user"));

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  r.classList.toggle("collapse");
});

document.addEventListener("DOMContentLoaded", () => {
  renderTaskStats();
  renderProjectStats();
});

function renderTaskStats() {
  $.ajax({
    url: `http://localhost:3000/api/dashboard/tasks/${user.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      document.getElementById("project_count").innerText = data.project_count;
      document.getElementById("total_tasks").innerText = data.total_tasks;
      document.getElementById("total_tasks_completed").innerText =
        data.total_tasks_completed;
      document.getElementById("total_tasks_pending").innerText =
        data.total_tasks_pending;
    },
    error: function () {},
  });
}

function renderProjectStats() {
  $.ajax({
    url: `http://localhost:3000/api/projects/?userId=${user.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      const projects = data;
      const list = document.getElementById("project-list");

      data.forEach((project) => {
        const row = document.createElement("tr");
        row.setAttribute("id", "project");

        let badge = "";
        switch (project.status) {
          case "ACTIVE":
            badge = "warning";
            break;
          case "IN_PROGRESS":
            badge = "warning";
            break;
          case "COMPLETE":
            badge = "success";
            break;
          case "OVERDUE":
            badge = "danger";
            break;
        }

        let dateTime = new Date(project.deadLine);
        let formattedDate = dateTime.toISOString().split("T")[0];

        row.innerHTML = `<td> ${project.name} </td>
        <td><b class="badge ${badge}"> ${project.status} </b></td>
        <td> ${formattedDate} </td>
        <td> ${project.complete} % </td>`;
        list.appendChild(row);
      });
    },
    error: function () {},
  });
}

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
