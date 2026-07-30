---
name: render-textures
description: "Use this skill when using RenderTexture or DynamicTexture in Phaser 4. Covers drawing game objects to textures, dynamic texture creation, snapshot/screenshot, stamps, and off-screen rendering. Triggers on: RenderTexture, DynamicTexture, snapshot, draw to texture, stamp."
---

# Render Textures and Dynamic Textures
> Drawing game objects to off-screen textures in Phaser 4 -- RenderTexture game object, DynamicTexture for shared textures, the Stamp helper, command-buffer rendering, snapshots, procedural generation, and minimap patterns.

**Key source paths:** `src/gameobjects/rendertexture/`, `src/textures/DynamicTexture.js`, `src/gameobjects/stamp/`, `src/textures/typedefs/StampConfig.js`, `src/textures/typedefs/CaptureConfig.js`
**Related skills:** ../sprites-and-images/SKILL.md, ../loading-assets/SKILL.md, ../cameras/SKILL.md

## Quick Start

```js
// In a Scene's create() method:

// 1. RenderTexture -- a visible game object with its own DynamicTexture
const rt = this.add.renderTexture(400, 300, 256, 256);
rt.draw('player', 128, 128);          // draw a texture by key at center
rt.fill(0x222244, 0.5);               // semi-transparent fill
rt.render();                           // flush the command buffer

// 2. DynamicTexture -- a shared texture in the Texture Manager
const dt = this.textures.addDynamicTexture('composite', 512, 512);
dt.stamp('coin', null, 64, 64, { scale: 2, angle: 45 });
dt.render();
this.add.image(400, 300, 'composite'); // any game object can use it

// 3. Stamp game object -- lightweight Image that ignores camera scroll
const hud = this.add.stamp(10, 10, 'heart');
```

## Core Concepts

### RenderTexture vs DynamicTexture

Phaser 4 splits texture-drawing into two layers:

| | RenderTexture | DynamicTexture |
|---|---|---|
| What it is | Image game object + auto-created DynamicTexture | Texture in the Texture Manager |
| Created via | `this.add.renderTexture(x, y, w, h)` | `this.textures.addDynamicTexture(key, w, h)` |
| Visible on its own | Yes (it extends Image) | No (must be assigned to a game object) |
| Shared across objects | Possible via `saveTexture(key)` | Yes, by key |
| Cross-scene use | No (belongs to one Scene) | Yes (textures are global) |
| Has position/scale/alpha | Yes (all Image components) | No (it is a Texture, not a GameObject) |

**When to use which:**
- Use **RenderTexture** when you need a single visible surface you draw onto (paint canvas, trail effect, composite sprite).
- Use **DynamicTexture** when many game objects share the same generated texture, or you need a texture for masks/shaders, or you need cross-scene access.

RenderTexture is a thin proxy. Methods like `draw()`, `stamp()`, `fill()`, `clear()`, `erase()`, `snapshot()` all delegate to its underlying `this.texture` (a DynamicTexture).

**Origin note:** RenderTexture extends Image, so its origin defaults to (0.5, 0.5). If you want top-left positioning (common for full-screen or minimap RTs), call `rt.setOrigin(0, 0)`.

### The Command Buffer (v4 Architecture)

In Phaser 4, drawing calls (`draw`, `stamp`, `fill`, `clear`, `erase`, `repeat`, `capture`) do **not** execute immediately. They push commands into a `commandBuffer` array. You must call `.render()` to flush and execute the buffer.

```js
rt.clear();
rt.fill(0x000000);
rt.draw(sprite, 128, 128);
rt.render();  // REQUIRED -- nothing appears without this
```

For RenderTexture game objects, the `renderMode` property controls automatic rendering:

| Mode | Behavior |
|---|---|
| `'render'` (default) | Draws the texture contents to the frame each tick. You call `render()` manually when content changes. |
| `'redraw'` | Calls `render()` automatically every frame but does NOT display itself. Useful for textures reused by other objects. |
| `'all'` | Calls `render()` every frame AND draws itself to the frame. |

```js
rt.setRenderMode('all');       // auto-render + display every frame
rt.setRenderMode('all', true); // same, plus preserve the command buffer
```

### Preserve Mode

By default the command buffer clears after `render()`. Call `preserve(true)` to keep commands between renders, so the same drawing replays each frame:

```js
rt.preserve(true);
rt.clear();
rt.draw(sprite);
// On every subsequent render(), clear + draw will repeat
```

### Stamp Game Object

