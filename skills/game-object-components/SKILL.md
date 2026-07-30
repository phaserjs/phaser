---
name: game-object-components
description: "Use this skill when working with Phaser 4 game object components and the mixin system. Covers Transform, Alpha, Tint, Origin, Depth, Flip, Mask, GetBounds, Lighting, and other shared component behaviors. Triggers on: component, mixin, transform, mask, bounds, lighting."
---

# Phaser 4 -- Game Object Components Reference

> Component mixins that provide shared behavior to all Game Objects: Alpha, BlendMode, Depth, Flip, GetBounds, Lighting, Mask, Origin, ScrollFactor, Size, Texture, TextureCrop, Tint, Transform, Visible, PathFollower, RenderNodes, RenderSteps, Filters, FilterList.

## Quick Start

```js
// Every Game Object gets its component methods via mixins.
// Just call them directly on any game object:
const sprite = this.add.sprite(400, 300, 'hero');

sprite.setAlpha(0.5);                          // Alpha
sprite.setBlendMode(Phaser.BlendModes.ADD);    // BlendMode
sprite.setDepth(10);                           // Depth
sprite.setFlip(true, false);                   // Flip
sprite.setOrigin(0, 0);                        // Origin
sprite.setScrollFactor(0);                     // ScrollFactor (HUD)
sprite.setDisplaySize(64, 64);                 // Size
sprite.setTexture('hero', 'walk-1');           // Texture
sprite.setTint(0xff0000);                      // Tint
sprite.setPosition(100, 200);                  // Transform
sprite.setVisible(false);                      // Visible
sprite.setScale(2);                            // Transform
sprite.setAngle(45);                           // Transform

// Per-corner alpha (WebGL only)
sprite.setAlpha(1, 0.5, 0.5, 1);

// Crop a texture region
sprite.setCrop(0, 0, 32, 32);

// Enable WebGL filters (post-processing)
sprite.enableFilters();
sprite.filters.internal.addBlur(1, 2, 2, 1);

// Lighting (WebGL only, v4 feature)
sprite.setLighting(true);
```

## Core Concepts

### The Mixin System

Phaser uses `Phaser.Class` with a `Mixins` array to compose Game Objects from reusable component objects. Each component is a plain JS object whose properties and methods are copied onto the class prototype. This is NOT prototypal inheritance -- it is property copying at class definition time.

```js
// How Phaser defines Sprite internally:
var Sprite = new Class({
    Extends: GameObject,
    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Lighting,
        Components.Mask,
        Components.Origin,
        Components.RenderNodes,
        Components.ScrollFactor,
        Components.Size,
        Components.TextureCrop,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        SpriteRender
    ],
    initialize: function Sprite (scene, x, y, texture, frame) { /* ... */ }
});
```

### Key Rules

1. Components are mixed in at class creation, not per-instance.
2. Most setter methods return `this` for chaining: `sprite.setAlpha(0.5).setDepth(10).setPosition(100, 200)`.
3. Many properties use getters/setters internally (e.g., `alpha`, `depth`, `visible`, `scale`, `rotation`). Setting `alpha = 0` or `scale = 0` clears render flags, skipping rendering.
4. `renderFlags` is a bitmask: bit 0 = visible, bit 1 = alpha, bit 2 = scale, bit 3 = texture. All bits must be set for the object to render.
5. **Alpha vs AlphaSingle**: `Alpha` supports per-corner alpha (WebGL), `AlphaSingle` only supports a single global alpha. Containers use `AlphaSingle`.
6. **Texture vs TextureCrop**: `TextureCrop` extends `Texture` with `setCrop()` support. Sprites and Images use `TextureCrop`; some objects use plain `Texture`.
7. **Filters and RenderSteps** are v4-only, WebGL-only systems for post-processing.

## Complete Component Reference

### Alpha

Provides per-corner transparency. Used by Sprite, Image, Text, and most renderable objects.

