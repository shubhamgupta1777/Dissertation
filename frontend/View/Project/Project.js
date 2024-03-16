// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  r.classList.toggle("collapse");
});

// const option = document.querySelector(".fa-ellipsis-vertical");
// option.addEventListener("click", () => {
//   document.querySelector(".dropdown-list").classList.toggle("show");
// });
// // Close the dropdown if the user clicks outside of it
// window.onclick = function (event) {
//   if (!event.target.matches(".btn")) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains("show")) {
//         openDropdown.classList.remove("show");
//       }
//     }
//   }
// };
// const ev = document.querySelector(".obj-container");
// ev.addEventListener("click", function (event) {
//   // Get details of the clicked element
//   const clickedElement = event.target;
//   const elementText = clickedElement.textContent.trim();

//   // Log details of the clicked element
//   console.log("Clicked element:", clickedElement);
//   console.log("Text:", elementText);
// });
// Handle form submission
// document
//   .querySelector(".form-container")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();
//     // Get form values
//     const name = document.getElementById("name").value;
//     const description = document.getElementById("description").value;
//     const startDate = document.getElementById("startDate").value;
//     const deadLine = document.getElementById("deadLine").value;

//     // Do something with form data (e.g., send it to server)
//     console.log("Form submitted with values:");
//     console.log("Name:", name);
//     console.log("Description:", description);
//     console.log("Start Date:", startDate);
//     console.log("Deadline:", deadLine);

//     // Close the form
//     this.reset();
//     closeForm();
//   });

//++++++++++++ OBJECTIVES ++++++++++++//
const new_objective = document.querySelector(".add_obj");

// Open the form
new_objective.addEventListener("click", function () {
  document.getElementById("addObjectiveForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
});

const objectives = document.querySelectorAll(".objectives tr");

// Open the form
objectives.forEach((item) => {
  item.addEventListener("click", function () {
    document.getElementById("editObjectiveForm").style.display = "block";
    document.getElementById("overlay").style.display = "block"; // Show overlay
  });
});

// Close the form
function closeObjForm() {
  document.getElementById("addObjectiveForm").style.display = "none";
  document.getElementById("editObjectiveForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}

//++++++++++++ DELIVERABLES ++++++++++++//
const new_deliverable = document.querySelector(".add_del");

// Open the form
new_deliverable.addEventListener("click", function () {
  document.getElementById("addDeliverableForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
});
const deliverables = document.querySelectorAll(".deliverables tr");

// Open the form
deliverables.forEach((item) => {
  item.addEventListener("click", function () {
    document.getElementById("editDeliverableForm").style.display = "block";
    document.getElementById("overlay").style.display = "block"; // Show overlay
  });
});

// Close the form
function closeDelForm() {
  document.getElementById("addDeliverableForm").style.display = "none";
  document.getElementById("editDeliverableForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}

//++++++++++++ PROJECT MEMBERS ++++++++++++//
const new_member = document.querySelector(".add_mem");

// Open the form
new_member.addEventListener("click", function () {
  document.getElementById("addMemberForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
});

const members = document.querySelectorAll(".members tr");

// Open the form
members.forEach((item) => {
  item.addEventListener("click", function () {
    document.getElementById("editMemberForm").style.display = "block";
    document.getElementById("overlay").style.display = "block"; // Show overlay
  });
});

// Close the form
function closeMemForm() {
  document.getElementById("addMemberForm").style.display = "none";
  document.getElementById("editMemberForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}

//++++++++++++ PROJECT ++++++++++++//
const new_project = document.querySelector(".update_project");
// Open the form
new_project.addEventListener("click", function () {
  document.getElementById("addProjectForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
});

// Close the form
function closeForm() {
  document.getElementById("addProjectForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}
