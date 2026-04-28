(function () {
  'use strict';

  function initImageSlider(sliderEl) {
    var track    = sliderEl.querySelector('[data-img-slider-track]');
    var slides   = Array.from(sliderEl.querySelectorAll('[data-img-slide]'));
    var prevBtn  = sliderEl.querySelector('[data-img-prev]');
    var nextBtn  = sliderEl.querySelector('[data-img-next]');
    var viewport = sliderEl.querySelector('.img-slider__viewport');
    var lightbox = sliderEl.querySelector('[data-img-lightbox]');
    var lbImg    = lightbox ? lightbox.querySelector('[data-img-lightbox-img]') : null;
    var lbCloses = lightbox ? Array.from(lightbox.querySelectorAll('[data-img-lightbox-close]')) : [];
    var hasLightbox = sliderEl.dataset.lightbox !== 'false';

    if (!track || !slides.length || !viewport) return;

    var total        = slides.length;
    var startIndex   = parseInt(sliderEl.dataset.startIndex, 10) || 0;
    var currentIndex = 0;
    var isLoop       = sliderEl.dataset.loop !== 'false';
    var doAutoplay   = sliderEl.dataset.autoplay === 'true';
    var autoDelay    = parseInt(sliderEl.dataset.autoplayDelay, 10) || 4000;
    var autoTimer    = null;
    var resizeTimer  = null;

    // ── Ir a slide ─────────────────────────────────────────
    function goTo(index) {
      if (isLoop) {
        index = ((index % total) + total) % total;
      } else {
        index = Math.max(0, Math.min(index, total - 1));
      }
      currentIndex = index;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === currentIndex);
      });

      var slideW = slides[0].offsetWidth;
      var gapVal = parseFloat(getComputedStyle(track).gap) || 0;
      var viewW  = viewport.offsetWidth;
      var peekL  = (viewW - slideW) / 2;
      var offset = currentIndex * (slideW + gapVal) - peekL;
      var maxOff = (total - 1) * (slideW + gapVal) - peekL;
      if (offset < 0) offset = 0;
      if (maxOff > 0 && offset > maxOff) offset = maxOff;

      track.style.transform = 'translateX(-' + offset + 'px)';

      if (!isLoop) {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
      } else {
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
      }
    }

    // ── Autoplay ───────────────────────────────────────────
    function startAutoplay() {
      if (!doAutoplay) return;
      autoTimer = setInterval(function () { goTo(currentIndex + 1); }, autoDelay);
    }
    function stopAutoplay() { clearInterval(autoTimer); }
    function resetAutoplay() { stopAutoplay(); startAutoplay(); }

    // ── Lightbox ───────────────────────────────────────────
    function openLightbox(src, alt) {
      if (!lightbox || !lbImg || !hasLightbox) return;
      lbImg.src = src;
      lbImg.alt = alt || '';
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      stopAutoplay();
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lbImg) { lbImg.src = ''; }
      startAutoplay();
    }

    // ── Clicks en slides ───────────────────────────────────
    slides.forEach(function (slide) {
      var imgWrap = slide.querySelector('.img-slider__img-wrap');
      var img     = slide.querySelector('.img-slider__img');
      if (!imgWrap) return;

      imgWrap.addEventListener('click', function () {
        var idx = parseInt(slide.dataset.imgSlide, 10);
        if (slide.classList.contains('is-active')) {
          if (hasLightbox && img) openLightbox(img.src, img.alt);
        } else {
          goTo(idx);
          resetAutoplay();
        }
      });
    });

    // ── Cerrar lightbox ────────────────────────────────────
    lbCloses.forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    // ── Teclado ────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
      if (lightbox && lightbox.classList.contains('is-open')) {
        if (e.key === 'Escape') closeLightbox();
        return;
      }
      if (document.activeElement === sliderEl || sliderEl.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft')  { goTo(currentIndex - 1); resetAutoplay(); }
        if (e.key === 'ArrowRight') { goTo(currentIndex + 1); resetAutoplay(); }
      }
    });

    // ── Botones nav ────────────────────────────────────────
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); resetAutoplay(); });

    // ── Touch / Swipe ──────────────────────────────────────
    var touchStartX = 0;
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        resetAutoplay();
      }
    }, { passive: true });

    // ── Resize ─────────────────────────────────────────────
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { goTo(currentIndex); }, 130);
    });

    // ── Hover pause ────────────────────────────────────────
    sliderEl.addEventListener('mouseenter', stopAutoplay);
    sliderEl.addEventListener('mouseleave', startAutoplay);

    // ── Init ───────────────────────────────────────────────
    sliderEl.setAttribute('tabindex', '0');
    goTo(startIndex);
    startAutoplay();
  }

  function init() {
    document.querySelectorAll('[data-img-slider]').forEach(initImageSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