`Stamp` (`this.add.stamp(x, y, texture, frame)`) is a lightweight Image subclass that ignores camera scroll and transform during rendering. It is used internally by DynamicTexture for drawing operations and is also useful for HUD elements. It extends Image with custom render nodes (`DefaultStampNodes`).

### The `stamp()` Method vs the Stamp Game Object

These are different things:
- **`rt.stamp(key, frame, x, y, config)`** -- a method on RenderTexture/DynamicTexture that draws a texture frame to the surface with transform options (alpha, tint, angle, scale, origin, blendMode).
- **`this.add.stamp(x, y, texture, frame)`** -- a factory that creates a Stamp game object added to the Scene display list.

## Common Patterns

### Drawing Sprites and Game Objects

```js
const rt = this.add.renderTexture(0, 0, 800, 600);

// Single game object at an offset
rt.draw(sprite, 100, 100);

// Array of objects
rt.draw([sprite1, sprite2, sprite3]);

// Group or Container (only visible children are drawn)
rt.draw(enemyGroup);
rt.draw(myContainer, 50, 50);  // offset added to children positions

// Entire Scene display list
rt.draw(this.children);

// Texture by string key
rt.draw('explosion', 200, 200);

// Don't forget to flush
rt.render();
```

The `draw()` method accepts: renderable game objects, Groups, Containers, Display Lists, other RenderTextures/DynamicTextures, Texture Frames, texture key strings, or arrays of any of these.

Note: `alpha` and `tint` parameters on `draw()` only apply to Texture Frames/strings. Game objects use their own alpha and tint when drawn.

### Stamping Textures with Config

The `stamp()` method draws a texture frame with full transform control. The frame is centered on the x/y position by default (origin 0.5).

```js
rt.stamp('bullet', null, 100, 100, {
    alpha: 0.8,
    tint: 0xff0000,
    angle: 45,          // degrees (takes precedence over rotation)
    scale: 2,           // uniform scale
    scaleX: 1.5,        // overrides scale for X
    scaleY: 0.5,        // overrides scale for Y
    originX: 0,         // top-left origin
    originY: 0,
    blendMode: 0
});
rt.render();
```

### Capture -- Drawing with Overrides (v4)

The `capture()` method draws a game object with temporary property overrides, restoring originals afterward:

```js
rt.capture(player, {
    x: 64,
    y: 64,
    scale: 0.5,
    alpha: 0.8,
    rotation: Math.PI / 4,
    transform: 'world',    // 'local', 'world', or a TransformMatrix
    camera: someCamera      // optional camera override
});
rt.render();
```

This is useful for drawing an object at a different position/scale without modifying the object itself.

### Filling and Clearing

```js
// Fill entire texture with color
rt.fill(0xff0000);          // solid red
rt.fill(0x000000, 0.5);     // semi-transparent black

// Fill a region
rt.fill(0x00ff00, 1, 10, 10, 100, 50);  // green rect at (10,10) size 100x50

// Clear everything (transparent)
rt.clear();

// Clear a region
rt.clear(10, 10, 100, 50);

rt.render();
```

### Erasing

Erase uses ERASE blend mode to cut holes in the texture:

```js
rt.fill(0xffffff);           // white background
rt.erase(circleSprite, 100, 100);  // punch a hole shaped like the sprite
rt.render();
```

### Repeating / Tiling a Texture

```js
// Fill the entire RenderTexture with a tiled pattern
rt.repeat('grass', null);                        // tile the whole surface
rt.repeat('brick', null, 0, 0, 256, 128);       // tile a specific region
rt.repeat('tile', 'frame2', 0, 0, 512, 512, {
    tileScaleX: 2,
    tileScaleY: 2,
    tilePositionX: 16,
    alpha: 0.8
});
rt.render();
```

### Snapshots (Pixel Capture)

Snapshots read pixel data from the framebuffer. They are **expensive and blocking** -- use sparingly.

```js
// Full texture snapshot -- callback receives an HTMLImageElement
rt.snapshot(function (image) {
    document.body.appendChild(image);  // or use as texture source
});

// Area snapshot
rt.snapshotArea(0, 0, 128, 128, function (image) {
    // image is 128x128 region from top-left
}, 'image/jpeg', 0.8);

// Single pixel -- callback receives a Phaser.Display.Color
rt.snapshotPixel(64, 64, function (color) {
    console.log(color.r, color.g, color.b, color.a);
});
```

### Using as a Texture Source for Other Objects

```js
const rt = this.add.renderTexture(0, 0, 256, 256);
rt.draw(complexScene);
rt.render();

// Register in the Texture Manager under a key
rt.saveTexture('composited');

// Now any game object can use it
this.add.image(400, 300, 'composited');
this.add.sprite(100, 100, 'composited');

// Updates to the RenderTexture automatically reflect on all users
```

