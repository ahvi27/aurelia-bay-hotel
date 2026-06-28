/* ===========================================================
   AURELIA & BAY — Main App Logic
   Global state, navbar, dark mode, toasts, modals, scroll reveal
   =========================================================== */

const App = {
  state: {
    favorites: new Set(),
    booking: {
      roomId: null,
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      paymentMethod: 'card'
    },
    currentRoute: 'home',
    currentParams: {}
  }
};

/* ---------- Toasts ---------- */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  toast.style.animation = 'slideInRight 0.35s ease-out';
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

/* ---------- Button ripple effect ---------- */
function attachRipple(el) {
  el.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
}
function attachRippleToAllButtons(scope = document) {
  scope.querySelectorAll('.btn').forEach(attachRipple);
}

/* ---------- Dark mode ---------- */
function initDarkMode() {
  const saved = App._theme || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    App._theme = next;
    showToast(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
  });
}

/* ---------- Navbar scroll state ---------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const floatingBook = document.getElementById('floatingBook');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('show', y > 480);
    floatingBook.classList.toggle('show', y > 480 && App.state.currentRoute !== 'reservation');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ---------- Scroll reveal (IntersectionObserver) ---------- */
let revealObserver;
function initScrollReveal(scope = document) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  }
  scope.querySelectorAll('.reveal, .reveal-zoom').forEach(el => revealObserver.observe(el));
}

/* ---------- Modal (success) ---------- */
function openSuccessModal(text, ref) {
  const modal = document.getElementById('successModal');
  document.getElementById('successModalText').textContent = text;
  document.getElementById('modalRef').textContent = ref ? `Confirmation: ${ref}` : '';
  document.getElementById('modalRef').style.display = ref ? 'block' : 'none';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSuccessModal() {
  document.getElementById('successModal').classList.remove('open');
  document.body.style.overflow = '';
}
function initModal() {
  document.getElementById('closeSuccessModal').addEventListener('click', closeSuccessModal);
  document.getElementById('successModalDone').addEventListener('click', closeSuccessModal);
  document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target.id === 'successModal') closeSuccessModal();
  });
}

/* ---------- Favorites ---------- */
function toggleFavorite(roomId, btn) {
  if (App.state.favorites.has(roomId)) {
    App.state.favorites.delete(roomId);
    btn.classList.remove('active');
  } else {
    App.state.favorites.add(roomId);
    btn.classList.add('active');
    showToast('Added to your favorites');
  }
}

/* ---------- Helpers ---------- */
function formatMoney(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}
function starString(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '<i class="fa-solid fa-star"></i>';
  if (half) s += '<i class="fa-solid fa-star-half-stroke"></i>';
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) s += '<i class="fa-regular fa-star"></i>';
  return s;
}
function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}
function todayISO() {
  return new Date().toISOString().split('T')[0];
}
function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
function getRoomById(id) {
  return ROOMS.find(r => r.id === id);
}

/* ---------- App init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNavbarScroll();
  initMobileMenu();
  initModal();
  initRouter();

  window.setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
  }, 600);
});
