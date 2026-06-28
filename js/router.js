/* ===========================================================
   AURELIA & BAY — Router
   Simple hash-free SPA router driven by data-route attributes
   =========================================================== */

const Templates = {};

function initRouter() {
  document.body.addEventListener('click', (e) => {
    const el = e.target.closest('[data-route]');
    if (!el) return;
    e.preventDefault();
    const route = el.getAttribute('data-route');
    const param = el.getAttribute('data-param');
    navigate(route, param ? { id: param } : {});
  });

  window.addEventListener('popstate', (e) => {
    const state = e.state || { route: 'home', params: {} };
    renderRoute(state.route, state.params, false);
  });

  const initial = parseLocation();
  renderRoute(initial.route, initial.params, false);
}

function parseLocation() {
  return { route: 'home', params: {} };
}

function navigate(route, params = {}) {
  App.state.currentRoute = route;
  App.state.currentParams = params;
  history.pushState({ route, params }, '', '#' + route);
  renderRoute(route, params, true);
}

function renderRoute(route, params = {}, scrollUp = true) {
  App.state.currentRoute = route;
  App.state.currentParams = params;
  const app = document.getElementById('app');

  let html = '';
  switch (route) {
    case 'home': html = Templates.home(); break;
    case 'rooms': html = Templates.rooms(); break;
    case 'room-details': html = Templates.roomDetails(params.id); break;
    case 'reservation': html = Templates.reservation(params.id); break;
    case 'about': html = Templates.about(); break;
    case 'gallery': html = Templates.gallery(); break;
    case 'contact': html = Templates.contact(); break;
    default: html = Templates.home();
  }

  app.innerHTML = `<div class="page-enter">${html}</div>`;
  if (scrollUp) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  updateActiveNav(route);
  document.getElementById('floatingBook').classList.toggle('show', false);

  // page-specific init
  if (route === 'home') initHomePage();
  if (route === 'rooms') initRoomsPage();
  if (route === 'room-details') initRoomDetailsPage(params.id);
  if (route === 'reservation') initReservationPage(params.id);
  if (route === 'about') initAboutPage();
  if (route === 'gallery') initGalleryPage();
  if (route === 'contact') initContactPage();

  attachRippleToAllButtons(app);
  initScrollReveal(app);
  attachFavoriteButtons(app);

  // re-check scroll-dependent UI
  window.dispatchEvent(new Event('scroll'));
}

function updateActiveNav(route) {
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-route') === route);
  });
}

function attachFavoriteButtons(scope) {
  scope.querySelectorAll('.fav-btn').forEach(btn => {
    const id = btn.getAttribute('data-fav');
    if (App.state.favorites.has(id)) btn.classList.add('active');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(id, btn);
    });
  });
}

/* =========================================================
   ROOM CARD (shared component)
   ========================================================= */
function roomCardHTML(room, revealIndex = 0) {
  const badge = !room.available
    ? `<span class="room-badge low">Fully Booked</span>`
    : (room.rating >= 4.8 ? `<span class="room-badge">Most Booked</span>` : '');
  return `
  <div class="room-card reveal" style="transition-delay:${revealIndex * 0.06}s">
    <div class="room-card-img">
      <a href="#" data-route="room-details" data-param="${room.id}">
        <img src="${room.img}" alt="${room.name}" loading="lazy">
      </a>
      ${badge}
      <button class="fav-btn" data-fav="${room.id}" aria-label="Save to favorites"><i class="fa-solid fa-heart"></i></button>
    </div>
    <div class="room-card-body">
      <div class="room-card-top">
        <h4><a href="#" data-route="room-details" data-param="${room.id}">${room.name}</a></h4>
        <div class="room-rating">${starString(room.rating)} <span>${room.rating}</span></div>
      </div>
      <p class="room-card-desc">${room.desc}</p>
      <div class="room-card-amenities">
        <span><i class="fa-solid fa-user"></i> ${room.guests} Guests</span>
        <span><i class="fa-solid fa-bed"></i> ${room.bed}</span>
        <span><i class="fa-solid fa-wifi"></i> WiFi</span>
      </div>
      <div class="room-card-foot">
        <div class="room-price"><span class="num">${formatMoney(room.price)}</span> <span class="per">/ night</span></div>
        <button class="btn btn-navy btn-small" data-route="reservation" data-param="${room.id}" ${!room.available ? 'disabled' : ''}>
          ${room.available ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  </div>`;
}

