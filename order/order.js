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

// ===== BASE PRICES ===== //
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

// ===== DISCOUNT LOGIC (Chocolate & Vanilla) ===== //
function getBundlePricePerItem(totalQty) {
  if (totalQty >= 12) return 27 / 12;  // $2.25 each
  if (totalQty >= 6) return 16 / 6;    // $2.67 each
  if (totalQty >= 3) return 8.75 / 3;  // $2.92 each
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

  // Step 1: count total bundle items (chocolate + vanilla)
  document.querySelectorAll("tr").forEach(row => {
    const nameCell = row.querySelector(".product-name");
    const qtyInput = row.querySelector(".qty-input");
    if (!nameCell || !qtyInput) return;
    const name = nameCell.textContent.trim();
    const qty = parseInt(qtyInput.value) || 0;
    if (bundleItems.includes(name)) bundleQty += qty;
  });

  // Step 2: calculate subtotal for each row
  document.querySelectorAll("tr").forEach(row => {
    const nameCell = row.querySelector(".product-name");
    const qtyInput = row.querySelector(".qty-input");
    const subtotalCell = row.querySelector(".subtotal");
    if (!nameCell || !qtyInput || !subtotalCell) return;

    const name = nameCell.textContent.trim();
    const qty = parseInt(qtyInput.value) || 0;
    let price = basePrices[name] || 0;

    // Apply bundle discount pricing
    if (bundleItems.includes(name)) price = getBundlePricePerItem(bundleQty);

    const subtotal = qty * price;
    subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
    total += subtotal;
  });

  // Step 3: update total display
  const totalDisplay = document.getElementById("orderTotal");
  if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`;
}

// ===== INIT ===== //
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".qty-input");
  inputs.forEach(input => {
    const row = input.closest("tr");
    const name = row.querySelector(".product-name").textContent.trim();

    input.addEventListener("change", () => validateQuantity(name, input));
    input.addEventListener("input", () => updateTotal());
    input.addEventListener("keyup", () => updateTotal());
  });

  updateTotal();
});

// ===== 🧾 HELCIM PAYMENT INTEGRATION ===== //
async function processPayment() {
  try {
    // Get total
    const totalText = document.getElementById("orderTotal").textContent.trim();
    const amount = parseFloat(totalText.replace("$", "")) || 0;
    if (amount <= 0) {
      alert("Please select at least one item before paying.");
      return;
    }

    // Build order description
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

    // Create Helcim session on backend
    const response = await fetch("https://api.krystalskakepops.com/helcim-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount.toFixed(2), description })
    });

    const data = await response.json();

    // Handle response
    if (data.checkoutToken) {
      HelcimPay.open({
        checkoutToken: data.checkoutToken,
        onComplete: function (result) {
          console.log("✅ Payment completed:", result);
          window.location.href = "/order/thank-you.html";
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
