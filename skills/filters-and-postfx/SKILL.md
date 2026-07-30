---
name: filters-and-postfx
description: "Use this skill when applying visual filters or post-processing effects in Phaser 4. Covers bloom, blur, glow, color matrix, barrel distortion, displacement, custom shaders, and the filter pipeline. Triggers on: filter, post-processing, shader, bloom, blur, glow, color effects."
---

# Phaser 4 Filters and Post-FX

## Quick Start

Add a glow effect to a sprite:

```js
// In your Scene's create() method:
const sprite = this.add.sprite(400, 300, 'player');

// Step 1: Enable the filter system on the game object (WebGL only)
sprite.enableFilters();

// Step 2: Add filters via .filters.internal or .filters.external
sprite.filters.internal.addGlow(0xff00ff, 4, 0, 1);
```

Add a blur to the camera:

```js
// Cameras have filters enabled by default - no enableFilters() needed
const camera = this.cameras.main;
camera.filters.internal.addBlur(0, 2, 2, 1);
```

---

## Core Concepts

### How Filters Work in v4

Filters are GPU-based post-processing effects applied after an object or camera renders to a texture. Each filter runs a shader pass over that texture, producing the final visual output. Filters are WebGL only.

The rendering pipeline for a camera with filters:

1. Objects render to a texture the size of the camera.
2. **Internal filters** process that texture, applying effects in object/camera local space.
3. The texture is drawn to a context-sized texture, applying camera transformations (position, rotation, zoom).
4. **External filters** process that context texture, applying effects in screen space.
5. The final texture is composited into the output.

### Internal vs External Filters

Every `FilterList` exposes two sub-lists: `filters.internal` and `filters.external`. The distinction controls **when** the filter runs relative to the camera/object transform:

- **Internal** -- applied before the camera transform. Effects operate in the object's local coordinate space. A horizontal blur on a rotated object appears rotated with the object. Internal filters only cover the object/camera region, so they are cheaper.
- **External** -- applied after the camera transform. Effects operate in screen space. A horizontal blur on a rotated object always blurs horizontally on screen. External filters are full-screen and more expensive.

Use internal filters wherever possible for better performance.

### FilterList

`FilterList` (`Phaser.GameObjects.Components.FilterList`) is the container that holds filter controllers. It provides:

- `add(filter, index)` -- add a Controller instance at an optional index
- `remove(filter, forceDestroy)` -- remove and destroy a filter
- `clear()` -- remove and destroy all filters
- `getActive()` -- return all filters where `active === true`
- `list` -- the raw array of Controllers (safe to reorder)
- Convenience factory methods: `addBlur()`, `addGlow()`, `addMask()`, etc.

### Filter Controllers

Every filter is a `Phaser.Filters.Controller` subclass. Common Controller properties:

| Property | Type | Description |
|---|---|---|
| `active` | boolean | Toggle the filter on/off without removing it |
| `camera` | Camera | The camera that owns this filter |
| `renderNode` | string | The render node ID for the shader |
| `paddingOverride` | Rectangle | Override automatic padding calculation |
| `ignoreDestroy` | boolean | If true, the filter survives when its FilterList is destroyed (for reuse) |

Key methods: `setActive(bool)`, `setPaddingOverride(left, top, right, bottom)`, `getPadding()`, `destroy()`.

### Enabling Filters on Game Objects

Cameras have filters available by default. Game objects do not -- you must call `enableFilters()` first:

```js
const sprite = this.add.sprite(400, 300, 'hero');
sprite.enableFilters();

// Now sprite.filters is available
sprite.filters.internal.addGlow();
sprite.filters.external.addVignette();
```

`enableFilters()` creates an internal `filterCamera` on the game object that handles rendering the object to a texture for filter processing. It returns `this` for chaining.

Related properties on game objects after enabling:

