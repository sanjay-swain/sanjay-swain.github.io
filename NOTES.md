# Site notes

Personal site for Sanjay: blog, projects, research. Last updated: 2026-11-25.

## Principles

- **Attention goes where I choose.** The headline carries the personality. Animation plays a supporting role and should be easy to miss.
- **Nothing moves on its own.** Motion only responds to the visitor (hover, focus, tap). No autoplay, no bouncing cues.
- **Motion is slow and gentle.** Small rotation, \~300-500 ms ease, no overshoot, no scaling or parallax. Disabled under `prefers-reduced-motion`.
- **As little JS as possible.** HTML and CSS first. JS only where it clearly earns its place (tooltip pinning, interactive demos), loaded only on pages that need it. Every page must still work without it.
- **Dark by default**, light follows the system setting. A header toggle overrides it and the choice is remembered (see Theme toggle).
- **Content leads.** Perfection is not required, since it's a personal site.

## Stack and hosting

- Zola 0.23.6, custom templates, Sass (`compile_sass = true`), no search index.
- Hosting: GitHub Pages, `base_url = "https://sanjay-swain.github.io/"` (site at root, no sub-path).
- Development on WSL. GitHub Action for deploy: not set up yet.

## Folder map

| Path            | Purpose                                                            |
| --------------- | ------------------------------------------------------------------ |
| `config.toml`   | Site config, nav and footer links under `[extra]`                  |
| `templates/`    | `base.html`, `index.html`, `section.html`, `page.html`, `404.html` |
| `sass/`         | `main.scss` imports `_fonts`, `_tokens`, `_base`, `_layout`        |
| `content/`      | `_index.md` (home), `about.md`, `projects/`, `blog/`               |
| `static/fonts/` | Self-hosted woff2 files                                            |

### Which template renders what

- `base.html`: shared shell (head, header/nav, footer). All others extend it and fill the `content` block. Has an empty `head` block so single posts can add scripts later.
- `index.html`: the homepage only (`content/_index.md`).
- `section.html`: any folder with an `_index.md` (Blog, Projects). Shows intro text and lists the pages inside.
- `page.html`: any single content file (About, each blog post).
- `404.html`: missing URLs.

## Config decisions

- Top-level keys (`title`, `base_url`, ...) must come **before** any `[table]` header, or TOML puts them in that table.
- Nav lives in `[[extra.nav]]` blocks (`name`, `path`). Adding a page to the nav is one block, no template edit.
- Nav paths use `@/` internal links, so a missing or renamed page fails the build loudly.
- Contact lives in the footer (`[[extra.footer_links]]`), not the nav.
- Nav label is "Blog".
- Publications page is **postponed**. If added, consider naming it "Research" (preprints, talks, posters, thesis, not only papers).

## Design tokens (`sass/_tokens.scss`)

All colors are CSS variables. Dark is the base; light comes from `[data-theme="light"]` (set by JS) or, without JS, from `prefers-color-scheme: light`.

| Token       | Dark      | Light                           |
| ----------- | --------- | ------------------------------- |
| `--bg`      | `#0f1418` | `#f6f8f7`                       |
| `--surface` | `#161d23` | `#edf1f0` (unverified, my pick) |
| `--border`  | `#26313a` | `#d3dad8` (unverified, my pick) |
| `--text`    | `#e8ecef` | `#1a2025`                       |
| `--muted`   | `#97a3ad` | `#5b6770`                       |
| `--mint`    | `#8fe3c0` | `#1d7a5a`                       |
| `--blue`    | `#7cc4e8` | `#1c6e94`                       |
| `--coral`   | `#ff8f70` | `#c4452a`                       |

- **Accent roles:** mint is the main accent (links, highlights) via `--accent`. Change that one line to re-theme. Blue is secondary (hover, tags). Coral is rare emphasis only.
- Light-mode accents are darker because pastels are unreadable on a light background.
- Avoid pure black and pure white.

## Typography

Fonts are self-hosted from Fontsource files in `static/fonts/` and declared in `sass/_fonts.scss`. Each family is split by character range (`unicode-range`), so the browser only downloads a file when the page uses characters from it.

| Role                  | Font                               | Files                                                                                                            |
| --------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Headings, nav, footer | Archivo (variable, weight + width) | `archivo-latin-standard-normal.woff2`, `archivo-latin-standard-italic.woff2`                                     |
| Body / blog text      | Source Serif 4                     | `source-serif-4-latin-standard-{normal,italic}.woff2`, `source-serif-4-latin-ext-standard-{normal,italic}.woff2` |
| Code                  | Fira Code, ligatures on            | `fira-code-latin-wght-normal.woff2`, `fira-code-symbols2-wght-normal.woff2`                                      |

