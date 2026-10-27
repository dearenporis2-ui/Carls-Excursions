/* Carl Mills Island Charters: shared site script (menu, booking form, parallax, loading screen, page transition, photo viewer) */

(function () {
  'use strict';
  /* CONFIG: the bookings WhatsApp number, digits only with country code */
  var WHATSAPP_NUMBER = '2482526753';
  var PACKAGES = {
    'full-day': 'Full-Day Island Excursion (Mahé ➔ Praslin ➔ La Digue)',
    'express': 'La Digue Day Express (Self-Guided Tour)'
  };
  var wa = function (t) { return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(t); };
  var $ = function (s) { return document.querySelector(s); };

  var general = 'Hello, I’d like to reserve an island excursion with Carl Mills Island Charters.';
  document.querySelectorAll('.js-wa').forEach(function (a) { a.href = wa(a.getAttribute('data-msg') || general); });
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();


  /* Booking form (book.html only) */
  var form = $('#bookForm');
  if (!form) return;
  var date = $('#f-date');
  var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  date.min = d.toISOString().split('T')[0];
  var wanted = new URLSearchParams(location.search).get('pkg');
  if (wanted && PACKAGES[wanted]) $('#f-pkg').value = wanted;

  
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#f-name').value.trim(), when = date.value,
        guests = parseInt($('#f-guests').value, 10), email = $('#f-email').value.trim(),
        pkg = $('#f-pkg').value, err = $('#err');
    if (!name || !when || !email || !(guests >= 1)) { err.textContent = 'Please complete all fields before sending your request.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Please enter a valid email address. Your payment link is sent there.'; return; }
    err.textContent = '';
    var msg = 'Hello, I’d like to request a booking:\n' +
      '• Name: ' + name + '\n' +
      '• Tour date: ' + when + '\n' +
      '• Guests: ' + guests + '\n' +
      '• Package: ' + PACKAGES[pkg] + ' – €130/pax + SCR 25 port tax\n' +
      '• Email (for the payment link): ' + email + '\n' +
      'Please confirm availability. Thank you!';
    var w = window.open(wa(msg), '_blank', 'noopener');
    if (!w) { window.location.href = wa(msg); }
  });
})();


(function () {
  /* Temporary address - swap for the custom domain once it is live */
  var FISH_TRAP_URL = 'https://dearenporis2-ui.github.io/FishTrap/';
  document.querySelectorAll('.js-fish').forEach(function (a) { a.href = FISH_TRAP_URL; });
})();

(function () {
  'use strict';
  var el = document.getElementById('bgfx');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight, amp = vh * 0.11,
        max = Math.max(document.documentElement.scrollHeight - vh, 1),
        rate = Math.min(0.15, (2 * amp) / max),
        y = Math.max(-amp, Math.min(amp, amp - window.pageYOffset * rate));
    el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  window.addEventListener('hashchange', req);
  update();
})();

(function () {
  'use strict';
  var nav = document.getElementById('nav'), menu = document.getElementById('navMenu'),
      tide = menu.querySelector('.tide'), links = [].slice.call(menu.querySelectorAll('a')),
      burger = document.getElementById('navBurger'), sheet = document.getElementById('sheet');

  /* sliding tide highlight */
  function active() { return menu.querySelector('[aria-current]'); }
  function place(a) {
    if (!a || !a.offsetWidth) { tide.style.opacity = 0; return; }
    tide.style.opacity = 1;
    tide.style.width = a.offsetWidth + 'px';
    tide.style.transform = 'translateX(' + a.offsetLeft + 'px)';
  }
  function home() { place(active()); }
  links.forEach(function (a) {
    a.addEventListener('mouseenter', function () { place(a); });
    a.addEventListener('focus', function () { place(a); });
  });
  menu.addEventListener('mouseleave', home);
  menu.addEventListener('focusout', home);
  window.addEventListener('hashchange', function () { setTimeout(home, 0); });
  window.addEventListener('resize', home);
  home();
  requestAnimationFrame(function () { requestAnimationFrame(function () { tide.classList.remove('fresh'); }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { tide.classList.add('fresh'); home(); requestAnimationFrame(function () { tide.classList.remove('fresh'); }); });

  /* compact bar + journey progress */
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset, max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    nav.classList.toggle('scrolled', y > 20);
    nav.style.setProperty('--p', Math.min(1, y / max).toFixed(4));
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('hashchange', function () { setTimeout(onScroll, 60); });
  onScroll();

  /* mobile sheet */
  function setOpen(open) {
    sheet.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () { setOpen(!sheet.classList.contains('open')); });
  window.addEventListener('hashchange', function () { setOpen(false); });
  sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) { setOpen(false); burger.focus(); } });
  window.matchMedia('(min-width:1100px)').addEventListener('change', function (e) { if (e.matches) setOpen(false); });
})();

