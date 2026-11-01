/* Funzioni condivise: normalizzazione dei nomi, chiamate al backend, modalità prova. */
(function () {
  'use strict';
  var CONFIG = window.CONFIG || {};
  var MODALITA_PROVA = !CONFIG.apiUrl || CONFIG.apiUrl === '#####';

  function normalizza(s) {
    s = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    s = s.replace(/['’`´\-]/g, ' ').replace(/[^a-z0-9 ]/g, ' ');
    return s.replace(/\s+/g, ' ').trim();
  }

  function esc(s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Tre invitati finti per provare il form prima che il backend sia collegato
  var PROFILI_PROVA = {
    'prova|faito': { nome: 'Prova', cognome: 'Faito', dove: 'tutteddue', cena: true, albergo: "Sant'Angelo", stanza: true, navetta: true, compagni: 'Marco Rossi, Sofia Rossi', risposte: {}, token: 'prova' },
    'prova|aperitivo': { nome: 'Prova', cognome: 'Aperitivo', dove: 'solo aperitivo', cena: false, albergo: 'Altrove', stanza: false, navetta: false, compagni: '', risposte: {}, token: 'prova' },
    'prova|altrove': { nome: 'Prova', cognome: 'Altrove', dove: 'faito', cena: true, albergo: 'Altrove', stanza: false, navetta: false, compagni: '', risposte: { email: 'prova@example.com', conferma: 'Sì' }, token: 'prova' },
    'prova|roma': { esitoForzato: 'roma', nome: 'Prova' }
  };

  function apiProva(azione, dati) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        if (azione === 'verifica') {
          var k = normalizza(dati.nome) + '|' + normalizza(dati.cognome);
          var p = PROFILI_PROVA[k] || PROFILI_PROVA[normalizza(dati.cognome) + '|' + normalizza(dati.nome)];
          if (!p) return resolve({ esito: 'non_trovato' });
          if (p.esitoForzato) return resolve({ esito: p.esitoForzato, nome: p.nome });
          var salvate = {};
          try { salvate = JSON.parse(sessionStorage.getItem('prova_risposte_' + k) || '{}'); } catch (e) {}
          var profilo = JSON.parse(JSON.stringify(p));
          Object.keys(salvate).forEach(function (c) { profilo.risposte[c] = salvate[c]; });
          return resolve({ esito: 'ok', profilo: profilo });
        }
        if (azione === 'salva') {
          var k2 = normalizza(dati.nome) + '|' + normalizza(dati.cognome);
          var r = dati.risposte || {};
          var piatte = { email: r.email, telefono: r.telefono, conferma: r.conferma, notti: Array.isArray(r.notti) ? r.notti.join(', ') : (r.notti || ''), navetta: r.navetta, allergie: r.allergie, messaggio: r.messaggio };
          try { sessionStorage.setItem('prova_risposte_' + k2, JSON.stringify(piatte)); } catch (e) {}
          return resolve({ esito: 'ok' });
        }
        resolve({ esito: 'azione_sconosciuta' });
      }, 500);
    });
  }

  function api(azione, dati) {
    if (MODALITA_PROVA) return apiProva(azione, dati);
    var corpo = JSON.stringify(Object.assign({ azione: azione }, dati || {}));
    // Content-Type text/plain evita il preflight CORS: Apps Script lo accetta e legge il JSON dal corpo
    return fetch(CONFIG.apiUrl, { method: 'POST', body: corpo, headers: { 'Content-Type': 'text/plain;charset=utf-8' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  function leggiProfilo() {
    try { return JSON.parse(sessionStorage.getItem('profilo') || 'null'); } catch (e) { return null; }
  }
  function salvaProfilo(p) {
    try { sessionStorage.setItem('profilo', JSON.stringify(p)); } catch (e) {}
  }

  window.Comune = { normalizza: normalizza, esc: esc, api: api, leggiProfilo: leggiProfilo, salvaProfilo: salvaProfilo, MODALITA_PROVA: MODALITA_PROVA, CONFIG: CONFIG };
})();
