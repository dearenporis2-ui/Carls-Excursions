(function(){
'use strict';

/* ===== Settings you may want to change ===== */
var BOAT_URL = 'https://dearenporis2-ui.github.io/Carls-Excursions/'; // boat excursions site (temporary GitHub link, change when the final address is ready)
var PHONE = '+248 263 6100', PHONE_HREF = 'tel:+2482636100';
var EMAIL = 'fishtraprestaurant@seychelles.net';
var TA_URL = 'https://www.tripadvisor.com/Restaurant_Review-g477968-d8285879-Reviews-Fish_Trap_Restaurant_Bar-La_Digue_Island.html';
var FB_URL = 'https://www.facebook.com/share/1dqpSRfH5N/?mibextid=wwXIfr';
var IG_URL = 'https://www.instagram.com/explore/locations/1031876572/fishtrap-la-digue/'; // currently Instagram's location page; swap for the restaurant's own profile link if they have one
var WA_URL = 'https://wa.me/2482512111?text=' + encodeURIComponent("Hello Fish Trap! I'd like to reserve a table."); // reservations via WhatsApp
var MAP_URL = 'https://www.google.com/maps?q=-4.349401,55.828519';
var PAGES = [['index.html','Home'],['story.html','Our story'],['food.html','Dining'],['menu.html','Menu'],['gallery.html','Gallery'],['visit.html','Visit']];
// Gallery photos. preview:1 = shown in the home page accordion (use 3 or 4).
var PHOTOS = [
  {src:'plate-with-food.webp', alt:'Seafood plate served at Fish Trap Restaurant, La Digue', cap:'From the kitchen', preview:1},
  {src:'inside-view.webp', alt:'Inside Fish Trap Restaurant & Bar with bamboo fish trap decor, La Passe, La Digue', cap:'Inside Fish Trap', preview:1},
  {src:'the-overview-of-our-deck.webp', alt:'Sea-view deck at Fish Trap Restaurant & Bar, La Passe, La Digue', cap:'The deck', preview:1},
  {src:'ocean-view.webp', alt:'Sea view from Fish Trap Restaurant & Bar, La Passe, La Digue, Seychelles', cap:'The view from the deck', preview:1},
  {src:'plate-with-food-2.webp', alt:'Dish served at Fish Trap Restaurant, La Passe, La Digue', cap:'From the kitchen'},
  {src:'inside-view-2.webp', alt:'Dining room at Fish Trap Restaurant & Bar, La Passe, La Digue', cap:'Inside Fish Trap'},
  {src:'plate-with-food-3.webp', alt:'Plate of food at Fish Trap Restaurant & Bar, La Digue', cap:'From the kitchen'},
  {src:'fish-trap-restaurant.webp', alt:'Fish Trap Restaurant & Bar in La Passe, La Digue', cap:'Fish Trap in La Passe'},
  {src:'bikes.webp', alt:'Bicycles in La Passe, La Digue, Seychelles', cap:'La Digue bikes'}
];

var html = document.documentElement, body = document.body;
var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
if(here.indexOf('.') < 0) here += '.html';
function amp(t){ return t.replace(/&/g,'&amp;'); }

/* ===== Shared shell: navbar, mobile menu, footer, photo viewer ===== */
var FISH = '<svg width="28" height="18" viewBox="0 0 32 20" aria-hidden="true"><path d="M2 10c5-8 14-8 19 0-5 8-14 8-19 0zm19 0l9-7v14z" fill="currentColor"/><circle cx="8" cy="9" r="1.3" fill="#021f17"/></svg>';
var linkHtml = PAGES.map(function(p){ return '<a href="'+p[0]+'"'+(p[0]===here?' class="on" aria-current="page"':'')+'>'+amp(p[1])+'</a>'; }).join('');
var mHtml = PAGES.map(function(p,i){ return '<a href="'+p[0]+'" style="--i:'+i+'">'+amp(p[1])+'</a>'; }).join('');
var shellTop =
 '<nav class="nav" id="nav" aria-label="Main"><div class="nav-bar">'+
 '<a class="brand" href="index.html" aria-label="Fish Trap Restaurant & Bar, home"><img class="brand-logo" src="images/logo.webp" alt="Fish Trap Restaurant & Bar"></a>'+
 '<div class="links" id="links">'+linkHtml+'<i class="bubble"></i></div>'+
 '<a class="nav-call" data-wa href="#">Reserve</a>'+
 '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>'+
 '<i class="progress"></i></div></nav>'+
 '<div class="mnav" id="mnav">'+mHtml+
 '<a class="mcall" data-wa href="#" style="--i:6">Reserve on WhatsApp</a>'+
 '<a class="mcall" data-boat href="#" style="--i:7">Boat trips &#8599;</a>'+
 '<a class="mcall" href="'+PHONE_HREF+'" style="--i:8">Call '+PHONE+'</a></div>';
var shellBottom =
 '<footer class="foot"><div class="wrap"><div class="fgrid">'+
 '<div><img class="flogo" src="images/logo.webp" alt="Fish Trap Restaurant & Bar"><p>Seafood, Creole cooking and island cocktails in the centre of La Passe, La Digue, Seychelles.</p></div>'+
 '<div><h4>Explore</h4><ul>'+PAGES.map(function(p){return '<li><a href="'+p[0]+'">'+amp(p[1])+'</a></li>';}).join('')+'<li><a data-boat href="#">Boat trips &#8599;</a></li></ul></div>'+
 '<div><h4>Visit</h4><ul><li>Open every day, 7:30 AM to 11:00 PM</li><li><a href="'+PHONE_HREF+'">'+PHONE+'</a></li><li><a data-wa href="#">Reserve on WhatsApp</a></li><li><a href="'+FB_URL+'" target="_blank" rel="noopener">Facebook</a> &middot; <a href="'+IG_URL+'" target="_blank" rel="noopener">Instagram</a> &middot; <a href="'+TA_URL+'" target="_blank" rel="noopener">Tripadvisor</a></li><li><a href="mailto:'+EMAIL+'">'+EMAIL+'</a></li><li>La Passe, La Digue, Seychelles</li><li><a href="'+MAP_URL+'" target="_blank" rel="noopener">Open in Google Maps</a></li></ul></div>'+
 '</div><div class="copy">&copy; '+new Date().getFullYear()+' Fish Trap Restaurant &amp; Bar. All rights reserved.</div></div></footer>'+
 '<dialog id="lb" aria-label="Photo viewer"><div class="lb"><button class="x" type="button" aria-label="Close">&times;</button>'+
 '<button class="pv" type="button" aria-label="Previous photo">&#8249;</button><button class="nx" type="button" aria-label="Next photo">&#8250;</button>'+
 '<div class="stage"><img id="lbImg" alt=""></div><div class="meta"><span id="lbCap"></span><span id="lbNum"></span></div></div></dialog>';
body.insertAdjacentHTML('afterbegin', shellTop);
body.insertAdjacentHTML('beforeend', shellBottom);
document.querySelectorAll('[data-boat]').forEach(function(a){ a.href = BOAT_URL; a.target = '_blank'; a.rel = 'noopener'; });
document.querySelectorAll('[data-wa]').forEach(function(a){ a.href = WA_URL; a.target = '_blank'; a.rel = 'noopener'; });

/* ===== Navbar: sliding highlight, scroll morph, progress line, mobile menu ===== */
(function(){
  var nav = document.getElementById('nav'), links = document.getElementById('links'), bub = links.querySelector('.bubble'),
      as = [].slice.call(links.querySelectorAll('a')), bar = nav.querySelector('.progress'),
      burger = nav.querySelector('.burger'), mnav = document.getElementById('mnav'),
      active = links.querySelector('a.on');
  function move(a){
    if(!a){ bub.style.opacity = 0; return; }
    bub.style.opacity = 1; bub.style.width = a.offsetWidth + 'px'; bub.style.transform = 'translateX(' + a.offsetLeft + 'px)';
  }
  as.forEach(function(a){ a.addEventListener('mouseenter', function(){ move(a); }); a.addEventListener('focus', function(){ move(a); }); });
  links.addEventListener('mouseleave', function(){ move(active); });
  function onScroll(){
    var y = window.scrollY, h = html.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 60);
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
  }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', function(){ move(active); });
  if(document.fonts) document.fonts.ready.then(function(){ move(active); });
  onScroll(); move(active);
  function menu(open){
    html.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function(){ menu(!html.classList.contains('menu-open')); });
  mnav.addEventListener('click', function(e){ if(e.target.closest('a')) menu(false); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') menu(false); });
})();

/* ===== Menu tabs ===== */
(function(){
  var tabs = [].slice.call(document.querySelectorAll('.mtabs [data-t]')); if(!tabs.length) return;
  function open(id, push){
    tabs.forEach(function(b){
      var on = b.dataset.t === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
      document.getElementById('p-' + b.dataset.t).hidden = !on;
    });
    var cards = document.querySelectorAll('#p-' + id + ' .mg');
    if(window.gsap && !REDUCE) gsap.fromTo(cards, {opacity:0, y:24}, {opacity:1, y:0, duration:.6, stagger:.05, ease:'power3.out', overwrite:true});
    if(push && history.replaceState) history.replaceState(null, '', '#' + id);
    if(window.ScrollTrigger) ScrollTrigger.refresh();
  }
  tabs.forEach(function(b, i){
    b.addEventListener('click', function(){ open(b.dataset.t, true); });
    b.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if(d){ e.preventDefault(); var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); open(n.dataset.t, true); }
    });
  });
  var h = (location.hash || '').slice(1);
  open(tabs.some(function(b){ return b.dataset.t === h; }) ? h : tabs[0].dataset.t, false);
})();

