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

  // ---- Web3Forms AJAX submit → branded on-page thank-you (graceful fallback) ----
  document.querySelectorAll('form[data-w3form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch('https://api.web3forms.com/submit', {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
      }).then(function (r) { return r.json(); }).then(function (data) {
        var note = document.createElement('div');
        note.className = 'form-success';
        note.setAttribute('role', 'status');
        if (data && data.success) {
          note.innerHTML = '<h2>Thank you — your request is in!</h2><p>I\'ll get back to you by email soon. Please check your inbox (and spam folder) for my reply.</p><p><a class="btn btn-outline" href="index.html">Back to home</a></p>';
        } else {
          note.innerHTML = '<h2>That didn\'t send</h2><p>Please email me directly at <a href="mailto:hello@moonsugarbakery.com">hello@moonsugarbakery.com</a> and I\'ll take care of you.</p>';
        }
        form.replaceWith(note);
        note.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }).catch(function () {
        form.removeAttribute('data-w3form');           // fall back to normal POST
        if (btn) { btn.disabled = false; btn.textContent = original; }
        form.submit();
      });
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