- Archivo: only `latin` is downloaded, no `latin-ext`. Accented characters in headings would fall back to a system font.
- Source Serif 4: `latin` and `latin-ext`. Ranges are copied from Fontsource's CSS (verified). The `latin-ext` range ends at `U+20C4`.
- Fira Code is one family with two subset files. `latin` holds the ligatures. `symbols2` holds box-drawing and block characters. `symbols2` must stay **after** `latin` in `_fonts.scss`, because where ranges overlap the later rule wins. Both ranges are verified. Other Fira Code subsets are not downloaded and fall back to the system monospace font.
- Files named `standard` are assumed to be Fontsource's all-axes variable fonts (**unverified**). If bold or italic looks faked, check this first.
- Source Serif 4's optical-size axis is applied automatically by the browser.
- Ligatures need `letter-spacing: 0` in code. Add class `no-ligatures` to switch them off for one block.
- Fira Code has no italic. Code is always `font-style: normal`.
- Body \~18px, line height 1.6, line width \~65 characters for reading text.

## Layout and classes

- `body` is a flex column with `min-height: 100dvh`, `main` has `flex: 1`, so the footer sits at the bottom on short pages.
- Header, `main` and footer all need `width: 100%` plus `max-width` and `margin-inline: auto`, or the flex column shrinks them.
- `.site-header`, `.site-footer`: flex rows, wrap on narrow screens. Nav links are muted, mint on hover.
- `.site-name`: bold site title link.
- `.skip-link`: hidden off-screen, shown on keyboard focus.
- `.entry-list`: list of posts or projects (title left, date right).
- `.no-ligatures`: disables Fira Code ligatures for one code block.
- `:focus-visible` gets a mint outline. Keep it.

## Theme toggle

- Working. `base.html` sets `data-theme` before the stylesheet (no flash); `static/js/theme.js` handles the header button.
- Resolution: `localStorage.theme` → `prefers-color-scheme` → dark. The choice is saved in `localStorage` under `theme`.
- Without JS the button is hidden (`html.js`) and the system setting wins.

## Decided for later stages

### Homepage hero

- Huge headline, kept big on purpose (personality). Headline and short description fill the first screen without scrolling. Content boxes sit below.
- Signal that more content exists with something static (e.g. first row peeking in). No animated arrow.
- Default state slightly slanted (angle not chosen yet, roughly 3-4 degrees looks intentional). Straightens on hover.
- Hover area is a stable outer box, and only the text inside rotates (prevents flicker).
- Slow ease both ways. Optional 100-150 ms delay before reacting, only if it feels twitchy.
- One effect only (tilt). No color flood. Shadow, if used, follows the tilt.
- Touch devices get the static slanted state.
- Original inspiration: thil.ooo (hover colour flood judged too loud). Hover is much subtler here.

### Homepage content boxes

- Recent blogs and projects. Which one leads is **undecided**.

### Blog

- Standard references list at the bottom stays as the fallback and for accessibility.
- Hover tooltips (inspired by Paradox games): hover shows a box, staying hovered pins it. Pinning needs a little JS. Tap to open on touch. One level of nesting at first.
- Reference data ideally from one bibliography file, with a shortcode generating both tooltip and bottom list.
- Interactive demos: shortcode in Markdown, scripts loaded only on posts that need them, static image fallback, lazy loaded, touch support. WASM only if the demo needs heavy computation. An iframe is an option for large demos.
- Syntax highlighting theme is `github-dark`. Fine for dark mode, but code blocks stay dark on the light theme. Decide later whether that is acceptable or whether to use a light/dark pair (check what Zola 0.23.6 supports for this, **unverified**).

## Roadmap

- [x] Skeleton (config, base template, content placeholders)
- [x] SCSS tokens, base and layout styles
- [x] Footer-at-bottom fix (applied, not confirmed)
- [x] Fonts (files added, `@font-face` written, not confirmed loading)
- [ ] Homepage hero and content boxes
- [ ] Blog post template, reading typography, code blocks, reference list
- [ ] Tooltips, then pinning and nesting
- [ ] First interactive demo
- [ ] Current-page highlight in nav, RSS feed, GitHub Actions deploy, 404 styling
