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

// ===== TOTAL CALCULATION ===== //
function updateTotal() {
  let total = 0;
  let bundleQty = 0;

  // Step 1: count total bundle items
  document.querySelectorAll("tr").forEach(row => {
    const name = row.querySelector(".product-name")?.textContent.trim();
    const qty = parseInt(row.querySelector(".qty-input")?.value) || 0;
    if (bundleItems.includes(name)) bundleQty += qty;
  });

  // Step 2: calculate subtotal for each item
  document.querySelectorAll("tr").forEach(row => {
    const name = row.querySelector(".product-name")?.textContent.trim();
    const qtyInput = row.querySelector(".qty-input");
    const subtotalCell = row.querySelector(".subtotal");
    if (!name || !qtyInput || !subtotalCell) return;

    let qty = parseInt(qtyInput.value) || 0;

    // Only round dozen items — others stay exact
    if (dozenItems.includes(name) && qty > 0 && qty % 12 !== 0) {
      const rounded = Math.floor(qty / 12) * 12;
      qty = rounded;
      qtyInput.value = rounded;
    }

    let price = basePrices[name] || 0;
    if (bundleItems.includes(name)) price = getBundlePricePerItem(bundleQty);

    const subtotal = qty * price;
    subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
    total += subtotal;
  });

  document.getElementById("orderTotal").textContent = `$${total.toFixed(2)}`;
}

// ===== INIT ===== //
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".qty-input");

  inputs.forEach(input => {
    input.addEventListener("input", updateTotal);
    input.addEventListener("change", updateTotal);
  });

  updateTotal();
});

// ===== 🧾 HELCIM PAYMENT INTEGRATION ===== //
async function processPayment() {
  try {
    const totalText = document.getElementById("orderTotal").textContent.trim();
    const amount = parseFloat(totalText.replace("$", "")) || 0;

    if (amount <= 0) {
      alert("Please select at least one item before paying.");
      return;
    }

    // Build description
    const items = [];
    document.querySelectorAll("tr").forEach(row => {
      const name = row.querySelector(".product-name")?.textContent.trim();
      const qty = parseInt(row.querySelector(".qty-input")?.value) || 0;
      if (qty > 0) items.push(`${qty} x ${name}`);
    });

    const description = `Krystal’s Kake Pops Order – ${items.join(", ")}`;

    const response = await fetch("https://api.krystalskakepops.com/helcim-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount.toFixed(2), description })
    });

    const data = await response.json();

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