| Property | Default | Description |
|---|---|---|
| `filterCamera` | null -> Camera | The internal camera used for filter rendering |
| `filters` | null -> {internal, external} | Access to the FilterList pair |
| `renderFilters` | true | Master toggle for all filter rendering |
| `filtersAutoFocus` | true | Auto-adjust camera to follow the object |
| `filtersFocusContext` | false | Focus on the rendering context instead of the object bounds |
| `filtersForceComposite` | false | Always draw to a framebuffer even with no active filters |
| `maxFilterSize` | null -> Vector2 | Maximum texture size for filter framebuffers |

Use `willRenderFilters()` to check if any active filters will actually render.

---

## Common Patterns

### Adding Filters to Game Objects

```js
const sprite = this.add.sprite(400, 300, 'enemy');
sprite.enableFilters();

// Add a glow
const glow = sprite.filters.internal.addGlow(0x00ff00, 4);

// Modify at runtime
glow.outerStrength = 8;
glow.color = 0xff0000;

// Temporarily disable
glow.setActive(false);

// Remove and destroy
sprite.filters.internal.remove(glow);
```

### Camera Filters

```js
const camera = this.cameras.main;

// Internal: effect in camera-local space
const blur = camera.filters.internal.addBlur(0, 2, 2, 1);

// External: effect in screen space
const vignette = camera.filters.external.addVignette(0.5, 0.5, 0.5, 0.5);

// Color grading via ColorMatrix
const cm = camera.filters.internal.addColorMatrix();
cm.colorMatrix.sepia();
```

### Chaining Multiple Filters

Filters execute in list order. Each filter receives the output of the previous one:

```js
const cam = this.cameras.main;

// First: apply color grading
const cm = cam.filters.internal.addColorMatrix();
cm.colorMatrix.brightness(0.2);

// Second: apply blur to the color-graded result
cam.filters.internal.addBlur(1, 2, 2, 1);

// Third: add a vignette on top
cam.filters.external.addVignette(0.5, 0.5, 0.5, 0.8);
```

### Masks via Filters

Masks in v4 are implemented as filters. They use the alpha channel of a texture or game object to control visibility:

```js
// Mask with a static texture
sprite.enableFilters();
sprite.filters.internal.addMask('maskTexture');

// Mask with a game object (renders to DynamicTexture automatically)
const maskShape = this.add.circle(0, 0, 100, 0xffffff);
sprite.enableFilters();
const mask = sprite.filters.internal.addMask(maskShape);

// Invert the mask
mask.invert = true;

// Control auto-updating for game object masks
mask.autoUpdate = true;  // default: re-renders each frame
mask.needsUpdate = true; // force a one-time update

// Use a specific camera for viewing the mask object
sprite.filters.external.addMask(maskShape, false, this.cameras.main);
```

Internal masks match the object being filtered. External masks match the camera context. Use a `viewCamera` parameter to control which camera renders the mask game object.

### Wipe / Reveal Transitions

```js
const camera = this.cameras.main;
const wipe = camera.filters.external.addWipe(0.1, 0, 0);

// Animate via tween
this.tweens.add({
    targets: wipe,
    progress: 1,
    duration: 2000,
    ease: 'Linear'
});

// Direction helpers
wipe.setLeftToRight();
wipe.setTopToBottom();
wipe.setRevealEffect();   // reveal mode
wipe.setWipeEffect();     // wipe mode

// Wipe to another texture (for scene transitions)
wipe.setTexture('nextSceneCapture');
```

### ParallelFilters (Custom Bloom and Compositing)

ParallelFilters splits the input into two paths, processes each independently, then blends the results. This replaces the dedicated Bloom filter from v3:

```js
const camera = this.cameras.main;
const pf = camera.filters.internal.addParallelFilters();

// Top path: threshold bright areas, then blur them
pf.top.addThreshold(0.5, 1);
pf.top.addBlur();

// Configure the blend (how top combines onto bottom)
pf.blend.blendMode = Phaser.BlendModes.ADD;
pf.blend.amount = 0.5;

// Bottom path: left empty = uses original input
```

### CaptureFrame for Scene-Level Effects

`CaptureFrame` captures the current render state at the point it appears in the display list. Objects rendered before it are captured; objects after it are not:

