# Moose Master Cards and Rules Instructions

## Localization

- Keep every locale, including the reference locale, in the same standalone
  `locales/<code>.js` contributor format. Preserve the parsed payload during
  structure-only migrations, require each file to self-register its filename
  code, and discover locale files rather than maintaining a test list.
- Validate user-visible headings as well as card descriptions against the
  reference locale. Allow only explicit, documented shared-word exceptions and
  inspect rendered catalog results in addition to locale key coverage.

## Analytics

- Before enabling third-party analytics, inspect and intercept the actual
  browser request. Explicitly allowlist emitted fields, remove query and
  referrer data when the privacy policy requires it, and cover enabled,
  disabled, DNT, and blocked-tracker paths.
