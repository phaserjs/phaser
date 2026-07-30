# Game Object Components Reference

## Which Game Objects Have Which Components

| Component | Sprite | Image | Text | Container | TileSprite | Video | Graphics |
|---|---|---|---|---|---|---|---|
| Alpha | yes | yes | yes | -- | yes | yes | -- |
| AlphaSingle | -- | -- | -- | yes | -- | -- | yes |
| BlendMode | yes | yes | yes | yes | yes | yes | yes |
| Depth | yes | yes | yes | yes | yes | yes | yes |
| Flip | yes | yes | yes | -- | yes | yes | -- |
| GetBounds | yes | yes | yes | -- | yes | yes | -- |
| Lighting | yes | yes | yes | -- | yes | yes | -- |
| Mask | yes | yes | yes | yes | yes | yes | yes |
| Origin | yes | yes | yes | -- | yes | yes | -- |
| ScrollFactor | yes | yes | yes | -- | yes | yes | yes |
| Size | yes | yes | -- | -- | -- | -- | -- |
| ComputedSize | -- | -- | -- | -- | yes | yes | -- |
| TextureCrop | yes | yes | -- | -- | -- | -- | -- |
| Texture | -- | -- | -- | -- | yes | yes | -- |
| Tint | yes | yes | yes | -- | yes | yes | -- |
| Transform | yes | yes | yes | yes | yes | yes | yes |
| Visible | yes | yes | yes | yes | yes | yes | yes |
| RenderNodes | yes | yes | yes | -- | yes | yes | yes |
| PathFollower | -- | -- | -- | -- | -- | -- | -- |

PathFollower is only on `Phaser.GameObjects.PathFollower` (extends Sprite).

## RenderNodes (v4, WebGL only)

Manages custom WebGL render node assignments for advanced rendering.

| Member | Type | Description |
|---|---|---|
| `customRenderNodes` | object | Custom node overrides keyed by role. |
| `defaultRenderNodes` | object | Default nodes keyed by role. |
| `renderNodeData` | object | Per-node data keyed by node name. |
| `initRenderNodes(defaultNodes)` | method | Initialize render nodes from a Map of role->name. |
| `setRenderNodeRole(key, renderNode, renderNodeData?, copyData?)` | method | Set or remove a custom render node for a role. Pass `null` to remove. Returns `this`. |
| `setRenderNodeData(renderNode, key, value)` | method | Set data for a render node. Pass `undefined` value to delete key. Returns `this`. |

Common role keys: `'Submitter'`, `'Transformer'`, `'Texturer'`.

## RenderSteps (v4, WebGL only)

| Member | Type | Description |
|---|---|---|
| `_renderSteps` | array | Internal list of render step functions. |
| `renderWebGLStep(renderer, gameObject, drawingContext, parentMatrix?, renderStep?, displayList?, displayListIndex?)` | method | Execute a render step by index. |
| `addRenderStep(fn, index?)` | method | Add a render step function. Omit index to append. Returns `this`. |

## Filters Component (v4, WebGL only)

| Member | Type | Description |
|---|---|---|
| `filterCamera` | Camera | Internal camera used for filter rendering. |
| `filters` | object (readonly, get) | `{ internal: FilterList, external: FilterList }`. |
| `renderFilters` | boolean | Toggle filter rendering. Default: `true` |
| `filtersAutoFocus` | boolean | Auto-update filter camera each frame. Default: `true` |
| `enableFilters()` | method | Enable the filter system on this object. Returns `this`. |
| `willRenderFilters()` | method | Returns true if filters will be applied this frame. |
| `focusFiltersOverride(x?, y?, width?, height?)` | method | Manually override filter camera focus. |

## FilterList Methods

| Method | Description |
|---|---|
| `addBarrel(amount)` | Barrel distortion |
| `addBlur(quality, x, y, strength, color, steps)` | Gaussian blur |
| `addColorMatrix()` | Color matrix manipulation |
| `addGlow(color, outerStrength, innerStrength, scale, knockout, quality, distance)` | Glow/outline |
| `addMask(mask, invert, viewCamera, viewTransform, scaleFactor)` | Mask filter |
| `addVignette(x, y, radius, strength, color, blendMode)` | Vignette |
| `addWipe(wipeWidth, direction, axis, reveal, wipeTexture)` | Wipe transition |

See the [filters-and-postfx skill](../filters-and-postfx/SKILL.md) for the full list.
