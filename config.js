/* Configurazione del sito. Unico file da toccare quando il backend è pronto. */
window.CONFIG = {
  // URL dell'app web di Apps Script (finisce con /exec). Finché resta "#####" il sito gira in modalità prova
  // con tre invitati finti: "Prova Faito", "Prova Aperitivo", "Prova Altrove".
  apiUrl: 'https://script.google.com/macros/s/AKfycbxXyGO5pxIxrZGwtr_HbHz-mmmSQh5iybdC8_COhwzj3vxjaHWfz0PBXf_3NEb4bgBj/exec',

  // Contatto mostrato a chi non viene riconosciuto
  contattoAiuto: '',

  // Notti selezionabili nel form
  notti: ['venerdì 9 luglio', 'sabato 10 luglio']
};
