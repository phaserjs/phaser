---
name: scale-and-responsive
description: "Use this skill when making a Phaser 4 game responsive or handling display scaling. Covers ScaleManager, scale modes (FIT, RESIZE, EXPAND, ENVELOP), auto-center, fullscreen, and browser resize handling. Triggers on: ScaleManager, responsive, resize, fullscreen, FIT, scale mode."
---

# Scale and Responsive Design
> How to use the ScaleManager for scaling, centering, fullscreen, orientation handling, and responsive resize in Phaser 4.

**Key source paths:** `src/scale/ScaleManager.js`, `src/scale/const/`, `src/scale/events/`, `src/core/typedefs/ScaleConfig.js`
**Related skills:** ../game-setup-and-config/SKILL.md

## Quick Start

Scale-to-fit with centering -- the most common setup for responsive games:

```js
const config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'game-container',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    scene: MyScene
};

const game = new Phaser.Game(config);
```

The `scale` config object is parsed into a `Phaser.Core.Config` instance which the `ScaleManager` reads during boot. The ScaleManager sets the canvas element size and applies CSS scaling to fit it within its parent.

## Core Concepts

### ScaleManager (src/scale/ScaleManager.js)

The ScaleManager is created during the Game boot sequence and is accessible at `game.scale` or `this.scale` from within a Scene. It extends `EventEmitter`.

**Three internal Size components drive all calculations:**

| Component | Property | Purpose |
|-----------|----------|---------|
| `gameSize` | `game.scale.gameSize` | The unmodified game dimensions from config. Used for world bounds, cameras. Read via `game.scale.width` / `game.scale.height`. |
| `baseSize` | `game.scale.baseSize` | The auto-rounded gameSize. Sets the actual `canvas.width` and `canvas.height` attributes. |
| `displaySize` | `game.scale.displaySize` | The CSS-scaled canvas size after applying scale mode, parent bounds, and zoom. Sets `canvas.style.width` / `canvas.style.height`. |

Scaling works by keeping the canvas element dimensions fixed (baseSize) and stretching it via CSS properties (displaySize). This is equivalent to CSS `transform-scale` but without browser prefix issues.

The `displayScale` property (`Phaser.Math.Vector2`) holds the ratio `baseSize / canvasBounds` and is used internally for input coordinate transformation.

### Scale Modes (src/scale/const/SCALE_MODE_CONST.js)

All modes are on `Phaser.Scale.ScaleModes` and are set via `scale.mode` in config:

| Constant | Value | Behavior |
|----------|-------|----------|
| `NONE` | 0 | No automatic scaling. Canvas uses config width/height. You manage sizing yourself. If you resize the canvas externally, call `game.scale.resize(w, h)` to update internals. |
| `WIDTH_CONTROLS_HEIGHT` | 1 | Height adjusts automatically to maintain aspect ratio based on width. |
| `HEIGHT_CONTROLS_WIDTH` | 2 | Width adjusts automatically to maintain aspect ratio based on height. |
| `FIT` | 3 | Scales to fit inside parent while preserving aspect ratio. May leave empty space (letterbox/pillarbox). Most commonly used mode. |
| `ENVELOP` | 4 | Scales to cover the entire parent while preserving aspect ratio. May extend beyond parent bounds (content gets cropped). |
| `RESIZE` | 5 | Canvas element itself is resized to fill parent. No CSS scaling -- 1:1 pixel mapping. The `gameSize`, `baseSize`, and `displaySize` all change to match parent. Beware of GPU fill-rate on large displays. |
| `EXPAND` | 6 | Hybrid of RESIZE and FIT. The visible area resizes to fill the parent, and the canvas scales to fit inside that area. Added in v3.80. |

**Shorthand constants** are also available directly on `Phaser.Scale`: `Phaser.Scale.FIT`, `Phaser.Scale.RESIZE`, etc.

