/* ═══════════════════════════════════════════════
   AIRES DE PATAGONIA — interacciones (GSAP)
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ─────────── 1. Split de palabras ─────────── */
  function splitWords(el) {
    if (el.dataset.splitDone) return $$('.w-i', el);
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    var inner = [];
    words.forEach(function (w, i) {
      var mask = document.createElement('span');
      mask.className = 'w-mask';
      var span = document.createElement('span');
      span.className = 'w-i';
      span.textContent = w;
      mask.appendChild(span);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      inner.push(span);
    });
    el.dataset.splitDone = '1';
    return inner;
  }

  /* ─────────── 2. Entrada del hero ─────────── */
  function intro() {
    var tl = gsap.timeline();

    // la foto del muro verde se revela y entra el texto
    tl.from('.hero__marco .marco', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.5, ease: 'expo.out' }, 0)
      .from('.hero__marco img', { scale: 1.35, duration: 2.1, ease: 'expo.out' }, '<')
      .from('.hero__eyebrow', { yPercent: 120, opacity: 0, duration: .9, ease: 'expo.out' }, '-=1.6')
      .from('.hero__title .word', { yPercent: 118, duration: 1.15, ease: 'expo.out', stagger: .07 }, '-=1.1')
      .from('.hero__sub > span', { yPercent: 120, opacity: 0, duration: .9, ease: 'expo.out' }, '-=.7')
      .from('.hero__actions .btn', { y: 26, opacity: 0, duration: .8, ease: 'power3.out', stagger: .09 }, '-=.6')
      .from('.cartel__in', { yPercent: -60, opacity: 0, duration: 1.4, ease: 'expo.out' }, '-=1.2')
      .from('.nav__logo, .nav__right > *', { y: -24, opacity: 0, duration: .85, ease: 'expo.out', stagger: .08 }, '-=1.2');

    return tl;
  }

  /* ─────────── 3. Nav ─────────── */
  function nav() {
    var navEl = $('#nav');
    var last = 0;
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: function (self) {
        var y = self.scroll();
        navEl.classList.toggle('nav--solid', y > 80);
        if (document.body.classList.contains('is-open')) { navEl.classList.remove('nav--hidden'); last = y; return; }
        navEl.classList.toggle('nav--hidden', y > last && y > 400);
        last = y;
      }
    });
  }

  /* ─────────── 4. Menú hamburguesa ─────────── */
  function burgerMenu() {
    var burger  = $('#burger');
    var overlay = $('#menu-overlay');
    var bg      = $('.menu__bg');
    var bars    = $$('.burger__bars i');
    var label   = $('[data-burger-label]');
    var links   = $$('.menu__text > span');
    var nums    = $$('.menu__num');
    var hints   = $$('.menu__hint');
    var cols    = $$('.menu__foot-col');
    var focos   = $$('.menu__riel .foco');
    var foto    = $('.menu__foto');
    var open    = false;
    var tl;

    function build() {
      tl = gsap.timeline({ paused: true,
        onStart:    function () { overlay.classList.add('is-visible'); },
        onReverseComplete: function () { overlay.classList.remove('is-visible'); }
      });

      tl.to(bg, { clipPath: 'circle(150% at calc(100% - 90px) 44px)', duration: 1.05, ease: 'expo.inOut' })
        .to(bars[0], { rotate: 45, y: 3.5, width: 20, duration: .45, ease: 'power3.inOut' }, .05)
        .to(bars[1], { rotate: -45, y: -3.5, width: 20, marginLeft: 0, duration: .45, ease: 'power3.inOut' }, .05)
        .fromTo(focos, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .12 }, .25)
        .fromTo(foto, { y: 50, rotation: -4, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, .35)
        .fromTo(links, { yPercent: 115 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: .075 }, .28)
        .fromTo(nums,  { opacity: 0, x: -14 }, { opacity: .85, x: 0, duration: .7, ease: 'power3.out', stagger: .07 }, .38)
        .fromTo(hints, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out', stagger: .06 }, .5)
        .fromTo(cols,  { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .06 }, .55);
    }
    build();

    function toggle(force) {
      open = typeof force === 'boolean' ? force : !open;
      document.body.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      gsap.to(label, {
        opacity: 0, y: -8, duration: .18,
        onComplete: function () {
          label.textContent = open ? 'Cerrar' : 'Menú';
          gsap.fromTo(label, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .25 });
        }
      });
      if (open) tl.timeScale(1).play(); else tl.timeScale(1.5).reverse();
    }

    burger.addEventListener('click', function () { toggle(); });

    $$('[data-menu-link]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = $(a.getAttribute('href'));
        toggle(false);
        gsap.delayedCall(.45, function () {
          if (!target) return;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 10, behavior: 'smooth' });
        });
      });
    });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) toggle(false); });
  }

  /* ─────────── 5. Reveals genéricos ─────────── */
  function reveals() {
    // líneas simples
    $$('[data-reveal-line]').forEach(function (el) {
      gsap.from(el.querySelector('span') || el, {
        yPercent: 115, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // titulares palabra a palabra
    $$('[data-split]').forEach(function (el) {
      var words = splitWords(el);
      gsap.from(words, {
        yPercent: 115, duration: 1.05, ease: 'expo.out', stagger: .045,
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    // imágenes con máscara
    $$('.reveal-img').forEach(function (box) {
      var img = box.querySelector('img');
      gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 90%' } })
        .fromTo(box, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.out' })
        .fromTo(img, { scale: 1.34 }, { scale: 1.14, duration: 1.5, ease: 'expo.out' }, 0);
    });

    // los cuadros se "cuelgan" y la carta de papel se pega
    $$('.cuadro').forEach(function (el, i) {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
      gsap.from($('figcaption', el), {
        opacity: 0, y: 12, rotate: -6, duration: 1, delay: .5, ease: 'back.out(2)',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
    // las fotos del collage se desplazan suavemente dentro de su marco
    $$('.cuadro .reveal-img img').forEach(function (img, i) {
      gsap.fromTo(img, { yPercent: i ? -5 : 4 }, {
        yPercent: i ? 5 : -4, ease: 'none',
        scrollTrigger: { trigger: img.closest('.cuadro'), start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });
    var papel = $('[data-papel]');
    if (papel) {
      gsap.from(papel, {
        y: -50, rotate: -4, opacity: 0, duration: 1.2, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: papel, start: 'top 88%' }
      });
      gsap.from($('.sello', papel), {
        scale: 1.8, opacity: 0, rotate: -30, duration: .7, delay: .6, ease: 'power4.in',
        scrollTrigger: { trigger: papel, start: 'top 88%' }
      });
    }

    // parallax suave
    $$('[data-parallax]').forEach(function (el) {
      gsap.to(el, {
        y: parseFloat(el.dataset.parallax),
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    // la hoja de la carta se posa sobre la mesa
    gsap.from('.hoja', {
      y: 70, rotate: 2, opacity: 0, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.hoja', start: 'top 88%' }
    });

    // reseñas
    $$('.comandas').forEach(function (row) {
      gsap.from($$('[data-resena]', row), {
        y: -90, rotation: -5, opacity: 0, duration: 1.4, ease: 'elastic.out(1,.55)', stagger: .12,
        scrollTrigger: { trigger: row.querySelector('[data-resena]'), start: 'top 88%' }
      });
    });

    // tarjetas de local
    gsap.from('.flecha', {
      xPercent: function (i) { return i === 0 ? -14 : 14; }, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .14,
      scrollTrigger: { trigger: '.senales', start: 'top 82%' }
    });
    gsap.from('.horario', {
      y: -60, rotate: -4, opacity: 0, duration: 1.2, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.horario', start: 'top 88%' }
    });

    // hero: parallax de salida
    gsap.to('.hero__content', {
      y: -60, opacity: .3, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
    gsap.to('.hero__marco', {
      y: 50, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
    });
  }

  /* ─────────── 6. Contadores ─────────── */
  function counters() {
    $$('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count);
      var pre = el.dataset.prefix || '';
      var suf = el.dataset.suffix || '';
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: end, duration: 1.8, ease: 'power2.out',
            onUpdate: function () { el.textContent = pre + Math.round(obj.v) + suf; }
          });
        }
      });
    });
  }

  /* ─────────── 7. Carta: resaltado al pasar (sin imágenes, para que vaya ligera) ─────────── */
  function cartaHover() {
    if (touch) return;
    $$('.carta__item').forEach(function (item) {
      item.addEventListener('mouseenter', function () { item.classList.add('is-hot'); });
      item.addEventListener('mouseleave', function () { item.classList.remove('is-hot'); });
    });
  }

  /* ─────────── 7b. Carta: pestañas ─────────── */
  function cartaTabs() {
    var tabs = $$('.carta__tab');
    if (!tabs.length) return;
    function show(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById('panel-' + t.dataset.tab);
        if (on) {
          p.hidden = false;
          if (!reduced) gsap.fromTo(p, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out', clearProps: 'all' });
        } else { p.hidden = true; }
      });
      if (focus) tab.focus();
      ScrollTrigger.refresh();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); show(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  }

  /* ─────────── 10. Micro-interacciones ─────────── */
  function micro() {
    // las comandas se balancean al pasar por ellas (también al tocar)
    $$('[data-resena]').forEach(function (el) {
      var enter = function () {
        if (reduced) return;
        gsap.fromTo(el, { rotation: el.dataset.dir ? -el.dataset.dir : 3.2 }, { rotation: 0, duration: 1.8, ease: 'elastic.out(1,.22)', overwrite: 'auto' });
      };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('touchstart', enter, { passive: true });
    });

    // anclas suaves
    $$('a[href^="#"]:not([data-menu-link])').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = $(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 10, behavior: 'smooth' });
      });
    });
  }

  /* ─────────── 11. El salón: luz y cartel ─────────── */

  // el cartel de "Abierto" se mece en el riel
  function cartel() {
    var el = $('.cartel__in');
    if (!el || reduced) return;
    gsap.set(el, { rotation: -2.2 });
    gsap.to(el, { rotation: 2.2, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  // un foco cálido sigue al cursor en las secciones oscuras
  function luz() {
    if (touch) return;
    $$('.luzable').forEach(function (sec) {
      var mx = gsap.quickTo(sec, '--mx', { duration: .6, ease: 'power3', suffix: 'px' });
      var my = gsap.quickTo(sec, '--my', { duration: .6, ease: 'power3', suffix: 'px' });
      sec.addEventListener('mousemove', function (e) {
        var r = sec.getBoundingClientRect();
        mx(e.clientX - r.left);
        my(e.clientY - r.top);
      });
    });
  }

  // la ruta Patagonia → Alicante se dibuja sola
  function rutaOrigen() {
    var sec = $('.origen');
    if (!sec) return;
    var st = { trigger: sec, start: 'top 92%' };
    gsap.from('.origen__monte', { yPercent: 70, opacity: 0, duration: 1.5, ease: 'expo.out', scrollTrigger: st });
    gsap.from('.origen__linea', { scaleX: 0, duration: 1.6, ease: 'power2.inOut', stagger: .15, scrollTrigger: st });
    gsap.from('.origen__side, .origen__line', { y: 22, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12, scrollTrigger: st });
  }

  /* ─────────── Arranque ─────────── */
  function boot() {
    if (!hasGSAP) return;

    // la tienda (tienda.html) solo usa la barra, el menú y el cartel; el resto es de la página principal
    var tienda = document.body.classList.contains('page-tienda');

    if (!tienda && !reduced) intro();

    nav();
    burgerMenu();
    micro();
    cartel();
    if (!tienda) {
      reveals();
      counters();
      cartaHover();
      cartaTabs();
      luz();
      rutaOrigen();
    }

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