| Member | Type | Description |
|---|---|---|
| `alpha` | number (get/set) | Global alpha 0-1. Setting this also sets all four corners. Setting to 0 disables rendering. Default: `1` |
| `alphaTopLeft` | number (get/set) | Top-left corner alpha. WebGL only. |
| `alphaTopRight` | number (get/set) | Top-right corner alpha. WebGL only. |
| `alphaBottomLeft` | number (get/set) | Bottom-left corner alpha. WebGL only. |
| `alphaBottomRight` | number (get/set) | Bottom-right corner alpha. WebGL only. |
| `setAlpha(topLeft?, topRight?, bottomLeft?, bottomRight?)` | method | Set alpha. One arg = uniform. Four args = per-corner (WebGL). Returns `this`. |
| `clearAlpha()` | method | Resets alpha to 1. Returns `this`. |

### AlphaSingle

Simplified alpha with no per-corner support. Used by Container.

| Member | Type | Description |
|---|---|---|
| `alpha` | number (get/set) | Alpha 0-1. Default: `1` |
| `setAlpha(value?)` | method | Set alpha. Returns `this`. |
| `clearAlpha()` | method | Resets alpha to 1. Returns `this`. |

### BlendMode

Controls how pixels are composited during rendering.

| Member | Type | Description |
|---|---|---|
| `blendMode` | number/string (get/set) | Current blend mode. Accepts `Phaser.BlendModes` const, string, or integer. |
| `setBlendMode(value)` | method | Set the blend mode. Returns `this`. |

WebGL blend modes: `NORMAL`, `ADD`, `MULTIPLY`, `SCREEN`, `ERASE`. Canvas supports additional browser-dependent modes.

### Depth

Controls rendering order (z-index). Higher depth renders on top.

| Member | Type | Description |
|---|---|---|
| `depth` | number (get/set) | Depth value. Setting it queues a depth sort. Default: `0` |
| `setDepth(value)` | method | Set depth. Returns `this`. |
| `setToTop()` | method | Move to top of display list (no depth change). Returns `this`. |
| `setToBack()` | method | Move to back of display list. Returns `this`. |
| `setAbove(gameObject)` | method | Move above another Game Object in display list. Returns `this`. |
| `setBelow(gameObject)` | method | Move below another Game Object in display list. Returns `this`. |

### Flip

Visual mirroring without affecting physics bodies.

| Member | Type | Description |
|---|---|---|
| `flipX` | boolean | Horizontal flip state. Default: `false` |
| `flipY` | boolean | Vertical flip state. Default: `false` |
| `setFlipX(value)` | method | Set horizontal flip. Returns `this`. |
| `setFlipY(value)` | method | Set vertical flip. Returns `this`. |
| `setFlip(x, y)` | method | Set both flip states. Returns `this`. |
| `toggleFlipX()` | method | Toggle horizontal flip. Returns `this`. |
| `toggleFlipY()` | method | Toggle vertical flip. Returns `this`. |
| `resetFlip()` | method | Reset both to false. Returns `this`. |

### GetBounds

Calculate positions and bounding rectangles regardless of origin.

| Member | Type | Description |
|---|---|---|
| `getCenter(output?, includeParent?)` | method | Center coordinate. Returns `Vector2Like`. |
| `getTopLeft(output?, includeParent?)` | method | Top-left coordinate. Returns `Vector2Like`. |
| `getTopCenter(output?, includeParent?)` | method | Top-center coordinate. Returns `Vector2Like`. |
| `getTopRight(output?, includeParent?)` | method | Top-right coordinate. Returns `Vector2Like`. |
| `getLeftCenter(output?, includeParent?)` | method | Left-center coordinate. Returns `Vector2Like`. |
| `getRightCenter(output?, includeParent?)` | method | Right-center coordinate. Returns `Vector2Like`. |
| `getBottomLeft(output?, includeParent?)` | method | Bottom-left coordinate. Returns `Vector2Like`. |
| `getBottomCenter(output?, includeParent?)` | method | Bottom-center coordinate. Returns `Vector2Like`. |
| `getBottomRight(output?, includeParent?)` | method | Bottom-right coordinate. Returns `Vector2Like`. |
| `getBounds(output?)` | method | Full bounding rectangle. Returns `Rectangle`. |