function roomSkeletonHTML() {
  return `
  <div class="room-card">
    <div class="room-card-img skeleton" style="aspect-ratio:4/3;border-radius:0;"></div>
    <div class="room-card-body">
      <div class="skeleton" style="height:20px;width:60%;border-radius:6px;"></div>
      <div class="skeleton" style="height:14px;width:90%;border-radius:6px;margin-top:10px;"></div>
      <div class="skeleton" style="height:14px;width:80%;border-radius:6px;margin-top:6px;"></div>
      <div class="skeleton" style="height:36px;width:100%;border-radius:6px;margin-top:18px;"></div>
    </div>
  </div>`;
}

/* =========================================================
   HOME PAGE
   ========================================================= */
Templates.home = () => `
<section class="hero">
  <div class="hero-bg" style="background-image:url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1800&auto=format&fit=crop')"></div>
  <div class="hero-content">
    <div class="hero-main">
      <span class="eyebrow hero-eyebrow">Aurelia &amp; Bay — Est. 2011</span>
      <h1>Luxury Stay,<br><em>Comfortable</em> Experience</h1>
      <p class="hero-desc">Experience elegant rooms, world-class hospitality, and unforgettable moments, set above the bay.</p>
      <div class="hero-actions">
        <button class="btn btn-gold" data-route="reservation"><i class="fa-solid fa-calendar-check"></i> Book Now</button>
        <button class="btn btn-outline-light" data-route="rooms">Explore Rooms</button>
      </div>
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><div class="num">4.9</div><div class="label">Average Rating</div></div>
      <div class="hero-stat"><div class="num">120</div><div class="label">Rooms &amp; Suites</div></div>
      <div class="hero-stat"><div class="num">15</div><div class="label">Years of Hospitality</div></div>
    </div>
  </div>
  <div class="hero-scroll-cue"><span class="line"></span> Scroll</div>
</section>

<section>
  <div class="container">
    <div class="section-head">
      <div class="head-left">
        <span class="eyebrow">Why Choose Us</span>
        <h2>A stay built around the<br>details that matter</h2>
      </div>
    </div>
    <div class="feature-grid reveal-group">
      ${WHY_CHOOSE_US.map(f => `
        <div class="feature-card reveal">
          <div class="ic"><i class="fa-solid ${f.ic}"></i></div>
          <h4>${f.title}</h4>
          <p>${f.desc}</p>
        </div>`).join('')}
    </div>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <div class="section-head">
      <div class="head-left">
        <span class="eyebrow">Featured Rooms</span>
        <h2>Rooms &amp; suites for<br>every kind of stay</h2>
        <p>From cozy standard rooms to the panoramic Presidential Suite, each space is designed with quiet, considered luxury.</p>
      </div>
      <button class="btn btn-outline" data-route="rooms">View All Rooms <i class="fa-solid fa-arrow-right"></i></button>
    </div>
    <div class="room-grid" id="featuredRoomsGrid">
      ${ROOMS.map((r, i) => `<div class="room-card-slot" data-i="${i}"></div>`).join('')}
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="section-head">
      <div class="head-left">
        <span class="eyebrow">Testimonials</span>
        <h2>What our guests say</h2>
      </div>
    </div>
    <div class="testi-grid reveal-group">
      ${TESTIMONIALS.map(t => `
        <div class="testi-card reveal">
          <div class="testi-stars">${starString(t.rating)}</div>
          <p class="testi-quote">"${t.quote}"</p>
          <div class="testi-person">
            <img src="${t.photo}" alt="${t.name}">
            <div>
              <div class="name">${t.name}</div>
              <div class="loc">${t.loc}</div>
            </div>
          </div>
        </div>`).join('')}
    </div>
  </div>
</section>

<section class="section-navy">
  <div class="container">
    <div class="section-head">
      <div class="head-left">
        <span class="eyebrow">Hotel Facilities</span>
        <h2>Everything you need,<br>under one roof</h2>
      </div>
    </div>
    <div class="facility-grid reveal-group">
      ${FACILITIES.map(f => `
        <div class="facility-item reveal">
          <div class="ic"><i class="fa-solid ${f.ic}"></i></div>
          <div class="label">${f.label}</div>
        </div>`).join('')}
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="newsletter-box reveal">
      <div>
        <h3>Stay in the know</h3>
        <p>Seasonal offers, new suites, and stories from Aurelia &amp; Bay — once a month, no spam.</p>
      </div>
      <div>
        <form class="newsletter-form" id="newsletterForm" novalidate>
          <input type="email" id="newsletterEmail" placeholder="Enter your email address">
          <button type="submit" class="btn btn-gold">Subscribe</button>
        </form>
        <div class="field-error" id="newsletterError">Please enter a valid email address.</div>
      </div>
    </div>
  </div>
</section>

${Templates.footer()}
`;

