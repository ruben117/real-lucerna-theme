(function () {
  'use strict';

  function initGrid(grid) {
    var cards = grid.querySelectorAll('[data-prototipo-card]');

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (card) { card.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  function init() {
    document.querySelectorAll('[data-prototipos-grid]').forEach(initGrid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