Set `includeParent = true` to factor in parent Container transforms.

### Lighting (v4, WebGL only)

Enables light-based rendering with the Phaser 4 lighting system.

| Member | Type | Description |
|---|---|---|
| `lighting` | boolean | Whether to use lighting. Default: `false` |
| `selfShadow` | object | `{ enabled, penumbra, diffuseFlatThreshold }`. Self-shadow settings. |
| `setLighting(enable)` | method | Enable/disable lighting. Returns `this`. |
| `setSelfShadow(enabled?, penumbra?, diffuseFlatThreshold?)` | method | Configure self-shadow. Pass `null` for enabled to use game config default. Returns `this`. |

### Mask (Canvas only in v4)

Geometry masking for Canvas renderer. In WebGL, use `Filters.addMask()` instead.

| Member | Type | Description |
|---|---|---|
| `mask` | GeometryMask | The current mask, or null. |
| `setMask(mask)` | method | Apply a GeometryMask. Canvas only. In WebGL, logs a warning. Returns `this`. |
| `clearMask(destroyMask?)` | method | Remove the mask. Pass `true` to also destroy it. Returns `this`. |
| `createGeometryMask(graphics?)` | method | Create a GeometryMask from a Graphics/Shape object. Returns `GeometryMask`. |

### Origin

Controls the anchor point for position, rotation, and scale. Normalized 0-1.

| Member | Type | Description |
|---|---|---|
| `originX` | number | Horizontal origin. Default: `0.5` (center) |
| `originY` | number | Vertical origin. Default: `0.5` (center) |
| `displayOriginX` | number (get/set) | Origin in pixels. Setting recalculates `originX`. |
| `displayOriginY` | number (get/set) | Origin in pixels. Setting recalculates `originY`. |
| `setOrigin(x?, y?)` | method | Set origin (normalized). `y` defaults to `x`. Default: `0.5`. Returns `this`. |
| `setOriginFromFrame()` | method | Set origin from texture Frame pivot. Returns `this`. |
| `setDisplayOrigin(x?, y?)` | method | Set origin in pixels. Returns `this`. |
| `updateDisplayOrigin()` | method | Recalculate display origin cache. Returns `this`. |

### ScrollFactor

Controls how camera scrolling affects the object's rendered position.

| Member | Type | Description |
|---|---|---|
| `scrollFactorX` | number | Horizontal scroll factor. Default: `1` |
| `scrollFactorY` | number | Vertical scroll factor. Default: `1` |
| `setScrollFactor(x, y?)` | method | Set scroll factor. `y` defaults to `x`. Returns `this`. |

Key values: `0` = fixed to camera (HUD element), `1` = moves with camera, `0.5` = parallax half-speed.

### Size

Manages native and display dimensions.

| Member | Type | Description |
|---|---|---|
| `width` | number | Native (un-scaled) width. |
| `height` | number | Native (un-scaled) height. |
| `displayWidth` | number (get/set) | Scaled width. Setting adjusts `scaleX`. |
| `displayHeight` | number (get/set) | Scaled height. Setting adjusts `scaleY`. |
| `setSize(width, height)` | method | Set native size. Does NOT affect rendered size. Returns `this`. |
| `setDisplaySize(width, height)` | method | Set rendered size (adjusts scale). Returns `this`. |
| `setSizeToFrame(frame?)` | method | Set size from a texture Frame. Returns `this`. |

### Texture

Gets and sets the texture and frame for rendering.

| Member | Type | Description |
|---|---|---|
| `texture` | Phaser.Textures.Texture | The current Texture. |
| `frame` | Phaser.Textures.Frame | The current Frame. |
| `setTexture(key, frame?, updateSize?, updateOrigin?)` | method | Set texture by key. Returns `this`. |
| `setFrame(frame, updateSize?, updateOrigin?)` | method | Set frame by name, index, or Frame instance. Updates size and origin by default. Returns `this`. |

### TextureCrop

Extends Texture with cropping support. Used by Sprite and Image.

