// DISCLAIMER ALERT ON PAGE LOAD
window.addEventListener('load', () => {
  alert(
    '⚠️ DISCLAIMER\n\n' +
    'This website is provided for informational and demonstration purposes only. ' +
    'All products, prices, and promotions displayed are subject to change without notice. ' +
    'We do not guarantee the accuracy or completeness of any information on this site. ' +
    'By continuing to use this website, you agree to our Terms of Service and Privacy Policy.\n\n' +
    'Click OK to continue.'
  );
});

// STICKY HEADER SHADOW
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// COUNTDOWN TIMER (to midnight)
function updateCountdown() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  document.getElementById('countdown').textContent = `${h}:${m}:${s}`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// CART COUNTER
let cartCount = 0;
function addToCart() {
  cartCount++;
  const badge = document.getElementById('cartCount');
  badge.textContent = cartCount;
  badge.style.transform = 'scale(1.4)';
  setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
}
document.getElementById('cartCount').style.transition = 'transform 0.15s ease';

// WISHLIST TOGGLE
function toggleWish(btn) {
  btn.classList.toggle('active');
  const icon = btn.querySelector('i');
  if (btn.classList.contains('active')) {
    icon.className = 'ti ti-heart-filled';
  } else {
    icon.className = 'ti ti-heart';
  }
}

// MOBILE DRAWER
function openDrawer() {
  document.getElementById('mobileDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('mobileDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// LANGUAGE TOGGLE
document.querySelectorAll('.lang-toggle span').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.lang-toggle span').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
  });
});