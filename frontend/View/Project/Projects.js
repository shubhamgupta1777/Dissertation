// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");
const projectList = document.querySelector(".table-container .list");
const user = JSON.parse(localStorage.getItem("user"));
const fail_dialog = document.getElementById("fail-dialog");


window.project = {
  id: "",
  name: "",
};

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  r.classList.toggle("collapse");
});

const new_project = document.querySelector(".btn1");
// Open the form
new_project.addEventListener("click", function () {
  document.getElementById("addProjectForm").style.display = "block";
  document.getElementById("overlay").style.display = "block"; // Show overlay
});

// Close the form
function closeForm() {
  document.querySelector(".form-container").reset();
  document.getElementById("addProjectForm").style.display = "none";
  document.getElementById("overlay").style.display = "none"; // Hide overlay
}

// Handle form submission
document
  .querySelector(".form-container")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Get form values
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const startDate = document.getElementById("startDate").value;
    const deadLine = document.getElementById("deadLine").value;
    const userId = user.id;

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
    // console.log("Deadline:", deadLine);
    // console.log("User:", userId);
    $.ajax({
      url: `http://localhost:3000/api/project?userId=${userId}`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (data) {
        console.log("API response:", data);
        renderProjects();
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

// Handle click events on the document
const list = document.querySelector(".table-container");
list.addEventListener("click", function (event) {
  // Get details of the clicked element
  const clickedElement = event.target;
  const elementText = clickedElement.textContent.trim();

  // Log details of the clicked element
  console.log("Clicked element:", clickedElement);
  console.log("Text:", elementText);

  window.project.id = clickedElement.id;
  window.project.name = elementText;
  localStorage.setItem("project", JSON.stringify(window.project));

  window.location.href = "./Project.html";
});

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
});

function renderProjects() {
  projectList.innerHTML = "";
  $.ajax({
    url: `http://localhost:3000/api/projects?userId=${user.id}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      projects = data;

      projects.forEach((project) => {
        const row = document.createElement("tr");
        row.classList.add("project");

        const col = document.createElement("td");
        col.setAttribute("id", `${project._id}`);
        col.innerHTML = `<td>${project.name}</td>`;
        row.appendChild(col);
        projectList.appendChild(row);
      });
    },
    error: function () {},
  });
}

// Close the Dialog
function closeDialogForm() {
  fail_dialog.style.display = "none";
}
