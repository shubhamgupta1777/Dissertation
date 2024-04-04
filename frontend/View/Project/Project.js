// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");
const currProject = JSON.parse(localStorage.getItem("project"));
const objectiveList = document.querySelector(".objectives");
const membersList = document.querySelector(".members");
const fail_dialog = document.getElementById("fail-dialog");
const delete_dialog = document.getElementById("delete-dialog");



toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  r.classList.toggle("collapse");
});

function renderProjectDetails() {
  $.ajax({
    url: `http://localhost:3000/api/project/${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      document.getElementById("project-name").innerText = data.name;
      const status = document.getElementById("status");
      status.innerText = data.status;

      switch (status.innerText) {
        case "ACTIVE":
          status.classList.add("warning");
          break;
        case "IN_PROGRESS":
          status.classList.add("warning");
          break;
        case "COMPLETE":
          status.classList.add("success");
          break;
        case "OVERDUE":
          status.classList.add("danger");
          break;
      }
      document.getElementById("description").innerText = data.description;

      var options = { day: "numeric", month: "long", year: "numeric" };

      let date = new Date(data.startDate);
      var formattedDate = date.toLocaleDateString("en-US", options);

      document.getElementById("startDate").innerText = formattedDate;

      date = new Date(data.deadLine);
      formattedDate = date.toLocaleDateString("en-US", options);

      document.getElementById("endDate").innerText = formattedDate;
    },
    error: function () {},
  });
}

function renderObjectives() {
  objectiveList.innerHTML = "";
  $.ajax({
    url: `http://localhost:3000/api/objective?projectId=${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      let objectives = data;

      objectives.forEach((objective) => {
        const row = document.createElement("tr");
        row.classList.add("objective");
        const col = document.createElement("td");
        col.setAttribute("id", `${objective._id}`);
        col.innerHTML = `<td>${objective.name}</td>`;
        row.appendChild(col);
        objectiveList.appendChild(row);
      });
    },
    error: function () {},
  });
}

function renderTeamMembers() {
  membersList.innerHTML = "";
  $.ajax({
    url: `http://localhost:3000/api/users?projectId=${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      let users = data;

      users.forEach((user) => {
        const row = document.createElement("tr");
        const col = document.createElement("td");
        col.setAttribute("id", `${user._id}`);
        col.innerHTML = `<td>${user.uname}</td>`;
        row.appendChild(col);
        membersList.appendChild(row);
      });
    },
    error: function () {},
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectDetails();
  renderObjectives();
  renderTeamMembers();
});
//++++++++++++ PROJECT ++++++++++++//

// Open the form
function editProject() {
  $.ajax({
    url: `http://localhost:3000/api/project/${currProject.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      document.querySelector("#editProjectForm #title").value = data.name;
      document.querySelector("#editProjectForm #description").value =
        data.description;
      let dateTime = new Date(data.startDate);
      let formattedDate = dateTime.toISOString().split("T")[0];
      document.querySelector("#editProjectForm #startDate").value =
        formattedDate;
      dateTime = new Date(data.deadLine);
      formattedDate = dateTime.toISOString().split("T")[0];
      document.querySelector("#editProjectForm #deadLine").value =
        formattedDate;

      document.getElementById("editProjectForm").style.display = "block";
      document.getElementById("overlay").style.display = "block"; // Show overlay
    },
    error: function () {},
  });
}

document
  .querySelector(".form-container.proj")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Get form values
    const name = document.querySelector(".proj #title").value;
    const description = document.querySelector(".proj #description").value;
    const startDate = document.querySelector(".proj #startDate").value;
    const deadLine = document.querySelector(".proj #deadLine").value;

    const formData = {
      name,
      description,
      startDate,
      deadLine,
    };
    // console.log("Form submitted with values:");
    // console.log("Name:", name);
    // console.log("Description:", description);
    // console.log("Start Date:", startDate);
    // console.log("Dead Line:", deadLine);

    $.ajax({
      url: `http://localhost:3000/api/project/${currProject.id}`,
      type: "PATCH",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (data) {
        console.log("API response:", data);
        renderProjectDetails();
        closeForm();
      },
      error: function (result) {
        const err = JSON.parse(result.responseText);
        document.querySelector(".dialog-content").innerText = err.errors[0].msg;
        console.log(err.errors[0].msg);
        fail_dialog.style.display = "block";
      },
    });
  });

function deleteDialog() {
  document.querySelector("#delete-dialog").style.display = "block";
}

function deleteProject() {
  $.ajax({
    url: `http://localhost:3000/api/users/project/${currProject.id}`,
    type: "DELETE",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
    },
    error: function () {},
  });
  window.location.href = "./Projects.html";
}