function initHomePage() {
  // progressively render featured room cards (3 actual + skeleton illusion removed since data is local/instant,
  // but we simulate a brief stagger for the "loading skeleton" feature requirement)
  const grid = document.getElementById('featuredRoomsGrid');
  if (grid) {
    grid.innerHTML = ROOMS.slice(0, 6).map(() => roomSkeletonHTML()).join('');
    setTimeout(() => {
      grid.innerHTML = ROOMS.slice(0, 6).map((r, i) => roomCardHTML(r, i)).join('');
      attachFavoriteButtons(grid);
      initScrollReveal(grid);
    }, 380);
  }

  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletterEmail');
      const error = document.getElementById('newsletterError');
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (!valid) {
        error.classList.add('show');
        input.classList.add('invalid');
        return;
      }
      error.classList.remove('show');
      input.classList.remove('invalid');
      showToast('Subscribed! Welcome to Aurelia & Bay.');
      input.value = '';
    });
  }
}

/* =========================================================
   ROOMS LISTING PAGE
   ========================================================= */
Templates.rooms = () => `
<div class="page-header">
  <div class="page-header-bg" style="background-image:url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop')"></div>
  <div class="container page-header-content">
    <span class="eyebrow hero-eyebrow">All Accommodations</span>
    <h1>Rooms &amp; Suites</h1>
    <div class="breadcrumb"><a href="#" data-route="home">Home</a><span class="sep">/</span><span>Rooms</span></div>
  </div>
</div>

<section>
  <div class="container">
    <div class="rooms-toolbar">
      <div class="toolbar-field search-field">
        <label for="roomSearch">Search Rooms</label>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" id="roomSearch" placeholder="Search by room name...">
      </div>
      <div class="toolbar-field">
        <label for="roomTypeFilter">Room Type</label>
        <select id="roomTypeFilter">
          <option value="all">All Types</option>
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
        </select>
      </div>
      <div class="toolbar-field">
        <label for="guestsFilter">Guests</label>
        <select id="guestsFilter">
          <option value="0">Any</option>
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3+ Guests</option>
          <option value="4">4+ Guests</option>
        </select>
      </div>
      <div class="toolbar-field">
        <label for="priceRange">Max Price <span class="range-display" id="priceRangeVal">$600</span></label>
        <input type="range" id="priceRange" min="100" max="600" step="10" value="600">
      </div>
      <button class="toolbar-reset" id="resetFilters"><i class="fa-solid fa-rotate-left"></i> Reset</button>
    </div>

    <div class="rooms-meta">
      <span id="roomsCount">Showing ${ROOMS.length} rooms</span>
      <span>Sorted by recommended</span>
    </div>

    <div class="rooms-grid-page" id="roomsListGrid"></div>
    <div class="pagination" id="roomsPagination"></div>
  </div>
</section>

${Templates.footer()}
`;

