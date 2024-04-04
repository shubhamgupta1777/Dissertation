const form = document.getElementById("login");
const success_dialog = document.getElementById("success-dialog");
const fail_dialog = document.getElementById("fail-dialog");
const overlay = document.getElementById("overlay");
const close = document.getElementsByClassName("close");

window.user = {
  id: "",
  name: "",
  email: "",
};

close[0].addEventListener("click", function () {
  overlay.style.display = "none";
  fail_dialog.style.display = "none";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const pwd = document.getElementById("password").value;

  // console.log(email);
  // console.log(pwd);

  $.ajax({
    url: `http://localhost:3000/api/user?email=${email}&password=${pwd}`,
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("API response:", data);
      form.reset();
      overlay.style.display = "block";
      success_dialog.style.display = "block";
      window.user.id = `${data._id}`;
      window.user.name = `${data.uname}`;
      window.user.email = `${data.email}`;
      localStorage.setItem("user", JSON.stringify(window.user));
      setTimeout(() => {
        success_dialog.style.display = "none";
        window.location.href = "../Dashboard/Dashboard.html";
      }, 600);
    },
    error: function () {
      form.reset();
      overlay.style.display = "block";
      fail_dialog.style.display = "block";
    },
  });
});
