// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  r.classList.toggle("collapse");
});

// const days = document.querySelector("#days");
// console.log(days);
// days.innerHTML = 123;
// const badge = document.querySelector("#badge");
// console.log(badge);
// badge.innerHTML = "High";
// badge.classList.replace("success", "danger");

const card = document.createElement("card");

card.innerHTML = `
<div class="card">
<b class="badge success" id="badge">Low</b>
<h5 class="title">Title of the task</h5>
<div class="progress-container">
  <div class="progress-bar">
    <progress value="10" max="100"></progress>
  </div>
  <div class="progress-value">
    10%
  </div>
</div>
<h5 class="user">Gupta, Shubham</h5>
<h6 class="deadline">due in <span id="days">xx</span> days</h6>
</div>`;

document.querySelector(".card-holder.active").appendChild(card);

const new_task = document.querySelector(".add_task");

// Open the form
new_task.addEventListener("click", function () {
  document.getElementById("addTaskForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
});

const task = document.querySelectorAll(".card-holder .card");

// Open the form
task.forEach((item) => {
  item.addEventListener("click", function () {
    document.getElementById("editTaskForm").style.display = "block";
    document.getElementById("overlay").style.display = "block"; // Show overlay
  });
});

// Close the form
function closeObjForm() {
  document.getElementById("addTaskForm").style.display = "none";
  document.getElementById("editTaskForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}