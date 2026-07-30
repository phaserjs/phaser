---
name: game-setup-and-config
description: "Use this skill when creating a new Phaser 4 game instance or configuring GameConfig options. Covers renderer selection, canvas setup, scaling, pixel art, FPS settings, boot sequence, and all config sub-objects. Triggers on: new Phaser.Game, GameConfig, game setup, renderer, pixel art, FPS."
---

# Game Setup and Config
> How to create a Phaser.Game instance with the right GameConfig options for renderer, scaling, pixel art, FPS, and canvas placement.

**Key source paths:** `src/core/Game.js`, `src/core/Config.js`, `src/core/typedefs/GameConfig.js`, `src/const.js`, `src/scale/const/`
**Related skills:** ../scenes/SKILL.md, ../loading-assets/SKILL.md, ../scale-and-responsive/SKILL.md

## Quick Start

The simplest possible Phaser 4 game -- a single scene with the default 1024×768 canvas:

```js
class MyScene extends Phaser.Scene {
    preload() {
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        this.add.image(400, 300, 'logo');
    }
}

const config = {
    type: Phaser.AUTO,
    scene: MyScene
};

const game = new Phaser.Game(config);
```

`new Phaser.Game(config)` triggers the entire boot sequence: config parsing (`Config`), renderer creation, DOM insertion, and the game loop (`TimeStep`). The game waits for `DOMContentLoaded` before booting.

## Core Concepts

### Boot Sequence (src/core/Game.js)

1. `new Phaser.Game(config)` -- parses config into a `Phaser.Core.Config` instance.
2. Creates global managers: `AnimationManager`, `TextureManager`, `CacheManager`, `InputManager`, `SceneManager`, `ScaleManager`, `SoundManager`, `TimeStep`, `PluginManager`.
3. Waits for `DOMContentLoaded`, then calls `boot()`.
4. `boot()` creates the renderer (`CreateRenderer`), adds the canvas to the DOM (`AddToDOM`), prints the debug header, emits `BOOT`.
5. Once textures are ready (`TextureManager` emits `READY`), emits `READY` then calls `start()`.
6. `start()` begins the `TimeStep` loop, sets up the `VisibilityHandler`, calls `config.postBoot`.

### Config Parsing (src/core/Config.js)

The `Config` constructor reads a flat `GameConfig` object and resolves defaults. Some properties can be specified at top level OR nested inside sub-objects (e.g., `width` can be top-level or under `scale.width`). The `scale` sub-object takes priority when both are present.

Render properties can likewise be top-level shortcuts (e.g., `pixelArt: true`) or nested under `render`.

### Renderer Constants (src/const.js)

| Constant | Value | Behavior |
|---|---|---|
| `Phaser.AUTO` | `0` | WebGL if supported, else falls back to Canvas |
| `Phaser.CANVAS` | `1` | Force Canvas renderer |
| `Phaser.WEBGL` | `2` | Force WebGL -- no fallback if unsupported |
| `Phaser.HEADLESS` | `3` | No renderer -- DOM still required. For unit testing only |

Set via `config.type`. Default is `Phaser.AUTO`.

## Common Patterns

### Pixel Art Game

When `pixelArt` is `true`, Config automatically sets `antialias: false`, `antialiasGL: false`, and `roundPixels: true`.

```js
const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: Phaser.Scale.ZOOM_2X
    },
    scene: MyScene
};
```

### Smooth Pixel Art (WebGL only)

Preserves blocky pixels but smooths edges between them when scaled up:

```js
const config = {
    type: Phaser.WEBGL,
    width: 320,
    height: 240,
    smoothPixelArt: true,
    scene: MyScene
};
```

When `smoothPixelArt` is `true`, Config sets `antialias: true`, `antialiasGL: true`, and `pixelArt: false`.

### Full-Window Responsive Game

```js
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        width: '100%',
        height: '100%'
    },
    scene: MyScene
};
```

### Fixed Aspect Ratio with FIT

```js
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
        min: { width: 640, height: 360 },
        max: { width: 1920, height: 1080 }
    },
    backgroundColor: '#2d2d2d',
    scene: MyScene
};
```

### Custom FPS Limit