| Member | Type | Description |
|---|---|---|
| `texture` | Phaser.Textures.Texture | The current Texture. |
| `frame` | Phaser.Textures.Frame | The current Frame. |
| `isCropped` | boolean | Whether cropping is active. |
| `setTexture(key, frame?)` | method | Set texture by key. Returns `this`. |
| `setFrame(frame, updateSize?, updateOrigin?)` | method | Set frame. Also updates crop UVs if cropped. Returns `this`. |
| `setCrop(x?, y?, width?, height?)` | method | Set crop rectangle. Pass no args to clear. Accepts a `Rectangle` as first arg. Returns `this`. |

### Tint (WebGL only)

Applies color tinting to the texture via per-corner vertex colors.

| Member | Type | Description |
|---|---|---|
| `tint` | number (get/set) | Uniform tint color (reads `tintTopLeft`). Default: `0xffffff` |
| `tintTopLeft` | number | Top-left vertex tint. Default: `0xffffff` |
| `tintTopRight` | number | Top-right vertex tint. Default: `0xffffff` |
| `tintBottomLeft` | number | Bottom-left vertex tint. Default: `0xffffff` |
| `tintBottomRight` | number | Bottom-right vertex tint. Default: `0xffffff` |
| `tintMode` | number | Tint blend mode. Default: `Phaser.TintModes.MULTIPLY` |
| `isTinted` | boolean (readonly) | True if any tint or mode is set. |
| `setTint(topLeft?, topRight?, bottomLeft?, bottomRight?)` | method | Set tint colors. One arg = uniform. Returns `this`. |
| `setTintMode(mode)` | method | Set tint mode (v4). Modes: `MULTIPLY`, `FILL`, `ADD`, `SCREEN`, `OVERLAY`, `HARD_LIGHT`. Returns `this`. |
| `clearTint()` | method | Reset to white + MULTIPLY. Returns `this`. |

**v4 change**: `setTintFill()` is removed. Use `setTint(color).setTintMode(Phaser.TintModes.FILL)` instead.

### Transform

Position, scale, rotation, and coordinate transforms.

| Member | Type | Description |
|---|---|---|
| `x` | number | X position. Default: `0` |
| `y` | number | Y position. Default: `0` |
| `z` | number | Z position (NOT rendering order; use `depth`). Default: `0` |
| `w` | number | W position. Default: `0` |
| `scale` | number (get/set) | Uniform scale. Get returns average of scaleX and scaleY. |
| `scaleX` | number (get/set) | Horizontal scale. Default: `1` |
| `scaleY` | number (get/set) | Vertical scale. Default: `1` |
| `angle` | number (get/set) | Rotation in degrees (clockwise, 0 = right). |
| `rotation` | number (get/set) | Rotation in radians. |
| `setPosition(x?, y?, z?, w?)` | method | Set position. `y` defaults to `x`. Returns `this`. |
| `copyPosition(source)` | method | Copy x/y/z/w from a Vector-like object. Returns `this`. |
| `setRandomPosition(x?, y?, width?, height?)` | method | Randomize position within area. Returns `this`. |
| `setRotation(radians?)` | method | Set rotation in radians. Returns `this`. |
| `setAngle(degrees?)` | method | Set rotation in degrees. Returns `this`. |
| `setScale(x?, y?)` | method | Set scale. `y` defaults to `x`. Returns `this`. |
| `setX(value?)` | method | Set x. Returns `this`. |
| `setY(value?)` | method | Set y. Returns `this`. |
| `setZ(value?)` | method | Set z. Returns `this`. |
| `setW(value?)` | method | Set w. Returns `this`. |
| `getLocalTransformMatrix(tempMatrix?)` | method | Get local transform matrix. Returns `TransformMatrix`. |
| `getWorldTransformMatrix(tempMatrix?, parentMatrix?)` | method | Get world transform including parent Containers. Returns `TransformMatrix`. |
| `getLocalPoint(x, y, point?, camera?)` | method | Convert world coords to local space. Returns `Vector2`. |
| `getWorldPoint(point?, tempMatrix?, parentMatrix?)` | method | Get world position factoring parent containers. Returns `Vector2`. |
| `getParentRotation()` | method | Sum of all parent container rotations in radians. |

