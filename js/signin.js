document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const messageElement = document.getElementById("loginMessage");
    
    messageElement.textContent = "";
    messageElement.className = "message";
    
    const storedUsers = JSON.parse(localStorage.getItem("SignUp")) || [];
    const user = storedUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem("CurrentUser", JSON.stringify(user));
        messageElement.textContent = "Login successful! Redirecting...";
        messageElement.classList.add("success");

        const redirectPage = sessionStorage.getItem("redirectAfterSignIn");

        if (redirectPage) {
            sessionStorage.removeItem("redirectAfterSignIn");
            window.location.href = redirectPage;
        } else {
            if (user.role === "super_admin") {
                window.location.href = "super_admin.html";
            } else if (user.role === "admin") {
                window.location.href = "sub_admin.html";
            } else {
                window.location.href = "index.html";
            }
        }
        
    } else {
        messageElement.textContent = "Invalid email or password";
        messageElement.classList.add("error");
    }
});
