const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'analytics.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const endpoint = 'https://moose-test.goatcounter.com/count';

function run(options = {}) {
  const requests = [];
  const notice = { hidden: true };
  const context = vm.createContext({
    URL,
    location: new URL(options.url || 'https://moose.marcomc.com/?search=private#catalog'),
    navigator: options.navigator || {},
    window: options.window || {},
    document: {
      referrer: options.referrer || '',
      querySelector: () => ({ content: options.endpoint ?? endpoint }),
      getElementById: id => id === 'analytics-privacy' ? notice : requests.find(pixel => pixel.id === id),
      createElement: () => ({
        attributes: {},
        setAttribute(name, value) { this.attributes[name] = value; }
      }),
      body: { append: pixel => requests.push(pixel) }
    }
  });
  vm.runInContext(source, context);
  return { requests, notice, context };
}

test('analytics is wired after the application and has a valid optional public endpoint', () => {
  assert.ok(html.indexOf('src="analytics.js"') > html.indexOf('src="app.js"'));
  const configured = html.match(/name="goatcounter-endpoint" content="([^"]*)"/)[1];
  assert.ok(configured === '' || /^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(configured));
  assert.match(html, /id="analytics-privacy" hidden/);
  assert.match(html, /href="https:\/\/www.goatcounter.com\/help\/privacy" data-i18n="analyticsPrivacy"/);
});

test('disabled or malformed endpoints never send a tracking request', () => {
  for (const value of ['', 'YOUR-SITE', 'http://test.goatcounter.com/count',
    'https://test.goatcounter.com.evil.example/count', 'https://test.goatcounter.com/count?secret=1']) {
    const { requests, notice } = run({ endpoint: value });
    assert.equal(requests.length, 0, value);
    assert.equal(notice.hidden, true);
  }
});

test('local files, development servers and alternate hosts cannot affect production statistics', () => {
  for (const url of ['file:///tmp/index.html', 'http://localhost:8765/',
    'http://127.0.0.1:8765/', 'https://marcomc.github.io/moose-master-cards-and-rules/',
    'http://moose.marcomc.com/', 'https://moose.marcomc.com.evil.example/',
    'https://moose.marcomc.com:8765/']) {
    assert.equal(run({ url }).requests.length, 0, url);
  }
});

test('Do Not Track and Global Privacy Control prevent all tracking requests', () => {
  for (const options of [{ navigator: { doNotTrack: '1' } },
    { window: { doNotTrack: '1' } }, { navigator: { globalPrivacyControl: true } }]) {
    const { requests, notice } = run(options);
    assert.equal(requests.length, 0);
    assert.equal(notice.hidden, true);
  }
  assert.equal(run({ navigator: { doNotTrack: '0', globalPrivacyControl: false } }).requests.length, 1);
});

test('production sends only the documented fields and never sends a query or fragment', () => {
  const result = run({ referrer: 'https://search.example/private/path?q=secret#private' });
  const pixel = result.requests[0];
  const url = new URL(pixel.src);
  assert.equal(url.origin + url.pathname, endpoint);
  assert.deepEqual([...url.searchParams.keys()].sort(), ['b', 'p', 'r', 'rnd', 't']);
  assert.equal(url.searchParams.get('p'), '/');
  assert.equal(url.searchParams.get('t'), 'Moose Master Cards and Rules');
  assert.equal(url.searchParams.get('r'), 'https://search.example');
  assert.equal(url.searchParams.get('b'), '0');
  assert.ok(url.searchParams.get('rnd'));
  assert.equal(pixel.referrerPolicy, 'no-referrer');
  assert.equal(pixel.hidden, true);
  assert.equal(pixel.loading, 'eager');
  assert.equal(pixel.alt, '');
  assert.equal(result.notice.hidden, false);
  vm.runInContext(source, result.context);
  assert.equal(result.requests.length, 1, 'Repeated initialization must not count twice');
  const bot = run({ navigator: { webdriver: true } });
  assert.equal(new URL(bot.requests[0].src).searchParams.get('b'), '153');
});

test('direct, invalid and same-site referrals do not invent an external source', () => {
  for (const referrer of ['', 'not a URL', 'file:///private/page.html',
    'https://moose.marcomc.com/?private=1#rules']) {
    const { requests } = run({ referrer });
    assert.equal(new URL(requests[0].src).searchParams.get('r'), '', referrer);
  }
});
