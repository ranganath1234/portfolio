/* =========================================================
   Ranganath M — Portfolio interactions (vanilla JS, no build)
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EMAIL = 'ranganathmukkundi@gmail.com';

  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }

  /* ---------- Theme ---------- */
  (function theme() {
    var root = document.documentElement;
    var btn = $('#themeToggle');
    var meta = $('meta[name="theme-color"]');
    function apply(t) {
      root.setAttribute('data-theme', t);
      if (meta) meta.setAttribute('content', t === 'light' ? '#f7f4ed' : '#0a0e13');
      if (btn) btn.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
    apply(root.getAttribute('data-theme') || 'dark');
    if (btn) btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(next); safeSet('theme', next);
    });
  })();

  /* ---------- Nav: scrolled state, mobile menu, active link ---------- */
  (function nav() {
    var header = $('#nav');
    var burger = $('#navBurger');
    var links = $$('#navLinks a');

    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function setOpen(open) {
      header.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    burger.addEventListener('click', function () { setOpen(!header.classList.contains('is-open')); });
    links.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

    if ('IntersectionObserver' in window) {
      var map = {};
      links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          var a = map[en.target.id];
          if (a) a.setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

      var hero = document.getElementById('top');
      if (hero) new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) links.forEach(function (a) { a.removeAttribute('aria-current'); });
      }, { threshold: 0.5 }).observe(hero);
    }
  })();

  /* ---------- Reveal on scroll ---------- */
  (function reveal() {
    var items = $$('.reveal');
    // Stagger siblings slightly
    var counts = new Map();
    items.forEach(function (el) {
      var p = el.parentElement;
      var n = counts.get(p) || 0;
      counts.set(p, n + 1);
      el.style.setProperty('--d', Math.min(n * 80, 400) + 'ms');
    });
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Typed role line ---------- */
  (function typed() {
    var el = $('#typed');
    if (!el || reduceMotion) return;
    var words;
    try { words = JSON.parse(el.getAttribute('data-words')); } catch (e) { return; }
    if (!words || !words.length) return;
    var wi = 0, ci = words[0].length, deleting = false;
    function tick() {
      var word = words[wi];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci >= word.length) { deleting = true; return setTimeout(tick, 1900); }
        return setTimeout(tick, 55);
      }
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 300); }
      setTimeout(tick, 28);
    }
    setTimeout(function () { deleting = true; tick(); }, 2300);
  })();

  /* ---------- Architecture explorer (CampusProjects.tech) ---------- */
  (function architecture() {
    var DATA = {
      visitors: {
        title: 'Visitors — search to storefront',
        points: [
          'Search traffic lands on SEO-ready pages: sitemap, structured data and canonical URLs, monitored in Google Search Console.',
          'GA4 / Google Tag Manager ecommerce tracking follows the journey from landing page to purchase.'
        ]
      },
      frontend: {
        title: 'React.js + TypeScript on Vercel',
        points: [
          'A decoupled frontend: it calls the Django API through a server-side proxy rather than straight from the browser.',
          'Includes the referral dashboard, a lead-capture form and a feedback survey.',
          'Deployed on Vercel.'
        ]
      },
      api: {
        title: 'Django REST Framework on AWS Lightsail',
        points: [
          'Docker + Gunicorn behind Nginx, served over HTTPS with Let’s Encrypt.',
          'OTP-verified email signup, JWT authentication and Google sign-in.',
          'Project catalog, orders, referral rewards and token-based project downloads.',
          'Documented with OpenAPI.'
        ]
      },
      db: {
        title: 'MySQL on Supabase',
        points: [
          'The Django backend is built on MySQL.',
          'The database is hosted on Supabase, separate from the application server.'
        ]
      },
      razorpay: {
        title: 'Razorpay — payments end to end',
        points: [
          'Checkout sessions to start a payment.',
          'Payment verification, webhooks and refunds.'
        ]
      },
      google: {
        title: 'Google sign-in',
        points: [
          'Lets users sign in with their Google account, alongside OTP-verified email signup.',
          'Sessions are secured with JWT authentication.'
        ]
      },
      telegram: {
        title: 'Telegram alerts',
        points: [
          'Alerts on server health status are sent to Telegram so problems get noticed quickly.'
        ]
      }
    };

    var nodes = $$('#arch .node');
    var detail = $('#archDetail');
    var title = $('#archTitle');
    var list = $('#archPoints');
    if (!nodes.length) return;

    function select(key, animate) {
      var d = DATA[key];
      if (!d) return;
      nodes.forEach(function (n) { n.setAttribute('aria-pressed', String(n.getAttribute('data-node') === key)); });
      title.textContent = d.title;
      list.textContent = '';
      d.points.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; list.appendChild(li); });
      if (animate && !reduceMotion) {
        detail.classList.remove('is-swap');
        void detail.offsetWidth; // restart animation
        detail.classList.add('is-swap');
      }
    }
    nodes.forEach(function (n) { n.addEventListener('click', function () { select(n.getAttribute('data-node'), true); }); });
    select('api', false);
  })();

  /* ---------- Smart-watch simulator ---------- */
  (function demo() {
    var root = $('#demo');
    if (!root) return;

    var stage = $('.stage', root);
    var watch = $('#watch');
    var voiceEl = $('#demoVoice');
    var patternEl = $('#demoPattern');
    var patternName = $('#demoPatternName');
    var note = $('#demoNote');
    var btnPlay = $('#demoPlay');
    var btnAuto = $('#demoAuto');
    var btnSpeak = $('#demoSpeak');
    var hapticHint = $('#demoHaptic');
    var stateBtns = $$('[data-state]', root);
    var langBtns = $$('[data-lang]', root);
    var DEFAULT_NOTE = note.textContent;

    // Illustrative vibration patterns, as navigator.vibrate() arrays: [pulse, gap, pulse, ...] in ms
    var PATTERNS = {
      red:    { name: 'one long pulse',     ms: [800] },
      yellow: { name: 'two medium pulses',  ms: [260, 160, 260] },
      green:  { name: 'three short pulses', ms: [140, 100, 140, 100, 140] }
    };
    // Illustrative phrasing for the voice alerts
    var VOICE = {
      en: { red: 'Signal is red. Please wait.', yellow: 'Signal is yellow. Get ready.', green: 'Signal is green. You may cross now.' },
      hi: { red: 'सिग्नल लाल है। कृपया रुकिए।', yellow: 'सिग्नल पीला है। तैयार रहिए।', green: 'सिग्नल हरा है। अब आप सड़क पार कर सकते हैं।' },
      kn: { red: 'ಸಿಗ್ನಲ್ ಕೆಂಪು ಇದೆ. ದಯವಿಟ್ಟು ನಿಲ್ಲಿ.', yellow: 'ಸಿಗ್ನಲ್ ಹಳದಿ ಇದೆ. ಸಿದ್ಧರಾಗಿ.', green: 'ಸಿಗ್ನಲ್ ಹಸಿರು ಇದೆ. ಈಗ ರಸ್ತೆ ದಾಟಬಹುದು.' }
    };
    var LANG_CODE = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN' };
    var LANG_NAME = { en: 'English', hi: 'Hindi', kn: 'Kannada' };
    var ORDER = ['red', 'green', 'yellow']; // real-world signal order
    var WINDOW_MS = 900;                    // time scale of the pattern strip

    var state = 'red';
    var lang = 'en';
    var timers = [];
    var bars = [];
    var autoTimer = null;
    var visible = false;
    var speakOn = false;

    var synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
    if (synth) btnSpeak.hidden = false;
    if ('vibrate' in navigator) hapticHint.hidden = false;

    function renderPattern() {
      var pat = PATTERNS[state].ms;
      patternEl.textContent = '';
      bars = pat.map(function (d, i) {
        var s = document.createElement('i');
        s.className = i % 2 === 0 ? 'p' : 'g';
        s.style.flex = '0 0 ' + (d / WINDOW_MS * 100).toFixed(2) + '%';
        patternEl.appendChild(s);
        return s;
      });
      var rest = document.createElement('i');
      rest.className = 'rest';
      patternEl.appendChild(rest);
      patternName.textContent = PATTERNS[state].name;
    }

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
      watch.classList.remove('is-buzz');
      bars.forEach(function (b) { b.classList.remove('on'); });
    }

    function findVoice(l) {
      if (!synth) return null;
      var voices = synth.getVoices() || [];
      var exact = LANG_CODE[l].toLowerCase();
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang.toLowerCase().replace('_', '-') === exact) return voices[i];
      }
      for (var j = 0; j < voices.length; j++) {
        if (voices[j].lang.toLowerCase().indexOf(l) === 0) return voices[j];
      }
      return null;
    }

    function speak() {
      if (!speakOn || !synth) return;
      var voice = findVoice(lang);
      if (!voice && lang !== 'en') {
        note.textContent = 'No ' + LANG_NAME[lang] + ' voice is installed on this device, so the alert is shown as text only.';
        return;
      }
      note.textContent = DEFAULT_NOTE;
      synth.cancel();
      var u = new SpeechSynthesisUtterance(VOICE[lang][state]);
      u.lang = LANG_CODE[lang];
      if (voice) u.voice = voice;
      synth.speak(u);
    }

    function play(haptic) {
      clearTimers();
      var pat = PATTERNS[state].ms;
      var t = 0;
      pat.forEach(function (d, i) {
        if (i % 2 === 0) {
          timers.push(setTimeout(function () { watch.classList.add('is-buzz'); bars[i].classList.add('on'); }, t));
          timers.push(setTimeout(function () { watch.classList.remove('is-buzz'); bars[i].classList.remove('on'); }, t + d));
        }
        t += d;
      });
      if (haptic && navigator.vibrate) { try { navigator.vibrate(pat); } catch (e) { /* ignore */ } }
      speak();
    }

    function renderVoice() {
      voiceEl.textContent = VOICE[lang][state];
      voiceEl.setAttribute('lang', lang);
    }

    function setState(s) {
      state = s;
      stage.setAttribute('data-state', s);
      stateBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-state') === s)); });
      renderPattern();
      renderVoice();
    }

    function setLang(l) {
      lang = l;
      langBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
      renderVoice();
    }

    stateBtns.forEach(function (b) {
      b.addEventListener('click', function () { setState(b.getAttribute('data-state')); play(true); });
    });
    langBtns.forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); play(false); });
    });
    btnPlay.addEventListener('click', function () { play(true); });

    btnSpeak.addEventListener('click', function () {
      speakOn = !speakOn;
      btnSpeak.setAttribute('aria-pressed', String(speakOn));
      if (speakOn) { speak(); } else { if (synth) synth.cancel(); note.textContent = DEFAULT_NOTE; }
    });
    if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = function () { /* voices are looked up lazily */ };

    btnAuto.addEventListener('click', function () {
      var on = btnAuto.getAttribute('aria-pressed') !== 'true';
      btnAuto.setAttribute('aria-pressed', String(on));
      clearInterval(autoTimer);
      if (on) {
        autoTimer = setInterval(function () {
          if (!visible || document.hidden) return;
          setState(ORDER[(ORDER.indexOf(state) + 1) % ORDER.length]);
          play(false);
        }, 4200);
      }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(root);
    } else { visible = true; }

    setState('red');
  })();

  /* ---------- Copy citation ---------- */
  (function citation() {
    var btn = $('#copyCite');
    var label = $('#copyLabel');
    if (!btn) return;
    function flash(msg) {
      btn.classList.add('is-copied');
      label.textContent = msg;
      setTimeout(function () { btn.classList.remove('is-copied'); label.textContent = 'Copy citation'; }, 2000);
    }
    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      flash(ok ? 'Copied!' : 'Press Ctrl+C');
    }
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-cite');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { flash('Copied!'); }, function () { fallbackCopy(text); });
      } else { fallbackCopy(text); }
    });
  })();

  /* ---------- Contact form → opens the visitor's email app ---------- */
  (function contact() {
    var form = $('#contactForm');
    var note = $('#formNote');
    if (!form) return;
    var original = note.textContent;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        note.classList.add('is-error');
        note.textContent = 'Please fill in your name, a valid email and a message.';
        var bad = form.querySelector(':invalid');
        if (bad) bad.focus();
        return;
      }
      note.classList.remove('is-error');
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var msg = form.elements.message.value.trim();
      var subject = 'Portfolio message from ' + name;
      var body = msg + '\n\n— ' + name + ' (' + email + ')';
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      note.textContent = 'Opening your email app… if nothing happens, write to ' + EMAIL + ' directly.';
      setTimeout(function () { note.textContent = original; }, 8000);
    });
  })();

  /* ---------- Footer year ---------- */
  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
