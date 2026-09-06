// Language data belongs in locales/<language-code>.js.
window.MOOSE_LOCALES = Object.create(null);
window.MOOSE_ADD_LOCALE = (code, text) => {
  if (Object.hasOwn(window.MOOSE_LOCALES, code)) {
    throw new Error(`Locale already registered: ${code}`);
  }
  window.MOOSE_LOCALES[code] = text;
};
