function loadProductDetails() {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    document.body.innerHTML =
      '<p style="text-align:center;">لا يوجد بيانات لعرضها.</p>';
    return;
  }

  // ✅ تحميل الصورة
  document.getElementById("productImage").src = product.image
    ? `../Dental/${product.image}`
    : "images/default.png";

  // ✅ اسم المركز واسم الآلة
  document.getElementById("brandName").textContent =
    product.brandName || "اسم المركز غير محدد";
  document.getElementById("productName").textContent =
    product.equipmentName || "اسم الآلة غير محدد";

  // ✅ أزرار البيع والإيجار
  const saleBtn = document.getElementById("saleBtn");
  const rentBtn = document.getElementById("rentBtn");

  if (product.action === "sell") {
    saleBtn.style.display = "inline-block";
    rentBtn.style.display = "none";
  } else if (product.action === "rent") {
    saleBtn.style.display = "none";
    rentBtn.style.display = "inline-block";
  } else {
    saleBtn.style.display = "inline-block";
    rentBtn.style.display = "inline-block";
  }

  // ✅ تاريخ الإيجار
  const rentDateContainer = document.getElementById("startDate");
  if (rentDateContainer) {
    rentDateContainer.style.display =
      product.action === "sell" ? "none" : "block";
  }

  // ✅ السعر
  const priceText =
    product.action === "sell"
      ? `${product.sellPrice} EGP`
      : product.action === "rent"
      ? `${product.rentPrice} EGP`
      : `${product.sellPrice} EGP / ${product.rentPrice} EGP`;

  document.getElementById("productPrice").textContent = priceText || "غير محدد";

  // ✅ الوصف
  document.getElementById("productDesc").textContent =
    product.description || "لا يوجد وصف متاح.";
}

// ✅ ربط الأزرار
document.addEventListener("DOMContentLoaded", () => {
  loadProductDetails();

  document.getElementById("addToCartBtn").addEventListener("click", addToCart);
  document
    .getElementById("saveProductBtn")
    .addEventListener("click", saveProduct);
});

loadProductDetails();

// إضافة المنتج إلى السلة
function addToCart() {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));

  if (!currentUser) {
    alert("يرجى تسجيل الدخول أولًا.");
    return;
  }

  const userKey = `cartProducts_${currentUser.email}`;
  const cartProducts = JSON.parse(localStorage.getItem(userKey)) || [];

  if (!product.id) product.id = Date.now();

  let newCartItem = {
    id: product.id,
    name: product.equipmentName,
    image: product.image || "",
    action: product.action,
    cartItemId: Date.now().toString() + Math.random().toString(36).slice(2),
  };

  if (product.action === "rent" || product.action === "both") {
    const startInput = document.getElementById("startDate");
    const startDate = startInput?.value;

    if (!startDate) {
      alert("يرجى اختيار تاريخ بداية الإيجار.");
      return;
    }

    const duration = parseInt(product.rentDuration) || 1; // ✅ عدد الشهور
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + duration); // ✅ نضيف شهور بدل أيام

    newCartItem.startDate = startDate;
    newCartItem.endDate = end.toISOString().slice(0, 10);
    newCartItem.rentPrice = product.rentPrice;
    newCartItem.totalRentPrice = duration * parseFloat(product.rentPrice || 0);
    newCartItem.rentDuration = duration;
  }

  if (product.action === "sell" || product.action === "both") {
    newCartItem.sellPrice = product.sellPrice;
  }

  cartProducts.push(newCartItem);
  localStorage.setItem(userKey, JSON.stringify(cartProducts));
  alert("تمت إضافة المنتج إلى السلة.");
}

// حفظ المنتج في المفضلة
function saveProduct() {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));

  if (!currentUser) {
    alert("يرجى تسجيل الدخول أولًا.");
    return;
  }

  const userKey = `savedProducts_${currentUser.email}`;
  const savedProducts = JSON.parse(localStorage.getItem(userKey)) || [];

  if (!product.id) product.id = Date.now();

  const exists = savedProducts.some((p) => p.id === product.id);
  if (exists) {
    alert("المنتج محفوظ بالفعل.");
    return;
  }

  let newSavedItem = {
    id: product.id,
    name: product.equipmentName,
    image: product.image || "",
    action: product.action,
    saveItemId: Date.now().toString() + Math.random().toString(36).slice(2),
  };

  if (product.action === "rent" || product.action === "both") {
    const startInput = document.getElementById("startDate");
    const startDate = startInput?.value;

    if (!startDate) {
      alert("يرجى اختيار تاريخ بداية الإيجار قبل الحفظ.");
      return;
    }

    const duration = parseInt(product.rentDuration) || 1;

    newSavedItem.startDate = startDate;
    newSavedItem.rentDuration = duration;
    newSavedItem.rentPrice = product.rentPrice;
  }

  if (product.action === "sell" || product.action === "both") {
    newSavedItem.sellPrice = product.sellPrice;
  }

  savedProducts.push(newSavedItem);
  localStorage.setItem(userKey, JSON.stringify(savedProducts));
  alert("تم حفظ المنتج بنجاح.");
}
