// Pricing configuration
const prices = {
  single: 3.50,
  three: 8.75,
  halfDozen: 17,
  dozen: 32
};

// Grab elements
const chocolateInput = document.getElementById('chocolateQty');
const vanillaInput = document.getElementById('vanillaQty');
// const strawberryInput = document.getElementById('strawberryQty'); // Currently not used
const totalPopsEl = document.getElementById('totalPops');
const totalPriceEl = document.getElementById('totalPrice');
const orderBtn = document.getElementById('orderBtn');

// Calculate total function
function calculateTotal() {
  const chocolate = parseInt(chocolateInput.value) || 0;
  const vanilla = parseInt(vanillaInput.value) || 0;
  // const strawberry = parseInt(strawberryInput.value) || 0;

  const totalPops = chocolate + vanilla; // Strawberry removed
  let totalPrice = 0;

  if (totalPops === 1) totalPrice = prices.single;
  else if (totalPops === 3) totalPrice = prices.three;
  else if (totalPops === 6) totalPrice = prices.halfDozen;
  else if (totalPops === 12) totalPrice = prices.dozen;
  else if (totalPops > 0) {
    // Mix & match calculation for non-standard quantities
    let remaining = totalPops;
    totalPrice = 0;

    while (remaining >= 12) { totalPrice += prices.dozen; remaining -= 12; }
    while (remaining >= 6) { totalPrice += prices.halfDozen; remaining -= 6; }
    while (remaining >= 3) { totalPrice += prices.three; remaining -= 3; }
    while (remaining >= 1) { totalPrice += prices.single; remaining -= 1; }
  }

  totalPopsEl.textContent = totalPops;
  totalPriceEl.textContent = totalPrice.toFixed(2);

  // Disable order button if no pops selected
  orderBtn.disabled = totalPops === 0;
}

// Event listeners
[chocolateInput, vanillaInput].forEach(input => {
  input.addEventListener('input', calculateTotal);
});

// Initial calculation
calculateTotal();

// Order button click
orderBtn.addEventListener('click', () => {
  const chocolate = parseInt(chocolateInput.value) || 0;
  const vanilla = parseInt(vanillaInput.value) || 0;
  const totalPops = chocolate + vanilla;
  const totalPrice = totalPriceEl.textContent;

  if (totalPops === 0) {
    alert("Please select at least one cake pop to order.");
    return;
  }

  // Example: redirect to Helcim checkout with totalPrice (replace with actual integration)
  alert(`Thank you! You ordered ${totalPops} pops. Total: $${totalPrice}`);
});
