(function () {
  'use strict';

  function initSlider(dataEl) {
    /* Leer configuración desde data-attributes */
    var intervalo = parseInt(dataEl.getAttribute('data-intervalo'), 10) || 5000;
    var fade      = parseInt(dataEl.getAttribute('data-fade'), 10)      || 1200;

    /* Leer las URLs de las imágenes */
    var imgEls = dataEl.querySelectorAll('[data-slide]');
    if (imgEls.length < 2) return;

    /* Encontrar el dnd-section padre */
    var section = dataEl.closest('.dnd-section');
    if (!section) return;

    /* Asegurar que la sección sea el contexto de posicionamiento */
    if (getComputedStyle(section).position === 'static') {
      section.style.position = 'relative';
    }

    /* Construir el contenedor del slider */
    var slider = document.createElement('div');
    slider.className = 'hero-bg-slider';
    slider.setAttribute('aria-hidden', 'true');

    imgEls.forEach(function (imgEl, i) {
      var slide = document.createElement('div');
      slide.className = 'hero-bg-slider__slide' + (i === 0 ? ' is-active' : '');
      slide.style.backgroundImage    = "url('" + imgEl.getAttribute('data-slide') + "')";
      slide.style.transitionDuration = fade + 'ms';
      slider.appendChild(slide);
    });

    /* Insertar ANTES del row-fluid, como primer hijo del dnd-section */
    section.insertBefore(slider, section.firstChild);

    /* Pre-cargar imágenes para evitar flash en el primer cambio */
    imgEls.forEach(function (imgEl) {
      var img = new Image();
      img.src = imgEl.getAttribute('data-slide');
    });

    /* Ciclo de cambio */
    var slides  = slider.querySelectorAll('.hero-bg-slider__slide');
    var current = 0;

    setInterval(function () {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, intervalo);
  }

  function init() {
    document.querySelectorAll('[data-hero-slider]').forEach(initSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
