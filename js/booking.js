/* ===========================================================
   AURELIA & BAY — Booking Logic
   Reservation form: room selection, date math, stepper controls,
   payment selection, live summary, validation, and confirmation.
   =========================================================== */

const TAX_RATE = 0.12;
const SERVICE_CHARGE = 25;

function initReservationPage(preselectedId) {
  const roomSelect = document.getElementById('roomTypeSelect');
  const checkIn = document.getElementById('checkInDate');
  const checkOut = document.getElementById('checkOutDate');
  const adultsVal = document.getElementById('adultsVal');
  const childrenVal = document.getElementById('childrenVal');
  const form = document.getElementById('reservationForm');

  const b = App.state.booking;
  if (preselectedId) b.roomId = preselectedId;
  if (!checkIn.value) checkIn.value = b.checkIn || '';
  if (!checkOut.value) checkOut.value = b.checkOut || '';

  let adults = b.adults || 2;
  let children = b.children || 0;
  adultsVal.textContent = adults;
  childrenVal.textContent = children;

  function syncState() {
    b.roomId = roomSelect.value;
    b.checkIn = checkIn.value;
    b.checkOut = checkOut.value;
    b.adults = adults;
    b.children = children;
    renderSummary();
  }

  document.getElementById('adultsPlus').addEventListener('click', () => {
    adults = Math.min(adults + 1, 8);
    adultsVal.textContent = adults;
    syncState();
  });
  document.getElementById('adultsMinus').addEventListener('click', () => {
    adults = Math.max(adults - 1, 1);
    adultsVal.textContent = adults;
    syncState();
  });
  document.getElementById('childrenPlus').addEventListener('click', () => {
    children = Math.min(children + 1, 6);
    childrenVal.textContent = children;
    syncState();
  });
  document.getElementById('childrenMinus').addEventListener('click', () => {
    children = Math.max(children - 1, 0);
    childrenVal.textContent = children;
    syncState();
  });

  roomSelect.addEventListener('change', syncState);

  checkIn.addEventListener('change', () => {
    const nextDay = new Date(checkIn.value);
    nextDay.setDate(nextDay.getDate() + 1);
    const minOut = nextDay.toISOString().split('T')[0];
    checkOut.min = minOut;
    if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = minOut;
    syncState();
  });
  checkOut.addEventListener('change', syncState);

  document.querySelectorAll('.pay-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      b.paymentMethod = opt.getAttribute('data-pay');
    });
  });

  form.addEventListener('submit', handleReservationSubmit);

  renderSummary();
}

function renderSummary() {
  const b = App.state.booking;
  const room = getRoomById(b.roomId);
  const content = document.getElementById('summaryContent');
  if (!content) return;

  if (!room) {
    content.innerHTML = `<div class="summary-empty"><i class="fa-solid fa-bed" style="font-size:24px; color:var(--border); margin-bottom:10px; display:block;"></i>Select a room to see your booking summary.</div>`;
    return;
  }

  const nights = nightsBetween(b.checkIn, b.checkOut);
  const roomTotal = nights * room.price;
  const tax = Math.round(roomTotal * TAX_RATE);
  const service = nights > 0 ? SERVICE_CHARGE : 0;
  const total = roomTotal + tax + service;

  content.innerHTML = `
    <div class="summary-room-preview">
      <img src="${room.img}" alt="${room.name}">
      <div>
        <div class="name">${room.name}</div>
        <div class="nights">${nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : 'Select your dates'}</div>
      </div>
    </div>
    <div class="summary-line"><span>Room Price</span><span>${formatMoney(room.price)} &times; ${nights} night${nights === 1 ? '' : 's'}</span></div>
    <div class="summary-line"><span>Taxes (12%)</span><span>${formatMoney(tax)}</span></div>
    <div class="summary-line"><span>Service Charge</span><span>${formatMoney(service)}</span></div>
    <div class="summary-line total"><span>Total Price</span><span class="num">${formatMoney(total)}</span></div>
  `;
}

function clearFieldErrors(form) {
  form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

function handleReservationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  clearFieldErrors(form);

  const b = App.state.booking;
  const room = getRoomById(b.roomId);
  const checkIn = document.getElementById('checkInDate');
  const checkOut = document.getElementById('checkOutDate');
  const name = document.getElementById('guestName');
  const email = document.getElementById('guestEmail');
  const phone = document.getElementById('guestPhone');
  const roomSelect = document.getElementById('roomTypeSelect');

  let valid = true;
  const fail = (el) => { el.classList.add('invalid'); valid = false; };

  if (!room) fail(roomSelect);
  if (!checkIn.value) fail(checkIn);
  if (!checkOut.value || nightsBetween(checkIn.value, checkOut.value) <= 0) fail(checkOut);
  if (!name.value.trim() || name.value.trim().length < 2) fail(name);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) fail(email);
  if (!phone.value.trim() || phone.value.trim().length < 7) fail(phone);

  if (!valid) {
    showToast('Please complete all required fields correctly.', 'error');
    form.querySelector('.invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const submitBtn = document.getElementById('confirmReservationBtn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span class="spinner"></span> Processing...`;
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    const ref = 'AB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const nights = nightsBetween(checkIn.value, checkOut.value);
    openSuccessModal(
      `Thank you, ${name.value.trim().split(' ')[0]}. Your ${room.name} is reserved for ${nights} night${nights > 1 ? 's' : ''}. A confirmation has been sent to ${email.value.trim()}.`,
      ref
    );

    // reset booking state for a fresh visit
    App.state.booking = { roomId: null, checkIn: '', checkOut: '', adults: 2, children: 0, paymentMethod: 'card' };
    form.reset();
  }, 1100);
}
