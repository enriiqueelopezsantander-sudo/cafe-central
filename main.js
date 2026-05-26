/* ============================================
   CAFÉ CENTRAL — main.js
   Vanilla JS, no dependencies
   ============================================ */

(function () {
  'use strict';

  // ---------- Helpers ----------
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('[' + name + ']', e); }
  }

  // Remove no-js fallback class (if it was there)
  document.documentElement.classList.remove('no-js');

  // ---------- 1. Scroll-reveal with IntersectionObserver ----------
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });

    // Safety net: reveal anything still hidden after 6s
    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains('in')) el.classList.add('in');
      });
    }, 6000);
  }

  // ---------- 2. Reservation form ----------
  function initForm() {
    var form = document.getElementById('resForm');
    var success = document.getElementById('resSuccess');
    var dateInput = document.getElementById('r-date');
    if (!form) return;

    // Set min date = today; default to today
    if (dateInput) {
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var dd = String(today.getDate()).padStart(2, '0');
      var iso = yyyy + '-' + mm + '-' + dd;
      dateInput.setAttribute('min', iso);
      if (!dateInput.value) dateInput.value = iso;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name  = (form.elements['name']  || {}).value || '';
      var phone = (form.elements['phone'] || {}).value || '';
      var date  = (form.elements['date']  || {}).value || '';
      var time  = (form.elements['time']  || {}).value || '';

      if (!name.trim() || !phone.trim() || !date || !time) {
        // Highlight empty fields briefly
        ['name', 'phone', 'date', 'time'].forEach(function (n) {
          var f = form.elements[n];
          if (f && !f.value) {
            f.style.borderColor = '#c5301e';
            setTimeout(function () { f.style.borderColor = ''; }, 1800);
          }
        });
        return;
      }

      // Show success state
      if (success) {
        success.classList.add('show');
        form.querySelectorAll('input, select, button').forEach(function (el) {
          if (el !== success) el.disabled = true;
        });
        // Scroll the success into view smoothly
        setTimeout(function () {
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  }

  // ---------- 3. Highlight today in hours ----------
  function initToday() {
    var list = document.getElementById('hoursList');
    if (!list) return;
    var today = new Date().getDay(); // 0=Sun ... 6=Sat
    var li = list.querySelector('li[data-day="' + today + '"]');
    if (li) li.classList.add('today');
  }

  // ---------- 4. Nav scroll behavior ----------
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var lastY = 0;
    function onScroll() {
      var y = window.scrollY;
      if (y > 40) {
        nav.style.boxShadow = '0 12px 40px rgba(61,40,20,0.10)';
        nav.style.background = 'rgba(250, 246, 238, 0.92)';
      } else {
        nav.style.boxShadow = '';
        nav.style.background = '';
      }
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- 5. Smooth-scroll for anchor links (extra polish) ----------
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ---------- INIT ----------
  function init() {
    safe(initReveal,  'reveal');
    safe(initForm,    'form');
    safe(initToday,   'today');
    safe(initNav,     'nav');
    safe(initAnchors, 'anchors');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