### Center Modes (src/scale/const/CENTER_CONST.js)

Set via `scale.autoCenter` in config. Centering is achieved by setting CSS `marginLeft` and `marginTop` on the canvas:

| Constant | Value | Behavior |
|----------|-------|----------|
| `NO_CENTER` | 0 | No auto-centering (default). |
| `CENTER_BOTH` | 1 | Center horizontally and vertically within parent. |
| `CENTER_HORIZONTALLY` | 2 | Center horizontally only. |
| `CENTER_VERTICALLY` | 3 | Center vertically only. |

The parent element must have calculable bounds. If the parent has no defined width/height, centering will not work correctly.

### Zoom (src/scale/const/ZOOM_CONST.js)

Set via `scale.zoom` in config. Multiplies the display size:

| Constant | Value | Behavior |
|----------|-------|----------|
| `NO_ZOOM` | 1 | No zoom (default). |
| `ZOOM_2X` | 2 | 2x zoom -- good for pixel art at low base resolution. |
| `ZOOM_4X` | 4 | 4x zoom. |
| `MAX_ZOOM` | -1 | Automatically calculates the largest integer zoom that fits in the parent. |

You can also pass any numeric value. The zoom affects CSS display size but not the canvas resolution.

### Orientation (src/scale/const/ORIENTATION_CONST.js)

Read via `game.scale.orientation`. Values are strings:

- `Phaser.Scale.Orientation.LANDSCAPE` = `'landscape-primary'`
- `Phaser.Scale.Orientation.LANDSCAPE_SECONDARY` = `'landscape-secondary'`
- `Phaser.Scale.Orientation.PORTRAIT` = `'portrait-primary'`
- `Phaser.Scale.Orientation.PORTRAIT_SECONDARY` = `'portrait-secondary'`

Convenience booleans: `game.scale.isPortrait`, `game.scale.isLandscape` (device orientation), `game.scale.isGamePortrait`, `game.scale.isGameLandscape` (game dimensions).

## Common Patterns

### FIT Mode with Centering (Most Common)

```js
scale: {
    parent: 'game-container',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
}
```

The game maintains its 16:9 aspect ratio and centers within the parent. Empty space appears as letterbox/pillarbox bars. Style the parent's background color to control bar appearance.

### Responsive Resize (Dynamic Canvas Size)

```js
scale: {
    parent: 'game-container',
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%'
}
```

```js
// In your scene -- respond to size changes:
create() {
    this.scale.on('resize', this.handleResize, this);
}

handleResize(gameSize, baseSize, displaySize) {
    this.cameras.resize(gameSize.width, gameSize.height);
    // Reposition UI elements based on new dimensions
}
```

Width/height accept percentage strings (e.g., `'100%'`) which resolve against the parent size. If the parent has no size, they fall back to `window.innerWidth` / `window.innerHeight`.

### Fullscreen Toggle

```js
// Must be called from a pointerup gesture (not pointerdown)
this.input.on('pointerup', () => {
    if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
    } else {
        this.scale.startFullscreen();
    }
});

// Or use the convenience method:
this.input.on('pointerup', () => {
    this.scale.toggleFullscreen();
});
```

- `startFullscreen(fullscreenOptions)` -- requests browser fullscreen. Default options: `{ navigationUI: 'hide' }`.
- `stopFullscreen()` -- exits fullscreen mode.
- `toggleFullscreen(fullscreenOptions)` -- toggles between the two.
- `isFullscreen` -- read-only boolean for current state.

If no `fullscreenTarget` is configured, Phaser creates a temporary `<div>`, moves the canvas into it, and sends that div fullscreen. The div is removed when leaving fullscreen.

For iframes, the `allowfullscreen` attribute is required.

### Mobile Orientation Handling

```js
create() {
    this.scale.on('orientationchange', (orientation) => {
        if (orientation === Phaser.Scale.LANDSCAPE) {
            // Show game UI
        } else {
            // Show "rotate device" message
        }
    });

    // Lock orientation (mobile browsers only, limited support):
    this.scale.lockOrientation('landscape');
}
```