```js
// Requires composite mode on the camera
this.cameras.main.setForceComposite(true);

// Objects rendered before CaptureFrame are captured
const bg = this.add.image(400, 300, 'background');

// Create the capture point
const capture = this.add.captureFrame('myCapture');

// Display the captured texture with filters applied
const display = this.add.image(400, 300, 'myCapture');
display.enableFilters();
display.filters.internal.addBlur(0, 4, 4, 2);
```

---

## All Built-in Filters

| Filter | Add Method | Description |
|---|---|---|
| Barrel | `addBarrel(amount)` | Pinch/expand distortion. `amount=1` is neutral. |
| Blend | `addBlend(texture, blendMode, amount, color)` | Blend another texture using a blend mode. Supports modes not available in standard WebGL. |
| Blocky | `addBlocky(config)` | Pixelation that preserves original colors (no blending). Best without anti-aliasing. |
| Blur | `addBlur(quality, x, y, strength, color, steps)` | Gaussian blur. Quality: 0=low, 1=medium, 2=high. |
| Bokeh | `addBokeh(radius, amount, contrast)` | Depth-of-field bokeh blur effect. |
| ColorMatrix | `addColorMatrix()` | Color manipulation via matrix. Access `.colorMatrix` for sepia, grayscale, brightness, hue, etc. |
| CombineColorMatrix | `addCombineColorMatrix(texture)` | Combine channels from two textures via color matrices. Useful for alpha transfer. |
| Displacement | `addDisplacement(texture, x, y)` | Pixel displacement using a displacement map texture. Values are very small floats (e.g. 0.005). |
| Glow | `addGlow(color, outerStrength, innerStrength, scale, knockout, quality, distance)` | Luminous halo around edges. Supports inner/outer glow and knockout mode. |
| GradientMap | `addGradientMap(config)` | Recolor image using a ColorRamp based on brightness. |
| ImageLight | `addImageLight(config)` | Image-based lighting using a panorama environment map and normal map. |
| Key | `addKey(config)` | Chroma key: remove or isolate a specific color. Config: `{ color, threshold, feather, isolate }`. |
| Mask | `addMask(mask, invert, viewCamera, viewTransform, scaleFactor)` | Alpha masking via texture or game object. |
| NormalTools | `addNormalTools(config)` | Manipulate normal maps: rotate, adjust facing power, output grayscale facing data. |
| PanoramaBlur | `addPanoramaBlur(config)` | Spherically-correct blur for panorama images. For use with ImageLight. Very slow. |
| ParallelFilters | `addParallelFilters()` | Split input into two filter paths, blend results. Use for custom bloom. |
| Pixelate | `addPixelate(amount)` | Mosaic/pixelation effect. Pixel size = 2 + amount. Blends colors (unlike Blocky). |
| Quantize | `addQuantize(config)` | Reduce color palette. Supports RGBA/HSVA modes, gamma, offset, dithering. |
| Sampler | `addSampler(callback, region)` | Extract pixel data from the render. Does not alter the image. Expensive. |
| Shadow | `addShadow(x, y, decay, power, color, samples, intensity)` | Drop shadow with offset, decay, and color. |
| Threshold | `addThreshold(edge1, edge2, invert)` | Binary threshold per channel. Edges can be arrays for per-channel control. |
| TiltShift | `addTiltShift(radius, amount, contrast, blurX, blurY, strength)` | Miniature/tilt-shift effect (uses Bokeh internally). |
| Vignette | `addVignette(x, y, radius, strength, color, blendMode)` | Edge darkening/coloring. Supports NORMAL, ADD, MULTIPLY, SCREEN blend modes. |
| Wipe | `addWipe(wipeWidth, direction, axis, reveal, wipeTexture)` | Wipe/reveal transition. Animate `progress` via tween. |

---

## API Quick Reference

### Enabling and Accessing Filters

```js
// Game objects: must enable first
gameObject.enableFilters();
gameObject.filters.internal.addBlur();
gameObject.filters.external.addGlow();

// Cameras: filters available immediately
camera.filters.internal.addBlur();
camera.filters.external.addGlow();
```

