(() => {
  'use strict';
  // Configure the public /count URL in index.html; an empty value disables analytics.
  const endpoint = document.querySelector('meta[name="goatcounter-endpoint"]')?.content || '';
  if (!/^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.goatcounter\.com\/count$/.test(endpoint)) return;
  if (location.protocol !== 'https:' || location.host !== 'moose.marcomc.com') return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  if (document.getElementById('goatcounter-pixel')) return;

  // Keep only the referring origin, never its path, query parameters, or fragment.
  let referrer = '';
  try {
    const source = new URL(document.referrer);
    if (['http:', 'https:'].includes(source.protocol) && source.origin !== location.origin) {
      referrer = source.origin;
    }
  } catch { /* Direct visits have no referrer. */ }

  // Stable browser endpoint: https://www.goatcounter.com/help/pixel
  // Explicit parameters avoid count.js's automatic collection of location.search.
  const url = new URL(endpoint);
  url.searchParams.set('p', '/');
  url.searchParams.set('t', 'Moose Master Cards and Rules');
  url.searchParams.set('r', referrer);
  url.searchParams.set('b', navigator.webdriver ? '153' : '0');
  url.searchParams.set('rnd', Math.random().toString(36).slice(2));
  const pixel = document.createElement('img');
  pixel.id = 'goatcounter-pixel';
  pixel.alt = '';
  pixel.width = 1;
  pixel.height = 1;
  pixel.hidden = true;
  pixel.loading = 'eager';
  pixel.referrerPolicy = 'no-referrer';
  pixel.src = url.href;
  document.body.append(pixel);
  document.getElementById('analytics-privacy').hidden = false;
})();
