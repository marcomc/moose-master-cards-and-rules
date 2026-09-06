const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const registry = fs.readFileSync(path.join(root, 'localization.js'), 'utf8');

function readLocale(file) {
  const code = path.basename(file, '.js');
  assert.match(code, /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/, 'Use a lowercase language tag as the filename');
  const context = vm.createContext({ window: {} });
  vm.runInContext(registry, context, { filename: 'localization.js', timeout: 1000 });
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 1000 });
  assert.deepEqual(Object.keys(context.window.MOOSE_LOCALES), [code],
    `${file}: register exactly one language matching the filename`);
  return JSON.parse(JSON.stringify(context.window.MOOSE_LOCALES[code]));
}

function checkShape(reference, actual, location) {
  if (typeof reference === 'string') {
    assert.equal(typeof actual, 'string', location);
    assert.ok(actual.trim(), `${location}: empty translation`);
    assert.ok(!/\ufffd|\b(?:TODO|TRANSLATE|undefined)\b/.test(actual), `${location}: unfinished text`);
    assert.deepEqual(actual.match(/\{\w+\}/g) || [], reference.match(/\{\w+\}/g) || [], `${location}: placeholders`);
  } else if (Array.isArray(reference)) {
    assert.ok(Array.isArray(actual), location);
    assert.equal(actual.length, reference.length, `${location}: item count`);
    reference.forEach((value, index) => checkShape(value, actual[index], `${location}[${index}]`));
  } else {
    assert.ok(actual && typeof actual === 'object', location);
    assert.deepEqual(Object.keys(actual).sort(), Object.keys(reference).sort(), `${location}: keys`);
    for (const key of Object.keys(reference)) checkShape(reference[key], actual[key], `${location}.${key}`);
  }
}

function validateLocale(code, locale, english) {
  checkShape(english, locale, code);
  assert.ok(['ltr', 'rtl'].includes(locale.dir), `${code}: dir must be ltr or rtl`);
  for (const [id, word] of Object.entries({ C20: 'No', C33: 'Like', C34: 'Um', C35: 'Yes', C37: 'Turn' })) {
    assert.ok(locale.cards[id].name.includes(word), `${code}.${id}: printed word missing from name`);
    assert.ok(locale.cards[id].content.includes(word), `${code}.${id}: printed word missing from content`);
  }
  // Regional English variants legitimately share wording with the base locale.
  if (code !== 'en' && !code.startsWith('en-')) {
    for (const [id, card] of Object.entries(locale.cards)) {
      for (const field of ['content', 'effect', 'graphic']) {
        assert.notEqual(card[field], english.cards[id][field], `${code}.${id}.${field}: untranslated`);
      }
    }
  }
}

module.exports = { readLocale, validateLocale };

if (require.main === module) {
  const files = process.argv.length > 2
    ? process.argv.slice(2).map(file => path.resolve(file))
    : fs.readdirSync(path.join(root, 'locales')).filter(file => file.endsWith('.js'))
      .map(file => path.join(root, 'locales', file));
  const english = readLocale(path.join(root, 'locales/en.js'));
  for (const file of files) {
    try {
      validateLocale(path.basename(file, '.js'), readLocale(file), english);
      console.log(`PASS ${path.basename(file)}`);
    } catch (error) {
      console.error(`FAIL ${path.basename(file)}: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