(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* hero parallax: the photo drifts slower than the page */
  var hero = document.querySelector('.hero'), bg = document.getElementById('heroBg'), pt = false;
  function par() {
    pt = false;
    var sy = window.pageYOffset, h = hero ? hero.offsetHeight : 0;
    if (h) bg.style.transform = 'translate3d(0,' + clamp(sy * .2, 0, h * .22).toFixed(1) + 'px,0)';
    var ph = document.querySelector('.view:not([hidden]) .phero');
    if (ph && ph.offsetHeight) ph.style.setProperty('--py', clamp(sy * .2, 0, ph.offsetHeight * .22).toFixed(1) + 'px');
  }
  if (!reduce) {
    window.addEventListener('scroll', function () { if (!pt) { pt = true; requestAnimationFrame(par); } }, { passive: true });
    window.addEventListener('resize', par); window.addEventListener('hashchange', function () { setTimeout(par, 60); });
    par();
  }
})();

(function () {
  if (window.matchMedia('(max-width:639px)').matches)
    [].forEach.call(document.querySelectorAll('.card details'), function (d) { d.removeAttribute('open'); });
})();

(function () {
  'use strict';
  var de = document.documentElement, loader = document.getElementById('loader');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!loader) { de.classList.remove('loading'); de.classList.add('ready'); return; }
  var seen = de.classList.contains('seen');
  var route = document.getElementById('ldRoute'), msg = document.getElementById('ldMsg');
  var nodes = [].slice.call(loader.querySelectorAll('.ld-node')), pts = [0, .5, 1];
  var MIN = reduce ? 0 : (seen ? 350 : 1700), MAX = 6500, t0 = performance.now(), shown = 0, over = false, leaving = false;
  var tasks = { fonts: false, page: false, hero: false };
  var count = function () { return (tasks.fonts ? 1 : 0) + (tasks.page ? 1 : 0) + (tasks.hero ? 1 : 0); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { tasks.fonts = true; }); else tasks.fonts = true;
  if (document.readyState === 'complete') tasks.page = true; else window.addEventListener('load', function () { tasks.page = true; });
  var hi = new Image(); hi.onload = hi.onerror = function () { tasks.hero = true; }; hi.src = 'images/hero_bg.jpeg';
  try { sessionStorage.setItem('cm-seen', '1'); } catch (e) {}

  /* the cover lifts away and the page's headline and menu rise in */
  function lift() {
    if (over) return; over = true;
    loader.style.animation = 'none';
    loader.classList.add('done');
    de.classList.remove('loading'); de.classList.add('ready');
  }
  function frame(now) {
    if (over) return;
    var el = now - t0, ready = count() === 3;
    if (seen) {                       /* between pages: a short cover, gone as soon as the page is ready */
      if ((ready && el >= MIN) || el > MAX) { lift(); return; }
      requestAnimationFrame(frame); return;
    }
    var cap = MIN ? Math.min(1, el / MIN) : 1;     /* first visit: the boat sails from Mahe to La Digue */
    var target = el > MAX ? 1 : ready ? cap : Math.min(cap, .12 + .78 * count() / 3);
    shown += (target - shown) * .14;
    if (target === 1 && shown > .996) shown = 1;
    route.style.setProperty('--p', shown.toFixed(4));
    nodes.forEach(function (n, i) { n.classList.toggle('on', shown >= pts[i] - .02); });
    msg.textContent = shown < .34 ? 'Setting sail…' : shown < .7 ? 'Passing Praslin…' : shown < .985 ? 'Approaching La Digue…' : 'Welcome aboard';
    if (shown >= 1) { setTimeout(lift, reduce ? 0 : 350); return; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* leaving: the same cover sweeps up from the bottom, then the next page opens already covered */
  if (!reduce) document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var raw = a.getAttribute('href');
    if (!raw || raw.charAt(0) === '#' || a.target === '_blank' || a.hasAttribute('download')) return;
    var url; try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (!/^(https?|file):$/.test(url.protocol) || url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault();
    if (leaving) return; leaving = true; over = true;
    var inner = loader.querySelector('.ld-inner');
    de.classList.add('seen');                          /* the cover shows its short form */
    loader.classList.remove('done'); loader.style.animation = 'none';
    if (inner) { inner.style.transition = 'none'; inner.style.opacity = '1'; inner.style.transform = 'none'; }
    loader.style.transition = 'none'; loader.style.visibility = 'visible';
    loader.style.transform = 'translateY(calc(100% + 92px))';
    void loader.offsetHeight;
    loader.style.transition = 'transform .6s cubic-bezier(.77,0,.18,1)';
    loader.style.transform = 'translateY(0)';
    setTimeout(function () { location.href = a.href; }, 640);
  }, true);
  /* back button restores the page from memory: put the cover away again */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    leaving = false; over = true;
    loader.style.transition = 'none'; loader.style.transform = ''; loader.style.visibility = ''; loader.classList.add('done');
    var inner = loader.querySelector('.ld-inner'); if (inner) { inner.style.transition = ''; inner.style.opacity = ''; inner.style.transform = ''; }
    de.classList.remove('loading'); de.classList.add('ready');
    void loader.offsetHeight; loader.style.transition = '';
  });
})();