/* ===== Hero: open/closed status (Seychelles time, 7:30 AM to 11 PM) ===== */
(function(){
  var el = document.getElementById('status'); if(!el) return;
  var n = new Date(new Date().toLocaleString('en-US',{timeZone:'Indian/Mahe'}));
  var m = n.getHours() * 60 + n.getMinutes(), open = m >= 450 && m < 1380;
  el.classList.add(open ? 'open' : 'closed');
  document.getElementById('statusText').textContent = open ? 'Open now until 11:00 PM' : 'Closed now. Open daily from 7:30 AM';
})();

/* ===== Single-photo viewer ===== */
var lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), cur = 0;
function show(k){
  cur = (k + PHOTOS.length) % PHOTOS.length;
  var p = PHOTOS[cur];
  lbImg.src = 'images/' + p.src; lbImg.alt = p.alt || p.cap;
  document.getElementById('lbCap').textContent = p.cap;
  document.getElementById('lbNum').textContent = (cur + 1) + ' / ' + PHOTOS.length;
}
function openLb(i){ show(i); lb.showModal(); }
lb.querySelector('.x').onclick = function(){ lb.close(); };
lb.querySelector('.pv').onclick = function(){ show(cur - 1); };
lb.querySelector('.nx').onclick = function(){ show(cur + 1); };
lb.addEventListener('click', function(e){ if(e.target === lb || e.target.classList.contains('lb') || e.target.classList.contains('stage')) lb.close(); });
document.addEventListener('keydown', function(e){
  if(!lb.open) return;
  if(e.key === 'ArrowLeft') show(cur - 1);
  if(e.key === 'ArrowRight') show(cur + 1);
});

