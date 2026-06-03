# V4 New Features — Reference

> Detailed configuration, API tables, and source file maps for the v4-new-features skill.

## New Tint Modes

v3 had two tint modes set implicitly via `setTint()` (multiply) and `setTintFill()` (fill). v4 separates tint color from tint mode and adds new modes.

```js
// v3 approach:
sprite.setTint(0xff0000);      // multiply mode implicit
sprite.setTintFill(0xff0000);  // fill mode implicit

// v4 approach:
sprite.setTint(0xff0000);                            // sets color only
sprite.setTintMode(Phaser.TintModes.FILL);           // sets mode separately
// NOTE: setTintFill() is a deprecated no-op in v4 -- it only logs a console error
```

**Available modes** (`Phaser.TintModes`):

| Mode | Value | Effect |
|---|---|---|
| `MULTIPLY` | 0 | Default. Tint multiplied with texture color |
| `FILL` | 1 | Tint replaces texture color (respects alpha). Flash-white effect |
| `ADD` | 2 | Tint added to texture color (respects alpha) |
| `SCREEN` | 4 | Brightens dark areas of the texture |
| `OVERLAY` | 5 | Brightens lights, darkens darks |
| `HARD_LIGHT` | 6 | Like overlay with tint/texture swapped |
| `MULTIPLY_TWO` | 7 | Like multiply, but with an extra tint color for dark regions |

**Source**: `src/renderer/TintModes.js`

---

## Migrating from v3

For detailed migration instructions, code conversion examples, removed APIs, and a full checklist, see the dedicated [v3 to v4 Migration Guide](../v3-to-v4-migration/SKILL.md).

---

## Source File Map

| Feature | Path |
|---|---|
| CaptureFrame | `src/gameobjects/captureframe/CaptureFrame.js` |
| Gradient | `src/gameobjects/gradient/Gradient.js` |
| Noise (white) | `src/gameobjects/noise/Noise.js` |
| NoiseCell2D/3D/4D | `src/gameobjects/noise/noisecell{2,3,4}d/` |
| NoiseSimplex2D/3D | `src/gameobjects/noise/noisesimplex{2,3}d/` |
| SpriteGPULayer | `src/gameobjects/spritegpulayer/SpriteGPULayer.js` |
| TilemapGPULayer | `src/tilemaps/TilemapGPULayer.js` |
| Lighting component | `src/gameobjects/components/Lighting.js` |
| RenderSteps component | `src/gameobjects/components/RenderSteps.js` |
| RenderNodes component | `src/gameobjects/components/RenderNodes.js` |
| Tint component | `src/gameobjects/components/Tint.js` |
| TintModes | `src/renderer/TintModes.js` |
| RenderNode base class | `src/renderer/webgl/renderNodes/RenderNode.js` |
| RenderNodeManager | `src/renderer/webgl/renderNodes/RenderNodeManager.js` |
| Filter render nodes | `src/renderer/webgl/renderNodes/filters/` |
| Submitter nodes | `src/renderer/webgl/renderNodes/submitter/` |
| Transformer nodes | `src/renderer/webgl/renderNodes/transformer/` |
| Texturer nodes | `src/renderer/webgl/renderNodes/texturer/` |
| Batch handlers | `src/renderer/webgl/renderNodes/BatchHandler*.js` |
| Rendering concepts doc | `docs/Phaser 4 Rendering Concepts/` |

---

**Related skills**: ../filters-and-postfx/SKILL.md, ../game-object-components/SKILL.md, ../tilemaps/SKILL.md, ../v3-to-v4-migration/SKILL.md
