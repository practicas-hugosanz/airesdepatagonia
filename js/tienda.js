/* ═══════════════════════════════════════════════
   AIRES DE PATAGONIA — tienda online
   Carrito en el navegador y envío del pedido por WhatsApp.
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var WHATSAPP = '34636060366';
  var KEY = 'aires-pedido-v1';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }); };

  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { cart = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }

  /* ── DOM ── */
  var drawer = $('#cesta'), velo = $('#cestaVelo'), bolsaBtn = $('#bolsaBtn'), bolsaN = $('#bolsaN');
  var form = $('#pedidoForm'), vacia = $('#cestaVacia'), lineas = $('#lineas'), totalEl = $('#total');
  var errEl = $('#cestaError'), toast = $('#toast'), lastFocus = null, toastT;

  /* ── Tarjetas de producto ── */
  function selected(card) {
    var r = $('input[name^="v-"]:checked', card) || $('input[type=hidden]', card);
    var f = $('.prod__opt', card), o = f ? $('input:checked', f) : null;
    return {
      variant: r.value, price: parseFloat(r.dataset.price),
      optLabel: f ? f.dataset.label : '', option: o ? o.value : ''
    };
  }
  function updateSub(card) {
    var q = parseInt($('.qty__n', card).textContent, 10);
    $('.prod__sub', card).textContent = '· ' + money(selected(card).price * q);
  }
  $$('.prod, .fila').forEach(function (card) {
    updateSub(card);
    card.addEventListener('change', function () { updateSub(card); });
    $$('.qty__b', card).forEach(function (b) {
      b.addEventListener('click', function () {
        var out = $('.qty__n', card);
        var q = Math.max(1, Math.min(50, parseInt(out.textContent, 10) + parseInt(b.dataset.q, 10)));
        out.textContent = q; updateSub(card);
      });
    });
    $('.prod__add', card).addEventListener('click', function () {
      var s = selected(card), q = parseInt($('.qty__n', card).textContent, 10);
      add({ id: card.dataset.id, name: card.dataset.name, variant: s.variant, option: s.option, optLabel: s.optLabel, price: s.price }, q);
      $('.qty__n', card).textContent = '1'; updateSub(card);
    });
  });

  /* ── Carrito ── */
  function keyOf(l) { return [l.id, l.variant, l.option].join('|'); }
  function add(item, q) {
    var k = keyOf(item), f = cart.filter(function (l) { return keyOf(l) === k; })[0];
    if (f) f.qty = Math.min(99, f.qty + q); else { item.qty = q; cart.push(item); }
    save(); render(); bump();
    showToast('Añadido: ' + item.name + ' — ' + item.variant + (item.option ? ' (' + item.option + ')' : ''));
  }
  function total() { return cart.reduce(function (t, l) { return t + l.price * l.qty; }, 0); }
  function count() { return cart.reduce(function (t, l) { return t + l.qty; }, 0); }

  function render() {
    var n = count();
    bolsaN.textContent = n;
    bolsaBtn.classList.toggle('bolsa--llena', n > 0);
    bolsaBtn.setAttribute('aria-label', 'Abrir mi pedido (' + n + (n === 1 ? ' producto' : ' productos') + ')');
    vacia.hidden = n > 0; form.hidden = n === 0;
    lineas.innerHTML = '';
    cart.forEach(function (l, i) {
      var li = document.createElement('li');
      li.className = 'linea';
      li.innerHTML =
        '<div class="linea__txt"><strong></strong><span></span></div>' +
        '<div class="qty qty--s"><button type="button" class="qty__b" aria-label="Quitar una unidad">−</button><output></output><button type="button" class="qty__b" aria-label="Añadir una unidad">+</button></div>' +
        '<span class="linea__precio"></span>';
      $('strong', li).textContent = l.name;
      $('.linea__txt span', li).textContent = l.variant + (l.option ? ' · ' + l.option : '');
      $('output', li).textContent = l.qty;
      $('.linea__precio', li).textContent = money(l.price * l.qty);
      var b = $$('.qty__b', li);
      b[0].addEventListener('click', function () { l.qty--; if (l.qty < 1) cart.splice(i, 1); save(); render(); });
      b[1].addEventListener('click', function () { l.qty = Math.min(99, l.qty + 1); save(); render(); });
      lineas.appendChild(li);
    });
    totalEl.textContent = money(total());
  }

  function bump() {
    bolsaBtn.classList.remove('bump'); void bolsaBtn.offsetWidth; bolsaBtn.classList.add('bump');
  }
  function showToast(t) {
    toast.textContent = t; toast.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 2400);
  }

  /* ── Cajón ── */
  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add('on'); velo.hidden = false;
    requestAnimationFrame(function () { velo.classList.add('on'); });
    drawer.setAttribute('aria-hidden', 'false'); bolsaBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    setTimeout(function () { drawer.focus(); }, 60);
  }
  function closeDrawer() {
    drawer.classList.remove('on'); velo.classList.remove('on');
    drawer.setAttribute('aria-hidden', 'true'); bolsaBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    setTimeout(function () { velo.hidden = true; }, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  bolsaBtn.addEventListener('click', openDrawer);
  $('#cestaX').addEventListener('click', closeDrawer);
  velo.addEventListener('click', closeDrawer);
  $('#cestaSeguir').addEventListener('click', function () { closeDrawer(); var p = $('#productos'); if (p) p.scrollIntoView({ behavior: 'smooth' }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('on')) closeDrawer();
    if (e.key === 'Tab' && drawer.classList.contains('on')) {            // el foco se queda dentro del cajón
      var f = $$('button, input, select, textarea, a[href]', drawer).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === drawer)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ── Día y hora de recogida: botones, sin controles nativos ── */
  var diasEl = $('#dias'), horasEl = $('#horas');
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function chip(name, value, text, checked) {
    var l = document.createElement('label'); l.className = 'chip chip--s';
    l.innerHTML = '<input type="radio" name="' + name + '"><span></span>';
    $('input', l).value = value; $('input', l).checked = !!checked; $('span', l).textContent = text;
    return l;
  }
  var nombresDia = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  for (var i = 0; i < 7; i++) {
    var d = new Date(); d.setDate(d.getDate() + i);
    diasEl.appendChild(chip('dia', iso(d), i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : nombresDia[d.getDay()] + ' ' + d.getDate()));
  }
  var slots = [];
  for (var h = 10; h <= 22; h++) { ['00', '30'].forEach(function (m) { slots.push(('0' + h).slice(-2) + ':' + m); }); }
  slots.forEach(function (t) { horasEl.appendChild(chip('hora', t, t)); });
  function bloquearPasadas() {                       // si el día es hoy, las horas que ya pasaron no se pueden elegir
    var sel = $('input[name=dia]:checked', diasEl), hoy = sel && sel.value === iso(new Date()), ahora = new Date();
    $$('input', horasEl).forEach(function (inp) {
      var p = inp.value.split(':'), pasada = hoy && (parseInt(p[0], 10) * 60 + parseInt(p[1], 10) <= ahora.getHours() * 60 + ahora.getMinutes());
      inp.disabled = !!pasada; if (pasada && inp.checked) inp.checked = false;
      inp.parentNode.classList.toggle('chip--off', !!pasada);
    });
  }
  diasEl.addEventListener('change', bloquearPasadas);
  bloquearPasadas();

  /* ── Pedido ── */
  function message(d) {
    var rows = cart.map(function (l) {
      return '• ' + l.qty + ' × ' + l.name + ' — ' + l.variant + (l.option ? ' (' + l.option + ')' : '') + ' — ' + money(l.price * l.qty);
    });
    var fecha = new Date(d.dia + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    return ['Hola, quiero hacer un pedido para recoger:', '', rows.join('\n'), '', 'Total: ' + money(total()), '',
      'Local: ' + d.local, 'Día: ' + fecha, 'Hora: ' + d.hora, 'Nombre: ' + d.nombre,
      d.notas ? 'Comentarios: ' + d.notas : '', '', 'El pago lo hago en el local al recoger.'].filter(function (x, i, a) { return !(x === '' && a[i - 1] === ''); }).join('\n');
  }
  function data() {
    var fd = new FormData(form);
    return { local: fd.get('local'), dia: fd.get('dia'), hora: fd.get('hora'), nombre: (fd.get('nombre') || '').trim(), notas: (fd.get('notas') || '').trim() };
  }
  function validate(d) {
    if (!cart.length) return 'Añade algún producto al pedido.';
    if (!d.nombre) return 'Escribe tu nombre para el pedido.';
    if (!d.dia) return 'Elige el día de recogida.';
    if (!d.hora) return 'Elige la hora de recogida.';
    var when = new Date(d.dia + 'T' + d.hora + ':00');
    if (when.getTime() < Date.now()) return 'Esa hora ya ha pasado. Elige otro momento.';
    return '';
  }
  function error(t) { errEl.textContent = t; errEl.hidden = !t; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = data(), msg = validate(d);
    error(msg);
    if (msg) { var bad = !d.nombre ? '#nombre' : !d.dia ? 'input[name=dia]' : 'input[name=hora]'; var el = $(bad); if (el) el.focus(); return; }
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message(d)), '_blank', 'noopener');
  });
  $('#copiar').addEventListener('click', function () {
    var d = data(), msg = validate(d);
    error(msg); if (msg) return;
    var text = message(d);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { showToast('Pedido copiado'); }, function () { showToast('No se pudo copiar'); });
    else showToast('No se pudo copiar');
  });
  $('#vaciar').addEventListener('click', function () { cart = []; save(); render(); error(''); });
  form.addEventListener('input', function () { if (!errEl.hidden) error(''); });

  /* ── Entradas suaves (solo opacidad y desplazamiento) ── */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.prod, .fila, .pasos li, .hoja').forEach(function (el, i) { el.style.setProperty('--d', (i % 3) * 80 + 'ms'); io.observe(el); });
  }

  render();
})();
