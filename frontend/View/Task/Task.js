// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");
const user = JSON.parse(localStorage.getItem("user"));
const currProject = JSON.parse(localStorage.getItem("project"));
const fail_dialog = document.getElementById("fail-dialog");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  r.classList.toggle("collapse");
});

document.addEventListener("DOMContentLoaded", () => {
  // console.log(currProject);
  renderProjectOptions();
});

function changeCurrentProject() {
  const selectProject = document.querySelector(".change_project select");
  currProject.id =
    selectProject.options[selectProject.options.selectedIndex].id;
  currProject.name = selectProject.value;
  renderTasks();
  getDeliverables();
  getUsers();
  // console.log("Project changed:",currProject.id,currProject.name);
}

function renderProjectOptions() {
  $.ajax({
    url: `http://localhost:3000/api/projects?userId=${user.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      const select = document.createElement("select");
      select.setAttribute("onchange", "changeCurrentProject()");
      data.forEach((project) => {
        const option = document.createElement("option");
        option.setAttribute("id", `${project._id}`);
        option.innerText = project.name;
        select.appendChild(option);
      });
      document.querySelector(".change_project").appendChild(select);
      currProject.id = select.options[select.options.selectedIndex].id;
      currProject.name = select.value;
      renderTasks();
      getDeliverables();
      getUsers();
    },
    error: function () {},
  });
}

function renderTasks() {
  document.querySelector(".card-holder.active").innerHTML = "";
  document.querySelector(".card-holder.in_progress").innerHTML = "";
  document.querySelector(".card-holder.complete").innerHTML = "";
  document.querySelector(".card-holder.closed").innerHTML = "";

  $.ajax({
    url: `http://localhost:3000/api/task?projectId=${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      data.forEach((task) => {
        const card = createCard(task);
        putCard(card, task.status);
      });
    },
    error: function () {},
  });
}

function getDeliverables() {
  document.querySelector(".add_task #add_deliverable").innerHTML = "";
  document.querySelector(".edit_task #edit_deliverable").innerHTML = "";

  $.ajax({
    url: `http://localhost:3000/api/deliverable?projectId=${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);

      const div = document.createElement("div");
      const select = document.createElement("select");
      select.setAttribute("id", "deliverables");
      data.forEach((deliverable) => {
        const option = document.createElement("option");
        option.setAttribute("id", `${deliverable._id}`);
        option.innerText = deliverable.name;
        select.appendChild(option);
        div.appendChild(select);
      });

      document.querySelector(".add_task #add_deliverable").innerHTML =
        div.innerHTML;
      document.querySelector(".edit_task #edit_deliverable").innerHTML =
        div.innerHTML;
    },
    error: function () {},
  });
}

function getUsers() {
  document.querySelector(".add_task #add_user").innerHTML = "";
  document.querySelector(".edit_task #edit_user").innerHTML = "";

  $.ajax({
    url: `http://localhost:3000/api/users?projectId=${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);

      const div = document.createElement("div");
      const select = document.createElement("select");
      select.setAttribute("id", "users");
      data.forEach((user) => {
        const option = document.createElement("option");
        option.setAttribute("id", `${user._id}`);
        option.innerText = user.uname;
        select.appendChild(option);
        div.appendChild(select);
      });

      document.querySelector(".add_task #add_user").innerHTML = div.innerHTML;
      document.querySelector(".edit_task #edit_user").innerHTML = div.innerHTML;
    },
    error: function () {},
  });
}
let updates;

function createCard(task) {
  const card = document.createElement("card");
  let badge = "";
  switch (task.priority) {
    case "LOW":
      badge = "success";
      break;
    case "MEDIUM":
      badge = "warning";
      break;
    case "HIGH":
      badge = "danger";
      break;
  }

  card.setAttribute("id", task._id);
  card.setAttribute("onclick", "editTask(this.id)");

  $.ajax({
    url: `http://localhost:3000/api/task/${task._id}/user`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      // console.log("API response:", data);
      // console.log("user:", data.user.uname);
      card.innerHTML = `
        <div class="card">
        <b class="badge ${badge}" id="badge">${task.priority}</b>
        <h3 class="title">${task.name}</h3>
        <h4 class="user">${data.user.uname}</h4>
        <h6 class="deadline">due in ${task.dueDays} days</h6>
        </div>`;
    },
    error: function () {},
  });

  return card;
}

function putCard(card, status) {
  switch (status) {
    case "ACTIVE":
      document.querySelector(".card-holder.active").appendChild(card);
      break;
    case "IN_PROGRESS":
      document.querySelector(".card-holder.in_progress").appendChild(card);
      break;
    case "OVERDUE":
      // document.querySelector(".card-holder.overdue").appendChild(card);
      break;
    case "COMPLETE":
      document.querySelector(".card-holder.complete").appendChild(card);
      break;
    case "CLOSED":
      document.querySelector(".card-holder.closed").appendChild(card);
      break;
  }
}