### Visible

Controls whether the Game Object renders. Invisible objects still run update logic.

| Member | Type | Description |
|---|---|---|
| `visible` | boolean (get/set) | Visibility state. Default: `true` |
| `setVisible(value)` | method | Set visibility. Returns `this`. |

### PathFollower

Manages following a `Phaser.Curves.Path` using an internal tween.

| Member | Type | Description |
|---|---|---|
| `path` | Phaser.Curves.Path | The Path being followed. |
| `rotateToPath` | boolean | Auto-rotate to face path direction. Default: `false` |
| `pathRotationOffset` | number | Rotation offset in degrees when `rotateToPath` is true. |
| `pathOffset` | Vector2 | Position offset from path coordinates. |
| `pathVector` | Vector2 | Current point on the path. |
| `pathDelta` | Vector2 | Distance traveled since last update. |
| `pathTween` | Tween | The tween driving path movement. |
| `setPath(path, config?)` | method | Set a new Path. Returns `this`. |
| `setRotateToPath(value, offset?)` | method | Enable auto-rotation. Returns `this`. |
| `isFollowing()` | method | Returns `true` if actively following. |
| `startFollow(config?, startAt?)` | method | Start following. `config` can be duration (number) or PathConfig. Returns `this`. |
| `pauseFollow()` | method | Pause movement. Returns `this`. |
| `resumeFollow()` | method | Resume movement. Returns `this`. |
| `stopFollow()` | method | Stop following. Returns `this`. |

### RenderNodes, RenderSteps, Filters, FilterList (v4, WebGL only)

For RenderNodes, RenderSteps, and FilterList details, see the [filters-and-postfx skill](../filters-and-postfx/SKILL.md) and [references/REFERENCE.md](references/REFERENCE.md).

Key points: Call `enableFilters()` on game objects before accessing `filters`. Cameras have filters by default. Use `filters.internal` for object-local effects and `filters.external` for screen-space effects.

For a full component-to-game-object matrix, see [references/REFERENCE.md](references/REFERENCE.md).

## Factory Registration and Display List

### Custom Game Object Factory Registration

Register custom game objects on the factory so they can be created via `this.add.myObject()`:

```js
class LaserBeam extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'laser');
    }
}

Phaser.GameObjects.GameObjectFactory.register('laserBeam', function (x, y) {
    const beam = new LaserBeam(this.scene, x, y);
    this.displayList.add(beam);
    return beam;
});

// Now usable in any scene:
const laser = this.add.laserBeam(100, 200);
```

### Factory (this.add) vs Creator (this.make)

`this.add` creates the object AND adds it to the display list. `this.make` creates the object but does NOT add it -- useful for off-screen preparation or deferred display.

```js
// Added to display list immediately
const visible = this.add.sprite(100, 100, 'hero');

// Created but NOT on the display list
const offscreen = this.make.sprite({ key: 'hero', x: 100, y: 100 });

// Add it later when ready
this.add.existing(offscreen);
```

### GetAdvancedValue for Flexible Config

`GetAdvancedValue` resolves static values, random arrays, randInt/Float ranges, and callbacks from config objects:

```js
// Static value
{ speed: 100 }

// Random from array
{ speed: [100, 200, 300] }

// Random integer range
{ speed: { randInt: [50, 150] } }

// Random float range
{ speed: { randFloat: [0.5, 1.5] } }

// Callback
{ speed: function () { return Math.random() * 100; } }
```

### Display List Ordering

Objects added later render on top of earlier objects. Control ordering with:

```js
// Depth-based ordering (higher = on top, triggers sort)
sprite.setDepth(10);

// Display list position (no depth change)
sprite.setToTop();
sprite.setToBack();
sprite.setAbove(otherSprite);
sprite.setBelow(otherSprite);
```

When both `depth` and display list position are used, `depth` takes priority after the next sort pass.

## Gotchas

