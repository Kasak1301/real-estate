// =====================
// SMOOTH SCROLL
// =====================
function smoothScrollTo(id) {
  var el = document.querySelector('#' + id);
  if (!el) return;
  var navHeight = document.querySelector('#navbar').offsetHeight;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - navHeight,
    behavior: 'smooth'
  });
}

document.querySelector('#navbar').addEventListener('click', function (e) {
  if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
    e.preventDefault();
    smoothScrollTo(e.target.getAttribute('href').replace('#', ''));
  }
});

// =====================
// NAVBAR SCROLL EFFECT
// =====================
window.addEventListener('scroll', function () {
  document.querySelector('#navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// =====================
// FADE-IN ON SCROLL
// =====================
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('active');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(function (el) {
  observer.observe(el);
});

// =====================
// STAT COUNTER ANIMATION
// =====================
function animateCounter(el) {
  var target = parseInt(el.dataset.target, 10);
  var start = performance.now();
  var duration = 1800;

  (function update(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  })(start);
}

var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-n').forEach(function (el) {
  counterObserver.observe(el);
});

// =====================
// SEARCH TABS
// =====================
document.querySelectorAll('.search-tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.search-tab').forEach(function (t) {
      t.classList.remove('active');
    });
    tab.classList.add('active');
  });
});

// =====================
// CONTACT FORM
// =====================
function handleSubmit(e) {
  e.preventDefault();
  var successMsg = document.getElementById('formSuccess');
  successMsg.classList.add('show');
  e.target.reset();
  setTimeout(function () {
    successMsg.classList.remove('show');
  }, 5000);
}

// =====================
// DYNAMIC REVIEWS
// =====================
function renderStars(n) {
  var html = '';
  for (var i = 1; i <= 5; i++) {
    html += '<span class="' + (i <= n ? 'star-on' : 'star-off') + '">★</span>';
  }
  return html;
}

function renderReviewsGrid() {
  if (typeof DB === 'undefined') return;
  var grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  var reviews = DB.getReviews().filter(function (r) { return r.visible !== false && r.rating >= 3; });
  var empty = document.getElementById('reviewsGridEmpty');

  if (!reviews.length) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  grid.innerHTML = reviews.map(function (r, i) {
    var featured = i === 0 ? ' rcard-featured' : '';
    return '<div class="rcard' + featured + '">' +
      '<div class="rcard-quote">&ldquo;</div>' +
      '<div class="rcard-stars">' + renderStars(r.rating) + '</div>' +
      '<p class="rcard-text">' + r.text + '</p>' +
      '<div class="rcard-author">' +
        '<div class="rcard-avatar">' + r.initials + '</div>' +
        '<div class="rcard-author-info">' +
          '<strong>' + r.author + '</strong>' +
          (r.location ? '<span>' + r.location + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderReviewsTrack() { renderReviewsGrid(); }

// =====================
// HERO SEARCH BAR
// =====================
function initHeroSearch() {
  var btn = document.getElementById('heroSearchBtn');
  var input = document.getElementById('heroSearchInput');
  if (!btn || !input) return;
  btn.addEventListener('click', function () {
    var q = input.value.trim();
    window.location.href = q ? 'properties.html?q=' + encodeURIComponent(q) : 'properties.html';
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') btn.click();
  });
}

// =====================
// INIT
// =====================
document.addEventListener('DOMContentLoaded', function () {
  renderReviewsTrack();
  initHeroSearch();
});
