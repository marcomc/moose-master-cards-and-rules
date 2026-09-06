# Changelog

Notable changes to Moose Master Cards and Rules are documented here.

## [Unreleased]

### Fixed

- Restored the other 37 card images at higher resolution with clearer text,
  sharper illustrations, and corrected colors, retaining their English content
  and existing catalog paths. Removed fingers from the "Um" card image.
- Reconstructed the "Write your own rule!" card image with AI to remove fingers
  and their shadows, preserving the heading, border colors, and hoofprint motif.
  Restored the partially obscured seventh hoofprint using the shared pattern
  on other cards as the position and size reference, matching the intensity
  of the other prints.

## [1.1.0] - 2026-09-06

### Added

- Optional GoatCounter integration for visits, estimated unique visits, referring
  websites, and visitor countries, with setup instructions in the README.
  Configured the owner's `marcomc.goatcounter.com` endpoint; counting starts
  when the updated site is published to the production domain.
- A single asynchronous counting request per page load on `moose.marcomc.com`,
  using GoatCounter's browser endpoint without third-party JavaScript.
  Language changes, searches, filters, and navigation anchors do not add visits.
  Local files and development or alternate hosts are excluded.
- Respect for Do Not Track and Global Privacy Control, origin-only referrals,
  and exclusion of URL query strings, fragments, and the Referer header from
  tracking requests. The analytics privacy link is translated into all 21 languages.
- Analytics regression checks for activation, disabled or invalid configuration,
  production host restrictions, privacy preferences, request contents, and
  duplicate initialization.
- A direct link to the public website in the README.
- Nineteen languages, bringing the guide to 21: Simplified Chinese, Hindi,
  Spanish, Modern Standard Arabic, French, Bengali, Portuguese, Indonesian,
  Urdu, Japanese, German, Danish, Swedish, Norwegian Bokmål, Finnish,
  Icelandic, Estonian, Latvian, and Lithuanian, alongside English and Italian.
- Complete translations of the interface, five gameplay steps, all 38 card
  entries, artwork descriptions, and five custom-rule examples in each language.
- Right-to-left layouts for Arabic and Urdu, with spacing suited to connected
  scripts and responsive handling of longer translated headings.
- Translated browser titles, page headings, metadata, navigation labels, and
  a visible version number linked to this changelog.
- Original English names alongside translated card names for matching the
  photographs, while keeping search available in either language.
- A translation note explaining the original English images and quoted
  forbidden words, and documentation of language selection and translation scope.
- Dependency-free checks for locale completeness, card coverage, script loading,
  image references, text direction, and version consistency.
- A contributor workflow using English as the translation template, with a
  standalone validator for checking a submitted locale before site integration.

### Changed

- Language selection now checks the browser's ordered language preferences,
  supports regional tags and the Norwegian `no` alias, and still detects the
  browser language when storage is unavailable or a saved choice is unsupported.
- Result counts use localized number formatting and wording valid for zero,
  one, or multiple cards. Search preserves meaningful non-Latin combining marks
  while supporting Latin searches without accents.
- Italian word-rule entries now explicitly retain the printed English forbidden
  words and provide their meanings, consistently with the added languages.
- Every language, including English and Italian, now has its own file under
  `locales/`, using the same format with explicit card IDs. `localization.js`
  only registers languages, and checks automatically discover locale files.
  The static site and English fallback for future incomplete additions remain.

### Fixed

- Translated the Italian names of the role, activity, action, and penalty cards
  that still used English headings. Aligned the custom-rule card name and
  gameplay references with the translated names. Original English names remain
  visible alongside translations and searchable; Bonus is shared by both languages.
- Added a regression check for untranslated Italian card names.

## [1.0.0] - 2026-09-06

Initial release of the unofficial Moose Master learning guide.

### Added

- Standalone static website that opens directly in a browser or runs on a
  static host, without a build step or external libraries.
- Illustrated catalog of 38 card designs across Master, Activity, Action,
  Penalty, and Moose Rules categories, including the blank rule card.
  Each entry includes its content, effect, artwork description, and a local
  image that can be opened separately.
- Gameplay introduction covering setup, turns, penalties, winning conditions,
  and deck composition, based mainly on the 2019 rules, with a note explaining
  the revised Moose Master effect in the 2021 rules.
- English and Italian interface, gameplay explanations, and card descriptions,
  with original card images in English. Language selection uses the browser
  language or a saved preference, with English fallback for missing translations.
- Live text search, card-type filtering, result counts, and a reset action
  when no cards match.
- Unofficial custom-rule examples for the blank Moose Rules card.
- Responsive layouts for desktop and mobile, print styles, keyboard focus
  indicators, and lazy-loaded card images.
- README with usage instructions, educational purpose, source attribution,
  direct links to the official 2019 and 2021 rulebook PDFs, copyright and
  non-affiliation disclaimers, responsibility for errors, and guidance for
  correction or removal requests.
