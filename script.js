// ===== main.js =====

// Smooth scroll for internal links (like "Contact" in the navbar)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Highlight active navbar link while scrolling
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120; // offset for navbar height
  sections.forEach(section => {
    const link = document.querySelector(`a[href="#${section.id}"]`);
    if (!link) return;
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollY > top && scrollY <= top + height) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// Optional: subtle hover scale animation for product cards
document.querySelectorAll('.hover-scale').forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('scale-up'));
  card.addEventListener('mouseleave', () => card.classList.remove('scale-up'));
});
