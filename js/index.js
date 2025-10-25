

     // Check if user is logged in
     /* const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
      if (!currentUser) {
          window.location.href = "signin.html";
      }

     // Display welcome message
      if (currentUser) {
          const welcomeElement = document.getElementById("userWelcome");
         // welcomeElement.textContent = مرحباً ${currentUser.name || currentUser.email}!;
      }
*/
      function logout() {
          localStorage.removeItem("CurrentUser");
          window.location.href = "signin.html";
      }
