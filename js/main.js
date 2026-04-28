(function () {

  // ── Utilidad: ejecutar cuando el DOM esté listo ────────────────
  function domReady(callback) {
    if (['interactive', 'complete'].indexOf(document.readyState) >= 0) {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  // ── Header: scroll sticky + hamburger mobile ───────────────────
  function initHeader() {
    var header    = document.getElementById('site-header');
    var hamburger = document.getElementById('header-hamburger');
    var nav       = document.getElementById('header-nav');

    if (!header) return;

    var SCROLL_THRESHOLD = 10;

    function onScroll() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!hamburger || !nav) return;

    function openMenu() {
      nav.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Cerrar menú');
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menú');
    }

    function toggleMenu() {
      var isOpen = nav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    }

    hamburger.addEventListener('click', toggleMenu);

    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        closeMenu();
      }
    });

    nav.querySelectorAll('.menu__link').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    var mql = window.matchMedia('(min-width: 768px)');
    function onBreakpoint(e) {
      if (e.matches) closeMenu();
    }
    if (mql.addEventListener) {
      mql.addEventListener('change', onBreakpoint);
    } else {
      mql.addListener(onBreakpoint);
    }
  }

  // ── Email unsubscribe ──────────────────────────────────────────
  function initEmailUnsub() {
    var emailGlobalUnsub = document.querySelector('input[name="globalunsub"]');
    if (!emailGlobalUnsub) return;

    function toggleDisabled() {
      var emailSubItem = document.querySelectorAll('#email-prefs-form .item');
      emailSubItem.forEach(function (item) {
        var input = item.querySelector('input');
        if (emailGlobalUnsub.checked) {
          item.classList.add('disabled');
          input.setAttribute('disabled', 'disabled');
          input.checked = false;
        } else {
          item.classList.remove('disabled');
          input.removeAttribute('disabled');
        }
      });
    }

    emailGlobalUnsub.addEventListener('change', toggleDisabled);
  }

  // ── Init ───────────────────────────────────────────────────────
  domReady(function () {
    if (!document.body) return;
    initHeader();
    initEmailUnsub();
  });

})();