// Close the form
function closeForm() {
  const form = document.querySelector("#editProjectForm .proj");
  form.reset();
  document.getElementById("editProjectForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}

//++++++++++++ OBJECTIVES ++++++++++++//
const new_objective = document.querySelector(".add_obj");

// Open the form
new_objective.addEventListener("click", function () {
  document.getElementById("addObjectiveForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
});

document
  .querySelector(".form-container.obj")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Get form values
    const name = document.querySelector("#addObjectiveForm #title").value;
    const description = document.querySelector(
      "#addObjectiveForm #description"
    ).value;
    const priority = document.querySelector(
      "#addObjectiveForm #priority"
    ).value;
    const project = currProject.id;

    const formData = {
      name,
      description,
      priority,
      project,
    };
    // console.log("Form submitted with values:");
    // console.log("Name:", name);
    // console.log("Description:", description);
    // console.log("Priority:", priority);
    // console.log("Project:", project);

    $.ajax({
      url: `http://localhost:3000/api/objective`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (data) {
        console.log("API response:", data);
        renderObjectives();
      },
      error: function () {},
    });

    // Close the form
    this.reset();
    closeObjForm();
  });

let currObjective = {
  id: "",
};
// Open the form
const objectivesList = document.querySelector(".objectives");
objectivesList.addEventListener("click", function (event) {
  // Get details of the clicked element
  const clickedElement = event.target;
  const title = document.querySelector("#editObjectiveForm #title");
  const description = document.querySelector("#editObjectiveForm #description");
  const priority = document.querySelector("#editObjectiveForm #priority");

  $.ajax({
    url: `http://localhost:3000/api/objective/${clickedElement.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      title.value = data.name;
      description.value = data.description;
      priority.value = data.priority;

      currObjective = {
        id: clickedElement.id,
      };
      document.getElementById("overlay").style.display = "block"; // Show overlay
      document.getElementById("editObjectiveForm").style.display = "block";
    },
    error: function () {},
  });
});

// update objective
function updateObj() {
  const name = document.querySelector("#editObjectiveForm #title").value;
  const description = document.querySelector(
    "#editObjectiveForm #description"
  ).value;
  const priority = document.querySelector("#editObjectiveForm #priority").value;

  const formData = {
    name,
    description,
    priority,
  };

  // console.log("Form submitted with values:");
  // console.log("Objective:", currObjective.id);
  // console.log("Name:", name);
  // console.log("Description:", description);
  // console.log("Priority:", priority);

  $.ajax({
    url: `http://localhost:3000/api/objective/${currObjective.id}`,
    type: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (data) {
      console.log("API response:", data);
      renderObjectives();
    },
    error: function (err) {
      console.log(err);
    },
  });
  closeObjForm();
}

function deleteObj() {
  $.ajax({
    url: `http://localhost:3000/api/objective/${currObjective.id}`,
    type: "DELETE",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      renderObjectives();
    },
    error: function (err) {
      console.log(err);
    },
  });
  closeObjForm();
}

// Close the form
function closeObjForm() {
  const form = document.querySelector("#editObjectiveForm .obj");
  form.reset();

  document.getElementById("addObjectiveForm").style.display = "none";
  document.getElementById("editObjectiveForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}

//++++++++++++ PROJECT MEMBERS ++++++++++++//
const new_member = document.querySelector(".add_mem");
// Open the form
new_member.addEventListener("click", function () {
  document.getElementById("addMemberForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
});

document
  .querySelector(".form-container.tm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Get form values
    const email = document.querySelector("#addMemberForm #email").value;
    const project = currProject.id;

    const formData = {
      project,
    };
    // console.log("Form submitted with values:");
    // console.log("Email:", email);
    // console.log("Project:", project);

    $.ajax({
      url: `http://localhost:3000/api/user?email=${email}`,
      type: "PATCH",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (data) {
        console.log("API response:", data);
        renderTeamMembers();
        closeMemForm();
      },
      error: function (result) {
        const err = JSON.parse(result.responseText);
        document.querySelector(".dialog-content").innerText = err.message;
        fail_dialog.style.display = "block";
      },
    });
  });

const members = document.querySelectorAll(".members");
let currMember = {
  id: "",
};
// Open the form
members.forEach((item) => {
  item.addEventListener("click", function (event) {
    const clickedElement = event.target;
    const name = document.querySelector(".profile-card #name");
    const id = document.querySelector(".profile-card #id");
    const email = document.querySelector(".profile-card #email");

    console.log(clickedElement);
    $.ajax({
      url: `http://localhost:3000/api/user/${clickedElement.id}`,
      type: "GET",
      contentType: "application/json",
      success: function (data) {
        console.log("API response:", data);
        name.innerText = data.uname;
        id.innerText = data._id;
        email.innerText = data.email;

        currMember.id = clickedElement.id;

        document.getElementById("editMemberForm").style.display = "block";
        document.getElementById("overlay").style.display = "block"; // Show overlay
      },
      error: function () {},
    });
  });
});

function removeUser() {
  $.ajax({
    url: `http://localhost:3000/api/user/${currMember.id}/project/${currProject.id}`,
    type: "DELETE",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      renderTeamMembers();
    },
    error: function () {},
  });
  closeMemForm();
}
// Close the Dialog
function closeDialogForm() {
  delete_dialog.style.display = "none";
  fail_dialog.style.display = "none";
}

// Close the form
function closeMemForm() {
  const name = document.querySelector(".profile-card #name");
  name.innerText = "";
  const id = document.querySelector(".profile-card #id");
  id.innerText = "";
  const email = document.querySelector(".profile-card #email");
  email.innerText = "";
  const user = document.querySelector(".tm");
  user.reset();

  document.getElementById("addMemberForm").style.display = "none";
  document.getElementById("editMemberForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}
