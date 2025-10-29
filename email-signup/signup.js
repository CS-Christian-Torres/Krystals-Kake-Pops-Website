// === Show/hide "Other Seasonal" input ===
const seasonalSelect = document.getElementById('seasonalPreference');
const otherContainer = document.getElementById('otherSeasonalContainer');

seasonalSelect.addEventListener('change', () => {
  const isOther = seasonalSelect.value === 'other';
  otherContainer.style.display = isOther ? 'block' : 'none';
  document.getElementById('otherSeasonal').required = isOther;
});

// === Form submission ===
const form = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const favoriteFlavor = form.favoriteFlavor.value.trim();
  const seasonalPreference = form.seasonalPreference.value.trim();
  const otherSeasonal = form.otherSeasonal.value.trim();

  // Validate required fields
  if (!name || !email || !favoriteFlavor || !seasonalPreference ||
      (seasonalPreference === 'other' && !otherSeasonal)) {
    alert('⚠️ Please fill out all required fields.');
    return;
  }

  // Build URL-encoded body (Flask uses request.form)
  const params = new URLSearchParams({
    name,
    email,
    favoriteFlavor,
    seasonalPreference,
    otherSeasonal
  });

  try {
    const response = await fetch('https://api.krystalskakepops.com/form-handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Server response:', result);
      successMessage.textContent = '🎉 Thank you! Your signup has been recorded.';
      successMessage.style.color = '#28a745';
      form.reset();
      otherContainer.style.display = 'none';
    } else {
      const errorText = await response.text();
      console.error('❌ Server error:', errorText);
      alert('❌ There was an error submitting your form. Please try again later.');
    }
  } catch (err) {
    console.error('⚠️ Network or fetch error:', err);
    alert('🚧 Unable to reach the server. Please try again later.');
  }
});
