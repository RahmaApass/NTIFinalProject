window.onload = function () {
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));

  if (!currentUser) {
    window.location.href = "signin.html";
  }

  // عرض بيانات المستخدم
  if (currentUser) {
    document.getElementById("profileName").textContent = currentUser.name || "";
    document.getElementById("profileAddress").textContent =
      currentUser.address || "";
    document.getElementById("profilePhone").textContent =
      currentUser.phone || "";
    document.getElementById("profileEmail").textContent =
      currentUser.email || "";
    document.getElementById("profileGender").textContent =
      currentUser.gender || "";
    document.getElementById("profileBirthday").textContent =
      currentUser.birthday || "";
  }

  const userEmail = currentUser?.email;
  if (!userEmail) return;

  const savedKey = "savedProducts_" + userEmail;
  const cartKey = "cartProducts_" + userEmail;

  const savedProducts = JSON.parse(localStorage.getItem(savedKey)) || [];
  const cartProducts = JSON.parse(localStorage.getItem(cartKey)) || [];

  const savedTbody = document.getElementById("saved-products-body");
  const cartTbody = document.getElementById("cart-products-body");

  // عرض المحفوظات
  if (savedTbody) {
    if (savedProducts.length === 0) {
      savedTbody.innerHTML =
        "<tr><td colspan='9'>لا توجد منتجات محفوظة.</td></tr>";
    } else {
      savedTbody.innerHTML = savedProducts
        .map((product) => {
          const isRent = product.action === "rent" || product.action === "both";
          const startDate = product.startDate || "-";
          let endDate = "-";
          let duration = "-";
          let price = product.sellPrice || "-";

          if (isRent && product.startDate && product.rentDuration) {
            const s = new Date(product.startDate);
            s.setMonth(s.getMonth() + Number(product.rentDuration));
            endDate = s.toISOString().split("T")[0];
            duration = product.rentDuration;
            price = (
              Number(product.rentPrice || 0) * Number(product.rentDuration || 0)
            ).toFixed(2);
          }

          return `
              <tr>
                <td><img src="../Dental/${
                  product.image
                }" class="img-thumbnail" /></td>
                <td>${product.name}</td>
                <td>${product.action}</td>
                <td>${isRent ? startDate : "-"}</td>
                <td>${isRent ? endDate : "-"}</td>
                <td>${isRent ? duration + "  Month" : "-"}</td>
                <td>${price}</td>
                <td>
                  <button class="btn btn-sm btn-warning mb-1 me-1" onclick="moveToCart(${
                    product.id
                  })">Book Now</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteFromSaved(${
                    product.id
                  })">Delete</button>
                </td>
              </tr>
            `;
        })
        .join("");
    }
  }

  // عرض السلة
  if (cartTbody) {
    if (cartProducts.length === 0) {
      cartTbody.innerHTML =
        "<tr><td colspan='9'>لا توجد منتجات في السلة.</td></tr>";
    } else {
      let totalRent = 0;
      let totalSell = 0;

      cartTbody.innerHTML = cartProducts
        .map((product) => {
          const isRent = product.action === "rent" || product.action === "both";
          const durationDays = isRent ? Number(product.rentDuration || 0) : 0;
          const rentCost = isRent
            ? (Number(product.rentPrice) || 0) * durationDays
            : 0;
          const sellCost =
            product.action === "sell" ? Number(product.sellPrice) || 0 : 0;

          totalRent += rentCost;
          totalSell += sellCost;

          return `
              <tr>
                <td><img src="../Dental/${
                  product.image
                }" class="img-thumbnail" /></td>
                <td>${product.name}</td>
                <td>${product.action}</td>
                <td>${isRent ? product.startDate : "-"}</td>
                <td>${isRent ? product.endDate : "-"}</td>
                <td>${isRent ? durationDays + " Month" : "-"}</td>
                <td>${isRent ? rentCost.toFixed(2) : sellCost.toFixed(2)}</td>
                <td>
                  <button class="btn btn-sm btn-danger" onclick="deleteFromCart('${
                    product.cartItemId
                  }')">Delete</button>
                </td>
              </tr>
            `;
        })
        .join("");

      document.getElementById("totalRent").innerText =
        totalRent.toFixed(2) + " EGP";
      document.getElementById("totalPurchase").innerText =
        totalSell.toFixed(2) + " EGP";
      document.getElementById("totalPrice").innerText =
        (totalRent + totalSell).toFixed(2) + " EGP";
    }
  }
};

