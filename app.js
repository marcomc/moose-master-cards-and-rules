(() => {
  'use strict';
  const registered = window.MOOSE_LOCALES, cards = window.MOOSE_CARDS;
  // English is the fallback for incomplete translations, including new card fields.
  function merge(base, extra) {
    const result = { ...base };
    for (const [key, value] of Object.entries(extra)) {
      result[key] = value && typeof value === 'object' && !Array.isArray(value)
        ? merge(base[key] || {}, value) : value;
    }
    return result;
  }
  const locales = Object.fromEntries(Object.entries(registered).map(([code, text]) => [code, merge(registered.en, text)]));
  const language = document.querySelector('#language');
  const search = document.querySelector('#search'), type = document.querySelector('#type');
  let lang = 'en';
  try { lang = localStorage.getItem('moose-language') || navigator.language.slice(0, 2); } catch { /* Storage may be unavailable for local files. */ }
  if (!locales[lang]) lang = locales[lang.split('-')[0]] ? lang.split('-')[0] : 'en';
  language.replaceChildren();
  for (const [code, text] of Object.entries(registered)) {
    const option = document.createElement('option');
    option.value = code; option.textContent = text.nativeName || code;
    language.append(option);
  }
  const normalize = value => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function node(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function renderCards() {
    const t = locales[lang], query = normalize(search.value.trim());
    const container = document.querySelector('#cards');
    const fragment = document.createDocumentFragment();
    let count = 0;
    for (const card of cards) {
      const c = t.cards[card.id];
      const searchable = normalize([c.name, c.content, c.effect, c.graphic, ...(c.examples || []), t.types[card.type], locales.en.cards[card.id].name].join(' '));
      if ((type.value && type.value !== card.type) || !searchable.includes(query)) continue;
      count++;
      const article = node('article', '', 'card'); article.id = card.id;
      const picture = node('a', '', 'picture'); picture.href = card.image;
      picture.target = '_blank'; picture.rel = 'noopener'; picture.setAttribute('aria-label', `${t.zoom}: ${c.name}`);
      const img = node('img'); img.src = card.image; img.alt = c.name; img.loading = 'lazy';
      img.width = Number(card.id.slice(1)) <= 19 ? 630 : 880;
      img.height = Number(card.id.slice(1)) <= 19 ? 880 : 630;
      picture.append(img);
      const body = node('div', '', 'body'); body.append(node('span', t.types[card.type], 'tag'), node('h3', c.name));
      const dl = node('dl');
      for (const [label, value] of [[t.content, c.content], [t.effect, c.effect]]) dl.append(node('dt', label), node('dd', value));
      body.append(dl);
      if (c.examples) {
        body.append(node('h4', t.examples), node('p', t.customHelp, 'custom-help'));
        const ul = node('ul', '', 'examples'); c.examples.forEach(example => ul.append(node('li', example))); body.append(ul);
      }
      const details = node('details'); details.append(node('summary', t.graphic), node('p', c.graphic)); body.append(details);
      article.append(picture, body); fragment.append(article);
    }
    container.replaceChildren(fragment);
    document.querySelector('#count').textContent = t.count.replace('{n}', count);
    document.querySelector('#empty').hidden = count !== 0;
  }
  function renderLanguage() {
    const t = locales[lang], selectedType = type.value;
    document.documentElement.lang = lang; document.title = t.title; language.value = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n]; });
    search.placeholder = t.placeholder;
    const steps = document.querySelector('#steps'); steps.replaceChildren();
    t.steps.forEach(([title, text]) => { const li = node('li'); li.append(node('h3', title), node('p', text)); steps.append(li); });
    type.replaceChildren();
    for (const [value, label] of [['', t.all], ...Object.entries(t.types)]) { const option = node('option', label); option.value = value; type.append(option); }
    type.value = selectedType;
    renderCards();
  }
  language.addEventListener('change', () => { lang = language.value; try { localStorage.setItem('moose-language', lang); } catch { /* Optional preference. */ } renderLanguage(); });
  search.addEventListener('input', renderCards); type.addEventListener('change', renderCards);
  document.querySelector('#reset').addEventListener('click', () => { search.value = ''; type.value = ''; renderCards(); search.focus(); });
  renderLanguage();
})();