(function () {
  'use strict';
  var lb = document.getElementById('lb'), img = lb.querySelector('img'), cap = lb.querySelector('.cap'), list = [], i = 0;
  function show(n) {
    i = (n + list.length) % list.length;
    img.src = list[i].getAttribute('data-src');
    img.alt = list[i].querySelector('img').alt;
    cap.textContent = (i + 1) + ' / ' + list.length;
  }
  function open(btn) {
    list = [].slice.call((btn.closest('.dc,.msn') || btn.closest('.view')).querySelectorAll('.gi,.dcc,.mi'));
    show(list.indexOf(btn));
    lb.hidden = false; document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-x').focus();
  }
  function close() { lb.hidden = true; img.removeAttribute('src'); document.body.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.gi,.dcc,.mi');
    if (b) { open(b); return; }
    if (lb.hidden) return;
    if (e.target.closest('.lb-x') || e.target === lb) close();
    else if (e.target.closest('.lb-p')) show(i - 1);
    else if (e.target.closest('.lb-n')) show(i + 1);
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  window.addEventListener('hashchange', close);
})();

/* ---- Gallery page: depth carousel ---- */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lb = function () { return document.getElementById('lb'); };
  var DESK = { w: 340, h: 420, r: 20, spread: 100, depth: 280, tilt: 16, persp: 2200, vis: 4, falloff: .2, blur: 8, dur: 650, height: 520 };
  var MOB = { w: 250, h: 330, r: 16, spread: 56, depth: 210, tilt: 14, persp: 1800, vis: 3, falloff: .2, blur: 6, dur: 650, height: 340 };

  function init(root) {
    var cards = [].slice.call(root.querySelectorAll('.dcc')), n = cards.length;
    if (!n) return;
    var stage = document.createElement('div'); stage.className = 'dc-stage';
    cards.forEach(function (c, i) {
      var t = document.createElement('span'); t.className = 'dc-tint'; c.appendChild(t); c._t = t;
      c.setAttribute('aria-roledescription', 'slide'); c.setAttribute('aria-label', (i + 1) + ' of ' + n);
      stage.appendChild(c);
    });
    root.appendChild(stage);
    var icon = function (name) { return '<svg class="i" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; };
    var prev = document.createElement('button'), next = document.createElement('button'), dots = document.createElement('div');
    prev.type = next.type = 'button'; prev.className = 'dc-arrow dc-prev'; next.className = 'dc-arrow dc-next';
    prev.setAttribute('aria-label', 'Previous photo'); next.setAttribute('aria-label', 'Next photo');
    prev.innerHTML = icon('chevron-left'); next.innerHTML = icon('chevron-right');
    dots.className = 'dc-dots';
    var dotEls = cards.map(function (c, i) {
      var d = document.createElement('button'); d.type = 'button'; d.className = 'dc-dot'; d.setAttribute('aria-label', 'Go to photo ' + (i + 1));
      d.addEventListener('click', function () { setFocus(i); }); dots.appendChild(d); return d;
    });
    if (n > 1) { root.appendChild(prev); root.appendChild(next); root.appendChild(dots); }

    var cfg = DESK, scale = 1, pos = 0, focus = 0, raf = 0, drag = null, hovered = false, focused = false, inView = true;

    function layout(p) {
      var vis = Math.min(cfg.vis, Math.max(1, n - 1)), base = -cfg.spread * vis / 2;
      cards.forEach(function (el, i) {
        var d = i - p;
        if (n > 1) { d = ((d % n) + n) % n; if (d > n / 2) d -= n; }
        var back = Math.max(0, d), shown = Math.abs(d) <= vis + .5;
        var opacity = shown ? (d < 0 ? Math.max(0, 1 + d) : 1) : 0;
        var bright = Math.max(.15, 1 - back * cfg.falloff), blurPx = Math.min(cfg.blur, back / Math.max(1, vis) * cfg.blur);
        el.style.transform = 'translate(-50%,-50%) scale(' + scale + ') translateX(' + (cfg.spread * d + base).toFixed(2) + 'px) translateZ(' + (-cfg.depth * d).toFixed(2) + 'px) rotateY(' + (cfg.tilt * clamp(d, 0, 1)).toFixed(3) + 'deg)';
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = 'brightness(' + bright.toFixed(3) + ') blur(' + blurPx.toFixed(2) + 'px)';
        el.style.zIndex = Math.round(2000 - d * 20);
        el.style.pointerEvents = shown && opacity > .05 ? 'auto' : 'none';
        el._t.style.opacity = clamp(back * cfg.falloff * 1.25, 0, .86).toFixed(3);
      });
    }
    function apply() {
      var w = root.clientWidth; if (!w) return;
      cfg = w < 640 ? MOB : DESK;
      var vis = Math.min(cfg.vis, Math.max(1, n - 1));
      scale = clamp(w / (cfg.w + cfg.spread * vis + 80), .4, 1);
      root.style.height = cfg.height + 'px'; root.style.perspective = cfg.persp + 'px';
      cards.forEach(function (c) { c.style.width = cfg.w + 'px'; c.style.height = cfg.h + 'px'; c.style.borderRadius = cfg.r + 'px'; });
      layout(pos);
    }
    function tweenTo(target) {
      cancelAnimationFrame(raf);
      var start = pos, t0 = performance.now(), dur = reduce ? 0 : cfg.dur;
      (function step(now) {
        var k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
        pos = start + (target - start) * e; layout(pos);
        if (k < 1) raf = requestAnimationFrame(step); else { pos = ((pos % n) + n) % n; layout(pos); }
      })(t0);
    }
    function mark() {
      dotEls.forEach(function (d, i) { d.classList.toggle('on', i === focus); });
      cards.forEach(function (c, i) { c.setAttribute('aria-hidden', i === focus ? 'false' : 'true'); });
    }
    function setFocus(raw) {
      var idx = ((raw % n) + n) % n, delta = idx - pos;
      if (n > 1) { delta = ((delta % n) + n) % n; if (delta > n / 2) delta -= n; }
      tweenTo(pos + delta); focus = idx; mark();
    }
    var step = function (k) { setFocus(focus + k); };

    cards.forEach(function (c, i) {
      c.addEventListener('click', function (e) { if (i !== focus) { e.stopPropagation(); setFocus(i); } });
    });
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'Enter' && e.target === root) { e.preventDefault(); cards[focus].click(); }
    });

    /* drag / swipe */
    root.addEventListener('pointerdown', function (e) {
      if (n < 2 || e.target.closest('button')) return;
      cancelAnimationFrame(raf);
      drag = { x: e.clientX, start: pos, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, id: e.pointerId };
    });
    root.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var stepPx = Math.max(cfg.w * .55 * scale, 40), dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; try { root.setPointerCapture(drag.id); } catch (err) {} }
      if (!drag.moved) return;
      var now = performance.now(), dt = Math.max(now - drag.lastT, 1);
      drag.v = (e.clientX - drag.lastX) / dt; drag.lastX = e.clientX; drag.lastT = now;
      pos = drag.start - dx / stepPx; layout(pos);
    });
    function end() {
      if (!drag) return;
      var d = drag; drag = null;
      if (!d.moved) return;
      var stepPx = Math.max(cfg.w * .55 * scale, 40);
      setFocus(Math.round(pos - clamp(d.v * 180 / stepPx, -1.5, 1.5)));
    }
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);

    /* gentle autoplay: pauses on hover/focus, off-screen, while dragging or with the viewer open */
    if (!reduce && n > 1) {
      root.addEventListener('mouseenter', function () { hovered = true; });
      root.addEventListener('mouseleave', function () { hovered = false; });
      root.addEventListener('focusin', function () { focused = true; });
      root.addEventListener('focusout', function () { focused = false; });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }).observe(root);
      setInterval(function () {
        if (!hovered && !focused && inView && !drag && root.clientWidth && lb().hidden) step(1);
      }, 3800);
    }

    if ('ResizeObserver' in window) new ResizeObserver(apply).observe(root); else window.addEventListener('resize', apply);
    mark(); apply();
  }
  [].slice.call(document.querySelectorAll('.dc')).forEach(init);
})();