/* =========================================================
   ROOM DETAILS PAGE
   ========================================================= */
Templates.roomDetails = (id) => {
  const room = getRoomById(id) || ROOMS[0];
  return `
<section style="padding-top:calc(var(--navbar-h) + 32px); padding-bottom:24px;">
  <div class="container">
    <div class="breadcrumb" style="color:var(--text-soft); margin-bottom:28px;">
      <a href="#" data-route="home">Home</a><span class="sep">/</span>
      <a href="#" data-route="rooms">Rooms</a><span class="sep">/</span>
      <span>${room.name}</span>
    </div>

    <div class="details-gallery">
      <div class="main-img" id="detailsMainImg" data-idx="0">
        <img src="${room.gallery[0]}" alt="${room.name}">
      </div>
      <div class="details-side">
        <div class="thumb" data-idx="1"><img src="${room.gallery[1]}" alt=""></div>
        <div class="thumb" data-idx="2">
          <img src="${room.gallery[2]}" alt="">
          ${room.gallery.length > 3 ? `<div class="more-overlay">+${room.gallery.length - 3} more</div>` : ''}
        </div>
      </div>
    </div>

    <div class="details-layout">
      <div class="details-main">
        <span class="eyebrow">${room.type}</span>
        <h1>${room.name}</h1>
        <div class="details-meta-row">
          <span class="stars">${starString(room.rating)}</span>
          <span>${room.rating} (${room.reviews} reviews)</span>
          <span class="dot"></span>
          <span><i class="fa-solid fa-user"></i> ${room.guests} Guests</span>
          <span class="dot"></span>
          <span><i class="fa-solid fa-bed"></i> ${room.bed}</span>
          <span class="dot"></span>
          <span><i class="fa-solid fa-up-right-and-down-left-from-center"></i> ${room.size}</span>
        </div>
        <p class="details-desc">${room.desc}</p>

        <h3 style="font-size:19px; margin-bottom:18px;">Amenities</h3>
        <div class="amenity-grid">
          ${room.amenities.map(a => `<div class="amenity-item"><i class="fa-solid ${amenityIcon(a)}"></i> ${a}</div>`).join('')}
        </div>

        <div class="info-strip">
          <div class="info-strip-item"><div class="lbl">Check-in</div><div class="val">${room.checkIn}</div></div>
          <div class="info-strip-item"><div class="lbl">Check-out</div><div class="val">${room.checkOut}</div></div>
          <div class="info-strip-item"><div class="lbl">Room Size</div><div class="val">${room.size}</div></div>
        </div>
      </div>

      <div class="details-aside">
        <div class="summary-card">
          <div class="price-row"><span class="num">${formatMoney(room.price)}</span><span class="per">/ night</span></div>
          <div class="rating-line"><i class="fa-solid fa-star"></i> ${room.rating} &middot; ${room.reviews} reviews</div>
          <button class="btn btn-gold btn-block" data-route="reservation" data-param="${room.id}" ${!room.available ? 'disabled' : ''}>
            ${room.available ? 'Reserve This Room' : 'Currently Unavailable'}
          </button>
          <button class="fav-btn" style="position:static; margin:14px auto 0; box-shadow:var(--shadow-sm);" data-fav="${room.id}">
            <i class="fa-solid fa-heart"></i>
          </button>
          <div class="summary-note">Free cancellation up to 48 hours before check-in</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <div class="section-head">
      <div class="head-left">
        <span class="eyebrow">You May Also Like</span>
        <h2>Similar rooms</h2>
      </div>
    </div>
    <div class="room-grid reveal-group" id="similarRoomsGrid"></div>
  </div>
</section>

${Templates.footer()}
`;
};

