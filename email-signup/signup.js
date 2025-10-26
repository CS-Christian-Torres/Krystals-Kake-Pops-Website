// Show/hide "Other Seasonal" input
const seasonalSelect = document.getElementById('seasonalPreference');
const otherContainer = document.getElementById('otherSeasonalContainer');

seasonalSelect.addEventListener('change', () => {
  const isOther = seasonalSelect.value === 'other';
  otherContainer.style.display = isOther ? 'block' : 'none';
  document.getElementById('otherSeasonal').required = isOther;
});

// Form submission
const form = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    favoriteFlavor: form.favoriteFlavor.value,
    seasonalPreference: form.seasonalPreference.value,
    otherSeasonal: form.otherSeasonal.value.trim()
  };

  // Validate required fields
  if (
    !formData.name ||
    !formData.email ||
    !formData.favoriteFlavor ||
    !formData.seasonalPreference ||
    (formData.seasonalPreference === 'other' && !formData.otherSeasonal)
  ) {
    alert('⚠️ Please fill out all required fields.');
    return;
  }

  // Convert to FormData for backend
  const body = new FormData();
  for (const key in formData) {
    body.append(key, formData[key]);
  }

  try {
    const response = await fetch('https://api.krystalskakepops.com/signup', {
      method: 'POST',
      body: body,
    });

    if (response.ok) {
      const result = await response.json();
      successMessage.textContent = '🎉 Thank you! Your signup has been recorded.';
      successMessage.style.color = '#28a745';
      form.reset();
      otherContainer.style.display = 'none';
    } else {
      alert('❌ There was an error submitting your form. Please try again later.');
    }
  } catch (err) {
    console.error('Error submitting form:', err);
    alert('🚧 Unable to reach the server. Please try again later.');
  }
});
