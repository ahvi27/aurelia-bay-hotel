/* ===========================================================
   AURELIA & BAY — Gallery & Lightbox
   Masonry grid with category filters + lightbox image preview
   =========================================================== */

const GalleryState = { activeCat: 'all', images: [], currentIndex: 0 };

function renderMasonry(cat = 'all') {
  const grid = document.getElementById('masonryGrid');
  if (!grid) return;

  const filtered = cat === 'all' ? GALLERY_IMAGES : GALLERY_IMAGES.filter(img => img.cat === cat);
  GalleryState.images = filtered;

  grid.innerHTML = filtered.map((img, i) => `
    <div class="masonry-item reveal" data-idx="${i}" style="grid-row-end: span ${img.tall ? 26 : 18};">
      <img src="${img.src}" alt="${img.label}" loading="lazy">
      <div class="zoom-ic"><i class="fa-solid fa-expand"></i></div>
      <div class="overlay">${img.label}</div>
    </div>`).join('');

  grid.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-idx'));
      openLightbox(filtered.map(im => im.src), idx);
    });
  });

  initScrollReveal(grid);
}

function initGalleryPage() {
  GalleryState.activeCat = 'all';
  renderMasonry('all');

  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      GalleryState.activeCat = cat;
      renderMasonry(cat);
    });
  });
}

/* ---------- Lightbox ---------- */
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, startIndex = 0) {
  lightboxImages = images;
  lightboxIndex = startIndex;
  updateLightboxImg();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightboxImg() {
  const img = document.getElementById('lightboxImg');
  img.src = lightboxImages[lightboxIndex];
  const multi = lightboxImages.length > 1;
  document.getElementById('lightboxPrev').style.display = multi ? 'flex' : 'none';
  document.getElementById('lightboxNext').style.display = multi ? 'flex' : 'none';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImg();
  });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightboxImg();
  });
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });
});