```js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    fps: {
        target: 60,
        limit: 30,
        forceSetTimeOut: false,
        smoothStep: true
    },
    scene: MyScene
};
```

### Transparent Canvas Over HTML

```js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    transparent: true,
    parent: 'game-container',
    scene: MyScene
};
```

When `transparent` is `true`, `backgroundColor` is forced to `0x000000` with alpha `0`.

### Pre-existing Canvas Element

```js
const canvas = document.getElementById('my-canvas');

const config = {
    type: Phaser.WEBGL,
    canvas: canvas,
    width: 800,
    height: 600,
    scene: MyScene
};
```

### Multiple Scenes

```js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [BootScene, PreloadScene, MenuScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 } }
    }
};
```

Only the first scene starts automatically. Others start only if they have `{ active: true }` in their scene config. See ../scenes/SKILL.md.

### Boot Callbacks

```js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    callbacks: {
        preBoot: function (game) {
            // Runs before Phaser boots. Game systems not yet available.
        },
        postBoot: function (game) {
            // Runs after boot. All systems ready, game loop starting.
        }
    },
    scene: MyScene
};
```

### Disabling Input Subsystems

```js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    input: {
        keyboard: true,
        mouse: true,
        touch: false,
        gamepad: false,
        activePointers: 1,
        windowEvents: true
    },
    disableContextMenu: true,
    scene: MyScene
};
```

## Configuration Reference

### Top-Level GameConfig Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `type` | `number` | `Phaser.AUTO` (0) | Renderer: `AUTO`, `CANVAS`, `WEBGL`, or `HEADLESS` |
| `width` | `number\|string` | `1024` | Game width in pixels (or `'100%'`). Overridden by `scale.width` |
| `height` | `number\|string` | `768` | Game height in pixels (or `'100%'`). Overridden by `scale.height` |
| `zoom` | `number` | `1` | Canvas zoom multiplier. Overridden by `scale.zoom` |
| `parent` | `HTMLElement\|string\|null` | `undefined` | DOM element or `id` for canvas. `undefined` = document body. `null` = no parent |
| `canvas` | `HTMLCanvasElement` | `null` | Provide your own canvas element |
| `context` | `CanvasRenderingContext2D\|WebGLRenderingContext` | `null` | Provide your own rendering context |
| `canvasStyle` | `string` | `null` | CSS styles applied to the canvas element |
| `customEnvironment` | `boolean` | `false` | Skip feature detection for non-browser environments. `renderType` cannot be `AUTO` if `true` |
| `scene` | `SceneType\|SceneType[]` | `null` | Scene class (extends Phaser.Scene) or array of scene classes |
| `seed` | `string[]` | `[random]` | Seed for `Phaser.Math.RND` |
| `title` | `string` | `''` | Game title shown in console banner |
| `url` | `string` | `'https://phaser.io/...'` | Game URL shown in console banner |
| `version` | `string` | `''` | Game version shown in console banner |
| `autoFocus` | `boolean` | `true` | Auto-focus window on boot and mousedown |
| `stableSort` | `number\|boolean` | `-1` | `-1` = auto-detect, `0`/`false` = built-in stable sort, `1`/`true` = rely on native ES2019 sort |
| `disableContextMenu` | `boolean` | `false` | Disable right-click context menu |
| `backgroundColor` | `string\|number` | `0x000000` | Canvas background color. Accepts hex number, CSS string, or color object |
| `banner` | `boolean\|BannerConfig` | (shown) | `false` to hide console banner entirely |

### scale (Phaser.Types.Core.ScaleConfig)

