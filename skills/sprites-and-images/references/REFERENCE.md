# Sprites And Images — Reference

> Detailed configuration, API tables, and source file maps for the sprites-and-images skill.

## API Quick Reference

Most-used properties and methods across all mixed-in components. All setter methods return `this` for chaining.

### Transform
| API | Type | Description |
|---|---|---|
| `x`, `y` | `number` | World position |
| `z`, `w` | `number` | Extra position axes (z does NOT control render order) |
| `scale` | `number` | Uniform scale (read: avg of scaleX+scaleY; write: sets both) |
| `scaleX`, `scaleY` | `number` | Per-axis scale |
| `angle` | `number` | Rotation in degrees (clockwise, 0=right) |
| `rotation` | `number` | Rotation in radians |
| `setPosition(x, y, z, w)` | method | Set position |
| `setScale(x, y)` | method | Set scale (y defaults to x) |
| `setRotation(radians)` | method | Set rotation in radians |
| `setAngle(degrees)` | method | Set rotation in degrees |
| `setRandomPosition(x, y, w, h)` | method | Randomize position within area |
| `copyPosition(source)` | method | Copy x/y/z/w from another object |

### Alpha
| API | Type | Description |
|---|---|---|
| `alpha` | `number` | Global opacity 0-1 |
| `alphaTopLeft/TR/BL/BR` | `number` | Per-corner alpha (WebGL) |
| `setAlpha(tl, tr, bl, br)` | method | Set alpha (single value or per-corner) |
| `clearAlpha()` | method | Reset to fully opaque |

### Tint (WebGL only)
| API | Type | Description |
|---|---|---|
| `tint` | `number` | Overall tint color (hex) |
| `tintTopLeft/TR/BL/BR` | `number` | Per-corner tint |
| `tintMode` | `number` | Tint blend mode |
| `isTinted` | `boolean` | Read-only: is any tint applied? |
| `setTint(tl, tr, bl, br)` | method | Set tint (single or per-corner) |
| `setTintMode(mode)` | method | Set tint blend mode |
| `clearTint()` | method | Reset tint to white + MULTIPLY |

### Origin
| API | Type | Description |
|---|---|---|
| `originX`, `originY` | `number` | Normalized origin 0-1 |
| `displayOriginX`, `displayOriginY` | `number` | Pixel origin values |
| `setOrigin(x, y)` | method | Set normalized origin |
| `setDisplayOrigin(x, y)` | method | Set pixel origin |

### Depth
| API | Type | Description |
|---|---|---|
| `depth` | `number` | Z-index for rendering |
| `setDepth(value)` | method | Set depth |
| `setToTop()` | method | Move to top of display list |
| `setToBack()` | method | Move to back of display list |
| `setAbove(gameObject)` | method | Position above another object |
| `setBelow(gameObject)` | method | Position below another object |

### Flip
| API | Type | Description |
|---|---|---|
| `flipX`, `flipY` | `boolean` | Flip state |
| `setFlip(x, y)` | method | Set both flip values |
| `setFlipX(value)` | method | Set horizontal flip |
| `setFlipY(value)` | method | Set vertical flip |
| `toggleFlipX()`, `toggleFlipY()` | method | Toggle flip state |
| `resetFlip()` | method | Reset both to false |

### Size
| API | Type | Description |
|---|---|---|
| `width`, `height` | `number` | Native (un-scaled) dimensions |
| `displayWidth`, `displayHeight` | `number` | Scaled dimensions (setting adjusts scale) |
| `setSize(w, h)` | method | Set internal size |
| `setDisplaySize(w, h)` | method | Set visual size (adjusts scale) |
| `setSizeToFrame(frame)` | method | Match size to frame |

### Texture (TextureCrop)
| API | Type | Description |
|---|---|---|
| `texture` | `Texture` | Current texture reference |
| `frame` | `Frame` | Current frame reference |
| `setTexture(key, frame)` | method | Change texture and frame |
| `setFrame(frame, updateSize, updateOrigin)` | method | Change frame only |
| `setCrop(x, y, w, h)` | method | Crop visible region |
| `isCropped` | `boolean` | Toggle crop on/off |

### Other
| API | Type | Description |
|---|---|---|
| `visible` / `setVisible(bool)` | | Visibility toggle |
| `scrollFactorX`, `scrollFactorY` / `setScrollFactor(x, y)` | | Camera scroll influence |
| `blendMode` / `setBlendMode(mode)` | | Blend mode |
| `destroy()` | method | Remove and clean up |
| `active` | `boolean` | Update-list processing flag (from GameObject) |
| `name` | `string` | Developer-assigned name (from GameObject) |
| `state` | `number\|string` | Developer-assigned state (from GameObject) |
| `setInteractive()` | method | Enable input (from GameObject) |
| `setData(key, value)` | method | Store custom data (from GameObject) |