/* ---- Fish Trap page: masonry photos ---- */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* masonry */
  function init(root) {
    var GAP = 12, RADIUS = 12, DUR = .8, BOUNCE = .35, STAG = .03, FROM = 'center';
    var items = [].slice.call(root.querySelectorAll('.msn-item')).map(function (el) {
      return { el: el, img: el.querySelector('img'), aspect: 1.2, x: 0, y: 0, s: 1, vx: 0, vy: 0, vs: 0, tx: 0, ty: 0, w: 0, h: 0, shown: false, dragging: false, blur: false, reveal: 0, start: 0 };
    });
    if (!items.length) return;
    root.style.setProperty('--msn-r', RADIUS + 'px');
    items.forEach(function (it) { it.el.style.opacity = '0'; });
    var order = items.slice(), width = 0, ready = false, measuring = false, raf = 0, last = 0, flush = 0, drag = null, suppress = false;
    var pend = [];

    function grid() {
      var colW = width < 640 ? 150 : 240, count = Math.max(1, Math.floor((width + GAP) / (colW + GAP)));
      return { count: count, size: Math.max(1, (width - GAP * (count - 1)) / count) };
    }
    function put(hs, it, g, commit) {
      var c = 0, top = Infinity;
      for (var k = 0; k < g.count; k++) if (hs[k] < top - .5) { top = hs[k]; c = k; }
      var h = Math.max(1, g.size * it.aspect);
      if (commit) hs[c] = top + h + GAP;
      return { x: Math.round(c * (g.size + GAP)), y: Math.round(top), w: g.size, h: h };
    }
    function slotsFor(others, dragged) {
      var g = grid(), hs = new Array(g.count).fill(0), slots = [];
      for (var i = 0; i <= others.length; i++) {
        var p = put(hs, dragged, g, false); slots.push({ x: p.x + p.w / 2, y: p.y + p.h / 2 });
        if (i < others.length) put(hs, others[i], g, true);
      }
      return slots;
    }
    function paint(it) {
      it.el.style.transform = 'translate3d(' + it.x + 'px,' + it.y + 'px,0) scale(' + it.s + ')';
      if (it.reveal < 1) {
        var e = 1 - Math.pow(1 - Math.max(0, it.reveal), 3);
        it.el.style.opacity = e; it.el.style.filter = it.blur ? 'blur(' + ((1 - e) * 12).toFixed(2) + 'px)' : '';
      } else if (it.el.style.opacity !== '') { it.el.style.opacity = ''; it.el.style.filter = ''; }
    }
    function layout() {
      if (!ready || !width) return;
      var g = grid(), hs = new Array(g.count).fill(0);
      order.forEach(function (it) {
        var p = put(hs, it, g, true);
        it.tx = p.x; it.ty = p.y; it.w = p.w; it.h = p.h;
        it.el.style.width = p.w + 'px'; it.el.style.height = p.h + 'px';
        if (!it.shown) { it.x = p.x; it.y = p.y; it.el.style.transform = 'translate3d(' + p.x + 'px,' + p.y + 'px,0)'; }
        else if (reduce && !it.dragging) { it.x = p.x; it.y = p.y; paint(it); }
      });
      root.style.height = Math.max(0, Math.max.apply(null, hs) - GAP) + 'px';
      kick();
    }
    function frame(now) {
      raf = 0;
      var el = clamp((now - last) / 1000, 0, 1 / 20); last = now;
      var omega = Math.PI * 2 / DUR, zeta = clamp(1 - BOUNCE, .1, 1), steps = Math.max(1, Math.ceil(el / (1 / 240))), dt = el / steps, active = false;
      items.forEach(function (it) {
        if (!it.shown) return;
        if (it.dragging) { paint(it); return; }
        if (now < it.start) { active = true; return; }
        for (var i = 0; i < steps; i++) {
          it.vx += (-omega * omega * (it.x - it.tx) - 2 * zeta * omega * it.vx) * dt;
          it.vy += (-omega * omega * (it.y - it.ty) - 2 * zeta * omega * it.vy) * dt;
          it.vs += (-omega * omega * (it.s - 1) - 2 * zeta * omega * it.vs) * dt;
          it.x += it.vx * dt; it.y += it.vy * dt; it.s += it.vs * dt;
        }
        var rest = Math.abs(it.x - it.tx) < .05 && Math.abs(it.y - it.ty) < .05 && Math.abs(it.s - 1) < .0005 && Math.abs(it.vx) + Math.abs(it.vy) < .05 && Math.abs(it.vs) < .001;
        if (rest) { it.x = it.tx; it.y = it.ty; it.s = 1; it.vx = it.vy = it.vs = 0; } else active = true;
        if (it.reveal < 1) { it.reveal = clamp((now - it.start) / (DUR * 1000), 0, 1); if (it.reveal < 1) active = true; }
        paint(it);
      });
      if (active) raf = requestAnimationFrame(frame);
    }
    function kick() { if (raf) return; last = performance.now(); raf = requestAnimationFrame(frame); }
    function visCenter() {
      var r = root.getBoundingClientRect(), top = Math.max(0, -r.top), bottom = Math.min(r.height, window.innerHeight - r.top);
      return bottom > top ? (top + bottom) / 2 : r.height / 2;
    }
    function flushReveals() {
      flush = 0;
      var batch = pend.filter(function (it) { return !it.shown; }); pend = [];
      if (!batch.length) return;
      batch.sort(function (a, b) { return a.ty - b.ty || a.tx - b.tx; });
      var now = performance.now(), rootW = root.clientWidth, cy = visCenter(), dirs = ['bottom', 'top', 'left', 'right'];
      batch.forEach(function (it, rank) {
        it.shown = true; it.blur = !reduce;
        if (reduce) { it.x = it.tx; it.y = it.ty; it.s = 1; it.reveal = 1; it.start = now; paint(it); return; }
        var dir = FROM === 'random' ? dirs[Math.floor(Math.random() * 4)] : FROM, dist = 60 + Math.min(it.h, 280) * .35;
        it.x = it.tx; it.y = it.ty; it.s = .96;
        if (dir === 'center') { it.x = rootW / 2 - it.w / 2; it.y = cy - it.h / 2; it.s = .55; }
        else if (dir === 'bottom') it.y += dist; else if (dir === 'top') it.y -= dist;
        else if (dir === 'left') it.x -= dist; else if (dir === 'right') it.x += dist;
        it.vx = it.vy = it.vs = 0; it.reveal = 0; it.start = now + rank * STAG * 1000; paint(it);
      });
      kick();
    }
    function request(it) { if (it.shown || pend.indexOf(it) >= 0) return; pend.push(it); if (!flush) flush = requestAnimationFrame(flushReveals); }
    function observe() {
      if (!('IntersectionObserver' in window)) { items.forEach(request); return; }
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!e.isIntersecting) return;
          items.forEach(function (it) { if (it.el === e.target) request(it); });
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -6% 0px' });
      items.forEach(function (it) { io.observe(it.el); });
    }
    /* measure real photo proportions once the page is on screen, then lay out */
    function measure() {
      if (measuring) return; measuring = true;
      var left = items.length, done = false;
      function fin() { if (done) return; done = true; ready = true; layout(); observe(); }
      items.forEach(function (it) {
        var im = new Image();
        var settle = function (ok) {
          if (ok && im.naturalWidth) it.aspect = im.naturalHeight / im.naturalWidth;
          left--; if (done) layout(); else if (left === 0) fin();
        };
        im.onload = function () { settle(true); }; im.onerror = function () { settle(false); };
        im.src = it.img.getAttribute('src');
      });
      setTimeout(fin, 2500);
    }
    if ('ResizeObserver' in window) {
      new ResizeObserver(function (en) {
        width = Math.round(en[0].contentRect.width);
        if (!width) return;
        if (!ready) measure(); else layout();
      }).observe(root);
    }

    /* drag to reorder (mouse): the grid reflows around the tile */
    function move(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var it = drag.it;
      if (!drag.active) {
        if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6 || !it.shown) return;
        drag.active = true; it.dragging = true; it.vx = it.vy = it.vs = 0;
        it.el.setAttribute('data-dragging', ''); root.setAttribute('data-dragging', '');
      }
      var r = root.getBoundingClientRect();
      it.x = e.clientX - r.left - drag.ox; it.y = e.clientY - r.top - drag.oy; it.s = 1; paint(it); kick();
      var others = order.filter(function (o) { return o !== it; }), slots = slotsFor(others, it),
          cx = it.x + it.w / 2, cy = it.y + it.h / 2, cur = order.indexOf(it), best = cur,
          nearest = Math.hypot(slots[cur].x - cx, slots[cur].y - cy), thr = nearest * .8 - 6;
      slots.forEach(function (sl, i) {
        var d = Math.hypot(sl.x - cx, sl.y - cy);
        if (d < nearest && d < thr) { nearest = d; best = i; }
      });
      if (best === cur) return;
      others.splice(best, 0, it); order = others; drag.moved = true; layout();
    }
    function up() {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      var d = drag; drag = null;
      if (!d || !d.active) return;
      d.it.dragging = false; d.it.el.removeAttribute('data-dragging'); root.removeAttribute('data-dragging');
      suppress = true; setTimeout(function () { suppress = false; }, 0);
      kick();
      if (d.moved) order.forEach(function (it) { root.appendChild(it.el); });   /* viewer pages in the new order */
    }
    items.forEach(function (it) {
      it.el.querySelector('.mi').addEventListener('pointerdown', function (e) {
        if (e.button !== 0 || e.pointerType === 'touch') return;
        var r = root.getBoundingClientRect();
        drag = { it: it, pid: e.pointerId, sx: e.clientX, sy: e.clientY, ox: e.clientX - r.left - it.x, oy: e.clientY - r.top - it.y, active: false, moved: false };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
    });
    root.addEventListener('click', function (e) { if (suppress) { e.stopPropagation(); e.preventDefault(); } }, true);
  }
  [].slice.call(document.querySelectorAll('.msn')).forEach(init);
})();

