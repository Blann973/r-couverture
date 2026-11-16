(function () {
  var calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var haut = document.querySelector('header');
  var io = 'IntersectionObserver' in window;

  /* En-tête : ombre et logo plus petit quand on descend */
  function defile() {
    if (scrollY > 40) haut.classList.add('reduit');
    else if (scrollY < 10) haut.classList.remove('reduit');
  }
  addEventListener('scroll', defile, { passive: true }); defile();

  /* Apparition des blocs au défilement */
  if (io && !calme) {
    var els = document.querySelectorAll('section h2,.grille4 article,.points>div,#devis form,.chiffres .wrap>div');
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (e, i) {
      e.classList.add('reveal');
      e.style.transitionDelay = (i % 4) * 80 + 'ms';
      obs.observe(e);
    });
  }

  /* Chiffres qui comptent */
  document.querySelectorAll('[data-count]').forEach(function (n) {
    if (!io || calme) return;
    var fin = +n.dataset.count, suf = n.dataset.suffix || '';
    n.textContent = '0' + suf;
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now();
      (function p(t) {
        var k = Math.min((t - t0) / 1200, 1);
        n.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(p);
      })(t0);
    });
    o.observe(n);
  });

  /* Lien du menu souligné selon la section affichée */
  var liens = document.querySelectorAll('nav a[href^="#"]:not(.cta)');
  function suivi() {
    var y = scrollY + 140, cur = '#haut';
    ['services', 'apropos', 'devis'].forEach(function (id) {
      var s = document.getElementById(id);
      if (s && s.offsetTop <= y) cur = '#' + id;
    });
    liens.forEach(function (a) { a.classList.toggle('actif', a.getAttribute('href') === cur); });
  }
  addEventListener('scroll', suivi, { passive: true }); suivi();
})();