For DynamicTexture, the key is set at creation time:

```js
const dt = this.textures.addDynamicTexture('terrain', 1024, 1024);
dt.repeat('grass', null);
dt.render();
this.add.image(512, 512, 'terrain');  // already keyed
```

### Procedural Generation

```js
const dt = this.textures.addDynamicTexture('starfield', 800, 600);
dt.fill(0x000011);
for (let i = 0; i < 200; i++) {
    const x = Phaser.Math.Between(0, 800);
    const y = Phaser.Math.Between(0, 600);
    const brightness = Phaser.Math.FloatBetween(0.3, 1);
    dt.stamp('star', null, x, y, { alpha: brightness, scale: Phaser.Math.FloatBetween(0.5, 1.5) });
}
dt.render();
this.add.image(400, 300, 'starfield');
```

### Minimap Pattern

```js
create() {
    // Small RenderTexture as minimap
    this.minimap = this.add.renderTexture(700, 50, 150, 100);
    this.minimap.setScrollFactor(0);  // fixed to camera
    this.minimap.setRenderMode('all'); // auto-render every frame
    this.minimap.preserve(true);
}

// In update or a callback:
this.minimap.clear();
this.minimap.fill(0x111111);
// Draw scaled-down versions of world objects
this.minimap.capture(player, { x: px * 0.1, y: py * 0.1, scale: 0.1 });
// render() is automatic in 'all' mode
```

### Callbacks in the Command Buffer

Insert logic between draw commands that executes during `render()`:

```js
rt.clear();
rt.draw(background);
rt.callback(() => {
    // Runs during render, after background is drawn
    sprite.setTint(0xff0000);
});
rt.draw(sprite);
rt.callback(() => {
    sprite.setTint(0xffffff);  // restore after drawing
});
rt.render();
```

### Resizing

```js
// Resize erases all content and recreates the framebuffer
rt.resize(512, 512);

// Optional: disable force-even rounding
rt.resize(513, 513, false);
```

### Internal Camera

Both RenderTexture and DynamicTexture have a `.camera` property that controls how game objects are positioned when drawn. Scroll, zoom, and rotate this camera to transform drawn content. Note: `stamp()` ignores the camera; only `draw()` and game object rendering respect it.

```js
rt.camera.setScroll(100, 50);
rt.camera.setZoom(2);
rt.draw(sprite);  // sprite drawn with camera transform applied
rt.render();
```

## API Quick Reference

### RenderTexture (extends Image)

| Method | Signature | Description |
|---|---|---|
| `draw` | `(entries, x?, y?, alpha?, tint?)` | Draw game objects, textures, groups, etc. |
| `capture` | `(entry, config)` | Draw with temporary property overrides |
| `stamp` | `(key, frame?, x?, y?, config?)` | Stamp a texture frame with transform |
| `erase` | `(entries, x?, y?)` | Draw using ERASE blend mode |
| `fill` | `(rgb, alpha?, x?, y?, w?, h?)` | Fill with color |
| `clear` | `(x?, y?, w?, h?)` | Clear to transparent |
| `repeat` | `(key, frame?, x?, y?, w?, h?, config?)` | Tile a texture as fill pattern |
| `render` | `()` | Flush the command buffer |
| `preserve` | `(bool)` | Keep command buffer between renders |
| `callback` | `(fn)` | Insert callback into command buffer |
| `resize` | `(w, h?, forceEven?)` | Resize (erases content) |
| `saveTexture` | `(key)` | Register in Texture Manager |
| `setRenderMode` | `(mode, preserve?)` | Set 'render', 'redraw', or 'all' |
| `snapshot` | `(callback, type?, quality?)` | Full snapshot to Image |
| `snapshotArea` | `(x, y, w, h, callback, type?, quality?)` | Area snapshot |
| `snapshotPixel` | `(x, y, callback)` | Single pixel to Color |

### DynamicTexture (extends Texture)

Same drawing methods as RenderTexture (`draw`, `stamp`, `erase`, `fill`, `clear`, `repeat`, `capture`, `render`, `preserve`, `callback`, `snapshot`, `snapshotArea`, `snapshotPixel`), plus:

| Method/Property | Description |
|---|---|
| `setSize(w, h?, forceEven?)` | Resize the texture |
| `camera` | Internal Camera for draw positioning |
| `commandBuffer` | Array of pending draw commands |
| `drawingContext` | WebGL DrawingContext with framebuffer |
| `getWebGLTexture()` | Returns the underlying WebGLTextureWrapper |