## Gotchas and Common Mistakes

1. **Using Sprite when Image suffices.** Sprites are added to the Scene `updateList` and run `preUpdate` every frame for animation ticking. If you do not need animation, use `Image` instead to avoid unnecessary overhead.

2. **`z` does not control render order.** The `z` property on Transform is a generic coordinate, not a z-index. Use `depth` or the display list ordering methods (`setToTop`, `setAbove`, etc.) to control what renders on top.

3. **`scale` getter returns the average.** Reading `sprite.scale` returns `(scaleX + scaleY) / 2`. If scaleX and scaleY differ, this may be misleading. Check `scaleX`/`scaleY` individually when non-uniform scaling is used.

4. **Setting scale to 0 hides the object.** Setting `scale`, `scaleX`, or `scaleY` to 0 clears a render flag. The object will not render until scale is set back to a non-zero value.

5. **Setting alpha to 0 hides the object.** Same render-flag behavior as scale. Alpha of exactly 0 prevents rendering. Use `setVisible(false)` if you want to explicitly hide without changing alpha.

6. **`setTintFill` is removed in Phaser 4.** Use `sprite.setTint(color).setTintMode(Phaser.TintModes.FILL)` instead. Calling `setTintFill()` will log an error to the console.

7. **Tint and tintMode are now separate in Phaser 4.** In Phaser 3 they were set together. In Phaser 4, `setTint()` only sets the color; use `setTintMode()` to change the blend operation.

8. **Flip does not affect physics bodies.** Flipping is a rendering toggle only. If your game logic depends on facing direction, track it separately from `flipX`/`flipY`.

9. **`setFrame` resets size and origin by default.** Calling `setFrame('new-frame')` will resize the object and recalculate origin. Pass `false` for `updateSize` and `updateOrigin` to prevent this: `setFrame('f', false, false)`.

10. **ScrollFactor and physics.** Scroll factor is a visual offset only. Physics collisions always use world position regardless of scroll factor. A scroll factor other than 1 can cause visual misalignment with physics bodies.

11. **Origin default is center (0.5, 0.5).** Position coordinates refer to the center of the object by default. Set `setOrigin(0, 0)` if you want position to refer to the top-left corner.

12. **Rotation direction.** Phaser uses right-hand clockwise rotation: 0 = right, 90 degrees (PI/2) = down, 180 = left, -90 (or 270) = up.

## Source File Map

| File | Purpose |
|---|---|
| `src/gameobjects/sprite/Sprite.js` | Sprite class definition and Mixins array |
| `src/gameobjects/sprite/SpriteFactory.js` | `this.add.sprite` factory registration |
| `src/gameobjects/sprite/SpriteRender.js` | Sprite render methods |
| `src/gameobjects/image/Image.js` | Image class definition and Mixins array |
| `src/gameobjects/image/ImageFactory.js` | `this.add.image` factory registration |
| `src/gameobjects/image/ImageRender.js` | Image render methods |
| `src/gameobjects/GameObject.js` | Base class (scene, active, name, state, data, destroy) |
| `src/gameobjects/GameObjectFactory.js` | Factory registry (`this.add`) |
| `src/gameobjects/components/index.js` | Component module exports |
| `src/gameobjects/components/Transform.js` | Position, scale, rotation |
| `src/gameobjects/components/Alpha.js` | Alpha / opacity |
| `src/gameobjects/components/Tint.js` | Tint color and mode |
| `src/gameobjects/components/Origin.js` | Origin / anchor point |
| `src/gameobjects/components/Depth.js` | Depth / z-ordering |
| `src/gameobjects/components/Flip.js` | Horizontal/vertical flip |
| `src/gameobjects/components/Visible.js` | Visibility toggle |
| `src/gameobjects/components/Size.js` | Width, height, display size |
| `src/gameobjects/components/ScrollFactor.js` | Camera scroll factor |
| `src/gameobjects/components/BlendMode.js` | Blend mode |
| `src/gameobjects/components/TextureCrop.js` | Texture, frame, and crop |
| `src/gameobjects/components/GetBounds.js` | Bounding box calculations |
| `src/gameobjects/components/Mask.js` | Bitmap and geometry masks |
| `src/gameobjects/components/Lighting.js` | Normal map lighting |
| `src/gameobjects/components/RenderNodes.js` | WebGL render node setup |
| `src/gameobjects/components/Filters.js` | Post-processing filters |
| `src/gameobjects/components/RenderSteps.js` | Render step pipeline |
| `src/animations/AnimationState.js` | Animation state machine (Sprite only) |