### Fixed Size (No Scaling)

```js
scale: {
    mode: Phaser.Scale.NONE,
    width: 800,
    height: 600
}
```

In NONE mode, if you change the canvas size externally you must call `game.scale.resize(newWidth, newHeight)` to update all internal components including input coordinates.

### Pixel Art with Max Zoom

```js
scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 320,
    height: 240,
    zoom: Phaser.Scale.MAX_ZOOM
},
pixelArt: true
```

`MAX_ZOOM` calculates the largest integer multiplier that fits in the parent. Combined with `pixelArt: true` (which disables anti-aliasing), this gives crisp pixel rendering.

### Snap Values for Grid Alignment

```js
scale: {
    mode: Phaser.Scale.FIT,
    width: 800,
    height: 600,
    snap: { width: 16, height: 16 }
}
```

When the browser resizes, dimensions snap down to the nearest grid multiple (using floor). Best used with FIT mode. Can also be set at runtime: `game.scale.setSnap(16, 16)` or reset with `game.scale.setSnap()`.

### Min/Max Size Constraints

```js
scale: {
    mode: Phaser.Scale.FIT,
    width: 800,
    height: 600,
    min: { width: 400, height: 300 },
    max: { width: 1600, height: 1200 }
}
```

The display size is clamped to these bounds during scaling calculations.

## Configuration Reference

### ScaleConfig (src/core/typedefs/ScaleConfig.js)

All properties go inside the `scale` object in your game config:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | `number\|string` | `1024` | Base game width. Strings like `'100%'` resolve against parent size. |
| `height` | `number\|string` | `768` | Base game height. Strings like `'100%'` resolve against parent size. |
| `zoom` | `number\|ZoomType` | `1` | Canvas zoom factor. Use `Phaser.Scale.MAX_ZOOM` for auto. |
| `parent` | `HTMLElement\|string\|null` | `undefined` | Parent DOM element or its ID. `undefined` = `document.body`. `null` = no parent (you manage canvas placement). |
| `expandParent` | `boolean` | `true` | Allow ScaleManager to set parent/body CSS height to 100%. |
| `mode` | `ScaleModeType` | `NONE` | Scale mode constant (see table above). |
| `min` | `{width, height}` | - | Minimum canvas dimensions. |
| `max` | `{width, height}` | - | Maximum canvas dimensions. |
| `snap` | `{width, height}` | - | Snap values for resize rounding. |
| `autoRound` | `boolean` | `false` | Floor display/style sizes for low-powered device performance. |
| `autoCenter` | `CenterType` | `NO_CENTER` | Auto-centering mode (see table above). |
| `resizeInterval` | `number` | `500` | Milliseconds between parent size checks (fallback polling). |
| `fullscreenTarget` | `HTMLElement\|string` | `undefined` | Element to send fullscreen. If not set, Phaser creates a wrapper div. |

## Events (src/scale/events/)

All events are on `Phaser.Scale.Events` and are emitted by the ScaleManager instance (`game.scale`):

| Event | String Value | Callback Signature | When |
|-------|-------------|-------------------|------|
| `RESIZE` | `'resize'` | `(gameSize, baseSize, displaySize, previousWidth, previousHeight)` | Any resize, refresh, or scale change. The three Size parameters have `.width`, `.height`, `.aspectRatio`. |
| `ORIENTATION_CHANGE` | `'orientationchange'` | `(orientation)` | Device orientation changes. `orientation` is a string constant from `Phaser.Scale.Orientation`. |
| `ENTER_FULLSCREEN` | `'enterfullscreen'` | `()` | Browser successfully enters fullscreen. |
| `LEAVE_FULLSCREEN` | `'leavefullscreen'` | `()` | Browser leaves fullscreen (via code or user ESC). |
| `FULLSCREEN_FAILED` | `'fullscreenfailed'` | `(error)` | Fullscreen request was denied by the browser. |
| `FULLSCREEN_UNSUPPORTED` | `'fullscreenunsupported'` | `()` | Browser does not support the Fullscreen API. |

