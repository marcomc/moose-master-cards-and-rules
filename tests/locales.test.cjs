const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const { readLocale, validateLocale } = require('../scripts/validate-locales.cjs');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const shippedCodes = ['en', 'it', 'zh', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'id', 'ur',
  'ja', 'de', 'da', 'sv', 'nb', 'fi', 'is', 'et', 'lv', 'lt'];
const files = fs.readdirSync(path.join(root, 'locales')).filter(file => file.endsWith('.js'));
const expectedCodes = files.map(file => path.basename(file, '.js'));
const scripts = [...html.matchAll(/<script defer src="([^"]+)"><\/script>/g)].map(match => match[1].split("?")[0]);
const context = vm.createContext({ window: {} });
for (const script of scripts.filter(script => !['app.js', 'analytics.js'].includes(script))) {
  vm.runInContext(fs.readFileSync(path.join(root, script), 'utf8'), context, { filename: script });
}
// Bring VM objects into the test realm for structural comparisons.
const locales = JSON.parse(JSON.stringify(context.window.MOOSE_LOCALES));
const cards = JSON.parse(JSON.stringify(context.window.MOOSE_CARDS));

test('all locale files load in the standalone page before the application', () => {
  assert.deepEqual(Object.keys(locales).sort(), [...expectedCodes].sort());
  for (const code of shippedCodes) assert.ok(locales[code], `Previously supported language removed: ${code}`);
  assert.ok(scripts.indexOf('app.js') > scripts.indexOf('cards.js'));
  assert.ok(scripts.filter(script => script.startsWith('locales/')).every(script => scripts.indexOf(script) < scripts.indexOf('app.js')));
  assert.equal(scripts[0], 'localization.js');
  assert.equal(new Set(scripts).size, scripts.length);
  assert.deepEqual(scripts.filter(file => file.startsWith('locales/')).sort(), files.map(file => `locales/${file}`).sort());
});

test('the registry contains no translations and each file registers only its own language', () => {
  const isolated = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(root, 'localization.js'), 'utf8'), isolated);
  assert.deepEqual(Object.keys(isolated.window.MOOSE_LOCALES), []);
  for (const code of expectedCodes) {
    assert.deepEqual(readLocale(path.join(root, `locales/${code}.js`)), locales[code], code);
  }
});

for (const code of expectedCodes) {
  test(`${code}: complete interface, rules and 38 cards without English fallback`, () => {
    const locale = locales[code];
    validateLocale(code, locale, locales.en);
    if (shippedCodes.includes(code)) assert.equal(locale.dir, ['ar', 'ur'].includes(code) ? 'rtl' : 'ltr');
    assert.equal(locale.steps.length, 5);
    assert.deepEqual(Object.keys(locale.cards).sort(), cards.map(card => card.id).sort());
    assert.equal(locale.cards.C38.examples.length, 5);
  });
}

test('Italian card names are translated, with only the shared word Bonus unchanged', () => {
  for (const card of cards) {
    if (card.id === 'C18') continue; // Bonus is also an Italian word.
    assert.notEqual(locales.it.cards[card.id].name, locales.en.cards[card.id].name,
      `Untranslated Italian card name: ${card.id}`);
  }
});

test('contributors can validate a standalone file before adding it to the site', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'moose-locale-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'xx.js');
  const candidate = structuredClone(locales.it);
  const write = code => fs.writeFileSync(file, `window.MOOSE_ADD_LOCALE(${JSON.stringify(code)}, ${JSON.stringify(candidate)});`);
  const run = () => spawnSync(process.execPath, [path.join(root, 'scripts/validate-locales.cjs'), file], { encoding: 'utf8' });
  write('xx');
  let result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PASS xx.js/);
  write('yy');
  result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /matching the filename/);
  delete candidate.cards.C01;
  write('xx');
  result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /xx.cards: keys/);
});

test('validation rejects incomplete text, missing placeholders and invalid direction', () => {
  for (const [mutate, error] of [
    [locale => { locale.cards.C38.examples.pop(); }, /item count/],
    [locale => { locale.count = 'Cards'; }, /placeholders/],
    [locale => { locale.navCards = ''; }, /empty translation/],
    [locale => { locale.dir = 'auto'; }, /dir must be/]
  ]) {
    const candidate = structuredClone(locales.it);
    mutate(candidate);
    assert.throws(() => validateLocale('xx', candidate, locales.en), error);
  }
});

test('duplicate registrations cannot silently replace another language', () => {
  const isolated = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(root, 'localization.js'), 'utf8'), isolated);
  isolated.window.MOOSE_ADD_LOCALE('en', locales.en);
  assert.throws(() => isolated.window.MOOSE_ADD_LOCALE('en', locales.it), /already registered/);
  assert.equal(isolated.window.MOOSE_LOCALES.en, locales.en);
});

test('localized markup and underlying images resolve', () => {
  assert.equal(cards.length, 38);
  assert.equal(new Set(cards.map(card => card.id)).size, 38);
  for (const key of [...html.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1])) {
    assert.equal(typeof locales.en[key], 'string', `Unknown markup key: ${key}`);
  }
  for (const card of cards) {
    for (const image of [card.image, card.thumbnail]) {
      assert.equal(typeof image, "string");
      assert.ok(image.endsWith(".webp"));
      assert.ok(fs.existsSync(path.join(root, image)), `Missing image: ${image}`);
    }
    assert.ok(locales.en.types[card.type], `Unknown type: ${card.type}`);
  }
});

test('release version matches the visible site, README and newest changelog release', () => {
  const version = html.match(/name="application-version" content="([^"]+)"/)[1];
  assert.equal(version, '1.1.0');
  assert.ok(html.includes(`<bdi>v${version}</bdi>`));
  assert.ok(fs.readFileSync(path.join(root, 'README.md'), 'utf8').includes(`**${version}**`));
  const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
  assert.equal(changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m)[1], version);
});
