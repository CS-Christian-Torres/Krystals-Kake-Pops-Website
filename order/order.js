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
  "🍓 Strawberry Burst": 27 / 12, // calculated per piece but sold as dozen
  "🍋 Lemon Poppy Delight": 27 / 12,
  "❤️ Red Velvet Romance": 27 / 12,
  "🎃 Spooky Skull Pop": 27 / 12
};

// ===== DISCOUNT LOGIC FOR CHOCOLATE & VANILLA ===== //
// Applies bulk pricing across both chocolate & vanilla combined
function getBundlePricePerItem(totalQty) {
  if (totalQty >= 12) return 27 / 12;  // $2.25 each
  if (totalQty >= 6) return 16 / 6;    // $2.67 each
  if (totalQty >= 3) return 8.75 / 3;  // $2.92 each
  return 3.5;                          // base price
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

  // first pass: count all chocolate & vanilla combined
  document.querySelectorAll("tr").forEach(row => {
    const nameCell = row.querySelector(".product-name");
    const qtyInput = row.querySelector(".qty-input");
    if (!nameCell || !qtyInput) return;
    const name = nameCell.textContent.trim();
    const qty = parseInt(qtyInput.value) || 0;
    if (bundleItems.includes(name)) bundleQty += qty;
  });

  // second pass: calculate totals
  document.querySelectorAll("tr").forEach(row => {
    const nameCell = row.querySelector(".product-name");
    const qtyInput = row.querySelector(".qty-input");
    const subtotalCell = row.querySelector(".subtotal");
    if (!nameCell || !qtyInput || !subtotalCell) return;

    const name = nameCell.textContent.trim();
    const qty = parseInt(qtyInput.value) || 0;
    let price = basePrices[name] || 0;

    // apply bundle discount for vanilla/chocolate
    if (bundleItems.includes(name)) {
      price = getBundlePricePerItem(bundleQty);
    }

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