// حذف من المحفوظات
function deleteFromSaved(id) {
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
  const key = "savedProducts_" + currentUser.email;
  let saved = JSON.parse(localStorage.getItem(key)) || [];
  saved = saved.filter((p) => Number(p.id) !== Number(id));
  localStorage.setItem(key, JSON.stringify(saved));
  location.reload();
}

// نقل من المحفوظات إلى السلة
function moveToCart(id) {
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
  const email = currentUser?.email;
  const savedKey = `savedProducts_${email}`;
  const cartKey = `cartProducts_${email}`;
  let saved = JSON.parse(localStorage.getItem(savedKey)) || [];
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const index = saved.findIndex((p) => Number(p.id) === Number(id));
  if (index === -1) return alert("لم يتم العثور على المنتج.");

  const product = saved[index];
  const cartItemId =
    Date.now().toString() + Math.random().toString(36).substring(2);

  // حساب endDate إذا كان إيجار
  let endDate = null;
  if (
    (product.action === "rent" || product.action === "both") &&
    product.startDate &&
    product.rentDuration
  ) {
    const s = new Date(product.startDate);
    s.setMonth(s.getMonth() + Number(product.rentDuration));
    endDate = s.toISOString().split("T")[0];
  }

  const productWithCartId = {
    ...product,
    cartItemId,
    endDate: endDate || null,
  };

  cart.push(productWithCartId);
  saved.splice(index, 1);

  localStorage.setItem(savedKey, JSON.stringify(saved));
  localStorage.setItem(cartKey, JSON.stringify(cart));
  location.reload();
}

// حذف من السلة
function deleteFromCart(cartItemId) {
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
  const key = "cartProducts_" + currentUser.email;
  let cart = JSON.parse(localStorage.getItem(key)) || [];
  cart = cart.filter((p) => String(p.cartItemId) !== String(cartItemId));
  localStorage.setItem(key, JSON.stringify(cart));
  location.reload();
}

function enableEdit() {
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
  if (!currentUser) return;

  const container = document.querySelector(".personal-desc .card .col-md-8");

  container.innerHTML = `
    <label><strong>Name:</strong></label>
    <input type="text" id="editName" class="form-control mb-2" value="${
      currentUser.name || ""
    }"/>

    <label><strong>Address:</strong></label>
    <input type="text" id="editAddress" class="form-control mb-2" value="${
      currentUser.address || ""
    }"/>

    <label><strong>Phone:</strong></label>
    <input type="text" id="editPhone" class="form-control mb-2" value="${
      currentUser.phone || ""
    }"/>

    <label><strong>Email:</strong></label>
    <input type="email" id="editEmail" class="form-control mb-2" value="${
      currentUser.email || ""
    }" disabled/>

    <label><strong>Gender:</strong></label>
    <input type="text" id="editGender" class="form-control mb-2" value="${
      currentUser.gender || ""
    }"/>

    <label><strong>Birthday:</strong></label>
    <input type="date" id="editBirthday" class="form-control mb-2" value="${
      currentUser.birthday || ""
    }"/>

    <button class="btn btn-success mt-2" onclick="saveProfile()">Save</button>
  `;
}

function saveProfile() {
  const updatedUser = {
    name: document.getElementById("editName").value.trim(),
    address: document.getElementById("editAddress").value.trim(),
    phone: document.getElementById("editPhone").value.trim(),
    email: document.getElementById("editEmail").value.trim(), // not editable
    gender: document.getElementById("editGender").value.trim(),
    birthday: document.getElementById("editBirthday").value,
  };

  // تحديث CurrentUser
  localStorage.setItem("CurrentUser", JSON.stringify(updatedUser));

  // تحديث المستخدم داخل users
  let users = JSON.parse(localStorage.getItem("SignUp")) || [];
  const index = users.findIndex((u) => u.email === updatedUser.email);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem("SignUp", JSON.stringify(users));
  }

  location.reload(); // لإعادة تحميل البيانات بشكل محدث
}