### StampConfig (for `stamp()` config parameter)

| Property | Default | Description |
|---|---|---|
| `alpha` | 1 | Alpha value |
| `tint` | 0xffffff | Tint color (WebGL only) |
| `angle` | 0 | Degrees (overrides rotation if non-zero) |
| `rotation` | 0 | Radians |
| `scale` | 1 | Uniform scale |
| `scaleX` / `scaleY` | 1 | Per-axis scale (overrides `scale`) |
| `originX` / `originY` | 0.5 | Origin point |
| `blendMode` | 0 | Blend mode |

### CaptureConfig (for `capture()` config parameter)

| Property | Description |
|---|---|
| `transform` | `'local'`, `'world'`, or a `TransformMatrix` |
| `camera` | Camera override for rendering |
| `x`, `y`, `alpha`, `tint`, `angle`, `rotation` | Override game object properties temporarily |
| `scale`, `scaleX`, `scaleY` | Scale overrides |
| `originX`, `originY`, `blendMode` | Additional overrides |

### Factory Methods

```js
this.add.renderTexture(x, y, width?, height?)  // default 32x32
this.add.stamp(x, y, texture, frame?)
this.textures.addDynamicTexture(key, width?, height?, forceEven?)  // default 256x256
```

## Gotchas

1. **Must call `render()`.** In Phaser 4, drawing methods buffer commands. Nothing appears until `render()` is called (unless using `renderMode: 'all'` or `'redraw'`).

2. **Cannot draw to itself.** A DynamicTexture/RenderTexture silently skips entries that reference itself.

3. **Command buffer clears after render.** Call `preserve(true)` before drawing if you need the same commands to replay each frame.

4. **`stamp()` ignores the internal camera.** Only game objects drawn via `draw()` or `capture()` respect the `.camera` property. Texture stamps are positioned absolutely.

5. **Default sizes differ.** RenderTexture defaults to 32x32. DynamicTexture defaults to 256x256.

6. **`forceEven` rounds dimensions up.** By default, width/height are rounded to even numbers for rendering quality. Pass `false` as the last argument if you need exact odd dimensions.

7. **Snapshots are expensive.** They use `readPixels` (WebGL) which blocks the GPU pipeline. Avoid per-frame snapshots. `snapshotPixel` is cheaper than full `snapshot`.

8. **WebGL1 has no anti-aliasing on framebuffers.** Shapes and Graphics drawn to a RenderTexture may have jagged edges. Use pre-rendered sprite textures instead.

9. **`resize()` erases content.** Resizing destroys and recreates the framebuffer.

10. **`saveTexture` renames, does not copy.** Calling `saveTexture(key)` assigns the DynamicTexture to the Texture Manager under that key. Calling it again with a different key renames it. Destroying the RenderTexture without saving first destroys the texture.

11. **`draw()` alpha/tint params only affect Texture Frames.** When drawing game objects, they use their own alpha and tint values. The `alpha` and `tint` parameters on `draw()` only apply when drawing texture strings or Frame instances.

12. **WebGL context loss.** DynamicTexture contents are lost on context loss. Listen for the `restorewebgl` event to redraw.

13. **Groups/Containers: x, y offset is additive.** When drawing a Group or Container with `rt.draw(group, x, y)`, the x/y offset is added to each child's position. Children at (100, 50) drawn with offset (10, 10) appear at (110, 60) in the texture.

## Source File Map

| File | Description |
|---|---|
| `src/gameobjects/rendertexture/RenderTexture.js` | RenderTexture game object (extends Image, proxies to DynamicTexture) |
| `src/gameobjects/rendertexture/RenderTextureFactory.js` | `this.add.renderTexture()` factory registration |
| `src/gameobjects/rendertexture/RenderTextureRender.js` | WebGL/Canvas render functions for RenderTexture |
| `src/gameobjects/rendertexture/RenderTextureRenderModes.js` | Enum: `RENDER`, `REDRAW`, `ALL` |
| `src/textures/DynamicTexture.js` | Core DynamicTexture class (command buffer, drawing, snapshots) |
| `src/textures/DynamicTextureCommands.js` | Command constants (CLEAR, FILL, STAMP, DRAW, ERASE, etc.) |
| `src/textures/typedefs/StampConfig.js` | StampConfig typedef for `stamp()` |
| `src/textures/typedefs/CaptureConfig.js` | CaptureConfig typedef for `capture()` |
| `src/gameobjects/stamp/Stamp.js` | Stamp game object (light Image, ignores camera scroll) |
| `src/gameobjects/stamp/StampFactory.js` | `this.add.stamp()` factory registration |