## API Quick Reference

### Key Properties (read-only unless noted)

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number` | Game width (from `gameSize.width`). |
| `height` | `number` | Game height (from `gameSize.height`). |
| `isFullscreen` | `boolean` | Currently in fullscreen mode. |
| `isPortrait` | `boolean` | Device is in portrait orientation. |
| `isLandscape` | `boolean` | Device is in landscape orientation. |
| `isGamePortrait` | `boolean` | Game dimensions are taller than wide. |
| `isGameLandscape` | `boolean` | Game dimensions are wider than tall. |
| `scaleMode` | `number` | Current scale mode constant. |
| `orientation` | `string` | Current orientation string. |
| `zoom` | `number` | Current zoom factor. |
| `autoRound` | `boolean` | Whether sizes are auto-floored. |
| `autoCenter` | `number` | Current center mode constant. |
| `parentSize` | `Size` | Computed parent dimensions. |
| `gameSize` | `Size` | Unmodified game dimensions. |
| `baseSize` | `Size` | Canvas element dimensions. |
| `displaySize` | `Size` | CSS-scaled display dimensions. |
| `displayScale` | `Vector2` | Ratio of baseSize to canvasBounds (used for input mapping). |
| `canvas` | `HTMLCanvasElement` | The game canvas element. |
| `canvasBounds` | `Rectangle` | DOM bounding rect of the canvas. |
| `parent` | `HTMLElement` | The parent DOM element. |
| `parentIsWindow` | `boolean` | True if parent is `document.body`. |
| `resizeInterval` | `number` | Polling interval in ms (writable). |

### Key Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `resize(width, height)` | `this` | For NONE mode: sets game, base, and display sizes directly. Updates canvas element and CSS. |
| `setGameSize(width, height)` | `this` | For scaled modes (FIT, etc.): changes the base game size and re-applies scaling. |
| `setParentSize(width, height)` | `this` | Manually set parent dimensions (useful when `parent: null`). |
| `setZoom(value)` | `this` | Change zoom factor at runtime. |
| `setMaxZoom()` | `this` | Set zoom to maximum integer that fits parent. |
| `setSnap(snapWidth, snapHeight)` | `this` | Set or reset snap grid values. |
| `getMaxZoom()` | `number` | Calculate (but don't apply) the max zoom. |
| `getViewPort(camera?, out?)` | `Rectangle` | Get the visible area rectangle, optionally for a specific camera. |
| `refresh(prevW?, prevH?)` | `this` | Force recalculation of scale, bounds, orientation. Emits RESIZE. |
| `startFullscreen(options?)` | `void` | Enter fullscreen. Must be called from `pointerup`. |
| `stopFullscreen()` | `void` | Exit fullscreen. |
| `toggleFullscreen(options?)` | `void` | Toggle fullscreen state. |
| `lockOrientation(orientation)` | `boolean` | Attempt to lock screen orientation (mobile only). |
| `transformX(pageX)` | `number` | Convert DOM pageX to game coordinate. |
| `transformY(pageY)` | `number` | Convert DOM pageY to game coordinate. |
| `getParentBounds()` | `boolean` | Recalculate parent size. Returns true if changed. |
| `updateCenter()` | `void` | Recalculate and apply centering margins. |
| `updateBounds()` | `void` | Update `canvasBounds` from the canvas bounding client rect. |

## Gotchas

1. **Parent element must have dimensions.** The ScaleManager relies on the parent's computed CSS size. An unstyled `<div>` has zero height, which breaks centering and scaling. Either give it explicit CSS dimensions or let `expandParent: true` (the default) set body/parent to 100% height.

2. **No padding on the parent.** The ScaleManager does not account for parent padding. Apply padding to a wrapper element instead, or use margins on the parent's parent.

3. **Do not style the canvas directly.** The ScaleManager controls `canvas.style.width`, `canvas.style.height`, `marginLeft`, and `marginTop`. External CSS on the canvas will conflict.

4. **Fullscreen requires `pointerup`, not `pointerdown`.** On touch devices, `pointerdown` fullscreen requests are blocked unless the document already received touch input. Always use `pointerup` for reliable behavior.

5. **Fullscreen in iframes needs `allowfullscreen`.** Without this attribute on the iframe element, fullscreen requests will silently fail.

6. **RESIZE mode and GPU fill-rate.** RESIZE creates a 1:1 pixel canvas matching the parent. On high-resolution displays this can be very large. Monitor performance on low-end devices.

7. **`resize()` vs `setGameSize()`.** Use `resize()` only in NONE mode (it sets everything directly). Use `setGameSize()` when using FIT/ENVELOP/etc. (it preserves the scale mode calculations).

8. **iOS height quirks.** When the parent is the window on iOS, the ScaleManager uses `GetInnerHeight` to work around Safari's dynamic toolbar affecting `getBoundingClientRect`.

9. **Percentage strings require a sized parent.** Setting `width: '100%'` or `height: '100%'` resolves against `parentSize`. If the parent has no size, it falls back to `window.innerWidth`/`innerHeight`.

10. **`resizeInterval` is a fallback poll.** Modern browsers dispatch `resize` events, but the ScaleManager also polls every `resizeInterval` ms (default 500) to catch edge cases on older browsers.

## Source File Map

| File | Purpose |
|------|---------|
| `src/scale/ScaleManager.js` | Main class -- all scaling, centering, fullscreen, orientation logic. Access via `game.scale`. |
| `src/scale/const/SCALE_MODE_CONST.js` | Scale mode constants: NONE, WIDTH_CONTROLS_HEIGHT, HEIGHT_CONTROLS_WIDTH, FIT, ENVELOP, RESIZE, EXPAND. |
| `src/scale/const/CENTER_CONST.js` | Center mode constants: NO_CENTER, CENTER_BOTH, CENTER_HORIZONTALLY, CENTER_VERTICALLY. |
| `src/scale/const/ZOOM_CONST.js` | Zoom constants: NO_ZOOM, ZOOM_2X, ZOOM_4X, MAX_ZOOM. |
| `src/scale/const/ORIENTATION_CONST.js` | Orientation string constants: LANDSCAPE, LANDSCAPE_SECONDARY, PORTRAIT, PORTRAIT_SECONDARY. |
| `src/scale/events/RESIZE_EVENT.js` | Resize event definition. Callback receives gameSize, baseSize, displaySize, previousWidth, previousHeight. |
| `src/scale/events/ENTER_FULLSCREEN_EVENT.js` | Emitted on successful fullscreen entry. |
| `src/scale/events/LEAVE_FULLSCREEN_EVENT.js` | Emitted when leaving fullscreen. |
| `src/scale/events/FULLSCREEN_FAILED_EVENT.js` | Emitted when fullscreen request is denied. |
| `src/scale/events/FULLSCREEN_UNSUPPORTED_EVENT.js` | Emitted when browser lacks Fullscreen API support. |
| `src/scale/events/ORIENTATION_CHANGE_EVENT.js` | Emitted on device orientation change. Callback receives orientation string. |
| `src/core/typedefs/ScaleConfig.js` | JSDoc typedef for the `scale` config object. |
| `src/structs/Size.js` | The Size component class used by gameSize, baseSize, displaySize. |
| `src/dom/GetInnerHeight.js` | iOS-specific workaround for getting accurate viewport height. |
| `src/dom/GetScreenOrientation.js` | Determines current screen orientation from dimensions. |
