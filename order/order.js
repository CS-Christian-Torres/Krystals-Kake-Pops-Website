// ===============================
//  Item categories & base setup
// ===============================
const BUNDLE_ITEMS = ["🍫 Chocolate Bliss", "✨ Vanilla Dream"];
const PER_ITEM_ITEMS = ["🍬 Rice Krispy Cloud", "🍪 Klassic Kookie Krush"];
const DOZEN_ONLY_ITEMS = [
  "🍓 Strawberry Burst",
  "🍋 Lemon Poppy Delight",
  "❤️ Red Velvet Romance",
  "🥨 Chocolate Drizzle Krunch",
  "🎃 Spooky Skull Pop",
  "🍪 Cookies & Cream Dream"
];

// ===============================
//  Price helpers
// ===============================
function getActivePayment() {
  return document.getElementById("payment")?.value || "Card";
}

function getBundleUnitPrice(payment, totalQty) {
  const isCash = payment === "Cash";
  if (totalQty >= 12) return isCash ? 25 / 12 : 27 / 12; // $2.08 vs $2.25
  if (totalQty >= 6) return isCash ? 15 / 6 : 16 / 6;    // $2.50 vs $2.67
  if (totalQty >= 3) return isCash ? 8 / 3 : 8.75 / 3;   // $2.67 vs $2.92
  return isCash ? 3.0 : 3.5;                             // single item
}

function getPerItemUnitPrice(payment) {
  return payment === "Cash" ? 2.0 : 2.5;
}

function getDozenPrice(payment) {
  return payment === "Cash" ? 25.0 : 27.0;
}

// ===============================
//  Main total calculation
// ===============================
function updateTotal() {
  const payment = getActivePayment();
  let total = 0;
  let bundleQty = 0;

  // Count combined qty for Chocolate + Vanilla
  document.querySelectorAll("tbody tr").forEach((row) => {
    const name = row.getAttribute("data-item");
    const qty = parseInt(row.querySelector(".qty-input")?.value) || 0;
    if (BUNDLE_ITEMS.includes(name)) bundleQty += qty;
  });

  // Calculate row subtotals
  document.querySelectorAll("tbody tr").forEach((row) => {
    const name = row.getAttribute("data-item");
    const qty = parseInt(row.querySelector(".qty-input")?.value) || 0;
    const priceCell = row.querySelector(".price");
    const subtotalCell = row.querySelector(".subtotal");
    if (!priceCell || !subtotalCell) return;

    let price = 0;
    let subtotal = 0;

    if (BUNDLE_ITEMS.includes(name)) {
      price = getBundleUnitPrice(payment, bundleQty);
      subtotal = qty * price;
      priceCell.textContent = `$${price.toFixed(2)}`;
    } else if (PER_ITEM_ITEMS.includes(name)) {
      price = getPerItemUnitPrice(payment);
      subtotal = qty * price;
      priceCell.textContent = `$${price.toFixed(2)}`;
    } else if (DOZEN_ONLY_ITEMS.includes(name)) {
      price = getDozenPrice(payment);
      subtotal = qty * price;
      priceCell.textContent = `$${price} / dozen`;
    }

    subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
    total += subtotal;
  });

  // Highlight active method (Cash vs Card)
  const isCash = payment === "Cash";
  document.querySelectorAll(".deal-chips").forEach((chips) => {
    chips.querySelectorAll("span").forEach((badge) => {
      badge.classList.toggle("fw-bold", badge.textContent.includes(isCash ? "cash" : "card"));
    });
  });

  // Display total
  const totalDisplay = document.getElementById("orderTotal");
  if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`;

  return total;
}

// ===============================
//  Build item summary
// ===============================
function buildItemsSummary() {
  const items = [];
  let totalQtyEach = 0;

  document.querySelectorAll("tbody tr").forEach((row) => {
    const name = row.getAttribute("data-item");
    const qty = parseInt(row.querySelector(".qty-input")?.value) || 0;
    if (qty > 0) {
      if (DOZEN_ONLY_ITEMS.includes(name)) {
        items.push(`${qty} dozen x ${name}`);
        totalQtyEach += qty * 12;
      } else {
        items.push(`${qty} x ${name}`);
        totalQtyEach += qty;
      }
    }
  });

  return { items, totalQtyEach };
}

// ===============================
//  UI Setup
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Quantity listeners
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("input", () => {
      if (parseInt(input.value) < 0) input.value = 0;
      updateTotal();
    });
    input.addEventListener("change", updateTotal);
    input.addEventListener("keyup", updateTotal);
  });

  // Payment listener
  document.getElementById("payment")?.addEventListener("change", updateTotal);

  // Delivery toggle
  const deliveryOption = document.getElementById("deliveryOption");
  const addressWrap = document.getElementById("addressWrap");
  const addressField = document.getElementById("addressField");
  const deliveryNote = document.getElementById("deliveryNote");

  function toggleDeliveryUI() {
    const isDelivery = deliveryOption.value === "Delivery";
    addressWrap.classList.toggle("d-none", !isDelivery);
    deliveryNote.classList.toggle("d-none", !isDelivery);
    if (addressField) addressField.required = isDelivery;
  }

  if (deliveryOption) {
    deliveryOption.addEventListener("change", toggleDeliveryUI);
    toggleDeliveryUI();
  }

  updateTotal();

  // ===============================
  //  Submit → Flask backend
  // ===============================
  const form = document.getElementById("orderForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { items, totalQtyEach } = buildItemsSummary();
    if (items.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    const first = form.elements["first_name"]?.value?.trim() || "";
    const last = form.elements["last_name"]?.value?.trim() || "";
    const phone = form.elements["phone"]?.value?.trim() || "";
    const delivery_option = form.elements["delivery_option"]?.value || "Pickup";
    const address = form.elements["address"]?.value?.trim() || "";
    const payment = form.elements["payment"]?.value || "Cash";

    if (!first || !last || !phone) {
      alert("First name, last name, and phone are required.");
      return;
    }
    if (delivery_option === "Delivery" && !address) {
      alert("Please enter a delivery address.");
      return;
    }

    const total = updateTotal();

    const payload = {
      name: `${first} ${last}`.trim(),
      phone,
      flavor: items.join(", "),     // 'flavor' field for your backend CSV
      quantity: String(totalQtyEach),
      total: total.toFixed(2),
      payment,
      delivery_option,
      address
    };

    const btn = form.querySelector('button[type="submit"]');
    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting…";

    try {
      const response = await fetch("https://api.krystalskakepops.com/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert("Thanks! Your order was submitted. We’ll text you to coordinate pickup/delivery.");
        form.reset();
        updateTotal();
        toggleDeliveryUI();
      } else {
        alert(data?.message || "There was a problem submitting your order.");
      }
    } catch (err) {
      console.error(err);
      alert("Network/server error while submitting your order.");
    } finally {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  });
});