/* ---- Islands page: video background ---- */
(function () {
  'use strict';
  var view = document.getElementById('view-islands'); if (!view) return;
  /* Set to true after adding photos named mahe, praslin and la-digue (.webp/.jpg/.jpeg/.png) to /images. They then replace each island's video clip. */
  var USE_PHOTOS = false;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData);

  /* Files in /videos. The second name in each pair is a fallback in case the file name uses different capitals. */
  var CANDS = [['videos/Island1.mp4', 'videos/island1.mp4'], ['videos/island2.mp4', 'videos/Island2.mp4'], ['videos/island3.mp4', 'videos/Island3.mp4']];
  var FADE = 1400;

  /* island photos (optional): put them in /images as mahe, praslin, la-digue (.webp/.jpg/.jpeg/.png). With none, the island's video shows instead. */
  [].forEach.call(view.querySelectorAll('.isl-img'), function (box) {
    var img = box.querySelector('img'), name = box.getAttribute('data-name'), exts = ['webp', 'jpg', 'jpeg', 'png'], i = 0;
    function next() { if (i >= exts.length) { img.style.display = 'none'; return; } img.src = 'images/' + name + '.' + exts[i++]; }
    img.addEventListener('error', next);
    img.addEventListener('load', function () { box.classList.add('has-img'); var fv = box.querySelector('.isl-fv'); if (fv) fv.pause(); });
    if (USE_PHOTOS) next();
  });

  /* background: the three videos play one at a time; the next one fades in over the last second of the current one */
  var A = document.getElementById('islVideo'), B = document.getElementById('islVideo2');
  var idx = 0, cur = A, idle = B, started = false, switching = false;
  [A, B].forEach(function (v) { v.muted = true; });
  function setSrc(el, i) {
    var c = CANDS[i], k = 0;
    el.onerror = function () { if (++k < c.length) { el.src = c[k]; el.load(); } };
    el.src = c[0]; el.load();
  }
  function fadeIn(el) {
    el.style.transition = 'none'; el.style.opacity = '0'; el.style.zIndex = '2';
    void el.offsetWidth;
    el.style.transition = 'opacity ' + FADE + 'ms ease'; el.style.opacity = '1';
  }
  function swap() {
    if (switching || still) return;
    if (idle.readyState < 3) { idle.addEventListener('canplay', swap, { once: true }); return; }
    switching = true;
    var out = cur, inn = idle;
    inn.currentTime = 0;
    var p = inn.play(); if (p && p.catch) p.catch(function () {});
    out.style.zIndex = '1';          /* the old video stays fully visible underneath while the new one fades in on top: no dark dip */
    fadeIn(inn);
    setTimeout(function () {
      out.style.transition = 'none'; out.style.opacity = '0'; out.pause();
      cur = inn; idle = out; idx = (idx + 1) % CANDS.length;
      setSrc(idle, (idx + 1) % CANDS.length);
      switching = false;
    }, FADE + 80);
  }
  function watch(e) {
    var v = e.target;
    if (v !== cur || switching) return;
    if (v.duration && v.duration - v.currentTime <= FADE / 1000 + .25) swap();
  }
  [A, B].forEach(function (v) {
    v.addEventListener('timeupdate', watch);
    v.addEventListener('ended', function (e) { if (e.target === cur) swap(); });
  });
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  /* each island frame shows its own clip (Mahé = video 1, Praslin = 2, La Digue = 3), playing only while on screen */
  var framesReady = false;
  function frames() {
    if (framesReady || still) return; framesReady = true;
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        var fv = e.target.querySelector('.isl-fv');
        if (!fv || e.target.classList.contains('has-img')) return;
        if (e.isIntersecting) play(fv); else fv.pause();
      });
    }, { threshold: .35 }) : null;
    [].forEach.call(view.querySelectorAll('.isl-img'), function (box, i) {
      var fv = box.querySelector('.isl-fv'); if (!fv) return;
      var c = CANDS[i % CANDS.length], k = 0;
      fv.muted = true;
      fv.onerror = function () { if (++k < c.length) fv.src = c[k]; };
      fv.src = c[0];
      if (io) io.observe(box);
    });
  }

  function sync() {
    if (view.hidden) { A.pause(); B.pause(); return; }
    if (still) return;
    if (!started) {
      started = true;
      setSrc(A, 0); A.style.opacity = '1'; A.style.zIndex = '2'; play(A);
      setSrc(B, 1);
    } else { play(cur); }
    frames();
  }
  window.addEventListener('hashchange', function () { setTimeout(sync, 0); });
  sync();
})();
