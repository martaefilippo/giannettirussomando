/* Costruisce la landing page leggendo contenuti.json. Una funzione per ogni tipo di sezione. */
(function () {
  'use strict';
  var app = document.getElementById('app');
  if (!app) return;

  function h(s) {
    // testo sicuro; "#####" diventa un segnaposto evidenziato
    var e = String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
    return e.replace(/#####/g, '<span class="seg">#####</span>');
  }
  function attr(s) { return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mappa(q) { return q === '#####' ? '#' : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }
  function stileTitolo(s) { return s.font_titolo ? ' style="font-family:\'' + attr(s.font_titolo) + '\', sans-serif"' : ''; }
  function foto(s) {
    var cls = 'foto' + (s.foto_orientamento === 'verticale' ? ' verticale' : '');
    if (!s.foto || s.foto === '#####') return '<div class="' + cls + '">foto da inserire</div>';
    return '<div class="' + cls + '"><img src="' + attr(s.foto) + '" alt="' + attr(s.foto_alt) + '" onerror="this.parentNode.textContent=\'foto da inserire\'"></div>';
  }
  function bandaApri(s, cfg) {
    var cls = 'banda ' + (s.sfondo === 'foto' ? 'foto' : (s.sfondo || 'crema'));
    var st = s.sfondo === 'foto' && s.foto_sfondo ? ' style="background-image:url(\'' + attr(s.foto_sfondo) + '\')"' : '';
    return '<section id="' + attr(s.id) + '" class="' + cls + ' sez-' + attr(s.tipo) + '"' + st + '>';
  }

  var tipi = {};

  tipi.intro = function (s, cfg) {
    var ev = cfg.evento;
    // foto a sinistra a tutta altezza, testo a destra; su telefono la foto va sopra
    return '<div class="intro-griglia">' + foto(s) +
      '<div class="intro-testo">' +
      '<h1 class="nomi"' + stileTitolo(s) + '>' + h(ev.sposa) + ' <span class="e">e</span> ' + h(ev.sposo) + '</h1>' +
      '<p class="invito-frase">' + h(s.frase) + '</p>' +
      '<p class="info-riga">' + h(ev.data_estesa) + '</p>' +
      '<p class="intro-luogo">' + h(ev.luogo_breve) + '</p>' +
      (s.testo && s.testo !== '#####' ? '<p class="lead">' + h(s.testo) + '</p>' : '') +
      (s.countdown ? '<div class="countdown" id="countdown"><div><b data-u="g">—</b><small>giorni</small></div><div><b data-u="h">—</b><small>ore</small></div><div><b data-u="m">—</b><small>minuti</small></div><div><b data-u="s">—</b><small>secondi</small></div></div>' : '') +
      '</div></div>';
  };

  tipi.location = function (s) {
    // foto nel suo formato originale, a tutta larghezza; scritta bianca sopra; pulsante nella foto (PC) o sotto (telefono)
    var btn = '<a class="btn giallo" href="' + attr(s.mappa_url || '#') + '" target="_blank" rel="noopener">' + h(s.pulsante || 'Apri in Google Maps') + '</a>';
    return '<div class="loc-foto"><img src="' + attr(s.foto) + '" alt="' + attr(s.foto_alt) + '">' +
      '<div class="loc-testo">' + (s.titolo ? '<h2' + stileTitolo(s) + '>' + h(s.titolo) + '</h2>' : '') +
      (s.sottotitolo ? '<p>' + h(s.sottotitolo) + '</p>' : '') +
      '<div class="loc-btn-pc">' + btn + '</div></div></div>' +
      '<div class="loc-btn-tel">' + btn + '</div>';
  };

  tipi.programma = function (s) {
    return '<div class="wrap stretto"><h2 class="titolo"' + stileTitolo(s) + '>' + h(s.titolo) + '</h2>' +
      '<ol class="timeline">' + (s.voci || []).map(function (v) {
        return '<li><time>' + h(v.ora) + '</time><div><b>' + h(v.titolo) + '</b>' + (v.testo ? '<p>' + h(v.testo) + '</p>' : '') + '</div></li>';
      }).join('') + '</ol>' +
      (s.consigli && s.consigli.length ? '<div class="consigli"><h3>' + h(s.consigli_titolo || 'Consigli') + '</h3><ul>' + s.consigli.map(function (c) { return '<li>' + h(c) + '</li>'; }).join('') + '</ul></div>' : '') +
      '</div>';
  };

  tipi.rsvp = function (s) {
    return '<div class="wrap stretto centro"><h2 class="titolo"' + stileTitolo(s) + '>' + h(s.titolo) + '</h2>' +
      '<p class="lead">' + h(s.testo) + '</p>' +
      (s.scadenza ? '<p class="info-riga">entro il ' + h(s.scadenza) + '</p>' : '') +
      '<div class="pulsanti"><a class="btn giallo" href="' + attr(s.link || 'accedi.html') + '">' + h(s.pulsante || 'Conferma') + '</a></div>' +
      (s.prenotazioni_testo ? '<h3 style="margin-top:1rem">' + h(s.prenotazioni_titolo) + '</h3><p class="lead tenue">' + h(s.prenotazioni_testo) + '</p>' : '') +
      '</div>';
  };

  tipi.weekend = function (s) {
    return '<div class="wrap"><h2 class="titolo"' + stileTitolo(s) + '>' + h(s.titolo) + '</h2>' +
      (s.testo ? '<p class="lead centro">' + h(s.testo) + '</p>' : '') +
      '<div class="giorni">' + (s.giorni || []).map(function (g) {
        return '<div class="giorno"><h3>' + h(g.giorno) + '</h3><ul>' + (g.voci || []).map(function (v) { return '<li>' + h(v) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div></div>';
  };

  tipi.regalo = function (s) {
    return '<div class="wrap stretto centro"><h2 class="titolo"' + stileTitolo(s) + '>' + h(s.titolo) + '</h2>' +
      '<p class="lead">' + h(s.testo) + '</p>' +
      '<div class="iban"><p><b>Intestatario</b> ' + h(s.intestatario) + '</p><p><b>IBAN</b> <code id="iban">' + h(s.iban) + '</code></p>' +
      '<button class="btn vuoto" type="button" id="copiaIban">Copia IBAN</button></div>' +
      '<div class="pulsanti">' + (s.link || []).map(function (l) {
        return '<a class="btn" href="' + attr(l.url === '#####' ? '#' : l.url) + '" target="_blank" rel="noopener">' + h(l.etichetta) + '</a>';
      }).join('') + '</div></div>';
  };

  tipi.saluto = function (s) {
    return '<div class="wrap stretto centro">' + foto(s) +
      '<h2 class="titolo"' + stileTitolo(s) + '>' + h(s.titolo) + '</h2><p class="lead">' + h(s.testo) + '</p></div>';
  };

  function header(cfg) {
    var ev = cfg.evento;
    if (!ev.menu) return '';
    var voci = cfg.sezioni.filter(function (s) { return s.menu; });
    return '<header class="topbar"><a class="marchio" href="#invito">' + h(ev.sposa) + ' <span>e</span> ' + h(ev.sposo) + '</a>' +
      '<button class="menu-toggle" id="menuToggle" aria-expanded="false">Menu</button>' +
      '<nav class="nav" id="nav">' + voci.map(function (s) { return '<a href="#' + attr(s.id) + '">' + h(s.menu) + '</a>'; }).join('') + '</nav></header>';
  }
  function piede(cfg) {
    return '<footer class="piede"><p class="nomi">' + h(cfg.evento.sposa) + ' <span class="e">e</span> ' + h(cfg.evento.sposo) + '</p><p>' + h(cfg.piede && cfg.piede.testo) + '</p></footer>';
  }

  function moduli(cfg) {
    var t = document.getElementById('menuToggle'), n = document.getElementById('nav');
    if (t && n) {
      t.addEventListener('click', function () { var o = n.classList.toggle('aperto'); t.setAttribute('aria-expanded', o ? 'true' : 'false'); });
      n.addEventListener('click', function (e) { if (e.target.tagName === 'A') { n.classList.remove('aperto'); t.setAttribute('aria-expanded', 'false'); } });
    }
    var cd = document.getElementById('countdown');
    if (cd) {
      var target = new Date(cfg.evento.data + 'T' + (cfg.evento.ora || '12:00') + ':00+02:00').getTime();
      var pad = function (x) { return x < 10 ? '0' + x : String(x); };
      var tick = function () {
        var d = target - Date.now();
        if (d <= 0) { cd.innerHTML = '<p class="lead">Oggi è il grande giorno!</p>'; return; }
        var s = Math.floor(d / 1000), g = Math.floor(s / 86400); s -= g * 86400;
        var hh = Math.floor(s / 3600); s -= hh * 3600; var m = Math.floor(s / 60); s -= m * 60;
        cd.querySelector('[data-u="g"]').textContent = g; cd.querySelector('[data-u="h"]').textContent = pad(hh);
        cd.querySelector('[data-u="m"]').textContent = pad(m); cd.querySelector('[data-u="s"]').textContent = pad(s);
      };
      tick(); setInterval(tick, 1000);
    }
    var cb = document.getElementById('copiaIban'), ib = document.getElementById('iban');
    if (cb && ib) cb.addEventListener('click', function () {
      var t2 = ib.textContent.replace(/\s+/g, '');
      var ok = function () { cb.textContent = 'Copiato'; setTimeout(function () { cb.textContent = 'Copia IBAN'; }, 2000); };
      var fb = function () { var r = document.createRange(); r.selectNodeContents(ib); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t2).then(ok).catch(fb); else fb();
    });
  }

  fetch('contenuti.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (cfg) {
    app.innerHTML = header(cfg) + '<main>' + cfg.sezioni.map(function (s) {
      var fn = tipi[s.tipo]; if (!fn) return '';
      return bandaApri(s, cfg) + fn(s, cfg) + '</section>';
    }).join('') + '</main>' + piede(cfg);
    moduli(cfg);
  }).catch(function (e) {
    app.innerHTML = '<p class="avviso errore" style="margin:2rem">Non riesco a leggere contenuti.json: ' + attr(e.message) + '</p>';
  });
})();