| Property | Type | Default | Description |
|---|---|---|---|
| `width` | `number\|string` | `1024` | Base game width |
| `height` | `number\|string` | `768` | Base game height |
| `zoom` | `number` | `1` | Zoom multiplier. Use constants: `NO_ZOOM` (1), `ZOOM_2X` (2), `ZOOM_4X` (4), `MAX_ZOOM` (-1) |
| `parent` | `HTMLElement\|string` | `undefined` | DOM parent for the canvas |
| `mode` | `number` | `Phaser.Scale.NONE` (0) | Scale mode (see table below) |
| `expandParent` | `boolean` | `true` | Allow adjusting parent CSS height to 100% |
| `autoRound` | `boolean` | `false` | Round display/style sizes for performance |
| `autoCenter` | `number` | `NO_CENTER` (0) | Canvas centering mode (see table below) |
| `resizeInterval` | `number` | `500` | Milliseconds between browser size checks |
| `fullscreenTarget` | `HTMLElement\|string` | `null` | Element for fullscreen mode |
| `min` | `{width, height}` | `{0, 0}` | Minimum canvas dimensions |
| `max` | `{width, height}` | `{0, 0}` | Maximum canvas dimensions (0 = no limit) |
| `snap` | `{width, height}` | `{0, 0}` | Snap canvas size to multiples |

### Scale Modes (src/scale/const/SCALE_MODE_CONST.js)

| Constant | Value | Behavior |
|---|---|---|
| `Phaser.Scale.NONE` | `0` | No scaling. Canvas stays at config size |
| `Phaser.Scale.WIDTH_CONTROLS_HEIGHT` | `1` | Height adjusts based on width |
| `Phaser.Scale.HEIGHT_CONTROLS_WIDTH` | `2` | Width adjusts based on height |
| `Phaser.Scale.FIT` | `3` | Fit inside parent keeping aspect ratio (letterboxing) |
| `Phaser.Scale.ENVELOP` | `4` | Cover parent keeping aspect ratio (may overflow) |
| `Phaser.Scale.RESIZE` | `5` | Canvas resizes to fill parent, ignoring aspect ratio |
| `Phaser.Scale.EXPAND` | `6` | Like RESIZE for visible area + FIT for canvas scale |

### Center Modes (src/scale/const/CENTER_CONST.js)

| Constant | Value |
|---|---|
| `Phaser.Scale.NO_CENTER` | `0` |
| `Phaser.Scale.CENTER_BOTH` | `1` |
| `Phaser.Scale.CENTER_HORIZONTALLY` | `2` |
| `Phaser.Scale.CENTER_VERTICALLY` | `3` |

### Zoom Constants (src/scale/const/ZOOM_CONST.js)

| Constant | Value | Behavior |
|---|---|---|
| `Phaser.Scale.NO_ZOOM` | `1` | No zoom |
| `Phaser.Scale.ZOOM_2X` | `2` | 2x zoom |
| `Phaser.Scale.ZOOM_4X` | `4` | 4x zoom |
| `Phaser.Scale.MAX_ZOOM` | `-1` | Max integer zoom that fits in parent |

### render (Phaser.Types.Core.RenderConfig)

These can be set at the top level OR nested under `render`. The `render` sub-object takes priority.

| Property | Type | Default | Description |
|---|---|---|---|
| `antialias` | `boolean` | `true` | Linear interpolation for scaled/rotated textures |
| `antialiasGL` | `boolean` | `true` | Antialias on WebGL context creation |
| `pixelArt` | `boolean` | `false` | Sets `antialias: false`, `roundPixels: true` automatically |
| `smoothPixelArt` | `boolean` | `false` | WebGL only. Blocky pixels with smooth edges |
| `roundPixels` | `boolean` | `false` | Snap texture-based objects to integer positions |
| `transparent` | `boolean` | `false` | Transparent canvas background |
| `clearBeforeRender` | `boolean` | `true` | Clear canvas each frame |
| `preserveDrawingBuffer` | `boolean` | `false` | Preserve WebGL buffers between frames |
| `premultipliedAlpha` | `boolean` | `true` | Pre-multiplied alpha in WebGL drawing buffer |
| `desynchronized` | `boolean` | `false` | Desynchronized rendering context |
| `failIfMajorPerformanceCaveat` | `boolean` | `false` | Abort WebGL if browser reports poor performance |
| `powerPreference` | `string` | `'default'` | `'high-performance'`, `'low-power'`, or `'default'` |
| `batchSize` | `number` | `16384` | Max quads per WebGL batch |
| `maxTextures` | `number` | `-1` | Max GPU textures. `-1` = use all available |
| `maxLights` | `number` | `10` | Max lights visible per camera |
| `autoMobileTextures` | `boolean` | `true` | Restrict to 1 texture per batch on iOS/Android |
| `selfShadow` | `boolean` | `false` | Self-shadowing on lit textured objects |
| `pathDetailThreshold` | `number` | `1` | Point-combining threshold for Graphics WebGL paths |
| `skipUnreadyShaders` | `boolean` | `false` | Skip drawing objects whose shader is still compiling |
| `mipmapFilter` | `string` | `''` | Mipmap filter: `'NEAREST'`, `'LINEAR'`, `'NEAREST_MIPMAP_NEAREST'`, etc. |
| `renderNodes` | `object` | `{}` | Custom render nodes for WebGL renderer |