/* ===== Accordion preview (home page) ===== */
(function(){
  var root = document.getElementById('ag'); if(!root) return;
  var prev = [];
  PHOTOS.forEach(function(p,i){ if(p.preview) prev.push(i); });
  var count = prev.length, cfg = {gap:10, expand:.52, tilt:8, parallax:.5, dur:.6, ease:'power3.out', stagger:.06};
  var mq = matchMedia('(max-width:700px)'), vertical = mq.matches, active = Math.min(2, count-1), first = true, mediaSize = 320, tl;
  root.style.setProperty('--ag-gap', cfg.gap + 'px');
  var panels = prev.map(function(pi, i){
    var p = PHOTOS[pi], b = document.createElement('button');
    b.type = 'button'; b.className = 'ag-panel'; b.style.cssText = '--ag-gray:0;--ag-dim:0';
    b.setAttribute('role','listitem'); b.setAttribute('aria-label', p.cap + ' (open photo)');
    b.innerHTML = '<span class="ag-frame"><span class="ag-media"><img draggable="false" alt=""></span><span class="ag-dim"></span></span><span class="ag-label"><span class="ag-bar"></span><span class="ag-text"></span></span>';
    var img = b.querySelector('img'); img.src = 'images/' + p.src; img.alt = p.alt || p.cap; img.onerror = function(){ img.remove(); };
    b.querySelector('.ag-text').textContent = p.cap;
    b.addEventListener('pointerenter', function(e){ if(e.pointerType === 'mouse') set(i); });
    b.addEventListener('focus', function(){ set(i); });
    b.addEventListener('click', function(){ if(i !== active) set(i); else openLb(pi); });
    b.addEventListener('keydown', function(e){
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if(d){ e.preventDefault(); panels[(i + d + count) % count].focus(); }
    });
    root.appendChild(b); return b;
  });
  function set(i){ if(i === active) return; active = i; layout(true); }
  function layout(animate){
    if(!window.gsap) return;
    var r = Math.min(Math.max(cfg.expand, .2), .9), grow = count > 1 ? (r * (count-1)) / (1-r) : 1;
    var dur = animate && !REDUCE ? cfg.dur : 0;
    if(tl) tl.kill();
    tl = gsap.timeline();
    panels.forEach(function(p, i){
      var on = i === active, rot = on ? 0 : (i < active ? cfg.tilt : -cfg.tilt);
      var media = p.querySelector('.ag-media'), bar = p.querySelector('.ag-bar'), text = p.querySelector('.ag-text');
      var drift = Math.max(-1.5, Math.min(1.5, active - i)), shift = drift * cfg.parallax * mediaSize * .06;
      tl.to(p, Object.assign({flexGrow: on ? grow : 1, '--ag-gray': on ? 0 : 1, '--ag-dim': on ? 0 : .35, duration: dur, ease: cfg.ease},
        vertical ? {rotateX: -rot} : {rotateY: rot}), 0);
      tl.to(media, {xPercent:-50, yPercent:-50, x: vertical ? 0 : (on ? 0 : shift), y: vertical ? (on ? 0 : shift) : 0, duration: dur, ease: cfg.ease}, 0);
      if(on) tl.to([bar, text], {opacity:1, x:0, duration: dur, ease: cfg.ease, stagger: REDUCE ? 0 : cfg.stagger}, 0);
      else tl.to([bar, text], {opacity:0, x:-14, duration: dur * .6, ease: cfg.ease}, 0);
    });
  }
  function measure(){
    var rect = root.getBoundingClientRect(), total = vertical ? rect.height : rect.width;
    var usable = Math.max(total - cfg.gap * (count-1), 120);
    mediaSize = Math.max(140, usable * Math.min(Math.max(cfg.expand, .2), .9) * 1.22);
    root.style.setProperty('--ag-media-size', mediaSize + 'px');
    layout(!first);
  }
  function orient(){
    vertical = mq.matches; root.classList.toggle('ag-vertical', vertical);
    if(window.gsap) gsap.set(panels.concat([].slice.call(root.querySelectorAll('.ag-media'))), {clearProps:'transform,flexGrow'});
    first = true; measure(); first = false;
  }
  mq.addEventListener('change', orient);
  new ResizeObserver(measure).observe(root);
  root.classList.toggle('ag-vertical', vertical);
  measure(); first = false;
})();

