document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const signupMessage = document.getElementById("signupMessage");

  let signUpContainer = JSON.parse(localStorage.getItem("SignUp")) || [];

  const superAdminEmail = "admin@example.com";
  const superAdminPassword = "adminpassword";

  const superAdminExists = signUpContainer.some(
    (user) => user.email === superAdminEmail && user.role === "super_admin"
  );

  if (!superAdminExists) {
    signUpContainer.push({
      name: "Super Admin",
      email: superAdminEmail,
      password: superAdminPassword,
      role: "super_admin",
      address: "",
      phone: "",
      gender: "",
      birthday: "",
    });
    localStorage.setItem("SignUp", JSON.stringify(signUpContainer));
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const inputs = signupForm.querySelectorAll("input, select");
      inputs.forEach((input) => {
        input.classList.remove("invalid");
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains("error-msg")) {
          errorMsg.remove();
        }
      });
      signupMessage.textContent = "";
      signupMessage.className = "message";

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const address = document.getElementById("address").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const gender = document.getElementById("gender").value;
      const birthday = document.getElementById("birthday").value;

      let isValid = true;

      if (name === "") {
        showError("signupName", "Please enter your name");
        isValid = false;
      }

      const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
      if (!emailRegex.test(email)) {
        showError("email", "Please enter a valid email address");
        isValid = false;
      }

      if (password.length < 6) {
        showError("password", "Password must be at least 6 characters");
        isValid = false;
      } else if (!/[A-Za-z]/.test(password)) {
        showError("password", "Password must contain at least one letter");
        isValid = false;
      }

      if (address === "") {
        showError("address", "Please enter your address");
        isValid = false;
      }

      const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        showError(
          "phone",
          "Phone must start with 010/011/012/015 and be 11 digits"
        );
        isValid = false;
      }

      if (gender === "") {
        showError("gender", "Please select your gender");
        isValid = false;
      }

      if (birthday === "") {
        showError("birthday", "Please select your birth date");
        isValid = false;
      }

      if (isValid) {
        const emailExists = signUpContainer.some(
          (user) => user.email === email
        );

        if (emailExists) {
          signupMessage.textContent = "This email is already registered.";
          signupMessage.classList.add("error");
        } else {
          const newUser = {
            name,
            email,
            password,
            role: "user",
            address,
            phone,
            gender,
            birthday,
          };

          signUpContainer.push(newUser);
          localStorage.setItem("SignUp", JSON.stringify(signUpContainer));
          localStorage.setItem("CurrentUser", JSON.stringify(newUser));

          signupMessage.textContent = "Registration successful!";
          signupMessage.classList.add("success");
          window.location.href = "index.html";
        }
      }
    });
  }

  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add("invalid");

    const errorMsg = document.createElement("div");
    errorMsg.className = "error-msg";
    errorMsg.textContent = message;
    errorMsg.style.color = "#dc3545";
    errorMsg.style.fontSize = "0.8rem";
    errorMsg.style.marginTop = "5px";

    input.insertAdjacentElement("afterend", errorMsg);
  }
});
