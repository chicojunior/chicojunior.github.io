#!/usr/bin/env bash
set -euo pipefail

FILE="index.html"

test -f "$FILE"
grep -q 'id="lang-toggle"' "$FILE"
grep -q 'const translations' "$FILE"
grep -q 'localStorage' "$FILE"
grep -q 'href="https://linkedin.com/in/franciscovale"' "$FILE"
grep -q 'href="https://github.com/chicojunior"' "$FILE"
grep -q 'href="old/CV-Current.pdf"' "$FILE"
grep -q 'target="_blank"' "$FILE"
grep -q 'data-i18n="about"' "$FILE"
grep -q 'data-i18n="stackFrontendTitle"' "$FILE"
grep -q 'data-i18n="stackBackendTitle"' "$FILE"
grep -q 'data-i18n="stackToolsTitle"' "$FILE"

echo "site_acceptance: PASS"