function amenityIcon(name) {
  const map = {
    'Air Conditioning': 'fa-snowflake', 'Free WiFi': 'fa-wifi', 'Smart TV': 'fa-tv',
    'Breakfast Included': 'fa-mug-saucer', 'Mini Bar': 'fa-wine-bottle', 'Rain Shower': 'fa-shower',
    'Work Desk': 'fa-laptop', 'Mini Kitchen': 'fa-kitchen-set', 'Sofa Bed': 'fa-couch',
    'Lounge Access': 'fa-champagne-glasses', 'Private Terrace': 'fa-umbrella-beach', 'Butler Service': 'fa-bell-concierge'
  };
  return map[name] || 'fa-circle-check';
}

function initRoomDetailsPage(id) {
  const room = getRoomById(id) || ROOMS[0];
  const mainImg = document.getElementById('detailsMainImg');
  const thumbs = document.querySelectorAll('.details-side .thumb');

  function openAt(idx) {
    openLightbox(room.gallery, idx);
  }
  if (mainImg) mainImg.addEventListener('click', () => openAt(0));
  thumbs.forEach(t => {
    t.addEventListener('click', () => openAt(parseInt(t.getAttribute('data-idx'))));
  });

  const similar = ROOMS.filter(r => r.id !== room.id && r.type === room.type).slice(0, 3);
  const fallback = similar.length ? similar : ROOMS.filter(r => r.id !== room.id).slice(0, 3);
  const grid = document.getElementById('similarRoomsGrid');
  if (grid) {
    grid.innerHTML = fallback.map((r, i) => roomCardHTML(r, i)).join('');
    attachFavoriteButtons(grid);
    initScrollReveal(grid);
  }
}

/* =========================================================
   RESERVATION PAGE
   ========================================================= */
