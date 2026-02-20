localStorage.setItem("loggedIn", true);


function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  // Demo credentials
  if (username === "admin" && password === "1234") {
    window.location.href = "index.html";
  } else {
    errorMsg.innerText = "❌ Invalid username or password";
  }
}
