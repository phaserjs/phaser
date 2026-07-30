# Phaser v3 to v4 Migration Guide

This guide covers everything you need to change when upgrading a Phaser v3 project to Phaser v4. It is organized from highest-impact changes to smaller details, so you can work through it top-to-bottom.

---

## Table of Contents

1. [Renderer: Pipelines to Render Nodes](#1-renderer-pipelines-to-render-nodes)
2. [Canvas Renderer Deprecated](#2-canvas-renderer-deprecated)
3. [FX and Masks are now Filters](#3-fx-and-masks-are-now-filters)
4. [Tint System](#4-tint-system)
5. [Camera System](#5-camera-system)
6. [Texture Coordinates and GL Orientation](#6-texture-coordinates-and-gl-orientation)
7. [DynamicTexture and RenderTexture](#7-dynamictexture-and-rendertexture)
8. [Shader API](#8-shader-api)
9. [GLSL Loading](#9-glsl-loading)
10. [Lighting](#10-lighting)
11. [TileSprite](#11-tilesprite)
12. [Graphics and Shape](#12-graphics-and-shape)
13. [Geometry: Point Replaced by Vector2](#13-geometry-point-replaced-by-vector2)
14. [Math Constants](#14-math-constants)
15. [Data Structures](#15-data-structures)
16. [Round Pixels](#16-round-pixels)
17. [Removed Game Objects](#17-removed-game-objects)
18. [Removed Plugins and Entry Points](#18-removed-plugins-and-entry-points)
19. [Removed Utilities and Polyfills](#19-removed-utilities-and-polyfills)
20. [Spine Plugins](#20-spine-plugins)
21. [Miscellaneous Breaking Changes](#21-miscellaneous-breaking-changes)
22. [Migration Checklist](#migration-checklist)

---

## 1. Renderer: Pipelines to Render Nodes

Phaser v4 contains a brand-new WebGL renderer. The entire rendering pipeline from v3 has been replaced. This is the single biggest change in v4.

**What was removed:**

The v3 `Pipeline` system has been removed entirely. Pipelines frequently held multiple responsibilities (e.g. the Utility pipeline handled various different rendering tasks) and each had to manage WebGL state independently, leading to conflicts where one pipeline could break another's assumptions.

**What replaced it:**

The new `RenderNode` architecture. Each render node handles a single rendering task, making the system more maintainable. All render nodes have a `run` method, and some have a `batch` method to assemble state from several sources before invoking `run`.

**What this means for you:**

- If your game only uses the standard Phaser API (Sprites, Text, Tilemaps, etc.), the new renderer should work transparently.
- If you wrote **custom WebGL pipelines** in v3, they will need to be rewritten as render nodes. Use `RenderConfig#renderNodes` to register custom render nodes at boot.
- If you accessed `WebGLRenderer` internals directly, be aware that many internal properties have been removed or restructured:
  - `WebGLRenderer.textureIndexes` is removed. Use `glTextureUnits.unitIndices` instead.
  - `WebGLRenderer#genericVertexBuffer` and `#genericVertexData` are removed (freeing ~16MB RAM/VRAM). `BatchHandler` render nodes now create their own WebGL data buffers.
  - `WebGLAttribLocationWrapper` is removed.
- Do not make direct WebGL `gl` calls in a Phaser v4 game. This can change the WebGL state without updating the internal `WebGLGlobalWrapper`, causing unpredictable behavior. If you need direct WebGL access, use an `Extern` game object, which resets state after it finishes.

---

## 2. Canvas Renderer Deprecated

The Canvas renderer is still available but should be considered deprecated. Canvas rendering does not support any of the WebGL techniques used in v4's advanced rendering features. As WebGL support is effectively baseline today, we recommend WebGL for all new projects.

Canvas retains one advantage: 27 blend modes vs WebGL's 4 native modes (NORMAL, ADD, MULTIPLY, SCREEN). In v4, the new `Blend` filter can recreate all Canvas blend modes in WebGL, though it requires indirection through a `CaptureFrame`, `DynamicTexture`, or similar.

---

## 3. FX and Masks are now Filters

This is one of the most impactful changes for v3 users who relied on the FX or Mask systems.

**What changed:**

FX (pre and post) and Masks have been unified into a single **Filter** system. A Filter takes an input image and produces an output image, usually via a single shader. All filters are mutually compatible.

**Key differences from v3:**

- **No more preFX/postFX distinction.** Filters are divided into **internal** (affects just the object) and **external** (affects the object in its rendering context, usually the full screen) lists.
- **No more object restrictions.** In v3, only certain objects supported FX. In v4, filters can be applied to **any game object or scene camera**, including `Extern` objects.
- **`BitmapMask` removed.** Use the new `Mask` filter instead. `GeometryMask` remains available in Canvas only.

**Removed derived FX and their replacements:**

| v3 FX | v4 Replacement |
|---|---|
| `Bloom` | `Phaser.Actions.AddEffectBloom()` |
| `Shine` | `Phaser.Actions.AddEffectShine()` |
| `Circle` | `Phaser.Actions.AddMaskShape()` |
| `Gradient` | `Gradient` game object |

**ColorMatrix change:**

The `ColorMatrix` filter shifted its color management methods onto a `colorMatrix` property:

```js
// v3
colorMatrix.sepia();

// v4
colorMatrix.colorMatrix.sepia();
```

**Mask migration:**

```js
// v3 - BitmapMask
const mask = new Phaser.Display.Masks.BitmapMask(scene, maskObject);
sprite.setMask(mask);

// v4 - Mask filter
sprite.filters.internal.addMask(maskObject);
```

---

## 4. Tint System

The tint system has been overhauled with a new API and additional blend modes.

**Removed:**
- `tintFill` property
- `setTintFill()` method

**Replacement:**
- Use the new `tintMode` property or `setTintMode()` method to control tint blending.
- `Phaser.TintModes` enumerates the available modes: `MULTIPLY`, `FILL`, `ADD`, `SCREEN`, `OVERLAY`, `HARD_LIGHT`.

**How to convert your code:**

```js
// v3
sprite.setTintFill(0xff0000);

// v4
sprite.setTint(0xff0000).setTintMode(Phaser.TintModes.FILL);
```

**Other tint changes:**
- `tint` and `setTint()` now purely affect color settings. In v3, calling these would silently deactivate fill mode.
- FILL mode now treats partial alpha correctly.
- BitmapText tinting now works correctly.

---

## 5. Camera System

The camera matrix system has been rewritten. If you only use standard camera properties (`scrollX`, `scrollY`, `zoom`, `rotation`), your code should work without changes. However, if you access camera matrices directly, you must update your code.

**What changed:**

| v3 | v4 |
|---|---|
| `Camera#matrix` = position + rotation + zoom | `Camera#matrix` = rotation + zoom + scroll (no position) |
| Scroll appended separately | Scroll is part of `Camera#matrix` |
| No equivalent | `Camera#matrixExternal` = position only |
| No equivalent | `Camera#matrixCombined` = `matrix` * `matrixExternal` |

**If you manipulated scroll factors manually:**

```js
// v3
spriteMatrix.e -= camera.scrollX * src.scrollFactorX;

// v4
TransformMatrix.copyWithScrollFactorFrom(matrix, scrollX, scrollY, scrollFactorX, scrollFactorY);
```

**Other camera changes:**
- `GetCalcMatrix()` now takes an additional `ignoreCameraPosition` parameter.
- `GetCalcMatrixResults` now includes a `matrixExternal` property.

---

## 6. Texture Coordinates and GL Orientation

Phaser v3 used top-left orientation for textures, which caused mismatches internally (framebuffers drawn upside-down, then flipped). Phaser v4 uses GL orientation throughout, where Y=0 is at the bottom.

**Action required:**
- If you use **compressed textures**, they must be re-compressed with the Y axis starting at the bottom and increasing upwards. This is usually available as a "flip Y" option in your texture compression software.
- Standard image textures (PNG, JPG, etc.) are handled automatically -- no action needed.
- If you write **custom shaders**, note that texture coordinates now use GL conventions where Y=0 is at the bottom of the image.

---

## 7. DynamicTexture and RenderTexture

In v3, `DynamicTexture` allowed you to define batches and perform intricate drawing operations directly. In v4, many of these complex methods have been removed in favor of using the standard rendering system, which handles batching automatically.

**Breaking change:** `DynamicTexture` and `RenderTexture` must now call `render()` to execute all buffered drawing commands. Previously, draw commands were executed immediately.

**New capabilities:**
- `DynamicTexture#preserve()` keeps the command buffer for reuse after rendering, allowing you to re-render commands that draw changing game objects.
- `DynamicTexture#callback()` inserts a callback to run during command buffer execution.
- `DynamicTexture#capture` renders game objects more accurately than `draw`, capturing the current camera view.
- `RenderTexture.renderMode` property: `"render"` (draw like an Image), `"redraw"` (update texture during render loop without drawing), or `"all"` (both). The `"redraw"` mode enables updating textures mid-render-loop for same-frame shader outputs.
- `TextureManager#addDynamicTexture` now has a `forceEven` parameter.

---

## 8. Shader API

The `Shader` game object has been significantly rewritten. Existing v3 shaders will need to be updated.

**What changed:**
- The construction signature now takes a config object (`ShaderQuadConfig`) instead of individual parameters.
- Shadertoy-style uniforms (resolution, time, etc.) are no longer set automatically. Encode them into your configuration if needed.
- Texture coordinates now use GL conventions (Y=0 at bottom).
- New `Shader#setUniform(name, value)` method for setting program uniforms individually.
- New `Shader#renderImmediate` method for rendering outside the regular render loop.

---

## 9. GLSL Loading

The way Phaser loads GLSL code has changed:

- GLSL code is no longer classified as "fragment" or "vertex" when loaded. Under the new system it could be either, or both. You load shaders separately and combine them when creating a Shader.
- Custom templates have been replaced with `#pragma` preprocessor directives, which are valid GLSL and compatible with automated syntax checkers. The pragmas are removed before compilation.

---

## 10. Lighting

Lighting has been simplified and enhanced.

**How to convert your code:**

```js
// v3 - Pipeline-based lighting
sprite.setPipeline('Light2D');

// v4 - Simple method call
sprite.setLighting(true);
```

**Other lighting changes:**
- Lighting is available on many game objects: BitmapText, Blitter, Graphics, Shape, Image, Sprite, Particles, SpriteGPULayer, Stamp, Text, TileSprite, Video, TilemapLayer, and TilemapGPULayer.
- Objects can now cast **self-shadows** using a shader that simulates shadows from surface features based on texture brightness. Configurable game-wide or per-object.
- Lights now have a `z` value to set height explicitly, replacing the implicit height based on game resolution from v3.
- Note: lighting changes the shader, which breaks render batches.
- You can also use the `ImageLight` filter for image-based lighting, but it is separate from the core lighting system.

---

## 11. TileSprite

TileSprite has been internally rewritten to use a new shader that manually controls texture coordinate wrapping instead of relying on WebGL texture wrapping parameters.

**What changed:**
- `TileSprite` no longer supports texture cropping.
- TileSprite now assigns default dimensions to each dimension separately.

**New capabilities:**
- TileSprite now supports **texture frames** within atlases and spritesheets (v3 could only repeat the entire texture file).
- New `tileRotation` property allows rotating the repeating texture.
- Works correctly with compressed textures, non-power-of-two textures, and DynamicTextures (all had issues in v3).

---

## 12. Graphics and Shape

- `Graphics` has a new `pathDetailThreshold` property (also available as a game config option) that skips vertices within a certain distance of one another, improving performance on complex curves in small areas.
- `Grid` shape has renamed properties: it now uses **stroke** instead of **outline**, matching the conventions of other Shape objects. Grid also has new controls for rendering gutters between cells and whether to draw outlines on the outside of the grid or just between cells.
- `Rectangle` now supports rounded corners.

---

## 13. Geometry: Point Replaced by Vector2

The `Geom.Point` class and all related functions have been removed. Use `Vector2` instead.

**Quick reference for method replacements:**

| v3 (`Point`) | v4 (`Vector2` / `Math`) |
|---|---|
| `Point.Ceil` | `Vector2.ceil` |
| `Point.Floor` | `Vector2.floor` |
| `Point.Clone` | `Vector2.clone` |
| `Point.CopyFrom(src, dest)` | `dest.copy(src)` |
| `Point.Equals` | `Vector2.equals` |
| `Point.GetCentroid` | `Math.GetCentroid` |
| `Point.GetMagnitude` | `Vector2.length` |
| `Point.GetMagnitudeSq` | `Vector2.lengthSq` |
| `Point.Invert` | `Vector2.invert` |
| `Point.Negative` | `Vector2.negate` |
| `Point.SetMagnitude` | `Vector2.setLength` |
| `Point.Project` | `Vector2.project` |
| `Point.ProjectUnit` | `Vector2.projectUnit` |
| `Point.Interpolate` | `Math.LinearXY` |
| `Point.GetRectangleFromPoints` | `Math.GetVec2Bounds` |

**All geometry classes now return Vector2 instead of Point:**

The following classes and their static helper functions (`getPoint`, `getPoints`, `getRandomPoint`, `CircumferencePoint`, `Random`, etc.) all return `Vector2` instances:

- `Geom.Circle`
- `Geom.Ellipse`
- `Geom.Line`
- `Geom.Polygon`
- `Geom.Rectangle`
- `Geom.Triangle`

If you have code that checks `instanceof Phaser.Geom.Point`, update it to check for `Phaser.Math.Vector2`.

---

## 14. Math Constants

| v3 | v4 | Notes |
|---|---|---|
| `Math.TAU` (was PI / 2) | `Math.TAU` (now PI * 2) | **Value changed!** This is now the correct mathematical tau. |
| `Math.PI2` | Removed | Use `Math.TAU` instead. |
| No equivalent | `Math.PI_OVER_2` | New constant for PI / 2 (what v3's `TAU` incorrectly was). |

**Action required:** If you used `Math.TAU` in v3 expecting PI / 2, replace it with `Math.PI_OVER_2`. If you used `Math.PI2`, replace it with `Math.TAU`.

---

## 15. Data Structures

**`Phaser.Struct.Set`** has been replaced with a native JavaScript `Set`. Methods like `iterateLocal` are gone. Use standard `Set` methods (`forEach`, `has`, `add`, `delete`, etc.).

**`Phaser.Struct.Map`** has been replaced with a native JavaScript `Map`. Methods like `contains` and `setAll` are gone. Use standard `Map` methods (`has`, `get`, `set`, `delete`, etc.).

---

## 16. Round Pixels

The `roundPixels` game config option now defaults to `false` (it was `true` in v3). The behavior has also been refined:

- `roundPixels` only operates when objects are axis-aligned and unscaled, preventing flicker on transforming objects.
- For per-object control, use the new `GameObject#vertexRoundMode` property:
  - `"off"` -- Never round.
  - `"safe"` -- Round only when the transform is position-only (no scale/rotation).
  - `"safeAuto"` (default) -- Like `"safe"`, but only when the camera has `roundPixels` enabled.
  - `"full"` -- Always round (can cause wobble on rotated sprites, PS1-style).
  - `"fullAuto"` -- Like `"full"`, but only when the camera has `roundPixels` enabled.
- The `TransformMatrix#setQuad` `roundPixels` parameter has been removed.

---

## 17. Removed Game Objects

- **`Mesh` and `Plane`** have been removed. These were limited 3D implementations; proper 3D support is planned for the future.

---

## 18. Removed Plugins and Entry Points

The following have been completely removed:

- **Camera3D Plugin**
- **Layer3D Plugin**
- **Facebook Plugin** detection constants
- **`phaser-ie9.js`** entry point (IE9 is no longer supported)

---

## 19. Removed Utilities and Polyfills

**`Create.GenerateTexture`** and all Create Palettes / the `create` folder have been removed. `TextureManager.generate` is also removed as a result.

**`Math.SinCosTableGenerator`** has been removed.

**All legacy polyfills removed:**
- `Array.forEach`
- `Array.isArray`
- `AudioContextMonkeyPatch`
- `console`
- `Math.trunc`
- `performance.now`
- `requestAnimationFrame`
- `Uint32Array`

Modern browsers provide all of these natively.

---

## 20. Spine Plugins

The Spine 3 and Spine 4 plugins bundled with Phaser are no longer updated. Use the official Phaser Spine plugin created by Esoteric Software instead.

---

## 21. Miscellaneous Breaking Changes

- **`Shader#setTextures()`** now replaces the texture array rather than adding to it. If you were calling it multiple times to build up textures, call it once with the full array.
- **`DOMElement`** now throws an error if it has no container. Ensure your DOM elements have a parent container.
- **`GameObject#enableLighting`** can now be set even if the scene light manager is not enabled. The manager must still be enabled for lights to render, but the flag itself is no longer gated.
- **Gamepad `Button` class** now accepts an `isPressed` parameter to initialize state correctly across scene transitions.
- **`BatchHandlerConfig#createOwnVertexBuffer`** type property has been removed.
- **`WebGLRenderer#genericVertexBuffer`** and **`#genericVertexData`** have been removed (freeing ~16MB RAM/VRAM).

---

## Migration Checklist

Use this checklist to track your migration progress:

- [ ] Update `npm install phaser@4` (or equivalent)
- [ ] Replace any custom WebGL pipelines with render nodes
- [ ] Replace `BitmapMask` usage with the `Mask` filter
- [ ] Replace removed FX (`Bloom`, `Shine`, `Circle`, `Gradient`) with their Action/GameObject equivalents
- [ ] Update `ColorMatrix` calls (methods moved to `.colorMatrix` property)
- [ ] Replace any `setTintFill()` calls with `setTint().setTintMode(Phaser.TintModes.FILL)`
- [ ] Replace `Geom.Point` usage with `Vector2`
- [ ] Update `Math.TAU` usage (now equals PI * 2, not PI / 2)
- [ ] Replace `Math.PI2` with `Math.TAU`
- [ ] Replace `Phaser.Struct.Set` with native `Set`
- [ ] Replace `Phaser.Struct.Map` with native `Map`
- [ ] Add `render()` calls to `DynamicTexture` / `RenderTexture` usage
- [ ] Re-compress any compressed textures for new Y-axis orientation
- [ ] Update any direct `Camera#matrix` access to use the new matrix system
- [ ] Update `Shader` game objects to use new `ShaderQuadConfig` constructor
- [ ] Update GLSL loading code (no fragment/vertex classification, `#pragma` directives)
- [ ] Replace `sprite.setPipeline('Light2D')` with `sprite.setLighting(true)`
- [ ] Update light height code to use new `z` property
- [ ] Remove any `TileSprite` texture cropping code
- [ ] Update `Grid` shape code (`outline` properties renamed to `stroke`)
- [ ] Remove any `Mesh` or `Plane` usage
- [ ] Replace any Phaser-bundled Spine plugin usage with the official Esoteric Software plugin
- [ ] Remove any reliance on `Create.GenerateTexture` or `TextureManager.generate`
- [ ] Test `roundPixels` behavior (now defaults to `false`)
- [ ] Remove any usage of removed polyfills, plugins, or entry points
- [ ] Verify custom shader texture coordinates (Y=0 is now at bottom)
