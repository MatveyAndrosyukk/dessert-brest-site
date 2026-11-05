(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const IG = 'dessert_brest';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- data ---------- */
  const FILLINGS = [
    { id: 'molochnaya', name: 'Молочная девочка', desc: 'Коржи на сгущёнке, сливочный крем с маскарпоне и персики', cut: true },
    { id: 'pistachio_raspberry', name: 'Фисташка-Малина', desc: 'Ванильный бисквит, малиновый кули, крем с фисташковой пастой', cut: true },
    { id: 'esterhazy', name: 'Эстерхази', desc: 'Орехово-воздушные коржи, крем с пралине, миндальные лепестки', cut: true },
    { id: 'choco_banana', name: 'Шоколадно-банановый', desc: 'Шоколадный бисквит, карамелизированный банан и ганаш', cut: true },
    { id: 'lemon_poppy', name: 'Лимонно-маковый', desc: 'Маковый бисквит, лимонный курд, творожно-сливочный крем', cut: true },
    { id: 'berry_cheesecake', name: 'Ягодный чизкейк', desc: 'Песочная основа, нежный чизкейк и сочные ягоды', cut: true },
    { id: 'den_noch', name: 'День-Ночь', desc: 'Ванильный и шоколадный бисквит, вишня, крем-чиз', cut: true },
    { id: 'twix', name: 'Чизкейк Твикс', desc: 'Классический чизкейк, сливочная карамель, шоколадный ганаш', cut: true },
    { id: 'choco_praline_cherry', name: 'Шоколад-Пралине-Вишня', desc: 'Шоколадный бисквит, крем-чиз, вишня, ганаш и хрустящий слой', cut: true },
    { id: 'captain_cookies', name: 'Капитан Кукис', desc: 'Песочные коржи с шоколадом, маскарпоне, домашняя карамель, арахис', cut: true },
    { id: 'raffaello', name: 'Рафаэлло', desc: 'Кокосовый бисквит, крем с маскарпоне, миндаль и кокос' },
    { id: 'snickers', name: 'Сникерс', desc: 'Шоколадный и ванильный бисквит, арахис, сливочный крем' },
    { id: 'mars', name: 'Марс', desc: 'Шоколадно-медовые коржи, сметанный крем, сливочная карамель' },
    { id: 'other', name: 'Другая начинка', desc: 'Наполеон, медовик, Сан-Себастьян, Лавандовый… уточним в Директ', img: 'img/fill-more.webp' }
  ];
  const TYPES = [
    { id: 'cake', name: 'Торт на праздник', desc: 'Любой дизайн · 60 руб/кг', img: 'img/cake_birthday_berries.webp' },
    { id: 'kids', name: 'Детский торт', desc: 'Банты, ягоды, надписи', img: 'img/cake_bows.webp' },
    { id: 'bento', name: 'Бенто в чашке', desc: 'Шоколад-вишня · 55 руб', img: 'img/dess_bento_cup.webp' },
    { id: 'candy', name: 'Кенди-бар', desc: 'Сладкий стол для гостей', img: 'img/dess_macarons.webp' }
  ];
  const PLACES = [
    { id: 'sov', name: 'Советская, 130', desc: 'Ежедневно 8:30–23:00', img: 'img/facade.webp' },
    { id: 'push', name: 'Пушкинская, 43', desc: 'Пн–Чт 8:30–22:00, Пт–Вс до 23:00', img: 'img/vitrine.webp' }
  ];
  const OCCASIONS = ['День рождения', 'Детский праздник', 'Свадьба', 'Юбилей', 'Корпоратив', 'Просто так'];
  const fillImg = f => f.img || `img/f-${f.id}.webp`;

  /* ---------- header ---------- */
  const header = $('.site-header');
  const burger = $('#burger');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('menu-open'); burger.setAttribute('aria-expanded', false);
  }));
  // active nav link
  const navLinks = $$('.nav a[href^="#"]');
  const secs = navLinks.map(a => $(a.getAttribute('href') === '#top' ? '.hero' : a.getAttribute('href'))).filter(Boolean);
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.classList.contains('hero') ? '#top' : '#' + e.target.id;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => navIO.observe(s));

  /* ---------- hero slider ---------- */
  const texts = $$('.hero-text'), imgs = $$('.hero-img'), num = $('#heroNum'), hero = $('.hero');
  let hi = 0, htimer;
  const go = n => {
    hi = (n + texts.length) % texts.length;
    texts.forEach((t, i) => t.classList.toggle('is-active', i === hi));
    imgs.forEach((t, i) => { t.classList.toggle('was', t.classList.contains('is-active') && i !== hi); if (i !== hi && !t.classList.contains('was')) t.classList.remove('was'); t.classList.toggle('is-active', i === hi); });
    setTimeout(() => imgs.forEach((t, i) => i !== hi && t.classList.remove('was')), 1500);
    num.textContent = String(hi + 1).padStart(2, '0');
    const bar = $('.hero-count span');
    bar.style.animation = 'none'; bar.offsetWidth; bar.style.animation = '';
    restart();
  };
  const restart = () => { clearInterval(htimer); if (!reduce) htimer = setInterval(() => go(hi + 1), 6000); };
  $('#heroNext').addEventListener('click', () => go(hi + 1));
  $('#heroPrev').addEventListener('click', () => go(hi - 1));
  let tx = null;
  hero.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  hero.addEventListener('touchend', e => { if (tx == null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) go(hi + (d < 0 ? 1 : -1)); tx = null; });
  restart();

  /* ---------- menu carousel ---------- */
  const car = $('#menuCarousel');
  car.innerHTML = FILLINGS.filter(f => f.cut).map(f => `
    <article class="dish">
      <div class="dish-img"><img src="img/s-${f.id}.webp" alt="Торт «${f.name}» в разрезе" loading="lazy"></div>
      <h3>${f.name}</h3>
      <p>${f.desc}</p>
      <div class="price"><b>60 руб</b><span>|</span>за 1 кг</div>
      <button class="btn btn-green btn-sm" data-open-order data-type="cake" data-fill="${f.id}">Заказать с этой начинкой</button>
    </article>`).join('');
  $$('[data-scroll]').forEach(b => b.addEventListener('click', () => {
    const card = car.querySelector('.dish'); const step = card.offsetWidth + parseFloat(getComputedStyle(car).columnGap || 30);
    const max = car.scrollWidth - car.clientWidth;
    let to = car.scrollLeft + step * +b.dataset.scroll;
    if (to > max + 5) to = 0; else if (to < -5) to = max;
    car.scrollTo({ left: to, behavior: 'smooth' });
  }));

  /* ---------- feature slider ---------- */
  const feats = $$('.feature'), dots = $('#featureDots');
  let fi = 0, ftimer;
  dots.innerHTML = feats.map((_, i) => `<button aria-label="Слайд ${i + 1}"${i ? '' : ' class="on"'}></button>`).join('');
  const fgo = n => {
    fi = (n + feats.length) % feats.length;
    feats.forEach((f, i) => f.classList.toggle('is-active', i === fi));
    $$('button', dots).forEach((d, i) => d.classList.toggle('on', i === fi));
    clearInterval(ftimer); if (!reduce) ftimer = setInterval(() => fgo(fi + 1), 7000);
  };
  $$('button', dots).forEach((d, i) => d.addEventListener('click', () => fgo(i)));
  const fs = $('#feature'); let fx = null;
  fs.addEventListener('touchstart', e => fx = e.touches[0].clientX, { passive: true });
  fs.addEventListener('touchend', e => { if (fx == null) return; const d = e.changedTouches[0].clientX - fx; if (Math.abs(d) > 50) fgo(fi + (d < 0 ? 1 : -1)); fx = null; });
  fgo(0);

  /* gallery: duplicate for seamless loop */
  const gal = $('#gallery'); gal.innerHTML += gal.innerHTML;
  $$('figure', gal).slice(gal.children.length / 2).forEach(f => { f.setAttribute('aria-hidden', 'true'); $$('button', f).forEach(b => b.tabIndex = -1); });

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));
  function countUp(el) {
    const end = +el.dataset.count, dec = +(el.dataset.dec || 0), t0 = performance.now(), dur = 1600;
    const tick = t => { const p = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec).replace('.', ','); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /* ---------- decor: wrap, drop-in on view, float ---------- */
  $$('img.deco').forEach((img, k) => {
    const w = document.createElement('span');
    w.className = img.className; w.setAttribute('style', (img.getAttribute('style') || '').replace(/transform:[^;]+;?/, ''));
    w.setAttribute('aria-hidden', 'true');
    ['depth', 'speed', 'rot'].forEach(d => { if (img.dataset[d]) w.dataset[d] = img.dataset[d]; });
    w.style.setProperty('--fd', (k % 5) * -1.3 + 's');
    img.className = 'deco-in'; img.removeAttribute('style'); ['depth', 'speed', 'rot'].forEach(d => delete img.dataset[d]);
    img.parentNode.insertBefore(w, img); w.appendChild(img);
  });
  const dio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$(':scope > .deco, :scope > * > .deco', e.target).forEach((d, i) => setTimeout(() => d.classList.add('landed'), i * 140));
    dio.unobserve(e.target);
  }), { threshold: .12 });
  [...new Set($$('.deco').map(d => d.closest('section') || d.parentElement))].forEach(sec => dio.observe(sec));
  if (reduce) $$('.deco').forEach(d => d.classList.add('landed'));

  /* ---------- marquee follows scroll (direction + speed) ---------- */
  const mt = $('.marquee-track');
  let mPos = 0, lastY = scrollY, dir = 1;
  const mLoop = () => {
    const dy = scrollY - lastY; lastY = scrollY;
    if (dy) dir = dy > 0 ? 1 : -1;
    mPos += dir * (0.5 + Math.min(Math.abs(dy), 60) * 0.25);
    const half = mt.scrollWidth / 2; if (half) mPos = ((mPos % half) + half) % half;
    mt.style.transform = `translate3d(${-mPos}px,0,0)`;
    requestAnimationFrame(mLoop);
  };
  if (!reduce) requestAnimationFrame(mLoop);

  /* ---------- 3D tilt on filling cards ---------- */
  if (matchMedia('(hover:hover)').matches && !reduce) car.addEventListener('mousemove', e => {
    const d = e.target.closest('.dish'); if (!d) return;
    const r = d.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    $('.dish-img', d).style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 16}deg)`;
  });
  car.addEventListener('mouseout', e => { const d = e.target.closest('.dish'); if (d && !d.contains(e.relatedTarget)) $('.dish-img', d).style.transform = ''; });

  /* ---------- parallax decor (scroll + mouse) ---------- */
  const decos = $$('[data-depth],[data-speed]');
  let mx = 0, my = 0, raf = 0;
  const paint = () => {
    raf = 0;
    const vh = innerHeight;
    decos.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const d = +(el.dataset.depth || 0), sp = +(el.dataset.speed || 0), rot = +(el.dataset.rot || 0);
      const sy = sp ? (r.top + r.height / 2 - vh / 2) * sp : 0;
      el.style.transform = `translate3d(${mx * d}px, ${my * d + sy}px, 0) rotate(${rot + mx * d * .15}deg)`;
    });
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(paint); };
  if (!reduce) {
    addEventListener('scroll', req, { passive: true });
    addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; req(); }, { passive: true });
    paint();
  }

  /* ---------- QUIZ ---------- */
  const st = { type: null, fill: null, weight: 2, occasion: null, place: null, step: 1 };
  const card = (o, group) => `<button type="button" class="card" data-group="${group}" data-id="${o.id}">
      <span class="tick"><svg><use href="#check"/></svg></span>
      <img src="${o.img}" alt="" loading="lazy"><span class="card-body"><b>${o.name}</b><small>${o.desc}</small></span></button>`;
  $('#typeCards').innerHTML = TYPES.map(t => card(t, 'type')).join('');
  $('#fillCards').innerHTML = FILLINGS.map(f => card({ ...f, img: fillImg(f) }, 'fill')).join('');
  $('#placeCards').innerHTML = PLACES.map(p => card(p, 'place')).join('');
  $('#occasionChips').innerHTML = OCCASIONS.map(o => `<button type="button" class="chip" data-occ="${o}">${o}</button>`).join('');

  const markSel = (group, id) => $$(`.card[data-group="${group}"]`).forEach(c => c.classList.toggle('sel', c.dataset.id === id));
  const setType = id => {
    st.type = id; markSel('type', id);
    $('#stepFill').hidden = !(id === 'cake' || id === 'kids');
    $('#stepBento').hidden = id !== 'bento';
    $('#stepCandy').hidden = id !== 'candy';
  };
  const setFill = id => { st.fill = id; markSel('fill', id); };
  $('#quiz').addEventListener('click', e => {
    const c = e.target.closest('.card');
    if (c) {
      const g = c.dataset.group;
      if (g === 'type') { setType(c.dataset.id); setTimeout(() => goStep(2), 380); }
      if (g === 'fill') setFill(c.dataset.id);
      if (g === 'place') { st.place = c.dataset.id; markSel('place', st.place); }
      err('');
    }
    const ch = e.target.closest('.chip');
    if (ch) { st.occasion = st.occasion === ch.dataset.occ ? null : ch.dataset.occ; $$('.chip').forEach(x => x.classList.toggle('sel', x.dataset.occ === st.occasion)); }
    const q = e.target.closest('[data-qty]');
    if (q) { const inp = q.parentElement.querySelector('input'); inp.value = Math.min(+inp.max, Math.max(+inp.min, (+inp.value || 0) + +q.dataset.qty)); }
  });
  const w = $('#weight');
  const upW = () => { st.weight = +w.value; $('#weightVal').textContent = String(st.weight).replace('.', ',') + ' кг'; $('#priceVal').textContent = Math.round(st.weight * 60); };
  w.addEventListener('input', upW); upW();

  // date: min today, warn if < 5 days
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dateIn = $('#date'); dateIn.min = iso(today);
  const recDate = new Date(today); recDate.setDate(recDate.getDate() + 7); dateIn.value = iso(recDate);
  const checkDate = () => {
    const hint = $('#dateHint'); if (!dateIn.value) return;
    const days = Math.round((new Date(dateIn.value + 'T00:00') - today) / 864e5);
    const isCake = st.type !== 'bento';
    if (isCake && days < 5) { hint.textContent = 'Меньше 5 дней — напишите нам, уточним, успеем ли к этой дате.'; hint.classList.add('warn'); }
    else { hint.textContent = 'Торты рекомендуем заказывать минимум за 5–7 дней до праздника.'; hint.classList.remove('warn'); }
  };
  dateIn.addEventListener('change', checkDate);

  const steps = $$('.step'), stepLis = $$('#quizSteps li');
  const err = m => { $('#qErr').textContent = m; };
  const validate = n => {
    if (n === 1 && !st.type) return 'Выберите, что заказываем';
    if (n === 2 && (st.type === 'cake' || st.type === 'kids') && !st.fill) return 'Выберите начинку';
    if (n === 4) { if (!dateIn.value) return 'Укажите дату'; if (dateIn.value < dateIn.min) return 'Дата уже прошла'; if (!st.place) return 'Выберите кофейню, где заберёте заказ'; }
    if (n === 5) { const nm = $('#name'); if (!nm.value.trim()) { nm.parentElement.classList.add('err'); nm.focus(); return 'Как к вам обращаться?'; } }
    return '';
  };
  const goStep = n => {
    if (n > st.step) { for (let i = st.step; i < n; i++) { const m = validate(i); if (m) { err(m); return; } } }
    err(''); st.step = n;
    steps.forEach(s => s.classList.toggle('is-active', +s.dataset.step === n));
    stepLis.forEach((l, i) => { l.classList.toggle('on', i + 1 === n); l.classList.toggle('done', i + 1 < n); });
    $('#qBack').style.visibility = n > 1 ? 'visible' : 'hidden';
    $('#qNext').hidden = n === 5; $('#qSend').hidden = n !== 5;
    if (n === 4) checkDate();
    if (n === 5) renderSummary();
    const top = $('#order').getBoundingClientRect().top;
    if (top < -40 || top > innerHeight * .5) $('#order').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  $('#qNext').addEventListener('click', () => goStep(st.step + 1));
  $('#qBack').addEventListener('click', () => goStep(st.step - 1));
  $('#name').addEventListener('input', e => { e.target.parentElement.classList.remove('err'); err(''); });

  const fmtDate = v => { if (!v) return '—'; const [y, m, d] = v.split('-'); return `${d}.${m}.${y}`; };
  const details = () => {
    const t = TYPES.find(x => x.id === st.type);
    const f = FILLINGS.find(x => x.id === st.fill);
    const p = PLACES.find(x => x.id === st.place);
    const rows = [['Заказ', t ? t.name : '—']];
    let img = t ? t.img : '';
    if (st.type === 'cake' || st.type === 'kids') {
      rows.push(['Начинка', f ? f.name : '—'], ['Вес', `${String(st.weight).replace('.', ',')} кг (≈ ${Math.round(st.weight * 60)} руб)`]);
      if (f) img = fillImg(f);
    }
    if (st.type === 'bento') rows.push(['Количество', `${$('#bentoQty').value} шт. (≈ ${$('#bentoQty').value * 55} руб)`]);
    if (st.type === 'candy') rows.push(['Гостей', $('#guests').value]);
    if (st.occasion) rows.push(['Повод', st.occasion]);
    const ins = $('#inscription').value.trim(); if (ins) rows.push(['Надпись', `«${ins}»`]);
    const des = $('#design').value.trim(); if (des) rows.push(['Дизайн', des]);
    rows.push(['Дата', fmtDate(dateIn.value)], ['Забрать', p ? p.name : '—']);
    rows.push(['Имя', $('#name').value.trim() || '—']);
    const tel = $('#tel').value.trim(); if (tel) rows.push(['Телефон', tel]);
    return { rows, img };
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function renderSummary() {
    const { rows, img } = details();
    $('#summary').innerHTML = `${img ? `<img src="${img}" alt="">` : ''}<dl><h4>Ваш заказ</h4>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
  }
  ['#name', '#tel'].forEach(s => $(s).addEventListener('input', () => st.step === 5 && renderSummary()));
  const message = () => 'Здравствуйте! Хочу сделать заказ через сайт 🍰\n' + details().rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0';
      document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
      ta.remove(); return ok;
    }
  }
  const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2800); };

  $('#quizForm').addEventListener('submit', async e => {
    e.preventDefault();
    const m = validate(5); if (m) { err(m); return; }
    const text = message();
    const copied = copy(text);              // copy first (inside the click gesture)
    const win = window.open(`https://ig.me/m/${IG}`, '_blank'); try { if (win) win.opener = null; } catch (_) {}
    const ok = await copied;
    $('#quizForm').hidden = true; $('#quizSteps').hidden = true; $('#sent').hidden = false;
    toast(ok ? 'Текст заказа скопирован — вставьте его в Директ' : 'Не удалось скопировать — нажмите «Скопировать снова»');
    if (!win) toast('Нажмите «Открыть Директ ещё раз»');
  });
  $('#copyAgain').addEventListener('click', async () => toast(await copy(message()) ? 'Скопировано' : 'Не удалось скопировать'));
  $('#restart').addEventListener('click', () => {
    $('#quizForm').reset(); Object.assign(st, { type: null, fill: null, occasion: null, place: null, step: 1 });
    $$('.card,.chip').forEach(c => c.classList.remove('sel')); dateIn.value = iso(recDate); upW();
    $('#quizForm').hidden = false; $('#quizSteps').hidden = false; $('#sent').hidden = true; goStep(1);
  });

  // open order from anywhere
  $$('[data-open-order]').forEach(b => b.addEventListener('click', e => {
    const type = b.dataset.type, fill = b.dataset.fill;
    if (!type) return; // plain anchor
    e.preventDefault();
    if ($('#sent').hidden === false) $('#restart').click();
    setType(type); if (fill) setFill(fill);
    st.step = 1; goStep(2);
    $('#order').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));

  $('#year').textContent = new Date().getFullYear();
})();
