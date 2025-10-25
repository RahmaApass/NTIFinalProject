// بيانات الأدمن الرئيسي
const superAdmin = {
  name: "Super Admin",
  email: "admin@example.com",
  password: "adminpassword",
  role: "super_admin",
};

// تخزين البيانات في localStorage
localStorage.setItem("superAdmin", JSON.stringify(superAdmin));

// Check if user is logged in and is super admin
const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
if (!currentUser || currentUser.role !== "super_admin") {
  window.location.href = "signin.html";
}

// Load and display all users
function loadUsers() {
  const users = JSON.parse(localStorage.getItem("SignUp")) || [];
  const adminTableBody = document.querySelector("#adminTable tbody");
  adminTableBody.innerHTML = "";

  const nameFilter = document.getElementById("searchName").value.toLowerCase();
  const roleFilter = document.getElementById("filterRole").value;

  users.forEach((user) => {
    const userName = user.name ? user.name.toLowerCase() : "";
    const userEmail = user.email ? user.email.toLowerCase() : "";
    const userRole = user.role || "user";

    const nameMatch =
      userName.includes(nameFilter) || userEmail.includes(nameFilter);
    const roleMatch = roleFilter === "" || userRole === roleFilter;

    if (nameMatch && roleMatch) {
      const row = adminTableBody.insertRow();
      row.innerHTML = `
                <td>${user.name || user.email}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${userRole}">${getRoleDisplayName(
        userRole
      )}
            `;
    }
  });

  if (adminTableBody.rows.length === 0) {
    adminTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #666;">لا يوجد مستخدمون مطابقون للمعايير</td></tr>`;
  }
}

function getRoleDisplayName(role) {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return " Sup Admin";
    case "user":
      return " User";
    default:
      return role;
  }
}

// Add new admin
document
  .getElementById("addAdminForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("adminName").value.trim();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const messageElement = document.getElementById("addAdminMessage");

    // Clear previous message
    messageElement.style.display = "none";
    messageElement.className = "message";

    // Validation
    if (!name || !email || !password) {
      showMessage("جميع الحقول مطلوبة", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("SignUp")) || [];
    const emailExists = users.some((user) => user.email === email);

    if (emailExists) {
      showMessage("هذا البريد الإلكتروني مستخدم بالفعل", "error");
      return;
    }

    // Add new admin
    const newAdmin = {
      name: name,
      email: email,
      password: password,
      role: "admin", // Assigns 'admin' role
    };

    users.push(newAdmin);
    localStorage.setItem("SignUp", JSON.stringify(users));

    showMessage("تم إضافة الأدمن الفرعي بنجاح", "success");
    document.getElementById("addAdminForm").reset();
    loadUsers(); // Reload the table to show the new admin
  });

function showMessage(text, type) {
  const messageElement = document.getElementById("addAdminMessage");
  messageElement.textContent = text;
  messageElement.className = `message ${type}`;
  messageElement.style.display = "block";
}

function logout() {
  localStorage.removeItem("CurrentUser");
  window.location.href = "signin.html";
}

// Filtering logic
document.getElementById("searchName").addEventListener("input", loadUsers);
document.getElementById("filterRole").addEventListener("change", loadUsers);

// Initial load
loadUsers();