1. **alpha=0 prevents rendering entirely**: Setting `alpha` to 0 clears a render flag bit. The object is not drawn at all, not merely transparent. Same applies to `scale = 0` and `visible = false`.

2. **Flip does not affect physics**: Flipping is rendering-only. Physics bodies remain unchanged. Account for this in collision code.

3. **ScrollFactor and physics**: Physics collisions use world position. A scroll factor other than 1 offsets where the texture renders but not where the body is. For HUD elements with scroll factor 0, avoid adding physics bodies.

4. **depth vs display list order**: `setDepth()` queues a sort and is the primary z-ordering tool. `setToTop()`, `setAbove()`, etc. reorder the display list without changing `depth`. If you mix both, `depth` takes priority after the next sort.

5. **Mask component is Canvas-only in v4**: For WebGL masking, use `enableFilters()` then `filters.internal.addMask()`. The `setMask()` method logs a warning in WebGL.

6. **setTintFill is removed in v4**: Use `setTint(color).setTintMode(Phaser.TintModes.FILL)` instead.

7. **Tint modes in v4**: Tint mode is now separate from tint color. Available modes: `MULTIPLY` (default), `FILL`, `ADD`, `SCREEN`, `OVERLAY`, `HARD_LIGHT`.

8. **displayWidth/displayHeight adjusts scale**: Setting `displayWidth` or `displayHeight` modifies `scaleX`/`scaleY`. It does NOT change `width`/`height`.

9. **setSize vs setDisplaySize**: `setSize()` changes internal dimensions (used for frames, physics). `setDisplaySize()` changes the rendered size by adjusting scale.

10. **Origin default is 0.5**: All Game Objects default to center origin. Use `setOrigin(0, 0)` for top-left positioning. Text and BitmapText instead default to top-left positioning.

11. **Transform.z is NOT depth**: The `z` property on Transform is for custom use. Rendering order is controlled by `depth` (Depth component) or display list position.

12. **Filters are expensive**: Each object with active filters requires extra draw calls. Use `renderFilters = false` to temporarily disable. Internal filters are cheaper than external.

## Source File Map

| File | Description |
|---|---|
| `src/gameobjects/components/index.js` | Component registry, exports all components |
| `src/gameobjects/components/Alpha.js` | Per-corner alpha mixin |
| `src/gameobjects/components/AlphaSingle.js` | Single-value alpha mixin |
| `src/gameobjects/components/BlendMode.js` | Blend mode mixin |
| `src/gameobjects/components/Depth.js` | Depth/z-order mixin |
| `src/gameobjects/components/Flip.js` | Visual flip mixin |
| `src/gameobjects/components/GetBounds.js` | Bounds calculation mixin |
| `src/gameobjects/components/Lighting.js` | v4 lighting mixin |
| `src/gameobjects/components/Mask.js` | Canvas geometry mask mixin |
| `src/gameobjects/components/Origin.js` | Origin/anchor mixin |
| `src/gameobjects/components/ScrollFactor.js` | Camera scroll factor mixin |
| `src/gameobjects/components/Size.js` | Dimensions mixin |
| `src/gameobjects/components/Texture.js` | Texture/frame assignment mixin |
| `src/gameobjects/components/TextureCrop.js` | Texture with crop support mixin |
| `src/gameobjects/components/Tint.js` | Vertex color tinting mixin |
| `src/gameobjects/components/Transform.js` | Position/scale/rotation mixin |
| `src/gameobjects/components/Visible.js` | Visibility mixin |
| `src/gameobjects/components/PathFollower.js` | Path-following mixin |
| `src/gameobjects/components/RenderNodes.js` | v4 WebGL render node mixin |
| `src/gameobjects/components/RenderSteps.js` | v4 WebGL render step mixin |
| `src/gameobjects/components/Filters.js` | v4 WebGL filter system mixin |
| `src/gameobjects/components/FilterList.js` | v4 filter list class (add effects) |
| `src/gameobjects/components/TransformMatrix.js` | 2D transform matrix utility |

---

**Related skills**: `sprites-and-images.md`, `custom-game-objects.md`