### FilterList Methods

```js
const list = camera.filters.internal;

list.addBlur();                    // Factory method (one per filter type)
list.add(controllerInstance);      // Add a pre-built controller
list.add(controller, 2);           // Insert at index 2
list.remove(controller);           // Remove and destroy
list.clear();                      // Remove and destroy all
list.getActive();                  // Get all active controllers
list.list;                         // Raw array (reorder safely)
```

### Controller Common API

```js
controller.active = false;                  // Disable without removing
controller.setActive(true);                 // Enable (returns this)
controller.setPaddingOverride(10, 10, 10, 10); // Override padding
controller.setPaddingOverride(null);        // Clear override
controller.ignoreDestroy = true;            // Survive FilterList.destroy()
controller.destroy();                       // Manual cleanup
```

### Mask Filter API

```js
const mask = list.addMask('texKey');       // From texture key
const mask = list.addMask(gameObject);     // From game object
mask.invert = true;                         // Invert mask
mask.autoUpdate = false;                    // Stop auto-updating GO masks
mask.needsUpdate = true;                    // Force one update
mask.setTexture('newKey');                  // Change texture source
mask.setGameObject(newGO);                 // Change GO source
mask.viewCamera = otherCamera;             // Camera for GO rendering
mask.viewTransform = 'local';              // 'local' or 'world'
mask.scaleFactor = 0.5;                    // Scale mask texture size
```

### ColorMatrix Presets

```js
const cm = list.addColorMatrix();
cm.colorMatrix.sepia();
cm.colorMatrix.grayscale(1);
cm.colorMatrix.brightness(0.3);
cm.colorMatrix.hue(90);
cm.colorMatrix.saturate(-0.5);
cm.colorMatrix.contrast(0.3);
cm.colorMatrix.blackWhite();
cm.colorMatrix.negative();
cm.colorMatrix.desaturate();
cm.colorMatrix.night(0.5);
cm.colorMatrix.lsd();
cm.colorMatrix.brown();
cm.colorMatrix.vintagePinhole();
cm.colorMatrix.kodachrome();
cm.colorMatrix.technicolor();
cm.colorMatrix.polaroid();
cm.colorMatrix.shiftToBGR();
```

---

## Gotchas

1. **WebGL only** -- Filters do not work in Canvas renderer. `enableFilters()` returns early if WebGL is not available.

2. **enableFilters() required for game objects** -- Cameras have filters by default. Sprites, images, containers, and other game objects require `enableFilters()` before accessing `filters`.

3. **Performance cost** -- Each object with active filters creates extra draw calls (one for the base render plus one per active filter). Use sparingly and performance test early.

4. **Internal vs external matters** -- Internal filters are cheaper (object-region sized). External filters are full-screen. A blur that should rotate with the object must be internal; a blur that should stay screen-aligned must be external.

5. **Filter order matters** -- Filters are applied sequentially in list order. The output of one feeds into the next.

6. **Glow quality and distance are immutable** -- `quality` and `distance` on the Glow filter cannot be changed after creation. Destroy and recreate the filter to change them.

7. **CaptureFrame requires forceComposite** -- The camera must have `setForceComposite(true)` or otherwise render into a framebuffer for CaptureFrame to work.

8. **Padding for expanding effects** -- Filters like Blur, Glow, and Shadow can automatically calculate padding to expand the render texture. Override with `setPaddingOverride()` if needed. Pass `null` to clear the override. When used on a camera, use `camera.getPaddingWrapper(x)` to render more world outside the image edge.

9. **Controller reuse** -- By default, controllers are destroyed when their FilterList is destroyed. Set `ignoreDestroy = true` to reuse a controller across multiple objects, but you must manage its lifecycle manually. Works best with external filters.

10. **Mask game object rendering** -- When using a game object as a mask source, it is rendered to a DynamicTexture each frame (if `autoUpdate` is true). Set `autoUpdate = false` and use `needsUpdate = true` for one-shot updates to improve performance for static masks.

