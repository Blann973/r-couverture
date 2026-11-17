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
    var els = document.querySelectorAll('section h2,.grille4 article,.depts>div,.horaires,.liste-conseils li,#devis form,.histoire .texte p');
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

  /* Lien du menu souligné selon la section affichée */
  var liens = document.querySelectorAll('nav a[href^="#"]:not(.cta)');
  function suivi() {
    var y = scrollY + 140, best = null, pos = -1;
    liens.forEach(function (a) {
      var c = document.querySelector(a.getAttribute('href'));
      var t = c ? c.offsetTop : 0;
      if (t <= y && t >= pos) { pos = t; best = a; }
    });
    liens.forEach(function (a) { a.classList.toggle('actif', a === best); });
  }
  addEventListener('scroll', suivi, { passive: true }); suivi();
})();