// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");
const currProject = JSON.parse(localStorage.getItem("project"));
const user = JSON.parse(localStorage.getItem("user"));
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
  renderDeliverables();
  getObjectives();
  // console.log("Project changed:",currProject.id,currProject.name);
}

function createCard(deliverable) {
  const card = document.createElement("card");
  let badge = "";
  switch (deliverable.priority) {
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

  card.setAttribute("id", deliverable._id);
  card.innerHTML = `
        <div class="card">
        <b class="badge ${badge}" id="badge">${deliverable.priority}</b>
        <h3 class="title">${deliverable.name}</h3>
        <div class="progress-container">
          <div class="progress-bar">
            <progress value="${deliverable.progress}" max="100"></progress>
          </div>
          <div class="progress-value">
          ${deliverable.progress}%
          </div>
        </div>
        <h6 class="deadline">due in ${deliverable.dueDays} days</h6>
        </div>`;
  card.setAttribute("onclick", "editDeliverable(this.id)");
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
  }
}

function renderDeliverables() {
  document.querySelector(".card-holder.active").innerHTML = "";
  document.querySelector(".card-holder.in_progress").innerHTML = "";
  document.querySelector(".card-holder.complete").innerHTML = "";

  $.ajax({
    url: `http://localhost:3000/api/deliverable?projectId=${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      data.forEach((deliverable) => {
        const card = createCard(deliverable);
        putCard(card, deliverable.status);
      });
    },
    error: function () {},
  });
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
      renderDeliverables();
      getObjectives();
    },
    error: function () {},
  });
}

function getObjectives() {
  document.querySelector(".add_deliverable #add_objective").innerHTML = "";
  document.querySelector(".edit_deliverable #edit_objective").innerHTML = "";

  $.ajax({
    url: `http://localhost:3000/api/objective?projectId=${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);

      const div = document.createElement("div");
      const select = document.createElement("select");
      select.setAttribute("id", "objectives");
      data.forEach((objective) => {
        const option = document.createElement("option");
        option.setAttribute("id", `${objective._id}`);
        option.innerText = objective.name;
        select.appendChild(option);
        div.appendChild(select);
      });

      document.querySelector(".add_deliverable #add_objective").innerHTML =
        div.innerHTML;
      document.querySelector(".edit_deliverable #edit_objective").innerHTML =
        div.innerHTML;
    },
    error: function () {},
  });
}
// add deliverable
function addDeliverable() {
  document.getElementById("addDeliverableForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
}

// handle submit
document
  .querySelector("#addDeliverableForm .add_deliverable")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Get form values
    const select = document.querySelector(".add_deliverable #objectives");
    const project = currProject.id;

    const objective = select.options[select.options.selectedIndex].id;
    const name = document.querySelector(".add_deliverable #name").value;
    const description = document.querySelector(
      ".add_deliverable #description"
    ).value;
    const startDate = document.querySelector(
      ".add_deliverable #startDate"
    ).value;
    const deadLine = document.querySelector(".add_deliverable #deadLine").value;
    const priority = document.querySelector(".add_deliverable #priority").value;

    const formData = {
      project,
      objective,
      name,
      description,
      startDate,
      deadLine,
      priority,
    };
    // console.log("Form submitted with values:");
    // console.log("Objective:", objective);
    // console.log("Name:", name);
    // console.log("Description:", description);
    // console.log("Start Date:", startDate);
    // console.log("Dead Line:", deadLine);
    // console.log("Priority:", priority);

    $.ajax({
      url: `http://localhost:3000/api/deliverable`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (data) {
        console.log("API response:", data);
        document.querySelector("#addDeliverableForm .add_deliverable").reset();

        renderDeliverables();
        closeDeliverableForm();
      },
      error: function (result) {
        const err = JSON.parse(result.responseText);
        document.querySelector(".dialog-content").innerText = err.errors[0].msg;
        console.log(err.errors[0].msg);
        fail_dialog.style.display = "block";
      },
    });
  });

let currDeliverable = {
  id: "",
};

// edit deliverable 
function editDeliverable(deliverable) {
  currDeliverable.id = deliverable;
  $.ajax({
    url: `http://localhost:3000/api/deliverable/${deliverable}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      // console.log(data.objective);
      document.querySelector(".edit_deliverable #name").value = data.name;
      document.querySelector(".edit_deliverable #description").value =
        data.description;
      let dateTime = new Date(data.startDate);
      let formattedDate = dateTime.toISOString().split("T")[0];
      document.querySelector(".edit_deliverable #startDate").value =
        formattedDate;
      dateTime = new Date(data.deadLine);
      formattedDate = dateTime.toISOString().split("T")[0];
      document.querySelector(".edit_deliverable #deadLine").value =
        formattedDate;
      document.querySelector(".edit_deliverable #priority").value =
        data.priority;
      const select = document.querySelector(".edit_deliverable #objectives");
      select.options[(id = `${data.objective}`)].selected = true;

      document.getElementById("editDeliverableForm").style.display = "block";
      document.getElementById("overlay").style.display = "block"; // Show overlay
    },
    error: function () {},
  });
}

// update deliverable
function updateDel() {
  console.log("Deliverable:", currDeliverable.id);
  const name = document.querySelector(".edit_deliverable #name").value;
  const description = document.querySelector(
    ".edit_deliverable #description"
  ).value;
  const startDate = document.querySelector(
    ".edit_deliverable #startDate"
  ).value;
  const deadLine = document.querySelector(".edit_deliverable #deadLine").value;
  const priority = document.querySelector(".edit_deliverable #priority").value;
  const select = document.querySelector(".edit_deliverable #objectives");
  const objective = select.options[select.options.selectedIndex].id;

  const formData = {
    objective,
    name,
    description,
    startDate,
    deadLine,
    priority,
  };

  // console.log("Form submitted with values:");
  // console.log("Objective:", objective);
  // console.log("Name:", name);
  // console.log("Description:", description);
  // console.log("Start Date:", startDate);
  // console.log("DeadLine:", deadLine);
  // console.log("Priority:", priority);

  $.ajax({
    url: `http://localhost:3000/api/deliverable/${currDeliverable.id}`,
    type: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (data) {
      console.log("API response:", data);
      renderDeliverables();
      closeDeliverableForm();
    },
    error: function (result) {
      const err = JSON.parse(result.responseText);
        document.querySelector(".dialog-content").innerText = err.errors[0].msg;
        console.log(err.errors[0].msg);
        fail_dialog.style.display = "block";
    },
  });
}

// delete deliverable
function deleteDel() {
  console.log("Deliverable:", currDeliverable.id);

  $.ajax({
    url: `http://localhost:3000/api/deliverable/${currDeliverable.id}`,
    type: "DELETE",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      renderDeliverables();
      closeDeliverableForm();
    },
    error: function (err) {
      console.log(err);
    },
  });
}

// Close the form
function closeDeliverableForm() {
  document.getElementById("addDeliverableForm").style.display = "none";
  document.getElementById("editDeliverableForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}

// Close the Dialog
function closeDialogForm() {
  fail_dialog.style.display = "none";
}
