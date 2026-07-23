/* Moon Sugar Bakery — shared behavior */
(function () {
  // Year in footer
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var t = document.querySelector('.menu-toggle');
  var n = document.getElementById('primary-nav');
  if (t && n) {
    t.addEventListener('click', function () {
      var open = n.classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    n.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        n.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Graceful image placeholders until photos exist in /images
  document.querySelectorAll('img.gimg, img.cover').forEach(function (img) {
    img.addEventListener('error', function () {
      var d = document.createElement('div');
      d.className = (img.className.replace('gimg', 'ph').replace('cover', 'cover ph'));
      d.setAttribute('role', 'img');
      d.setAttribute('aria-label', img.alt);
      d.textContent = img.getAttribute('data-ph') || img.alt || 'Photo';
      d.style.alignItems = 'center';
      d.style.justifyContent = 'center';
      d.style.display = 'flex';
      img.replaceWith(d);
    });
  });

  // ---- Gallery category modals (accessible dialog) ----
  var tiles = document.querySelectorAll('[data-modal-target]');
  if (tiles.length) {
    var lastFocus = null;

    function focusables(m) {
      return m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    }
    function openModal(id, trigger) {
      var m = document.getElementById(id);
      if (!m) return;
      lastFocus = trigger || document.activeElement;
      m.classList.add('open');
      document.body.classList.add('modal-open');
      var c = m.querySelector('.modal-close');
      if (c) c.focus();
    }
    function closeModal(m) {
      m.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (lastFocus) lastFocus.focus();
    }

    tiles.forEach(function (t) {
      t.addEventListener('click', function () {
        openModal(t.getAttribute('data-modal-target'), t);
      });
    });
    document.querySelectorAll('.modal').forEach(function (m) {
      m.querySelectorAll('[data-close]').forEach(function (b) {
        b.addEventListener('click', function () { closeModal(m); });
      });
      // Focus trap + ESC within this modal
      m.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeModal(m); return; }
        if (e.key !== 'Tab') return;
        var f = focusables(m);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    });
  }
})();
