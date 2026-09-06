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


## 🌐 Web Resources & Interactive Index
- [RELAXING CUBES AND CAMPFIRE](https://studyquests.pages.dev/relaxing-cubes-and-campfire.html)
- [CATEGORY QUIZ](https://learnquester.pages.dev/category-quiz.html)
- [WORD SEARCH UNIVERSE 2](https://studyquests.github.io/word-search-universe-2.html)
- [CATEGORY SOLITAIRE](https://quizverses-9d2f2.web.app/category-solitaire.html)
- [REFLECT BEAM LASER LOGIC](https://iskillquest.pages.dev/reflect-beam-laser-logic.html)
- [FARM BLOCK PUZZLE](https://theskillquest.pages.dev/farm-block-puzzle.html)
- [STICKMAN ESCAPE SCHOOL](https://themindplays.pages.dev/stickman-escape-school.html)
- [SAVE MY HERO](https://quizverses.pages.dev/save-my-hero.html)
- [INDEX20](https://studyplayings.pages.dev/index20.html)
- [MOJICON EMOJI CONNECT](https://quizverses.pages.dev/mojicon-emoji-connect.html)
- [REAL RACING 3D](https://thelearnquester.web.app/real-racing-3d.html)
- [CAT LIFE SIMULATOR DEVIL CAT](https://themindplay.pages.dev/cat-life-simulator-devil-cat.html)
- [CALL OF THE JUNGLE ANIMAL EVOLUTION](https://thelearnquester.web.app/call-of-the-jungle-animal-evolution.html)
- [SURVIVAL RACING EXTREME ROAD](https://themindzone.pages.dev/survival-racing-extreme-road.html)
- [MAGIC TRI PEAKS SOLITAIRE](https://studyplaying.github.io/magic-tri-peaks-solitaire.html)
- [DIGWORM IO](https://themindplaying.web.app/digworm-io.html)
- [BALL EATING SIMULATOR](https://theskillquest.pages.dev/ball-eating-simulator.html)
- [HAMSTER COMBO IDLE](https://quizverses.pages.dev/hamster-combo-idle.html)
- [GEOMETRY TOWER DEFENSE](https://quizverses.github.io/geometry-tower-defense.html)
- [CATEGORY PIXEL313](https://studyplaying.github.io/category-pixel313.html)
- [MAHJONG CONNECT GOLD](https://thequizzone.pages.dev/mahjong-connect-gold.html)
- [HOSPITAL INC](https://themindplays.pages.dev/hospital-inc.html)
- [PIXEL PATH](https://iskillquest.pages.dev/pixel-path.html)
- [YOUR DREAM ROOM](https://themindskillplayplay.pages.dev/your-dream-room.html)
- [VALENTINE HIDDEN HEART](https://quizverses.pages.dev/valentine-hidden-heart.html)
- [FOOTBALL PENALTY](https://iskillquest.pages.dev/football-penalty.html)
- [CHOO CHOO SPIDER MONSTER TRAIN](https://themindplay.github.io/choo-choo-spider-monster-train.html)
- [SUPERMARKET SIMULATOR DREAM STORE](https://studyplaying.github.io/supermarket-simulator-dream-store.html)
- [SCREW MATCH](https://iskillplay.web.app/screw-match.html)
- [FISH EAT GROW MEGA](https://theskillquest.pages.dev/fish-eat-grow-mega.html)
- [FASHIONISTA AVATAR STUDIO DRESS UP](https://iskillplay.web.app/fashionista-avatar-studio-dress-up.html)
- [KOBOLM RESCUE](https://thequizzone.pages.dev/kobolm-rescue.html)
- [CATEGORY MATCH 3](https://quizverses-9d2f2.web.app/category-match-3.html)
- [FORTRESS OF THE SINISTER](https://thequizzone.pages.dev/fortress-of-the-sinister.html)
- [DREAM PET HOTEL](https://thequizzone.pages.dev/dream-pet-hotel.html)
- [CATEGORY PREMIUM PERKS71](https://themindplay.pages.dev/category-premium-perks71.html)
- [RUNNING LATE](https://quizverses.github.io/running-late.html)
- [CATEGORY STRATEGY 2](https://studyplaying.github.io/category-strategy-2.html)
- [STICK HERO FIGHT](https://themindplaying.web.app/stick-hero-fight.html)
- [INDEX19](https://thelearnquester.web.app/index19.html)
- [CHICKEN WILD RUN](https://thequizzone.pages.dev/chicken-wild-run.html)
- [DIAMOND SOLITAIRE MAHJONG](https://iskillplay.web.app/diamond-solitaire-mahjong.html)
- [CONNECT EM ALL](https://themindplaying.web.app/connect-em-all.html)
- [PLANE CHASE](https://iskillplay.web.app/plane-chase.html)
- [CATEGORY MINECRAFT](https://iskillplay.web.app/category-minecraft.html)
- [CATEGORY IDLE448](https://studyplaying.github.io/category-idle448.html)
- [ACOX RUNNER](https://quizverses.pages.dev/acox-runner.html)
- [COLOR SAND PUZZLE](https://studyplaying.github.io/color-sand-puzzle.html)
- [TRIPEAKS SOLITAIRE ESCAPES](https://iskillplay.web.app/tripeaks-solitaire-escapes.html)
- [SUPERMARKET CASHIER SIMULATOR](https://thequizzone.pages.dev/supermarket-cashier-simulator.html)
- [BASKET SPORT STARS](https://studyplayings.web.app/basket-sport-stars.html)
- [CUBEREALM IO](https://studyplaying.github.io/cuberealm-io.html)
- [WINTER SOLITAIRE TRIPEAKS](https://thequizzone.pages.dev/winter-solitaire-tripeaks.html)
- [NUMBER DOMINATION](https://themindplay.pages.dev/number-domination.html)
- [CATEGORY MONSTER](https://quizverses.pages.dev/category-monster.html)
- [OCEAN KIDS BACK TO SCHOOL](https://quizverses.pages.dev/ocean-kids-back-to-school.html)
- [FISH SHOOTING FISH HUNTER](https://quizverses.pages.dev/fish-shooting-fish-hunter.html)
- [CATEGORY BUILDING179](https://themindplays.pages.dev/category-building179.html)
- [TRAVEL STORY MATCH](https://studyplaying.github.io/travel-story-match.html)
- [COLOR DOTS CHALLENGE](https://quizverses-9d2f2.web.app/color-dots-challenge.html)
- [CATEGORY SURVIVAL365](https://studyplaying.github.io/category-survival365.html)
- [CLEAN THE OCEAN](https://quizverses-9d2f2.web.app/clean-the-ocean.html)
- [STICKMAN DISMOUNT SIMULATOR](https://thequizzone.pages.dev/stickman-dismount-simulator.html)
- [LIFE CLICKER](https://thequizzone.pages.dev/life-clicker.html)
- [KABOOM MINER](https://theskillquest.pages.dev/kaboom-miner.html)
- [COLOR NUTS](https://theskillquest.pages.dev/color-nuts.html)
- [CATEGORY HORROR](https://themindplay.github.io/category-horror.html)
- [CANDY MONSTER RAFFI](https://iskillquest.pages.dev/candy-monster-raffi.html)
- [ASCENT](https://iskillplay.web.app/ascent.html)
- [SOCCER EURO CUP 2025](https://thequizzone.pages.dev/soccer-euro-cup-2025.html)
- [CHRISTMAS SNOWBALL ARENA](https://iskillplay.web.app/christmas-snowball-arena.html)
- [BLADE FORGE 3D](https://studyplaying.github.io/blade-forge-3d.html)
- [CATEGORY FASHION](https://studyplayings.web.app/category-fashion.html)
- [ESCAPE THE HORROR CRAFT](https://themindplays.pages.dev/escape-the-horror-craft.html)
- [WARPING BAT](https://iskillquest.pages.dev/warping-bat.html)
- [PARKING FRENZY](https://iskillquest.pages.dev/parking-frenzy.html)
- [CATEGORY BATTLE524](https://themindplays.pages.dev/category-battle524.html)
- [PAPERIO 2](https://iskillplay.web.app/paperio-2.html)
- [CATEGORY MATCH 3117](https://studyplaying.github.io/category-match-3117.html)
- [BUBBLY LAB](https://studyplaying.github.io/bubbly-lab.html)
- [BFFS SPRING BREAK FASHIONISTA](https://studyplaying.github.io/bffs-spring-break-fashionista.html)
- [CAPYBARA GO](https://thequizzone.pages.dev/capybara-go.html)
- [CATEGORY ART](https://themindplay.github.io/category-art.html)
- [SPRUNKI 3D ESCAPE](https://iskillplay.web.app/sprunki-3d-escape.html)
- [CATEGORY STORY45](https://iskillquest.pages.dev/category-story45.html)
- [PRIVACY](https://studyplayings.web.app/privacy.html)
- [TREASURE SEEKER](https://quizverses.pages.dev/treasure-seeker.html)
- [DARTS MASTERCARTOON 3D](https://thequizzone.pages.dev/darts-mastercartoon-3d.html)
- [SUMMER AESTHETICS](https://thelearnquester.web.app/summer-aesthetics.html)
- [100 DOORS CHALLENGE](https://theskillquest.pages.dev/100-doors-challenge.html)
- [CATEGORY CONTROLLER 2](https://studyquests.github.io/category-controller-2.html)
- [RAGDOLL SOCCER 2 PLAYERS](https://themindplays.pages.dev/ragdoll-soccer-2-players.html)
- [MEAN GIRLS GRADUATION DAY](https://studyplayings.web.app/mean-girls-graduation-day.html)
- [SIGMA BOY MUSICAL CLICKER](https://studyplayings.web.app/sigma-boy-musical-clicker.html)
- [PEW PEW DOSE](https://iskillquest.pages.dev/pew-pew-dose.html)
- [GEOMETRY OPEN WORLD](https://iskillplay.web.app/geometry-open-world.html)
- [SEAFARING MEMORY CHALLENGE](https://thequizzone.pages.dev/seafaring-memory-challenge.html)
- [INFINITE CRAFT](https://studyplayings.web.app/infinite-craft.html)
- [SURVEV](https://quizverses-9d2f2.web.app/survev.html)
- [CATEGORY DESTROY256](https://studyplayings.web.app/category-destroy256.html)
- [CATEGORY DESTROY256](https://quizverses-9d2f2.web.app/category-destroy256.html)
- [WHATS IN MY BAG](https://quizverses.github.io/whats-in-my-bag.html)
- [KNOTS](https://thequizzone.pages.dev/knots.html)
- [MOTO ATTACK BIKE RACING](https://thequizzone.pages.dev/moto-attack-bike-racing.html)
- [INDEX14](https://studyplayings.web.app/index14.html)
- [WAR OF GUN](https://studyplaying.github.io/war-of-gun.html)
- [CATEGORY RACING127](https://studyquests.github.io/category-racing127.html)
- [CATEGORY MAHJONG 2](https://studyplayings.pages.dev/category-mahjong-2.html)
- [FOOTBALL RUSH 3D](https://thequizzone.pages.dev/football-rush-3d.html)
- [ARROW WAVE](https://thelearnquester.web.app/arrow-wave.html)
- [AVENGER GUARD](https://theskillquest.pages.dev/avenger-guard.html)
- [GEOMETRY WAVE HERO](https://iskillplay.web.app/geometry-wave-hero.html)
- [RUSSIAN TREASURE HUNTER](https://themindplays.pages.dev/russian-treasure-hunter.html)
- [COLORING BY NUMBERS PIXEL ROOMS](https://iskillplay.web.app/coloring-by-numbers-pixel-rooms.html)
- [CATEGORY CAR 3](https://themindplays.pages.dev/category-car-3.html)
- [IDLE GAME PRISON LIFE](https://studyquests.github.io/idle-game-prison-life.html)
- [PLUG MAN RACE](https://thelearnquester.web.app/plug-man-race.html)
- [IDLE DICE 3D INCREMENTAL GAME](https://thequizzone.pages.dev/idle-dice-3d-incremental-game.html)
- [HORROR FOREST BEAR](https://thelearnquester.web.app/horror-forest-bear.html)
- [CATEGORY WATER39](https://themindplaying.web.app/category-water39.html)
- [SCREW MASTERS 3D PUZZLE](https://themindplay.pages.dev/screw-masters-3d-puzzle.html)
- [PULL THE PIN FISH RESCUE](https://thequizzone.pages.dev/pull-the-pin-fish-rescue.html)
- [CATEGORY ESCAPE187](https://themindplay.github.io/category-escape187.html)
- [STEAL BRAINROT ORIGINAL 3D](https://studyplaying.github.io/steal-brainrot-original-3d.html)
- [GUNFU STICKMAN 2](https://iskillquest.pages.dev/gunfu-stickman-2.html)
- [SCREW IT OUT JAM MATCHING COLORED SCREWS](https://themindplays.pages.dev/screw-it-out-jam-matching-colored-screws.html)
- [CATEGORY TRAFFIC34](https://quizverses.github.io/category-traffic34.html)
- [CHECKERS DELUXE EDITION](https://studyplaying.github.io/checkers-deluxe-edition.html)
- [LOVE IN STYLE](https://themindplay.github.io/love-in-style.html)
- [UNICORN PRINCESS DRESS UP](https://thequizzone.pages.dev/unicorn-princess-dress-up.html)