11. **No Bloom filter** -- v4 does not have a dedicated Bloom filter. Use ParallelFilters with Threshold + Blur + ADD blend instead (see Common Patterns), or use `Phaser.Actions.AddEffectBloom` to automate the process.

---

## v4 Changes from v3

| v3 (FX) | v4 (Filters) | Notes |
|---|---|---|
| `gameObject.preFX` / `gameObject.postFX` | `gameObject.filters.internal` / `gameObject.filters.external` | `preFX`/`postFX` replaced by internal/external filter lists |
| `camera.postFX` | `camera.filters.internal` / `camera.filters.external` | Cameras now have both internal and external lists |
| `FX.addBloom()` | Use `ParallelFilters` + Threshold + Blur | No dedicated Bloom filter; build it with ParallelFilters or `Phaser.Actions.AddEffectBloom` |
| `FX.addCircle()` | Use Vignette or Mask | Circle effect removed; use Vignette with radius or a circular Mask, or automate with `Phaser.Actions.AddMaskShape` |
| `FX.addGradient()` | Use Gradient GameObject + Quantize | New Gradient GameObject renders gradients; Quantize adds steps if wanted |
| Glow `quality` was 0-1 fraction | Glow `quality` is an integer (default 10) | Stochastic sampling replaces line sampling; higher quality at lower values |
| `camera.setMask()` | `camera.filters.internal.addMask()` | Masks are now filters, not a separate system |
| `gameObject.setMask()` | `gameObject.filters.internal.addMask()` | Same unified filter system |
| FX controllers | `Phaser.Filters.Controller` subclasses | Same pattern: returned controller objects with mutable properties |
| -- | `enableFilters()` required for game objects | New explicit opt-in step for game objects |
| -- | Blocky, Quantize, Key, Blend, CombineColorMatrix, ImageLight, NormalTools, PanoramaBlur, ParallelFilters, Sampler | New filters added in v4 |

---

## Source File Map

| File | Description |
|---|---|
| `src/gameobjects/components/Filters.js` | Mixin that adds `enableFilters()`, `filterCamera`, `filters` to game objects |
| `src/gameobjects/components/FilterList.js` | FilterList class with all `add*()` factory methods |
| `src/filters/Controller.js` | Base Controller class for all filters |
| `src/filters/Barrel.js` | Barrel distortion filter |
| `src/filters/Blend.js` | Texture blend filter |
| `src/filters/Blocky.js` | Color-preserving pixelation filter |
| `src/filters/Blur.js` | Gaussian blur filter |
| `src/filters/Bokeh.js` | Bokeh / tilt shift filter |
| `src/filters/ColorMatrix.js` | Color matrix filter (sepia, grayscale, etc.) |
| `src/filters/CombineColorMatrix.js` | Dual-texture channel combining filter |
| `src/filters/Displacement.js` | Displacement map filter |
| `src/filters/Glow.js` | Glow/outline filter |
| `src/filters/GradientMap.js` | Gradient map recoloring filter |
| `src/filters/ImageLight.js` | Image-based lighting filter |
| `src/filters/Key.js` | Chroma key filter |
| `src/filters/Mask.js` | Alpha mask filter (texture or game object) |
| `src/filters/NormalTools.js` | Normal map manipulation filter |
| `src/filters/PanoramaBlur.js` | Spherical panorama blur filter |
| `src/filters/ParallelFilters.js` | Parallel filter paths with blend |
| `src/filters/Pixelate.js` | Pixelation filter |
| `src/filters/Quantize.js` | Color quantization filter |
| `src/filters/Sampler.js` | Pixel sampling/readback filter |
| `src/filters/Shadow.js` | Drop shadow filter |
| `src/filters/Threshold.js` | Threshold filter |
| `src/filters/Vignette.js` | Vignette filter |
| `src/filters/Wipe.js` | Wipe/reveal transition filter |
| `src/gameobjects/captureframe/CaptureFrame.js` | CaptureFrame game object for scene-level capture |

---

Related: sprites-and-images.md, cameras.md, v4-new-features.md
