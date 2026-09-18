# Phaser - HTML5 Game Framework

![Phaser Banner](changelog/v4/assets/phaser4-logo.png "Phaser Banner")

[![Discord](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
![JSDelivr](https://img.shields.io/jsdelivr/npm/hm/phaser?style=for-the-badge)
![GitHub](https://img.shields.io/github/downloads/phaserjs/phaser/total?style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers and has been actively developed for over 13 years.

Games can be built for the web, or as YouTube Playables, Discord Activities, Reddit games, Twitch Overlays or compiled to iOS, Android, Steam and native apps using 3rd party tools. You can use JavaScript or TypeScript for development. Phaser supports over 40 different front-end frameworks including React and Vue.

Phaser is commercially developed and maintained by **Phaser Studio Inc** along with our fantastic open source community. As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Interested in learning more? Click the image below to watch our intro video.

[![YouTube](https://i.ytimg.com/vi/XLhi9IW0rxg/maxresdefault.jpg)](https://www.youtube.com/watch?v=XLhi9IW0rxg)

---

## Installing Phaser from NPM

Install via [npm](https://www.npmjs.com/package/phaser):

```bash
npm install phaser
```

Then import it in your project:

```js
import Phaser from 'phaser';
```

## Using Phaser from a CDN

[Phaser is on jsDelivr](https://www.jsdelivr.com/package/npm/phaser) which is a "super-fast CDN for developers". Include _either_ of the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.js"></script>
<script src="//cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.min.js"></script>
```

It is also available from Cloudflare's [cdnjs](https://cdnjs.com/libraries/phaser):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/4.2.1/phaser.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/4.2.1/phaser.min.js"></script>
```

## Create Phaser Game App

The easiest way to get started quickly with Phaser is our `create-phaser-game` app. This CLI tool presents an interactive selection of official project templates and demo games. Issue the command, answer some questions and the app will download and configure the right package for you.

```bash
npm create @phaserjs/game@latest
npx @phaserjs/create-game@latest
yarn create @phaserjs/game
pnpm create @phaserjs/game@latest
bun create @phaserjs/game@latest
```

We support Vue.js, React, Angular, Next.js, SolidJS, Svelte and Remix with Vite, Rollup, Parcel, Webpack, ESBuild, Import Map and Bun. Most come in both JavaScript and TypeScript versions.

[View the create game app tutorial](https://phaser.io/tutorials/create-game-app).

## How Big is Phaser?

Don't be alarmed if you look at `phaser.js` and see a file over 8 MB. Over 84% of that is inline documentation - JSDoc comments, type annotations, and detailed method descriptions that power the TypeScript definitions and API docs. It's there for your IDE, not for your players.

The minified build, `phaser.min.js`, strips all of that out and comes in at **345 KB** with standard gzip web server compression. This is the full version, with every feature included, but is still smaller than most texture images. You can reduce it further still by tweaking the build settings to exclude features your game doesn't need.

| Build | Raw Size | Compressed (gzip) |
| ----- | -------- | ------------------ |
| `phaser.js` (with docs) | 8.23 MB | - |
| `phaser.min.js` (full) | 1.29 MB | 345 KB |
| `phaser-arcade.min.js` | 1.18 MB | 313 KB |

### Why Phaser?

- **Battle-tested** - Over a decade of active development. Tens of thousands of games shipped. A huge community of developers who've seen it all.
- **Truly cross-platform** - One codebase runs on desktop browsers, mobile browsers, and can be wrapped for native app stores, Steam, YouTube Playables, Discord Activities, and more.
- **Developer-friendly API** - Scene-based architecture, a comprehensive loader, built-in physics (Arcade and Matter.js), animation system, input handling, cameras, tilemaps, particles, tweens, and much more - all with clear, consistent APIs.
- **Framework agnostic** - Works with React, Vue, Angular, Svelte, or plain JavaScript and TypeScript. Use whatever tools you prefer.
- **Massive ecosystem** - Over 2,000 code examples. Extensive API documentation. Active Discord and forums. First-class TypeScript definitions.
- **AI-ready** - Phaser's API is well understood by every major frontier LLM. This repository includes a comprehensive set of [AI agent skills](skills/) that give coding agents deep knowledge of every Phaser subsystem, making it the ideal framework for AI-assisted game development.

## What's New in Phaser 4

Phaser 4 is a major release built on a brand-new WebGL renderer. The entire rendering pipeline from v3 has been replaced with a modern, node-based architecture that manages WebGL state properly, handles context loss gracefully, and is significantly faster. If you've built games with Phaser 3, the public API is mostly familiar - but under the hood, everything has changed for the better.

Here are the headline features. For the full picture, see the [v4.0 Changelog](changelog/v4/4.0/CHANGELOG-v4.0.0.md) and [Migration Guide](changelog/v4/4.0/MIGRATION-GUIDE.md).

### New Render Node Architecture

The v3 pipeline system has been replaced with a clean, node-based renderer. Each render node handles a single task, WebGL state is fully managed, and context restoration is built in. The result is a renderer that's faster, more reliable, and much easier to extend with custom rendering logic. Quads now use index buffers, reducing vertex upload costs by a third. Multi-texture batching is smarter, avoiding unnecessary batch breaks on mobile. And the whole system uses just-in-time rendering - nothing hits the GPU until it absolutely has to.

### Unified Filter System

FX and Masks from v3 have been unified into a single, powerful **Filter** system. Filters can be applied to any game object or camera - no more restrictions on which objects support effects. Every filter takes an input image and produces an output, usually via a single shader, so they're all mutually compatible.

v4 ships with a huge library of built-in filters: Blur, Glow, Shadow, Pixelate, ColorMatrix, Bloom, Vignette, Wipe, and many more. New additions include **ImageLight** for realistic image-based lighting, **Blocky** for pixel-art-friendly pixelation, **GradientMap** for palette-swap effects, **Quantize** for retro dithered palettes, **Key** for chroma keying, **NormalTools** for normal map manipulation, and **Blend** which brings all 27 Canvas blend modes to WebGL.

Masks are now a filter too, more powerful than ever. A `Container` full of filtered, masked objects can itself be used as a mask source.

### SpriteGPULayer - Render a Million Sprites

`SpriteGPULayer` is a new game object designed to render massive numbers of sprites. Where standard Phaser rendering handles tens of thousands of sprites comfortably, SpriteGPULayer handles **a million or more**, up to 100x faster.

It works by storing all member data in a static GPU buffer and rendering everything in a single draw call, skipping the per-frame CPU-to-GPU upload that's normally the main bottleneck. Members aren't just static, either - each one supports GPU-driven animations on position, rotation, scale, alpha, tint, and frame, with a full set of easing functions. Per-member scroll factors enable parallax backgrounds, and non-looping mode supports one-off particle effects. It's perfect for bringing complex, animated backgrounds to life without touching your frame budget.

### TilemapGPULayer - Render Millions of Tiles

`TilemapGPULayer` renders an entire tilemap layer as a single quad. The shader cost is per-pixel, not per-tile, so it can display up to 4096 x 4096 tiles with no performance penalty for tile count. It also produces perfect texture filtering across tile boundaries - no seams, no bleeding. If you need large maps on screen at once, especially on mobile, this is the way to go.

### Overhauled Tint System

Tint has been reworked with color and mode as separate concerns. Six tint modes are available: `MULTIPLY`, `FILL`, `ADD`, `SCREEN`, `OVERLAY`, and `HARD_LIGHT`. The new `setTintMode()` method gives you explicit control, and BitmapText tinting finally works correctly.

### New Game Objects

- **Gradient** - Render linear, radial, conic, and bilinear color gradients with dithering support, powered by the new `ColorBand` and `ColorRamp` classes.
- **Noise, NoiseCell (2D/3D/4D), NoiseSimplex (2D/3D)** - Generate and animate cellular noise, simplex noise, and random static on the GPU, with normal map output for use in lighting and effects.
- **CaptureFrame** - Snapshot the current framebuffer mid-render for post-processing tricks.
- **Stamp** - Render a camera-independent quad, useful for DynamicTexture operations.

### Improved Lighting

Lighting is now as simple as `sprite.setLighting(true)` - no pipeline juggling required. Objects can cast self-shadows based on their own texture, lights have an explicit `z` height value, and lighting works across most game objects including BitmapText, Particles, TileSprite, and both tilemap layer types.

### Shader and TileSprite Improvements

The `Shader` game object has been rewritten with a cleaner config-based API (`ShaderQuadConfig`), and GLSL loading now uses standard `#pragma` directives that work with syntax checkers. `TileSprite` has been rebuilt with a new shader that supports texture atlas frames and tile rotation - no more whole-texture-only limitation.

---

## AI-Assisted Game Development

Phaser has been part of the training data for every major frontier LLM. Models from Anthropic, OpenAI, Google, and others understand the Phaser API deeply and can generate game code, debug rendering issues, set up physics, and build scene structures out of the box. Tools like Claude Code, Cursor, Codex, Antigravity, and GitHub Copilot can scaffold entire Phaser games and implement features from natural language descriptions.

### AI Agent Skills

This repository includes a comprehensive set of [AI agent skills](skills/) covering every major Phaser subsystem - scenes, physics, input, animations, tilemaps, tweens, particles, cameras, and much more. Point your AI coding agent at the `skills/` folder and it will understand Phaser 4's architecture, APIs, patterns, and gotchas in depth. Tell it to create a game and it will know the right way to structure scenes, load assets, set up physics, and handle input - all using idiomatic Phaser 4 code.

---

## Phaser TypeScript Definitions

Full TypeScript definitions can be found inside the [types folder](https://github.com/phaserjs/phaser/tree/master/types). They are also referenced in the `types` entry in `package.json`, meaning modern editors such as VSCode will detect them automatically.

Depending on your project, you may need to add the following to your `tsconfig.json` file:

```json
"lib": ["es6", "dom", "dom.iterable", "scripthost"],
"typeRoots": ["./node_modules/phaser/types"],
"types": ["Phaser"]
```

## API Documentation

Read our full API Documentation at https://docs.phaser.io/. Use the links at the top of the page to navigate the namespaces, classes, events and Game Objects and also to use the search box.

We maintain documentation for the most recent versions of Phaser on this site.

## Getting Started

We recommend the following to begin your journey:

* [Getting Started with Phaser](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* Download our Free 500 page book [Phaser by Example](https://phaser.io/news/2024/04/phaser-by-example-book).
* Plus, there are [over 700 Phaser tutorials](https://phaser.io/learn) listed on our website.

New tutorials are being published every week, so check our site for more.

## Source Code Examples

We have created hundreds of examples and they are all available with full source code and assets.

Browse our [Phaser Examples site](https://phaser.io/examples).

## Phaser Sandbox

The Phaser Sandbox is a fully-configured online editor, fully updated for Phaser 4, ready to go direct in your desktop browser. It's loaded with the latest version of Phaser and packed full of handy features. [Register for a free Phaser account](https://phaser.io/register) to create and save your own sandbox entries. Or view one [just like this](https://phaser.io/sandbox/XyqPcjNr).

## Phaser Plugins

Super community member RexRainbow has been publishing Phaser content for years, compiling an impressive catalogue of plugins that all Phaser developers should be aware of.

You'll find [Phaser Plugins](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html#list-of-my-plugins) that extend the framework with features such as UI controls, text input boxes, Firebase support, Finite State Machines and lots more. His set of [Phaser Notes](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html) are also invaluable reading.

## Migrating from Phaser 3

Phaser 4 keeps most of the public API you know, but there are important breaking changes - the renderer, tint system, FX/Masks, Shader API, lighting, and several removed classes (Point, Mesh, BitmapMask) all need attention. We've written a detailed [Migration Guide](changelog/v4/4.0/MIGRATION-GUIDE.md) with a checklist to walk you through it.

We've also included a dedicated [v3 to v4 migration skill](skills/v3-to-v4-migration/SKILL.md) in this repository. Point your AI coding agent at it and tell it to migrate your Phaser 3 game - it understands every breaking change and knows the exact v4 replacements.

## Change Log

We meticulously keep track of new features, updates and bug fixes in our change logs. Each version of Phaser has its own change log:

* [v4.2.1 Change Log](changelog/v4/4.2.1/CHANGELOG-v4.2.1.md)
* [v4.2.0 Change Log](changelog/v4/4.2/CHANGELOG-v4.2.0.md)
* [v4.1.0 Change Log](changelog/v4/4.1/CHANGELOG-v4.1.0.md)
* [v4.0.0 Change Log](changelog/v4/4.0/CHANGELOG-v4.0.0.md)
* [All Phaser Change Logs](CHANGELOG.md)

## Have fun!

Grab the source and join the fun!

Phaser wouldn't have been possible without the fantastic support of the community. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

[Rich](mailto:rich@phaser.io) and the whole team at Phaser Studio

![boogie](changelog/v4/assets/space-dance.gif)

**Visit** the [Phaser website](https://phaser.io)<br />
**Play** some [amazing games](https://phaser.io/games)<br />
**Learn** By browsing our [API Docs](https://docs.phaser.io) or [Support Forum](https://phaser.discourse.group/)<br />
**AI Skills** Point your AI agent at our [Phaser Skills](skills/) for deep framework knowledge<br />
**Code Examples?** We've over 2000 [Examples](https://phaser.io/examples) to learn from<br />
**Read** the weekly [Phaser World](https://phaser.world) Newsletter<br />
**Be Social:** Join us on [Discord](https://discord.com/invite/phaser) and [Reddit](https://www.reddit.com/r/phaser/) or follow us on [Twitter](https://twitter.com/phaser_)<br />

Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2011 - 2026 Phaser Studio Inc.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata


## 🌐 Web Resources & Aesthetic Symbols Index
- [SYM 1D49D](https://coquette-aesthetic-symbols-78.pages.dev/symbol/sym-1d49d/)
- [SYM 1F62E 200D 1F4A8](https://kawaii-kaomoji-hub-17.pages.dev/symbol/sym-1f62e-200d-1f4a8/)
- [SYM 263F](https://coquette-aesthetic-symbols-96.pages.dev/symbol/sym-263f/)
- [ROBLOX NAMES](https://anime-sparkle-text-95.pages.dev/vi/roblox-names/)
- [SYM 263A](https://vintage-runes-text-63.pages.dev/symbol/sym-263a/)
- [SYM 1D453](https://vintage-runes-text-63.pages.dev/symbol/sym-1d453/)
- [SYM 1D48E](https://clean-line-emojis-93.pages.dev/symbol/sym-1d48e/)
- [SYM 1D460](https://gothic-bio-fonts-98.pages.dev/symbol/sym-1d460/)
- [SYM 1D43F](https://scholarly-script-hub-43.pages.dev/symbol/sym-1d43f/)
- [SYM 26F5](https://gothic-bio-fonts-98.pages.dev/symbol/sym-26f5/)
- [SYM 26D3](https://vintage-runes-text-63.pages.dev/symbol/sym-26d3/)
- [SYM 1D41F](https://vintage-runes-text-63.pages.dev/symbol/sym-1d41f/)
- [SYM 1FAE0](https://academic-rune-text-25.pages.dev/symbol/sym-1fae0/)
- [SYM 1D49F](https://coquette-aesthetic-symbols-51.pages.dev/symbol/sym-1d49f/)
- [LAST QUARTER CRESCENT MOON](https://arcane-symbol-vault-32.pages.dev/symbol/last-quarter-crescent-moon/)
- [SYM 26ED](https://synth-dystopia-text-20.pages.dev/symbol/sym-26ed/)
- [SYM 1D44B](https://anime-sparkle-text-24.pages.dev/symbol/sym-1d44b/)
- [SYM 1F63A](https://classic-literature-symbols-64.pages.dev/symbol/sym-1f63a/)
- [SYM 2673](https://cyber-clan-tags-20.pages.dev/symbol/sym-2673/)
- [SYM 1D457](https://vintage-runes-text-63.pages.dev/symbol/sym-1d457/)
- [SYM 26EA](https://angelic-soft-text-59.pages.dev/symbol/sym-26ea/)
- [FLORAL BRANCH BOUQUET](https://synthwave-fancy-text-33.pages.dev/symbol/floral-branch-bouquet/)
- [TWELVE POINTED STAR](https://baroque-curse-text-56.pages.dev/symbol/twelve-pointed-star/)
- [SYM 1D468](https://clean-line-emojis-93.pages.dev/symbol/sym-1d468/)
- [SYM 26F0](https://vintage-lace-text-53.pages.dev/symbol/sym-26f0/)
- [SYM 1D49F](https://mecha-crosshair-symbols-40.pages.dev/symbol/sym-1d49f/)
- [SYM 1D448](https://zen-unicode-text-24.pages.dev/symbol/sym-1d448/)
- [TAURUS ZODIAC BULL](https://sleek-bio-fonts-25.pages.dev/symbol/taurus-zodiac-bull/)
- [LEFT RIGHT EXCHANGE ARROWS](https://clean-aesthetic-arrows-99.pages.dev/symbol/left-right-exchange-arrows/)
- [FREEFIRE NAMES](https://pink-ribbon-fonts-28.pages.dev/vi/freefire-names/)
- [SYM 2671](https://vintage-runic-symbols-53.pages.dev/symbol/sym-2671/)
- [SYM 2625](https://minimal-star-symbols-31.pages.dev/symbol/sym-2625/)
- [SYM 1F495](https://sleek-typography-hub-12.pages.dev/symbol/sym-1f495/)
- [SYM 1D47C](https://clean-aesthetic-arrows-99.pages.dev/symbol/sym-1d47c/)
- [SYM 26F4](https://vintage-runes-text-63.pages.dev/symbol/sym-26f4/)
- [SYM 1D48A](https://balletcore-bio-symbols-63.pages.dev/symbol/sym-1d48a/)
- [SYM 1F92C](https://vintage-runes-text-63.pages.dev/symbol/sym-1f92c/)
- [SYM 26E8](https://cyber-clan-tags-85.pages.dev/symbol/sym-26e8/)
- [SYM 2655](https://cyber-clan-tags-85.pages.dev/symbol/sym-2655/)
- [SYM 1D445](https://sleek-bio-fonts-25.pages.dev/symbol/sym-1d445/)
- [HEARTS](https://pastel-moe-kaomoji-91.pages.dev/pt/hearts/)
- [SYM 2674](https://minimal-star-symbols-31.pages.dev/symbol/sym-2674/)
- [SYM 1D45A](https://sleek-bio-fonts-25.pages.dev/symbol/sym-1d45a/)
- [SYM 1D420](https://vintage-lace-symbols-65.pages.dev/symbol/sym-1d420/)
- [BRACKETS](https://minimal-star-symbols-31.pages.dev/ru/brackets/)
- [SYM 1F92E](https://ballet-core-symbols-11.pages.dev/symbol/sym-1f92e/)
- [SYM 2672](https://sleek-bio-fonts-25.pages.dev/symbol/sym-2672/)
- [SYM 262E](https://clean-aesthetic-arrows-99.pages.dev/symbol/sym-262e/)
- [STARS](https://ballet-core-symbols-11.pages.dev/ja/stars/)
- [SYM 1F63A](https://vintage-runes-text-63.pages.dev/symbol/sym-1f63a/)
- [SYM 1D43E](https://vintage-lace-text-53.pages.dev/symbol/sym-1d43e/)
- [SYM 2683](https://clean-line-emojis-93.pages.dev/symbol/sym-2683/)
- [SYM 1F49D](https://scholarly-script-hub-43.pages.dev/symbol/sym-1f49d/)
- [SYM 274B](https://gothic-bio-fonts-98.pages.dev/symbol/sym-274b/)
- [LAST QUARTER CRESCENT MOON](https://pastel-moe-kaomoji-91.pages.dev/symbol/last-quarter-crescent-moon/)
- [ROBLOX NAMES](https://arcane-symbol-vault-32.pages.dev/ja/roblox-names/)
- [BRACKETS](https://ballet-core-symbols-11.pages.dev/pt/brackets/)
- [SYM 2626](https://clean-aesthetic-arrows-99.pages.dev/symbol/sym-2626/)
- [SYM 1D427](https://zen-unicode-text-24.pages.dev/symbol/sym-1d427/)
- [SYM 2639](https://cyber-clan-tags-85.pages.dev/symbol/sym-2639/)
- [SYM 26C6](https://balletcore-bio-symbols-63.pages.dev/symbol/sym-26c6/)
- [SYM 2764 FE0F 200D 1FA79](https://minimal-star-symbols-31.pages.dev/symbol/sym-2764-fe0f-200d-1fa79/)
- [SYM 1D453](https://clean-aesthetic-arrows-99.pages.dev/symbol/sym-1d453/)
- [SYM 260D](https://cyber-clan-tags-85.pages.dev/symbol/sym-260d/)
- [SYM 1F61E](https://ballet-core-symbols-11.pages.dev/symbol/sym-1f61e/)
- [SYM 1D470](https://gothic-bio-fonts-98.pages.dev/symbol/sym-1d470/)
- [BORDERS DIVIDERS](https://ballet-core-symbols-11.pages.dev/pt/borders-dividers/)
- [SYM 1F63B](https://neon-matrix-symbols-74.pages.dev/symbol/sym-1f63b/)
- [NATURE FLOWERS](https://ballet-core-symbols-11.pages.dev/ja/nature-flowers/)
- [SYM 1F914](https://clean-aesthetic-arrows-99.pages.dev/symbol/sym-1f914/)
- [DISCORD STATUS](https://minimal-star-symbols-31.pages.dev/es/discord-status/)
- [SYM 1D459](https://baroque-curse-text-56.pages.dev/symbol/sym-1d459/)
- [SYM 1F63B](https://chibi-emotion-faces-74.pages.dev/symbol/sym-1f63b/)
- [SYM 26D7](https://sleek-typography-hub-12.pages.dev/symbol/sym-26d7/)
- [KAOMOJI](https://gothic-bio-fonts-98.pages.dev/ja/kaomoji/)
- [HEAVY STAR](https://minimal-star-symbols-31.pages.dev/symbol/heavy-star/)
- [SYM 263B](https://minimal-star-symbols-31.pages.dev/symbol/sym-263b/)
- [SYM 1D472](https://cyber-clan-tags-55.pages.dev/symbol/sym-1d472/)
- [SYM 1F613](https://minimal-star-symbols-31.pages.dev/symbol/sym-1f613/)
- [SYM 2670](https://vintage-runic-symbols-53.pages.dev/symbol/sym-2670/)
- [SYM 2662](https://balletcore-bio-symbols-63.pages.dev/symbol/sym-2662/)
- [DISCORD STATUS](https://neon-glitch-symbols-29.pages.dev/pt/discord-status/)
- [STARS](https://arcane-symbol-vault-32.pages.dev/ru/stars/)
- [SYM 2680](https://arcane-symbol-vault-32.pages.dev/symbol/sym-2680/)
- [TIKTOK CAPTIONS](https://neon-matrix-symbols-74.pages.dev/ja/tiktok-captions/)
- [RADIOACTIVE SYMBOL](https://poetic-scroll-fonts-91.pages.dev/symbol/radioactive-symbol/)
- [SYM 26CA](https://neon-matrix-symbols-74.pages.dev/symbol/sym-26ca/)
- [SYM 1F916](https://pastel-moe-kaomoji-91.pages.dev/symbol/sym-1f916/)
- [SYM 1F612](https://cyber-clan-tags-20.pages.dev/symbol/sym-1f612/)
- [SYM 26B0](https://clean-line-emojis-93.pages.dev/symbol/sym-26b0/)
- [DISCORD STATUS](https://minimal-star-symbols-31.pages.dev/ru/discord-status/)
- [SYM 26FF](https://classic-literature-symbols-64.pages.dev/symbol/sym-26ff/)
- [SYM 26BC](https://vintage-runic-symbols-53.pages.dev/symbol/sym-26bc/)
- [RIGHT WING CLAN FLARE](https://arcane-symbol-vault-32.pages.dev/symbol/right-wing-clan-flare/)
- [BORDERS DIVIDERS](https://gothic-bio-fonts-22.pages.dev/es/borders-dividers/)
- [SYM 1D455](https://zen-typography-hub-86.pages.dev/symbol/sym-1d455/)
- [SYM 26FD](https://sleek-typography-hub-12.pages.dev/symbol/sym-26fd/)
- [SYM 1D45C](https://clean-aesthetic-arrows-99.pages.dev/symbol/sym-1d45c/)
- [BRACKETS](https://angelic-soft-text-59.pages.dev/brackets/)
- [SYM 1D478](https://balletcore-bio-symbols-63.pages.dev/symbol/sym-1d478/)
- [SYM 1D409](https://gothic-bio-fonts-98.pages.dev/symbol/sym-1d409/)
- [NATURE FLOWERS](https://minimal-star-symbols-31.pages.dev/ru/nature-flowers/)
- [SYM 263A](https://cyber-clan-tags-85.pages.dev/symbol/sym-263a/)
- [SYM 263F](https://minimal-star-symbols-31.pages.dev/symbol/sym-263f/)
- [SYM 1D4A0](https://clean-aesthetic-arrows-99.pages.dev/symbol/sym-1d4a0/)
- [SYM 1F49E](https://minimal-star-symbols-31.pages.dev/symbol/sym-1f49e/)
- [SYM 2673](https://sleek-bio-fonts-25.pages.dev/symbol/sym-2673/)
- [SYM 1D492](https://vintage-lace-symbols-65.pages.dev/symbol/sym-1d492/)
- [SYM 1D45E](https://clean-line-emojis-93.pages.dev/symbol/sym-1d45e/)
- [OPEN CENTRE STAR](https://pastel-moe-kaomoji-91.pages.dev/symbol/open-centre-star/)
- [SYM 1D478](https://gothic-bio-fonts-98.pages.dev/symbol/sym-1d478/)
- [SYM 2631](https://cyber-clan-tags-55.pages.dev/symbol/sym-2631/)
- [SYM 1F610](https://ballet-core-symbols-11.pages.dev/symbol/sym-1f610/)
- [CANCER ZODIAC CRAB](https://arcane-symbol-vault-32.pages.dev/symbol/cancer-zodiac-crab/)
- [BIOHAZARD SYMBOL](https://cyber-clan-tags-55.pages.dev/symbol/biohazard-symbol/)
- [LEFT RIGHT EXCHANGE ARROWS](https://scholarly-script-hub-43.pages.dev/symbol/left-right-exchange-arrows/)
- [SYM 26A6](https://academic-rune-text-25.pages.dev/symbol/sym-26a6/)
- [ROBLOX NAMES](https://cyber-clan-tags-20.pages.dev/roblox-names/)
- [SYM 2615](https://sleek-bio-fonts-25.pages.dev/symbol/sym-2615/)
- [SYM 26F0](https://vintage-runic-symbols-53.pages.dev/symbol/sym-26f0/)
- [SYM 2637](https://scholarly-script-hub-43.pages.dev/symbol/sym-2637/)
- [SYM 26DB](https://cyber-clan-tags-20.pages.dev/symbol/sym-26db/)
- [SYM 263A FE0F](https://cute-face-emoticons-66.pages.dev/symbol/sym-263a-fe0f/)
- [SYM 1F60D](https://scholarly-script-hub-43.pages.dev/symbol/sym-1f60d/)
- [SYM 1F620](https://cute-face-emoticons-66.pages.dev/symbol/sym-1f620/)
- [SYM 1D496](https://mecha-crosshair-symbols-40.pages.dev/symbol/sym-1d496/)
- [SYM 267E](https://minimal-star-symbols-31.pages.dev/symbol/sym-267e/)
- [SYM 267A](https://clean-line-emojis-93.pages.dev/symbol/sym-267a/)
- [LEFT WING CLAN FLARE](https://mecha-crosshair-symbols-40.pages.dev/symbol/left-wing-clan-flare/)
- [NATURE FLOWERS](https://minimal-star-symbols-31.pages.dev/nature-flowers/)
