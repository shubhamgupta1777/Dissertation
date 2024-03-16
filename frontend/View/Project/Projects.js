// Sidebar
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".btn");
const r = document.querySelector(".right-panel");

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

    // Do something with form data (e.g., send it to server)
    console.log("Form submitted with values:");
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Start Date:", startDate);
    console.log("Deadline:", deadLine);

    // Close the form
    this.reset();
    closeForm();
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

  console.log(window.location.href);
  const s = window.location.href.replace("Projects", "Project");
  console.log(s);
  window.location.href = s;
});
