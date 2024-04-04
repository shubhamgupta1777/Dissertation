const form = document.getElementById("sign-up");
const success_dialog = document.getElementById("success-dialog");
const fail_dialog = document.getElementById("fail-dialog");
const overlay = document.getElementById("overlay");
const close = document.querySelectorAll(".close");

close.forEach((item) => {
  item.addEventListener("click", function () {
    overlay.style.display = "none";
    success_dialog.style.display = "none";
    fail_dialog.style.display = "none";
  });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const uname = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const formData = {
    uname,
    email,
    password,
  };
  console.log(formData);
  $.ajax({
    url: "http://localhost:3000/api/user",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (data) {
      console.log("API response:", data);
      form.reset();
      overlay.style.display = "block";
      success_dialog.style.display = "block";
    },
    error: function () {
      form.reset();
      overlay.style.display = "block";
      fail_dialog.style.display = "block";
    },
  });
});
