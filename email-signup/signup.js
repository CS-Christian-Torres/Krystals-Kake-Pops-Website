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

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    flavor: form.favoriteFlavor.value, // matches Flask field
    preference:
      form.seasonalPreference.value === 'other'
        ? form.otherSeasonal.value.trim()
        : form.seasonalPreference.value, // matches Flask field
  };

  // Validate required fields
  if (!formData.name || !formData.email || !formData.flavor || !formData.preference) {
    alert('⚠️ Please fill out all required fields.');
    return;
  }

  try {
    const response = await fetch('https://api.krystalskakepops.com/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      successMessage.textContent = '🎉 Thank you! Your signup has been recorded.';
      successMessage.style.color = '#28a745';
      form.reset();
      otherContainer.style.display = 'none';
    } else {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      alert('❌ There was an error submitting your form. Please try again later.');
    }
  } catch (err) {
    console.error('Network or fetch error:', err);
    alert('🚧 Unable to reach the server. Please try again later.');
  }
});