### fps (Phaser.Types.Core.FPSConfig)

| Property | Type | Default | Description |
|---|---|---|---|
| `min` | `number` | `5` | Minimum acceptable FPS |
| `target` | `number` | `60` | Target FPS (informational, does not enforce) |
| `limit` | `number` | `0` | Enforce max FPS. `0` = no limit |
| `forceSetTimeOut` | `boolean` | `false` | Use `setTimeout` instead of `requestAnimationFrame` |
| `deltaHistory` | `number` | `10` | Frames to average for delta smoothing |
| `panicMax` | `number` | `120` | Frames before trusting delta again after a panic |
| `smoothStep` | `boolean` | `true` | Apply delta smoothing |

### Other Sub-Configs

| Sub-Config Key | Type | Source |
|---|---|---|
| `callbacks` | `CallbacksConfig` | `src/core/typedefs/CallbacksConfig.js` |
| `dom` | `DOMContainerConfig` | `src/core/typedefs/DOMContainerConfig.js` |
| `input` | `InputConfig` | `src/core/typedefs/InputConfig.js` |
| `loader` | `LoaderConfig` | `src/core/typedefs/LoaderConfig.js` |
| `physics` | `PhysicsConfig` | `src/core/typedefs/PhysicsConfig.js` |
| `plugins` | `PluginObject\|PluginObjectItem[]` | `src/core/typedefs/PluginObject.js` |
| `audio` | `AudioConfig` | `src/core/typedefs/AudioConfig.js` |
| `images` | `ImagesConfig` | `src/core/typedefs/ImagesConfig.js` |

## Game Lifecycle, Pause/Resume, and Destroy

### Game Lifecycle Events

Listen on `game.events` (or `this.game.events` from a Scene) for visibility and focus changes:

```js
game.events.on('blur', () => { /* tab lost focus */ });
game.events.on('focus', () => { /* tab regained focus */ });
game.events.on('hidden', () => { /* Page Visibility API: page hidden */ });
game.events.on('visible', () => { /* Page Visibility API: page visible */ });
game.events.on('pause', () => { /* game.pause() was called */ });
game.events.on('resume', () => { /* game.resume() was called */ });
```

Use named constants: `Phaser.Core.Events.BLUR`, `FOCUS`, `HIDDEN`, `VISIBLE`, `PAUSE`, `RESUME`.

### Pause and Resume

```js
// Pause the entire game loop (rendering and updates stop)
game.pause();

// Resume the game loop
game.resume();

// Check if the game is currently paused
if (game.isPaused) {
    // game loop is not running
}
```

### Destroying the Game

```js
// Remove the canvas from the DOM and clean up
game.destroy(true);

// Full cleanup -- pass noReturn=true if you will NEVER create another Phaser instance
// This allows the framework to release additional internal references
game.destroy(true, true);
```

`destroy(removeCanvas, noReturn)` is asynchronous -- it flags the game for destruction on the next frame. Listen for `Phaser.Core.Events.DESTROY` to react to completion.

### Global Game Members

The `Game` instance exposes key managers as properties, accessible from any Scene via `this.game`:

| Property | Type | Description |
|---|---|---|
| `game.config` | `Phaser.Core.Config` | Parsed GameConfig (read-only after boot) |
| `game.scene` | `SceneManager` | Start, stop, switch, and manage all scenes |
| `game.registry` | `DataManager` | Shared data store across all scenes |
| `game.anims` | `AnimationManager` | Global animation definitions |
| `game.cache` | `CacheManager` | Stores loaded non-texture assets (JSON, XML, etc.) |
| `game.textures` | `TextureManager` | Stores all loaded textures and sprite sheets |
| `game.sound` | `SoundManager` | Global sound playback manager |

