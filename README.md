# Moose Master Cards and Rules

An unofficial, independent learning guide to **Moose Master**, with illustrated
cards, explanations, and an interface in 21 languages. This project is shared
for educational and informational purposes, to help people learn the game.

Visit the website: [moose.marcomc.com](https://moose.marcomc.com/).

Current version: **1.1.0**. See the [changelog](CHANGELOG.md) for release history.

## Contents

- [Using the guide](#using-the-guide)
- [Languages and translations](#languages-and-translations)
- [Contributing a translation](#contributing-a-translation)
- [Visitor statistics](#visitor-statistics)
- [Validation](#validation)
- [Sources and original rulebooks](#sources-and-original-rulebooks)
- [Copyright and non-affiliation disclaimer](#copyright-and-non-affiliation-disclaimer)
- [Accuracy and responsibility](#accuracy-and-responsibility)
- [Corrections and rights-holder requests](#corrections-and-rights-holder-requests)
- [Disclaimer references](#disclaimer-references)

## Using the guide

Open [index.html](index.html) in a browser with JavaScript enabled. Select a
language, read the gameplay guide, and search or filter the illustrated cards.
No installation or build step is required. The folder can also be served by a
static web host, preserving the relative paths to scripts, styles, and images.

The guide accompanies the original game and its instructions. For authoritative
rules, consult the rulebook supplied with your copy and the official sources below.

## Languages and translations

| Group | Languages |
| --- | --- |
| Ten most spoken languages | English, Mandarin Chinese (Simplified), Hindi, Spanish, Modern Standard Arabic, French, Bengali, Portuguese, Indonesian, Urdu |
| Existing language | Italian |
| Additional languages | Japanese, German |
| Nordic languages | Danish, Swedish, Norwegian Bokmål, Finnish, Icelandic |
| Baltic languages | Estonian, Latvian, Lithuanian |

The first group uses total speakers (first and second language), based on the
[2026 Ethnologue ranking reproduced on Wikipedia](https://en.wikipedia.org/wiki/List_of_languages_by_total_number_of_speakers#Ethnologue_(2026)),
consulted on 2026-09-06. The
[original Ethnologue ranking](https://www.ethnologue.com/insights/ethnologue200/)
was not directly accessible. This is a documented selection for this release,
not a ranking that updates automatically. The Nordic and Baltic selection
covers the languages listed above, not every regional or minority language.

All 21 languages include navigation, page titles, search and filters, gameplay
instructions, all 38 card descriptions and effects, artwork descriptions, and
the five custom-rule examples. Arabic and Urdu use right-to-left layouts.
Chinese uses Simplified characters; Portuguese uses Brazilian wording;
Norwegian uses Bokmål. These are independent, generated translations and have
not received native-speaker review for every language.

The original photographs stay in English. Translated card names appear alongside
their English names, and both names can be searched. Quoted forbidden words
(`No`, `Like`, `Um`, `Yes`, `Turn`) retain the printed English words, with
translated explanations. Agree on equivalent words before playing in another
language; the guide does not silently change the rules on the physical cards.

The saved language takes priority over the browser's preferred languages.
Regional tags resolve to an available language (for example, `pt-BR` to `pt`),
and `no` resolves to Norwegian Bokmål (`nb`). An unsupported preference falls
through to the next supported browser language, then English. Language selection
still works if browser storage is blocked, but the choice cannot be saved.

## Contributing a translation

Every language has one self-contained file in `locales/<language-code>.js`,
including [English](locales/en.js) and [Italian](locales/it.js). All files use
the same format. `localization.js` only registers languages; it contains no
translations. The site loads these files before `app.js`, without a build step
or external translation service, and also works directly from `index.html`.

To contribute a language:

1. Copy `locales/en.js` to `locales/<language-code>.js`. Use a lowercase language
   tag, such as `nl` or `pt-pt`, for both the filename and the first argument of
   `window.MOOSE_ADD_LOCALE`.
2. Set `nativeName` to the language's own name and `dir` to `ltr` or `rtl`.
   Translate the interface, five gameplay steps, and each card's `name`,
   `content`, `effect`, and `graphic`, including the five examples in C38.
3. Preserve property names, category keys, card IDs C01–C38, the `{n}` placeholder,
   game mechanics, and quoted English forbidden words. Each file contains a
   `cards` object keyed by card ID; no positional mapping or shared translation
   file needs editing. Game names and original card references can remain English.
4. Validate your file from the project directory (replace `nl.js` with its name):

   ```sh
   node scripts/validate-locales.cjs locales/nl.js
   ```

5. Submit the locale file in a pull request. Include the language and regional
   variant, whether a native speaker reviewed it, and any wording uncertainties.
   The standalone validation command works before the file is added to the page.

To integrate and preview a contributed language, add its script after
`localization.js` and before `app.js` in `index.html`, for example:

```html
<script defer src="locales/nl.js"></script>
```

Then update the language table and changelog and run the tests below. Validation
discovers locale files automatically; adding a language requires no changes to
the validator or a hard-coded test list. Check the rendered page, including
search, card effects, and text direction. Runtime English fallback remains
available for future incomplete additions, but contribution checks require
complete translations.

## Visitor statistics

The site includes an optional [GoatCounter](https://www.goatcounter.com/)
integration. Its hosted service is free for reasonable public usage, including
personal sites. It reports visits, referring websites, and approximate visitor
countries without analytics cookies.

The endpoint in `index.html` is configured as
`https://marcomc.goatcounter.com/count`. Statistics are available in the owner's
[GoatCounter dashboard](https://marcomc.goatcounter.com/). Counting starts when
this configuration is published to the production domain.

To configure another counter or reuse the integration:

1. [Create a GoatCounter account](https://www.goatcounter.com/signup) for
   `moose.marcomc.com`, or add the site to your existing account.
2. Copy the public endpoint from its installation instructions into
   `index.html`:

   ```html
   <meta name="goatcounter-endpoint" content="https://YOUR-SITE.goatcounter.com/count">
   ```

   Use your actual site code. This endpoint is public; no password or API key
   belongs in the repository.
3. Keep **Settings → Data collection → Sessions** and location collection
   enabled. Keep individual pageview storage disabled for aggregate reporting.
4. Publish the updated site. Open the production domain once, then check your
   GoatCounter dashboard for the visit, normally visible within about 10 seconds.
   Browser tracking protection or an ad blocker may prevent it from appearing.
   Exclude your own IP in **Settings → Tracking → Ignore IPs** when administering
   the site. The standard script's `#toggle-goatcounter` shortcut is not used.

Tracking only runs on `https://moose.marcomc.com`. Local files, development
servers, and alternate hosts do not load the tracker. Do Not Track and Global
Privacy Control also disable it. Set the endpoint back to an empty string to
disable tracking for everyone.

The integration sends one page-load signal through GoatCounter's documented
[browser counting endpoint](https://www.goatcounter.com/help/pixel), without
loading a third-party JavaScript file. Language changes, card filters,
search terms, and navigation anchors do not create extra signals. All visits
use the same page path and title; query strings and fragments are excluded.
Referrals include only the originating website's origin, without its path or
query string. Missing referrals appear as direct/unknown traffic.
An enabled tracker displays a translated footer link to
[GoatCounter's privacy policy](https://www.goatcounter.com/help/privacy).

**Unique visits are estimates, not an exact count of people.**
[GoatCounter sessions](https://www.goatcounter.com/help/sessions) deduplicate
repeat visits to the same page for up to eight hours, using the site, IP address,
and browser User-Agent in memory. Different devices or networks can count
separately; shared networks can merge visitors. A return after eight hours can
count again. Country estimates can reflect a VPN's location, and blocked
tracking is not counted. Statistics start when tracking is activated; previous
GitHub Pages visits cannot be reconstructed by this integration.

## Validation

Run from this directory with Node.js 18 or newer:

```sh
node scripts/validate-locales.cjs
node --test tests/*.test.cjs
```

This checks every locale's fields, card coverage, custom examples, placeholders,
text direction, independent registration, script loading, image paths, and version
consistency, plus analytics activation, host restrictions, privacy signals, and
referrer sanitization. A failing check exits with a nonzero status.
Also open `index.html` in a browser and check language switching, search, filters,
saved preferences, and narrow layouts. No Node.js installation is needed to use
the guide itself.

## Sources and original rulebooks

The material was assembled through research into publicly accessible Internet
content, including official rulebooks, published guides, photographs, and
gameplay videos. Explanations and translations were prepared independently.

| Source | Reference |
| --- | --- |
| Official Moose Master website | [moosemaster.com](https://moosemaster.com/) |
| Original 2019 rules | [Official PDF — MooseMasterRules.pdf](https://moosemaster.com/wp-content/uploads/2019/10/MooseMasterRules.pdf) |
| Revised 2021 rules | [Official PDF — MooseMaster.pdf](https://moosemaster.com/wp-content/uploads/2024/07/MooseMaster.pdf) |
| Illustrated guide and card photographs | [Moose Master Card Game: Rules for How to Play — Eric Mortensen, Geeky Hobbies](https://www.geekyhobbies.com/moose-master-rules/) |
| Supplementary gameplay evidence | [Smosh Games — The Only Rule is Chaos](https://www.youtube.com/watch?v=IaiYYgfQGP0), [Scooter / Gaming Party — We Played Moose Master!](https://www.youtube.com/watch?v=WzAVtRA-ZT0) |

The two rulebook links point directly to PDFs hosted on the official website.
The revised document is identified as the June 2021 revision; the `2024/07`
directory in its URL is an upload path, not its edition date. This guide mainly
follows the 2019 rules and highlights the different Moose Master effect in the
2021 revision. Follow the instructions for your own edition where they differ.

## Copyright and non-affiliation disclaimer

I do not own or claim any copyright or other intellectual property rights in
Moose Master or any third-party content reproduced or referenced in this
repository. The game name, trademarks, logos, card artwork, original rulebook
text, photographs, video material, and other third-party assets remain the
property of their respective rights holders. Cropping, formatting, translating,
or annotating material does not transfer ownership of the underlying content.

This is a personal, unofficial educational project. Neither this project nor
its maintainer is affiliated with, sponsored by, endorsed by, or acting on behalf of Moose
Master's creators, publisher, distributors, or any other rights holder or source
mentioned here. Names and marks are used to identify the game and its sources.

Public availability on the Internet does not mean that material is in the
public domain or freely licensed. This repository grants no permission or
license to reuse third-party content. Its educational purpose, attribution, and
this disclaimer do not by themselves establish permission to reproduce or
redistribute protected material, or guarantee that a copyright exception applies.

## Accuracy and responsibility

Card images are AI-assisted restorations of source photographs and video crops,
prepared for clearer reading with sharper artwork and corrected colors.
Fine artwork details and color matching remain approximate.

Any errors, omissions, mistranslations, or mistaken interpretations introduced
in this guide are my responsibility alone, not that of the game's creators,
publisher, or the authors of the cited sources. The guide is provided as an
informal learning aid, without a guarantee of completeness or accuracy.
Translations, summaries, and custom-rule examples are unofficial and should
not be treated as publisher-approved instructions.

## Corrections and rights-holder requests

Please report errors through this repository's issue tracker. Rights holders
may use the same channel to request attribution corrections or removal of
material, identifying the affected content and their relationship to it.
I will review requests and correct or remove the relevant material as appropriate.

## Disclaimer references

The wording draws on the attribution and non-affiliation conventions in the
[Wizards of the Coast Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy)
and [Z-MAN Games IP Policy](https://www.zmangames.com/ip-policy/).
These are drafting references only: their permissions do not apply to Moose Master.
The caution about educational purpose reflects the
[U.S. Copyright Office's explanation of fair use](https://www.copyright.gov/fair-use/more-info.html);
it is not a claim that US law or a particular exception applies to this project.
