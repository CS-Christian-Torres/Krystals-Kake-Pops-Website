// ===== PRODUCT GROUPS ===== //
const dozenItems = [
  "🍓 Strawberry Burst",
  "🍋 Lemon Poppy Delight",
  "❤️ Red Velvet Romance",
  "🎃 Spooky Skull Pop"
];

const bundleItems = [
  "🍫 Chocolate Bliss",
  "✨ Vanilla Dream"
];

const individualItems = [
  "🍪 Klassic Kookie Krush",
  "🥨 Chocolate Drizzle Krunch",
  "🍬 Rice Krispy Cloud",
  "🍪 Cookies & Cream Dream"
];

// ===== BASE PRICES (CARD ONLY) ===== //
const basePrices = {
  "🍫 Chocolate Bliss": 3.5,
  "✨ Vanilla Dream": 3.5,
  "🍪 Klassic Kookie Krush": 2.5,
  "🥨 Chocolate Drizzle Krunch": 2.5,
  "🍬 Rice Krispy Cloud": 2.5,
  "🍪 Cookies & Cream Dream": 2.5,
  "🍓 Strawberry Burst": 27 / 12,
  "🍋 Lemon Poppy Delight": 27 / 12,
  "❤️ Red Velvet Romance": 27 / 12,
  "🎃 Spooky Skull Pop": 27 / 12
};

// ===== DISCOUNT LOGIC ===== //
function getBundlePricePerItem(totalQty) {
  if (totalQty >= 12) return 27 / 12;
  if (totalQty >= 6) return 16 / 6;
  if (totalQty >= 3) return 8.75 / 3;
  return 3.5;
}

// ===== VALIDATION ===== //
function validateQuantity(name, qtyInput) {
  const qty = parseInt(qtyInput.value) || 0;
  if (dozenItems.includes(name) && qty % 12 !== 0) {
    const adjusted = Math.ceil(qty / 12) * 12;
    qtyInput.value = adjusted;
    alert(`${name} can only be ordered by the dozen. Rounded up to ${adjusted}.`);
  }
  updateTotal();
}

// ===== TOTAL CALCULATION ===== //
function updateTotal() {
  let total = 0;
  let bundleQty = 0;

  document.querySelectorAll("tr").forEach(row => {
    const nameCell = row.querySelector(".product-name");
    const qtyInput = row.querySelector(".qty-input");
    if (!nameCell || !qtyInput) return;
    const name = nameCell.textContent.trim();
    const qty = parseInt(qtyInput.value) || 0;
    if (bundleItems.includes(name)) bundleQty += qty;
  });

  document.querySelectorAll("tr").forEach(row => {
    const nameCell = row.querySelector(".product-name");
    const qtyInput = row.querySelector(".qty-input");
    const subtotalCell = row.querySelector(".subtotal");
    if (!nameCell || !qtyInput || !subtotalCell) return;

    const name = nameCell.textContent.trim();
    const qty = parseInt(qtyInput.value) || 0;
    let price = basePrices[name] || 0;
    if (bundleItems.includes(name)) price = getBundlePricePerItem(bundleQty);

    const subtotal = qty * price;
    subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
    total += subtotal;
  });

  const totalDisplay = document.getElementById("orderTotal");
  if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`;
}

// ===== INIT ===== //
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".qty-input").forEach(input => {
    const name = input.closest("tr").querySelector(".product-name").textContent.trim();
    input.addEventListener("change", () => validateQuantity(name, input));
    input.addEventListener("keyup", updateTotal);
  });
  updateTotal();
});

// ===== 🧾 HELCIM PAYMENT INTEGRATION ===== //
async function processPayment() {
  try {
    // 1️⃣ Get order total
    const totalText = document.getElementById("orderTotal").textContent.trim();
    const amount = parseFloat(totalText.replace("$", "")) || 0;

    if (amount <= 0) {
      alert("Please select at least one item before paying.");
      return;
    }

    // 2️⃣ Collect item summary for description
    const items = [];
    document.querySelectorAll("tr").forEach(row => {
      const nameCell = row.querySelector(".product-name");
      const qtyInput = row.querySelector(".qty-input");
      if (!nameCell || !qtyInput) return;
      const name = nameCell.textContent.trim();
      const qty = parseInt(qtyInput.value) || 0;
      if (qty > 0) items.push(`${qty} x ${name}`);
    });

    const description = `Krystal’s Kake Pops Order – ${items.join(", ")}`;

    // 3️⃣ Send order to Flask backend
    const response = await fetch("https://api.krystalskakepops.com/helcim-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount.toFixed(2), description })
    });

    const data = await response.json();

    // 4️⃣ If backend returns a token, open payment window
    if (data.clientToken) {
      HelcimPay.open({
        clientToken: data.clientToken,
        onComplete: function (result) {
          console.log("✅ Payment completed:", result);
          window.location.href = "/thank-you.html";
        },
        onError: function (err) {
          console.error("❌ Payment error:", err);
          alert("Payment failed: " + (err.message || "Unknown error."));
        }
      });
    } else {
      console.error("Backend error:", data);
      alert("Unable to initialize payment session. Please try again later.");
    }
  } catch (error) {
    console.error("Network or server error:", error);
    alert("There was a problem connecting to the payment server.");
  }
}
