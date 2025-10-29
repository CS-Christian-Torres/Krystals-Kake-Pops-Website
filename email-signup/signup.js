// === Handle Email Signup / Contact Form ===
const form = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const favoriteFlavor = form.favoriteFlavor.value.trim();
  const seasonalPreference = form.seasonalPreference.value.trim();
  const otherSeasonal = form.otherSeasonal?.value.trim() || '';

  if (!name || !email || !favoriteFlavor || !seasonalPreference) {
    alert('⚠️ Please fill out all required fields.');
    return;
  }

  const params = new URLSearchParams({
    name,
    email,
    favoriteFlavor,
    seasonalPreference,
    otherSeasonal,
  });

  try {
    const response = await fetch('https://api.krystalskakepops.com/form-handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (response.ok) {
      successMessage.textContent = '🎉 Thank you! Your signup has been recorded.';
      successMessage.style.color = 'green';
      form.reset();
    } else {
      console.error('❌ Server error:', await response.text());
      alert('Server error. Please try again later.');
    }
  } catch (err) {
    console.error('⚠️ Network error:', err);
    alert('Unable to reach the server. Please try again later.');
  }
});