/* ===== Masonry (gallery page) ===== */
var masonry = (function(){
  var list = document.getElementById('mlist'); if(!list) return null;
  var items = [], built = false;
  function ratios(){
    return Promise.all(PHOTOS.map(function(p, i){
      return new Promise(function(res){
        var im = new Image();
        im.onload = function(){ res({i:i, ratio: Math.min(1.5, Math.max(.65, im.naturalHeight / im.naturalWidth))}); };
        im.onerror = function(){ res(null); };
        im.src = 'images/' + p.src;
      });
    }));
  }
  function build(rs){
    rs.forEach(function(o){
      if(!o) return;
      var p = PHOTOS[o.i], w = document.createElement('div');
      w.className = 'm-item'; w.tabIndex = 0; w.setAttribute('role','button'); w.setAttribute('aria-label','View photo: ' + p.cap);
      w.innerHTML = '<div class="m-img"><img alt="" loading="lazy" draggable="false"></div>';
      var mi = w.querySelector('img'); mi.src = 'images/' + p.src; mi.alt = p.alt || p.cap;
      w.addEventListener('click', function(){ openLb(o.i); });
      w.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openLb(o.i); } });
      w.addEventListener('mouseenter', function(){ if(window.gsap) gsap.to(w, {scale:.95, duration:.3, ease:'power2.out'}); });
      w.addEventListener('mouseleave', function(){ if(window.gsap) gsap.to(w, {scale:1, duration:.3, ease:'power2.out'}); });
      list.appendChild(w); items.push({el:w, ratio:o.ratio});
    });
    built = true;
  }
  function layout(intro){
    var W = list.clientWidth; if(!W || !items.length) return;
    var c = innerWidth >= 1000 ? 4 : innerWidth >= 600 ? 3 : 2, cw = W / c, hs = [];
    for(var k = 0; k < c; k++) hs.push(0);
    items.forEach(function(it){
      var col = hs.indexOf(Math.min.apply(null, hs));
      it.x = cw * col; it.y = hs[col]; it.w = cw; it.h = cw * it.ratio; hs[col] += it.h;
    });
    list.style.height = Math.max.apply(null, hs) + 'px';
    items.forEach(function(it, idx){
      var to = {x:it.x, y:it.y, width:it.w, height:it.h};
      if(!window.gsap){ it.el.style.cssText += ';opacity:1;transform:translate('+it.x+'px,'+it.y+'px);width:'+it.w+'px;height:'+it.h+'px'; return; }
      if(intro && !REDUCE){
        gsap.fromTo(it.el, {opacity:0, x:it.x, y:it.y + 160, width:it.w, height:it.h, filter:'blur(10px)'},
          Object.assign({opacity:1, filter:'blur(0px)', duration:.8, ease:'power3.out', delay: idx * .05}, to));
      } else {
        gsap.to(it.el, Object.assign({opacity:1, duration: intro ? 0 : .6, ease:'power3.out', overwrite:'auto'}, to));
      }
    });
  }
  var ready = ratios().then(build);
  addEventListener('resize', function(){ if(built) layout(false); });
  return {ready: ready, intro: function(){ ready.then(function(){ layout(true); }); }};
})();

