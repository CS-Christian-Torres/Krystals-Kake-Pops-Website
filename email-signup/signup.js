// Show/hide "Other Seasonal" input
const seasonalSelect = document.getElementById('seasonalPreference');
const otherContainer = document.getElementById('otherSeasonalContainer');

seasonalSelect.addEventListener('change', () => {
  if (seasonalSelect.value === 'other') {
    otherContainer.style.display = 'block';
    document.getElementById('otherSeasonal').required = true;
  } else {
    otherContainer.style.display = 'none';
    document.getElementById('otherSeasonal').required = false;
  }
});

// Form submission
const form = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    favoriteFlavor: form.favoriteFlavor.value,
    seasonalPreference: form.seasonalPreference.value,
    otherSeasonal: form.otherSeasonal.value.trim()
  };

  // Validate required fields
  if (!formData.name || !formData.email || !formData.favoriteFlavor || !formData.seasonalPreference || (formData.seasonalPreference === 'other' && !formData.otherSeasonal)) {
    alert('Please fill out all required fields.');
    return;
  }

  // TODO: Save formData to server/CSV

  successMessage.textContent = "Thank you! Your signup has been recorded.";
  form.reset();
  otherContainer.style.display = 'none';
});
