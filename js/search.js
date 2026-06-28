/* ===========================================================
   AURELIA & BAY — Room Search & Filtering
   Powers the Rooms listing page: search, type/guest/price filters,
   and pagination.
   =========================================================== */

const RoomSearch = {
  page: 1,
  perPage: 6,
  filters: { query: '', type: 'all', guests: 0, maxPrice: 600 }
};

function getFilteredRooms() {
  const f = RoomSearch.filters;
  return ROOMS.filter(r => {
    if (f.query && !r.name.toLowerCase().includes(f.query.toLowerCase())) return false;
    if (f.type !== 'all' && r.type !== f.type) return false;
    if (f.guests > 0) {
      if (f.guests >= 4 && r.guests < 4) return false;
      if (f.guests < 4 && r.guests < f.guests) return false;
    }
    if (r.price > f.maxPrice) return false;
    return true;
  });
}

function renderRoomsList() {
  const grid = document.getElementById('roomsListGrid');
  const pagination = document.getElementById('roomsPagination');
  const countLabel = document.getElementById('roomsCount');
  if (!grid) return;

  const filtered = getFilteredRooms();
  const totalPages = Math.max(1, Math.ceil(filtered.length / RoomSearch.perPage));
  if (RoomSearch.page > totalPages) RoomSearch.page = totalPages;

  const start = (RoomSearch.page - 1) * RoomSearch.perPage;
  const pageItems = filtered.slice(start, start + RoomSearch.perPage);

  countLabel.textContent = filtered.length === 0
    ? 'No rooms match your filters'
    : `Showing ${start + 1}–${Math.min(start + RoomSearch.perPage, filtered.length)} of ${filtered.length} rooms`;

  if (pageItems.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <i class="fa-solid fa-bed"></i>
        <h4>No rooms found</h4>
        <p>Try adjusting your search or filters to see more results.</p>
      </div>`;
  } else {
    grid.innerHTML = pageItems.map((r, i) => roomCardHTML(r, i)).join('');
    attachFavoriteButtons(grid);
    initScrollReveal(grid);
  }

  renderPagination(totalPages, pagination);
}

function renderPagination(totalPages, container) {
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = `<button data-page="${RoomSearch.page - 1}" ${RoomSearch.page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button data-page="${i}" class="${i === RoomSearch.page ? 'active' : ''}">${i}</button>`;
  }
  html += `<button data-page="${RoomSearch.page + 1}" ${RoomSearch.page === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  container.innerHTML = html;

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.getAttribute('data-page'));
      if (p >= 1 && p <= totalPages) {
        RoomSearch.page = p;
        renderRoomsList();
        document.querySelector('.rooms-toolbar').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initRoomsPage() {
  // restore last-used filters for a nicer back/forward experience
  RoomSearch.page = 1;

  const searchInput = document.getElementById('roomSearch');
  const typeFilter = document.getElementById('roomTypeFilter');
  const guestsFilter = document.getElementById('guestsFilter');
  const priceRange = document.getElementById('priceRange');
  const priceRangeVal = document.getElementById('priceRangeVal');
  const resetBtn = document.getElementById('resetFilters');

  searchInput.value = RoomSearch.filters.query;
  typeFilter.value = RoomSearch.filters.type;
  guestsFilter.value = String(RoomSearch.filters.guests);
  priceRange.value = RoomSearch.filters.maxPrice;
  priceRangeVal.textContent = formatMoney(RoomSearch.filters.maxPrice);

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      RoomSearch.filters.query = searchInput.value.trim();
      RoomSearch.page = 1;
      renderRoomsList();
    }, 220);
  });

  typeFilter.addEventListener('change', () => {
    RoomSearch.filters.type = typeFilter.value;
    RoomSearch.page = 1;
    renderRoomsList();
  });

  guestsFilter.addEventListener('change', () => {
    RoomSearch.filters.guests = parseInt(guestsFilter.value);
    RoomSearch.page = 1;
    renderRoomsList();
  });

  priceRange.addEventListener('input', () => {
    RoomSearch.filters.maxPrice = parseInt(priceRange.value);
    priceRangeVal.textContent = formatMoney(RoomSearch.filters.maxPrice);
    RoomSearch.page = 1;
    renderRoomsList();
  });

  resetBtn.addEventListener('click', () => {
    RoomSearch.filters = { query: '', type: 'all', guests: 0, maxPrice: 600 };
    RoomSearch.page = 1;
    searchInput.value = '';
    typeFilter.value = 'all';
    guestsFilter.value = '0';
    priceRange.value = 600;
    priceRangeVal.textContent = formatMoney(600);
    renderRoomsList();
    showToast('Filters reset');
  });

  renderRoomsList();
}