// add task
function addTask() {
  document.getElementById("addTaskForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
}

let currTask = {
  id: "",
};

// edit task
function editTask(task) {
  currTask.id = task;
  $.ajax({
    url: `http://localhost:3000/api/task/${task}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      document.querySelector(".edit_task #name").value = data.name;
      document.querySelector(".edit_task #description").value =
        data.description;
      let dateTime = new Date(data.startDate);
      let formattedDate = dateTime.toISOString().split("T")[0];
      document.querySelector(".edit_task #startDate").value = formattedDate;
      dateTime = new Date(data.deadLine);
      formattedDate = dateTime.toISOString().split("T")[0];
      document.querySelector(".edit_task #deadLine").value = formattedDate;
      document.querySelector(".edit_task #priority").value = data.priority;

      const deliverable = document.querySelector(".edit_task #deliverables");
      deliverable.options[(id = `${data.deliverable}`)].selected = true;

      const status = document.querySelector(".edit_task #status");
      status.value = `${data.status}`;

      const user = document.querySelector(".edit_task #users");
      user.options[(id = `${data.user}`)].selected = true;

      document.getElementById("editTaskForm").style.display = "block";
      document.getElementById("overlay").style.display = "block"; // Show overlay
    },
    error: function () {},
  });
}

// update task
function updateTask() {
  console.log("Task:", currTask.id);
  const name = document.querySelector(".edit_task #name").value;
  const description = document.querySelector(".edit_task #description").value;
  const startDate = document.querySelector(".edit_task #startDate").value;
  const deadLine = document.querySelector(".edit_task #deadLine").value;
  const priority = document.querySelector(".edit_task #priority").value;
  const selectDeliverable = document.querySelector(".edit_task #deliverables");
  const deliverable =
    selectDeliverable.options[selectDeliverable.options.selectedIndex].id;
  const selectUser = document.querySelector(".edit_task #users");
  const user = selectUser.options[selectUser.options.selectedIndex].id;
  const status = document.querySelector(".edit_task #status").value;

  const formData = {
    deliverable,
    user,
    name,
    description,
    startDate,
    deadLine,
    priority,
    status,
  };
  console.log(formData);
  // console.log("Form submitted with values:");
  // console.log("Objective:", objective);
  // console.log("Name:", name);
  // console.log("Description:", description);
  // console.log("Start Date:", startDate);
  // console.log("DeadLine:", deadLine);
  // console.log("Priority:", priority);

  $.ajax({
    url: `http://localhost:3000/api/task/${currTask.id}`,
    type: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (data) {
      console.log("API response:", data);
      renderTasks();
      closeTaskForm();
    },
    error: function (result) {
      const err = JSON.parse(result.responseText);
      document.querySelector(".dialog-content").innerText = err.errors[0].msg;
      console.log(err.errors[0].msg);
      fail_dialog.style.display = "block";
    },
  });
}

// handle submit
document
  .querySelector("#addTaskForm .add_task")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Get form values
    const selectedDeliverable = document.querySelector(
      ".add_task #deliverables"
    );
    const selectedUser = document.querySelector(".add_task #users");

    const project = currProject.id;
    const deliverable =
      selectedDeliverable.options[selectedDeliverable.options.selectedIndex].id;
    const user = selectedUser.options[selectedUser.options.selectedIndex].id;
    const name = document.querySelector(".add_task #name").value;
    const description = document.querySelector(".add_task #description").value;
    const startDate = document.querySelector(".add_task #startDate").value;
    const deadLine = document.querySelector(".add_task #deadLine").value;
    const priority = document.querySelector(".add_task #priority").value;

    const formData = {
      project,
      deliverable,
      user,
      name,
      description,
      startDate,
      deadLine,
      priority,
    };
    console.log("Form submitted with values:");
    console.log("Project:", project);
    console.log("User:", user);
    console.log("Deliverable:", deliverable);
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Start Date:", startDate);
    console.log("Dead Line:", deadLine);
    console.log("Priority:", priority);

    $.ajax({
      url: `http://localhost:3000/api/task`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (data) {
        console.log("API response:", data);
        document.querySelector("#addTaskForm .add_task").reset();
        renderTasks();
        closeTaskForm();
      },
      error: function (result) {
        const err = JSON.parse(result.responseText);
        document.querySelector(".dialog-content").innerText = err.errors[0].msg;
        console.log(err.errors[0].msg);
        fail_dialog.style.display = "block";
      },
    });
  });

// delete deliverable
function deleteTask() {
  $.ajax({
    url: `http://localhost:3000/api/task/${currTask.id}`,
    type: "DELETE",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      renderTasks();
      closeTaskForm();
    },
    error: function (err) {
      console.log(err);
    },
  });
}

// Close the form
function closeTaskForm() {
  document.getElementById("addTaskForm").style.display = "none";
  document.getElementById("editTaskForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}

// Close the Dialog
function closeDialogForm() {
  fail_dialog.style.display = "none";
}