/* ===== Scroll motion: parallax + reveals (starts once the loader lifts) ===== */
function startMotion(){
  if(masonry) masonry.intro();
  if(REDUCE || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.nav-bar', {opacity:0, y:-24, duration:.9, ease:'power3.out', delay:.25});
  gsap.from('.hero .status, .hero h1, .hero .tag, .hero .btns, .phead h1, .phead .sub', {opacity:0, y:40, duration:1, ease:'power3.out', stagger:.12, delay:.3});
  var himg = document.querySelector('.hero .bg img');
  if(himg){
    gsap.set(himg, {scale:1.2});
    gsap.to(himg, {yPercent:9, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
    gsap.to('.hero .wrap', {y:-60, opacity:.25, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom 25%', scrub:true}});
  }
  document.querySelectorAll('.leafbg').forEach(function(el){
    gsap.fromTo(el, {backgroundPositionY:'0%'}, {backgroundPositionY:'100%', ease:'none',
      scrollTrigger:{trigger:el, start:'top bottom', end:'bottom top', scrub:true}});
  });
  var els = gsap.utils.toArray('.rv');
  if(els.length){
    gsap.set(els, {opacity:0, y:44});
    ScrollTrigger.batch(els, {start:'top 90%', once:true,
      onEnter:function(b){ gsap.to(b, {opacity:1, y:0, duration:.95, ease:'power3.out', stagger:.12, overwrite:true}); }});
  }
  setTimeout(function(){ ScrollTrigger.refresh(); }, 600);
  if(masonry) masonry.ready.then(function(){ setTimeout(function(){ ScrollTrigger.refresh(); }, 1100); });
}

/* ===== Loading screen + page transitions ===== */
(function(){
  var loader = document.getElementById('loader');
  var seen = html.classList.contains('quick');
  function begin(){ startMotion(); }
  if(!loader){ html.classList.add('loaded'); begin(); return; }

  var urls = ['images/leaf-pattern.webp'];
  (body.getAttribute('data-preload') || '').split(',').forEach(function(t){
    t = t.trim(); if(!t) return;
    if(t === 'photos') PHOTOS.forEach(function(p){ urls.push('images/' + p.src); }); else urls.push(t);
  });
  document.querySelectorAll('img[src]').forEach(function(im){ urls.push(im.getAttribute('src')); });
  urls = urls.filter(function(u, i){ return urls.indexOf(u) === i; });

  var total = urls.length + 1, done = 0, target = 0, shown = 0, t0 = performance.now(), minT = seen ? 350 : 2300, finished = false;
  var barEl = loader.querySelector('.ld-bar i'), pctEl = loader.querySelector('.ld-pct');
  var allLoaded, minTime = new Promise(function(r){ setTimeout(r, minT); });
  var loadedP = new Promise(function(res){ allLoaded = res; setTimeout(res, 9000); });
  function tick(){ done++; target = Math.min(1, done / total); if(done >= total) allLoaded(); }
  urls.forEach(function(u){ var im = new Image(); im.onload = im.onerror = tick; im.src = u; });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(tick);

  function paint(){
    if(finished) return;
    var cap = Math.min(target, (performance.now() - t0) / minT);
    shown += (cap - shown) * .12;
    barEl.style.transform = 'scaleX(' + shown + ')';
    pctEl.textContent = Math.round(shown * 100) + '%';
    requestAnimationFrame(paint);
  }
  if(!seen) paint();

  Promise.all([loadedP, minTime]).then(function(){
    finished = true;
    barEl.style.transform = 'scaleX(1)'; pctEl.textContent = '100%';
    setTimeout(function(){
      loader.classList.add('done'); html.classList.add('loaded');
      try{ sessionStorage.setItem('ft-seen', '1'); }catch(e){}
      begin();
    }, seen ? 0 : 400);
  });

  // Wipe to the next page instead of a hard jump
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a'); if(!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var h = a.getAttribute('href'); if(!h || h.charAt(0) === '#' || a.target === '_blank' || /^(tel:|mailto:|https?:)/i.test(h)) return;
    if(!/\.html?(#.*)?$/i.test(h)) return;
    e.preventDefault();
    loader.style.transition = 'none'; loader.style.visibility = 'visible'; loader.style.transform = 'translateY(100%)';
    loader.style.borderRadius = '50% 50% 0 0 / 14vh 14vh 0 0'; loader.offsetHeight;
    loader.style.transition = 'transform .6s cubic-bezier(.77,0,.18,1), border-radius .6s cubic-bezier(.77,0,.18,1)';
    loader.style.transform = 'translateY(0)'; loader.style.borderRadius = '0';
    setTimeout(function(){ location.href = a.href; }, 640);
  });
  addEventListener('pageshow', function(e){
    if(e.persisted){ loader.style.transition = 'none'; loader.style.transform = 'translateY(-100%)'; loader.style.visibility = 'hidden'; html.classList.add('loaded'); }
  });
})();

})();