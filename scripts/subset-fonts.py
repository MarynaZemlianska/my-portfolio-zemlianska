"""Subset the self-hosted fonts to the scripts the site uses (Latin + Cyrillic).
Glyph outlines, kerning and OpenType features of the kept characters are unchanged.

Usage: python3 scripts/subset-fonts.py <source-dir> <output-dir>
Run it on the ORIGINAL full fonts (see git history of src/fonts) when adding a font.
"""
import pathlib, sys
from fontTools import subset

UNICODES = (
    "U+0000-00FF,"   # Basic Latin + Latin-1 (© « » × ·)
    "U+0100-017F,"   # Latin Extended-A
    "U+0300-036F,"   # combining marks
    "U+0400-04FF,"   # Cyrillic (Ukrainian: Є І Ї Ґ …)
    "U+2000-206F,"   # general punctuation (– — ’ “ ” …)
    "U+20A0-20CF,"   # currency (€ ₴)
    "U+2116,U+2122," # № ™
    "U+2190-21FF,"   # arrows
    "U+2700-27BF"    # dingbats (✓ ✔ ❮ ❯)
)

src, out = map(pathlib.Path, sys.argv[1:3])
out.mkdir(parents=True, exist_ok=True)
for font in sorted(src.glob("*.woff2")):
    target = out / font.name
    subset.main([str(font), f"--unicodes={UNICODES}", "--layout-features=*",
                 "--flavor=woff2", f"--output-file={target}"])
    print(f"{font.name}: {font.stat().st_size // 1024} KB -> {target.stat().st_size // 1024} KB")