```js
// Example: access the registry from any scene
this.game.registry.set('highScore', 9999);

// Example: access the scene manager
this.game.scene.start('MenuScene');
```

## Gotchas and Common Mistakes

1. **scale vs top-level config.** `width`, `height`, `zoom`, and `parent` can be set at the top level or inside `scale`. The `scale` sub-object values take priority. Avoid setting both to prevent confusion.

2. **Phaser.WEBGL has no fallback.** Unlike `AUTO`, using `Phaser.WEBGL` directly will not fall back to Canvas if WebGL is unavailable. The game will fail silently.

3. **parent: null vs parent: undefined.** `undefined` (or omitted) appends the canvas to `document.body`. `null` means Phaser will not add the canvas to the DOM at all -- you must do it yourself.

4. **transparent overrides backgroundColor.** When `transparent: true`, the background color is forced to `rgba(0,0,0,0)` regardless of what you set.

5. **fps.target does not enforce frame rate.** It is advisory only. Use `fps.limit` to actually cap the frame rate. The browser's display refresh rate is always the upper bound.

6. **fps.limit only slows down, never speeds up.** Setting `limit: 120` on a 60Hz display still results in 60 FPS.

7. **DOM Container requires a parent.** Setting `dom.createContainer: true` without providing a `parent` element will not work.

8. **smoothPixelArt is WebGL-only.** It has no effect with the Canvas renderer.

9. **window.FORCE_WEBGL and window.FORCE_CANVAS.** Config.js checks for these globals at the end of parsing and will override the `type` setting. This is intended for development/testing.

10. **Game.destroy() is asynchronous.** It flags the game for destruction on the next frame. Listen for the `DESTROY` event to react to completion. Pass `noReturn: true` only if you will never create another Phaser instance on the same page.

## v4 Changes from v3

- **Default dimensions changed:** Width defaults to `1024` (was `800`), height to `768` (was `600`).
- **EXPAND scale mode added:** `Phaser.Scale.EXPAND` (value `6`) is new -- combines RESIZE visible area behavior with FIT canvas scaling.
- **Loader maxRetries default:** `loader.maxRetries` defaults to `2` (was `0` in early v3).
- **smoothPixelArt option:** New WebGL-only rendering mode that smooths edges between blocky pixels.
- **renderNodes config:** New `render.renderNodes` property for custom WebGL render node registration.
- **skipUnreadyShaders:** New option for parallel shader compilation to prevent stutter.
- **pathDetailThreshold:** New config for Graphics WebGL path point combining.

## Source File Map

| Concept | File |
|---|---|
| Game class / boot sequence | `src/core/Game.js` |
| Config parsing / all defaults | `src/core/Config.js` |
| GameConfig typedef | `src/core/typedefs/GameConfig.js` |
| Renderer constants (AUTO, WEBGL, CANVAS, HEADLESS) | `src/const.js` |
| FPSConfig typedef | `src/core/typedefs/FPSConfig.js` |
| RenderConfig typedef | `src/core/typedefs/RenderConfig.js` |
| ScaleConfig typedef | `src/core/typedefs/ScaleConfig.js` |
| Scale mode constants | `src/scale/const/SCALE_MODE_CONST.js` |
| Center constants | `src/scale/const/CENTER_CONST.js` |
| Zoom constants | `src/scale/const/ZOOM_CONST.js` |
| TimeStep (game loop) | `src/core/TimeStep.js` |
| Renderer creation | `src/core/CreateRenderer.js` |
| ScaleManager | `src/scale/ScaleManager.js` |
| CallbacksConfig typedef | `src/core/typedefs/CallbacksConfig.js` |
| DOMContainerConfig typedef | `src/core/typedefs/DOMContainerConfig.js` |
| InputConfig typedef | `src/core/typedefs/InputConfig.js` |
| LoaderConfig typedef | `src/core/typedefs/LoaderConfig.js` |
| All core typedefs | `src/core/typedefs/` |