Templates.reservation = (id) => {
  const preselected = id || App.state.booking.roomId || '';
  return `
<div class="page-header" style="padding-bottom:48px;">
  <div class="page-header-bg" style="background-image:url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop')"></div>
  <div class="container page-header-content">
    <span class="eyebrow hero-eyebrow">Reservation</span>
    <h1>Complete Your Booking</h1>
    <div class="breadcrumb"><a href="#" data-route="home">Home</a><span class="sep">/</span><span>Reservation</span></div>
  </div>
</div>

<section style="padding-top:56px;">
  <div class="container">
    <div class="reservation-layout">
      <div>
        <form id="reservationForm" novalidate>
          <div class="form-card">
            <div class="form-section">
              <h3><i class="fa-solid fa-bed"></i> Stay Details</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="roomTypeSelect">Room Type</label>
                  <select id="roomTypeSelect">
                    <option value="">Select a room...</option>
                    ${ROOMS.map(r => `<option value="${r.id}" ${r.id === preselected ? 'selected' : ''} ${!r.available ? 'disabled' : ''}>${r.name} — ${formatMoney(r.price)}/night ${!r.available ? '(Unavailable)' : ''}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="checkInDate">Check-in Date</label>
                  <input type="date" id="checkInDate" min="${todayISO()}">
                </div>
                <div class="form-group">
                  <label for="checkOutDate">Check-out Date</label>
                  <input type="date" id="checkOutDate" min="${tomorrowISO()}">
                </div>
                <div class="form-group">
                  <label>Adults</label>
                  <div class="stepper">
                    <button type="button" id="adultsMinus">&minus;</button>
                    <span class="val" id="adultsVal">2</span>
                    <button type="button" id="adultsPlus">+</button>
                  </div>
                </div>
                <div class="form-group">
                  <label>Children</label>
                  <div class="stepper">
                    <button type="button" id="childrenMinus">&minus;</button>
                    <span class="val" id="childrenVal">0</span>
                    <button type="button" id="childrenPlus">+</button>
                  </div>
                </div>
                <div class="form-group full">
                  <label for="specialRequests">Special Requests <span class="opt">(optional)</span></label>
                  <textarea id="specialRequests" placeholder="Late check-in, room preferences, dietary notes..."></textarea>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3><i class="fa-solid fa-user"></i> Guest Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="guestName">Full Name</label>
                  <input type="text" id="guestName" placeholder="Jane Doe">
                </div>
                <div class="form-group">
                  <label for="guestEmail">Email</label>
                  <input type="email" id="guestEmail" placeholder="jane@example.com">
                </div>
                <div class="form-group full">
                  <label for="guestPhone">Phone Number</label>
                  <input type="tel" id="guestPhone" placeholder="+1 (555) 000-0000">
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3><i class="fa-solid fa-credit-card"></i> Payment Method</h3>
              <div class="payment-options">
                <div class="pay-option selected" data-pay="card"><i class="fa-solid fa-credit-card"></i><span class="lbl">Credit Card</span></div>
                <div class="pay-option" data-pay="paypal"><i class="fa-brands fa-paypal"></i><span class="lbl">PayPal</span></div>
                <div class="pay-option" data-pay="cash"><i class="fa-solid fa-money-bill-wave"></i><span class="lbl">Cash on Arrival</span></div>
              </div>
            </div>

            <button type="submit" class="btn btn-gold btn-block" id="confirmReservationBtn">
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>

      <div class="details-aside">
        <div class="summary-card" id="bookingSummaryCard">
          <h3 style="font-size:18px; margin-bottom:20px;">Booking Summary</h3>
          <div id="summaryContent"></div>
        </div>
      </div>
    </div>
  </div>
</section>

${Templates.footer()}
`;
};

/* =========================================================
   ABOUT PAGE
   ========================================================= */
Templates.about = () => `
<div class="page-header">
  <div class="page-header-bg" style="background-image:url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1600&auto=format&fit=crop')"></div>
  <div class="container page-header-content">
    <span class="eyebrow hero-eyebrow">Our Story</span>
    <h1>About Aurelia &amp; Bay</h1>
    <div class="breadcrumb"><a href="#" data-route="home">Home</a><span class="sep">/</span><span>About</span></div>
  </div>
</div>

<section>
  <div class="container">
    <div class="about-split">
      <div class="about-img-stack reveal">
        <img class="img-1" src="https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=900&auto=format&fit=crop" alt="Hotel lobby">
        <img class="img-2" src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=700&auto=format&fit=crop" alt="Hotel exterior">
      </div>
      <div class="about-text reveal">
        <span class="eyebrow">Since 2011</span>
        <h2 style="margin-top:14px; margin-bottom:22px; font-size:34px;">A family-run hotel,<br>grown one season at a time</h2>
        <p>Aurelia &amp; Bay began as a single restaurant and forty rooms along the harbor, opened by the Bellini family with a simple idea: hospitality should feel personal, not performed.</p>
        <p>Fifteen years on, that idea still shapes every stay. We\u2019ve grown to 120 rooms and suites, but we\u2019ve kept the parts that mattered from the beginning — a team that remembers your name, a kitchen that cooks like it\u2019s for family, and rooms designed to make you want to stay a little longer.</p>
      </div>
    </div>
  </div>
</section>

<section class="section-navy">
  <div class="container">
    <div class="stats-row reveal-group">
      <div class="stat-item reveal"><div class="num">5,000+</div><div class="label">Guests Hosted</div></div>
      <div class="stat-item reveal"><div class="num">120</div><div class="label">Rooms &amp; Suites</div></div>
      <div class="stat-item reveal"><div class="num">15</div><div class="label">Years of Experience</div></div>
      <div class="stat-item reveal"><div class="num">4.9</div><div class="label">Average Rating</div></div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="mv-grid reveal-group">
      <div class="mv-card reveal">
        <div class="ic"><i class="fa-solid fa-bullseye"></i></div>
        <h4>Our Mission</h4>
        <p>To offer hospitality that feels considered rather than scripted — where every guest leaves having felt genuinely looked after, not simply processed.</p>
      </div>
      <div class="mv-card reveal">
        <div class="ic"><i class="fa-solid fa-eye"></i></div>
        <h4>Our Vision</h4>
        <p>To remain the region\u2019s most personal luxury hotel, growing in quality of experience rather than size alone, for decades to come.</p>
      </div>
    </div>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <div class="section-head">
      <div class="head-left">
        <span class="eyebrow">Our Journey</span>
        <h2>Milestones along the way</h2>
      </div>
    </div>
    <div class="timeline reveal">
      ${TIMELINE.map(t => `
        <div class="timeline-item">
          <div class="yr">${t.yr}</div>
          <p>${t.text}</p>
        </div>`).join('')}
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="section-head">
      <div class="head-left">
        <span class="eyebrow">Meet The Team</span>
        <h2>The people behind your stay</h2>
      </div>
    </div>
    <div class="team-grid reveal-group">
      ${TEAM.map(m => `
        <div class="team-card reveal">
          <div class="photo"><img src="${m.photo}" alt="${m.name}"></div>
          <h4>${m.name}</h4>
          <div class="role">${m.role}</div>
        </div>`).join('')}
    </div>
  </div>
</section>

${Templates.footer()}
`;

function initAboutPage() {}

/* =========================================================
   GALLERY PAGE
   ========================================================= */
Templates.gallery = () => `
<div class="page-header">
  <div class="page-header-bg" style="background-image:url('https://images.unsplash.com/photo-1551776235-dde6d482980b?q=80&w=1600&auto=format&fit=crop')"></div>
  <div class="container page-header-content">
    <span class="eyebrow hero-eyebrow">Visual Tour</span>
    <h1>Gallery</h1>
    <div class="breadcrumb"><a href="#" data-route="home">Home</a><span class="sep">/</span><span>Gallery</span></div>
  </div>
</div>

<section>
  <div class="container">
    <div class="gallery-filters" id="galleryFilters">
      <button class="gallery-filter-btn active" data-cat="all">All</button>
      <button class="gallery-filter-btn" data-cat="rooms">Rooms</button>
      <button class="gallery-filter-btn" data-cat="restaurant">Restaurant</button>
      <button class="gallery-filter-btn" data-cat="pool">Pool</button>
      <button class="gallery-filter-btn" data-cat="lobby">Lobby</button>
      <button class="gallery-filter-btn" data-cat="events">Events</button>
    </div>
    <div class="masonry" id="masonryGrid"></div>
  </div>
</section>

${Templates.footer()}
`;

/* =========================================================
   CONTACT PAGE
   ========================================================= */
Templates.contact = () => `
<div class="page-header">
  <div class="page-header-bg" style="background-image:url('https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1600&auto=format&fit=crop')"></div>
  <div class="container page-header-content">
    <span class="eyebrow hero-eyebrow">Get In Touch</span>
    <h1>Contact Us</h1>
    <div class="breadcrumb"><a href="#" data-route="home">Home</a><span class="sep">/</span><span>Contact</span></div>
  </div>
</div>

<section>
  <div class="container">
    <div class="contact-layout">
      <div>
        <span class="eyebrow">Reach Us Directly</span>
        <h2 style="margin-top:14px; margin-bottom:8px; font-size:28px;">We\u2019re here to help</h2>
        <p style="color:var(--text-soft); font-size:14.5px;">Our concierge team responds to most enquiries within a few hours.</p>

        <div class="contact-info-list">
          <div class="contact-info-item">
            <div class="ic"><i class="fa-solid fa-location-dot"></i></div>
            <div><div class="lbl">Address</div><div class="val">14 Harbor Promenade, Bay City</div></div>
          </div>
          <div class="contact-info-item">
            <div class="ic"><i class="fa-solid fa-phone"></i></div>
            <div><div class="lbl">Phone</div><div class="val">+1 (555) 014-2200</div></div>
          </div>
          <div class="contact-info-item">
            <div class="ic"><i class="fa-solid fa-envelope"></i></div>
            <div><div class="lbl">Email</div><div class="val">stay@aureliabay.com</div></div>
          </div>
          <div class="contact-info-item">
            <div class="ic"><i class="fa-solid fa-clock"></i></div>
            <div><div class="lbl">Working Hours</div><div class="val">Reception open 24/7</div></div>
          </div>
        </div>

        <div class="map-placeholder">
          <i class="fa-solid fa-map-location-dot"></i>
          <span>Map preview placeholder</span>
        </div>

        <div class="social-row" style="margin-top:24px;">
          <a href="#" aria-label="Instagram" style="border-color:var(--border); color:var(--text-soft);"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="Facebook" style="border-color:var(--border); color:var(--text-soft);"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="X" style="border-color:var(--border); color:var(--text-soft);"><i class="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>

      <div class="form-card">
        <h3 style="margin-bottom:22px;">Send a Message</h3>
        <form id="contactForm" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label for="contactName">Name</label>
              <input type="text" id="contactName" placeholder="Your name">
            </div>
            <div class="form-group">
              <label for="contactEmail">Email</label>
              <input type="email" id="contactEmail" placeholder="you@example.com">
            </div>
            <div class="form-group full">
              <label for="contactSubject">Subject</label>
              <input type="text" id="contactSubject" placeholder="What is this about?">
            </div>
            <div class="form-group full">
              <label for="contactMessage">Message</label>
              <textarea id="contactMessage" placeholder="Write your message..."></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-navy btn-block" style="margin-top:8px;">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <div class="section-head" style="justify-content:center; text-align:center; flex-direction:column; align-items:center;">
      <span class="eyebrow">Frequently Asked</span>
      <h2>Common questions</h2>
    </div>
    <div class="faq-list" id="faqList"></div>
  </div>
</section>

${Templates.footer()}
`;

function initContactPage() {
  const faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.innerHTML = FAQS.map((f, i) => `
      <div class="faq-item" data-i="${i}">
        <button class="faq-q" type="button">
          <span>${f.q}</span>
          <i class="fa-solid fa-plus"></i>
        </button>
        <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>
      </div>`).join('');

    faqList.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqList.querySelectorAll('.faq-item').forEach(other => {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = [
        { el: document.getElementById('contactName'), check: v => v.trim().length > 1 },
        { el: document.getElementById('contactEmail'), check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
        { el: document.getElementById('contactSubject'), check: v => v.trim().length > 2 },
        { el: document.getElementById('contactMessage'), check: v => v.trim().length > 5 }
      ];
      let valid = true;
      fields.forEach(f => {
        const ok = f.check(f.el.value);
        f.el.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        showToast('Please complete all fields correctly.', 'error');
        return;
      }
      showToast('Message sent — we\u2019ll be in touch shortly.');
      form.reset();
    });
  }
}

/* =========================================================
   FOOTER (shared)
   ========================================================= */
Templates.footer = () => `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="logo" data-route="home">
          <span class="logo-mark">AB</span>
          <span class="logo-text">Aurelia&nbsp;&amp;&nbsp;Bay</span>
        </a>
        <p>A boutique waterfront hotel built around quiet luxury, considered service, and views worth waking up for.</p>
        <div class="social-row">
          <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" aria-label="Pinterest"><i class="fa-brands fa-pinterest-p"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Quick Links</h5>
        <ul>
          <li><a href="#" data-route="rooms">Rooms &amp; Suites</a></li>
          <li><a href="#" data-route="about">About Us</a></li>
          <li><a href="#" data-route="gallery">Gallery</a></li>
          <li><a href="#" data-route="reservation">Book Now</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Support</h5>
        <ul>
          <li><a href="#" data-route="contact">Contact Us</a></li>
          <li><a href="#" data-route="contact">FAQs</a></li>
          <li><a href="#" data-route="contact">Cancellation Policy</a></li>
          <li><a href="#" data-route="contact">Accessibility</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Contact</h5>
        <div class="contact-line"><i class="fa-solid fa-location-dot"></i><span>14 Harbor Promenade, Bay City</span></div>
        <div class="contact-line"><i class="fa-solid fa-phone"></i><span>+1 (555) 014-2200</span></div>
        <div class="contact-line"><i class="fa-solid fa-envelope"></i><span>stay@aureliabay.com</span></div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Aurelia &amp; Bay Hotel. All rights reserved.</span>
      <div><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
    </div>
  </div>
</footer>
`;
