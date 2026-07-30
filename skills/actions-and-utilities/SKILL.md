---
name: actions-and-utilities
description: "Use this skill when working with Phaser 4 utility functions, actions, alignment, grid layout, or batch operations on game objects. Triggers on: align, grid layout, actions, set operations on groups of game objects."
---

# Phaser 4 -- Actions & Utility Functions

> Phaser.Actions namespace for batch operations on Game Object arrays, plus Phaser.Utils.Array, Phaser.Utils.Objects, and Phaser.Utils.String helper functions.

**Related skills:** ../groups-and-containers/SKILL.md, ../sprites-and-images/SKILL.md

---

## Quick Start

```js
// Create 20 sprites and batch-position them in a grid
const sprites = [];
for (let i = 0; i < 20; i++) {
    sprites.push(this.add.sprite(0, 0, 'gem'));
}

// Arrange into a 5x4 grid
Phaser.Actions.GridAlign(sprites, {
    width: 5,
    height: 4,
    cellWidth: 64,
    cellHeight: 64,
    x: 100,
    y: 100
});

// Fade alpha from 0 to 1 across all sprites
Phaser.Actions.Spread(sprites, 'alpha', 0, 1);

// Offset each sprite's x by 10, with a step of 2 per item
Phaser.Actions.IncX(sprites, 10, 2);

// Works with Groups too
const group = this.add.group({ key: 'star', repeat: 11 });
Phaser.Actions.PlaceOnCircle(group.getChildren(), new Phaser.Geom.Circle(400, 300, 200));
```

---

## Core Concepts

### The Actions Pattern

Every Action in `Phaser.Actions` follows the same pattern:

1. **First argument is always an array** of Game Objects (or any objects with the required public properties like `x`, `y`, `alpha`, etc.).
2. **Returns the same array**, enabling chaining or pass-through.
3. **Works with Groups** by passing `group.getChildren()`.
4. Actions do NOT store state. They are one-shot batch operations.

### PropertyValueSet and PropertyValueInc

Most Set/Inc actions delegate to two core functions:

- **`PropertyValueSet(items, key, value, step, index, direction)`** -- Sets `items[i][key] = value + (i * step)`.
- **`PropertyValueInc(items, key, value, step, index, direction)`** -- Adds `items[i][key] += value + (i * step)`.

The `step` parameter adds an incremental offset per item. The `index` and `direction` parameters control iteration start point and order (1 = forward, -1 = backward).

### Geometry-Based Placement

Actions like `PlaceOnCircle`, `PlaceOnLine`, `RandomRectangle`, etc. accept Phaser geometry objects (`Phaser.Geom.Circle`, `Phaser.Geom.Line`, etc.), NOT Game Object shapes. If using a `Phaser.GameObjects.Circle`, pass its `.geom` property instead.

---

## All Actions

### Property Setters

| Action | Signature | Description |
|---|---|---|
| `SetX` | `(items, value, step?, index?, direction?)` | Set `x` property |
| `SetY` | `(items, value, step?, index?, direction?)` | Set `y` property |
| `SetXY` | `(items, x, y?, stepX?, stepY?, index?, direction?)` | Set both `x` and `y`; `y` defaults to `x` |
| `SetAlpha` | `(items, value, step?, index?, direction?)` | Set `alpha` |
| `SetBlendMode` | `(items, value, index?, direction?)` | Set blend mode |
| `SetDepth` | `(items, value, step?, index?, direction?)` | Set render depth |
| `SetHitArea` | `(items, hitArea?, callback?)` | Set interactive hit area |
| `SetOrigin` | `(items, originX, originY?, stepX?, stepY?, index?, direction?)` | Set origin point |
| `SetRotation` | `(items, value, step?, index?, direction?)` | Set rotation (radians) |
| `SetScale` | `(items, scaleX, scaleY?, stepX?, stepY?, index?, direction?)` | Set both scale axes |
| `SetScaleX` | `(items, value, step?, index?, direction?)` | Set `scaleX` |
| `SetScaleY` | `(items, value, step?, index?, direction?)` | Set `scaleY` |
| `SetScrollFactor` | `(items, x, y?, stepX?, stepY?, index?, direction?)` | Set scroll factor |
| `SetScrollFactorX` | `(items, value, step?, index?, direction?)` | Set horizontal scroll factor |
| `SetScrollFactorY` | `(items, value, step?, index?, direction?)` | Set vertical scroll factor |
| `SetTint` | `(items, topLeft, topRight?, bottomLeft?, bottomRight?)` | Set tint color(s) |
| `SetVisible` | `(items, value, index?, direction?)` | Set visibility |
| `PropertyValueSet` | `(items, key, value, step?, index?, direction?)` | Generic: set any named property |

### Property Incrementers

| Action | Signature | Description |
|---|---|---|
| `IncX` | `(items, value, step?, index?, direction?)` | Add to `x` |
| `IncXY` | `(items, x, y?, stepX?, stepY?, index?, direction?)` | Add to `x` and `y` |
| `IncY` | `(items, value, step?, index?, direction?)` | Add to `y` |
| `IncAlpha` | `(items, value, step?, index?, direction?)` | Add to `alpha` |
| `Angle` | `(items, value, step?, index?, direction?)` | Add to `angle` (degrees) |
| `Rotate` | `(items, value, step?, index?, direction?)` | Add to `rotation` (radians) |
| `ScaleX` | `(items, value, step?, index?, direction?)` | Add to `scaleX` |
| `ScaleXY` | `(items, scaleX, scaleY?, stepX?, stepY?, index?, direction?)` | Add to both scale axes |
| `ScaleY` | `(items, value, step?, index?, direction?)` | Add to `scaleY` |
| `PropertyValueInc` | `(items, key, value, step?, index?, direction?)` | Generic: increment any named property |

### Placement on Geometry

| Action | Signature | Description |
|---|---|---|
| `PlaceOnCircle` | `(items, circle, startAngle?, endAngle?)` | Evenly space on circle perimeter |
| `PlaceOnEllipse` | `(items, ellipse, startAngle?, endAngle?)` | Evenly space on ellipse perimeter |
| `PlaceOnLine` | `(items, line)` | Evenly space along a line |
| `PlaceOnRectangle` | `(items, rect, shift?)` | Evenly space on rectangle perimeter |
| `PlaceOnTriangle` | `(items, triangle, stepRate?)` | Evenly space on triangle perimeter |
| `RandomCircle` | `(items, circle)` | Random positions within a circle |
| `RandomEllipse` | `(items, ellipse)` | Random positions within an ellipse |
| `RandomLine` | `(items, line)` | Random positions along a line |
| `RandomRectangle` | `(items, rect)` | Random positions within a rectangle |
| `RandomTriangle` | `(items, triangle)` | Random positions within a triangle |

### Layout and Alignment

| Action | Signature | Description |
|---|---|---|
| `GridAlign` | `(items, config)` | Arrange in grid; config: `{ width, height, cellWidth, cellHeight, position, x, y }` |
| `AlignTo` | `(items, position, offsetX?, offsetY?)` | Chain-align each item next to the previous one using `Phaser.Display.Align` constants |
| `FitToRegion` | `(items, scaleMode?, region?, itemCoverage?)` | Scale/position each GO to fill a rectangle (v4.0.0+). scaleMode: 0=stretch, -1=fit inside, 1=cover outside |

### Distribution and Interpolation

| Action | Signature | Description |
|---|---|---|
| `Spread` | `(items, property, min, max, inc?)` | Linearly distribute a property from `min` to `max` across all items |
| `SmoothStep` | `(items, property, min, max, inc?)` | Distribute using Hermite smoothstep interpolation |
| `SmootherStep` | `(items, property, min, max, inc?)` | Distribute using Ken Perlin's smootherstep |

### Rotation and Movement

| Action | Signature | Description |
|---|---|---|
| `RotateAround` | `(items, point, angle)` | Rotate all items around a point (radians) |
| `RotateAroundDistance` | `(items, point, angle, distance)` | Rotate around a point at a fixed distance |
| `ShiftPosition` | `(items, x, y, direction?, output?)` | Snake-like: move head to x/y, each item takes position of the previous |
| `WrapInRectangle` | `(items, rect, padding?)` | Wrap x/y to stay within rectangle bounds |

### Queries and Iteration

| Action | Signature | Description |
|---|---|---|
| `GetFirst` | `(items, compare, index?)` | Find first item matching all properties in `compare` object |
| `GetLast` | `(items, compare, index?)` | Find last item matching all properties in `compare` object |
| `Call` | `(items, callback, context)` | Invoke callback for each item |
| `Shuffle` | `(items)` | Randomly reorder the array (Fisher-Yates) |
| `ToggleVisible` | `(items)` | Toggle `visible` on each item |
| `PlayAnimation` | `(items, key, ignoreIfPlaying?)` | Play animation on all items with an `anims` component |

### Effects (v4.0.0+)

| Action | Signature | Description |
|---|---|---|
| `AddEffectBloom` | `(items, config?)` | Add Bloom filter effect to a Camera or GO. Returns `{ parallelFilters, threshold, blur }[]` |
| `AddEffectShine` | `(items, config?)` | Add Shine filter effect |
| `AddMaskShape` | `(items, config?)` | Apply a shape-based mask (circle, square, rectangle, ellipse) with optional blur |

---

## Array Utilities

Namespace: `Phaser.Utils.Array`

| Function | Signature | Description |
|---|---|---|
| `Add` | `(array, item, limit?, callback?, context?)` | Add item(s) if not already present; optional size limit |
| `AddAt` | `(array, item, index?, limit?, callback?, context?)` | Insert item(s) at index |
| `BringToTop` | `(array, item)` | Move item to end of array |
| `CountAllMatching` | `(array, property, value, startIndex?, endIndex?)` | Count items where property equals value |
| `Each` | `(array, callback, context, ...args)` | Iterate with callback; passes item + extra args |
| `EachInRange` | `(array, callback, context, startIndex, endIndex, ...args)` | Iterate a slice with callback |
| `FindClosestInSorted` | `(value, array, key?)` | Binary-search style closest match in sorted array |
| `Flatten` | `(array, output?)` | Flatten nested arrays into a single array |
| `GetAll` | `(array, property?, value?, startIndex?, endIndex?)` | Filter items matching property/value |
| `GetFirst` | `(array, property?, value?, startIndex?, endIndex?)` | First item matching property/value |
| `GetRandom` | `(array, startIndex?, length?)` | Return a random element |
| `MoveAbove` | `(array, item1, item2)` | Move item2 directly above item1 |
| `MoveBelow` | `(array, item1, item2)` | Move item2 directly below item1 |
| `MoveDown` | `(array, item)` | Move item one position toward index 0 |
| `MoveTo` | `(array, item, index)` | Move item to specific index |
| `MoveUp` | `(array, item)` | Move item one position toward end |
| `NumberArray` | `(start, end, prefix?, suffix?)` | Generate `[start..end]` range; optional string prefix/suffix |
| `NumberArrayStep` | `(start?, end?, step?)` | Generate range with custom step size |
| `QuickSelect` | `(array, k, left?, right?, compare?)` | Partial sort: kth smallest element in-place |
| `Range` | `(a, b, options?)` | Generate array from range config |
| `Remove` | `(array, item, callback?, context?)` | Remove item(s) from array |
| `RemoveAt` | `(array, index, callback?, context?)` | Remove item at index |
| `RemoveBetween` | `(array, startIndex, endIndex, callback?, context?)` | Remove items in range |
| `RemoveRandomElement` | `(array, startIndex?, length?)` | Remove and return a random element |
| `Replace` | `(array, oldItem, newItem)` | Swap one item for another |
| `RotateLeft` | `(array, total?)` | Shift elements left; last wraps to front |
| `RotateRight` | `(array, total?)` | Shift elements right; first wraps to end |
| `SafeRange` | `(array, startIndex, endIndex, throwError?)` | Validate index range is within bounds |
| `SendToBack` | `(array, item)` | Move item to index 0 |
| `SetAll` | `(array, property, value, startIndex?, endIndex?)` | Set a property on all items in range |
| `Shuffle` | `(array)` | Fisher-Yates shuffle; modifies in-place |
| `SortByDigits` | `(array)` | Sort strings by embedded numeric values |
| `SpliceOne` | `(array, index)` | Fast single-element splice |
| `StableSort` | `(array, compare?)` | Guaranteed stable sort (merge sort fallback for engines without native stable sort) |
| `Swap` | `(array, item1, item2)` | Swap two items in-place |

Also includes `Phaser.Utils.Array.Matrix` sub-namespace for 2D matrix operations.

---

## Object Utilities

Namespace: `Phaser.Utils.Objects`

| Function | Signature | Description |
|---|---|---|
| `Clone` | `(obj)` | Shallow clone of object |
| `DeepCopy` | `(obj)` | Recursive deep copy of object or array |
| `Extend` | `(target, ...sources)` | jQuery-style extend; copies properties from sources to target |
| `GetAdvancedValue` | `(source, key, defaultValue)` | Like `GetValue` but resolves random/callback config values |
| `GetFastValue` | `(source, key, defaultValue?)` | Top-level-only property lookup; no dot-path support. Faster than `GetValue` |
| `GetMinMaxValue` | `(source, key, min, max, defaultValue)` | Get value clamped between min and max |
| `GetValue` | `(source, key, defaultValue, altSource?)` | Dot-path property lookup (e.g. `'render.screen.width'`). Falls back to altSource then defaultValue |
| `HasAll` | `(source, keys)` | True if source has ALL listed keys |
| `HasAny` | `(source, keys)` | True if source has ANY listed key |
| `HasValue` | `(source, key)` | True if source has the key |
| `IsPlainObject` | `(obj)` | True if obj is a plain `{}` object (not DOM, not window) |
| `Merge` | `(obj1, obj2)` | Merge obj2 into a clone of obj1 |
| `MergeRight` | `(obj1, obj2)` | Merge obj1 into a clone of obj2 |
| `Pick` | `(source, keys)` | Return new object with only the specified keys |
| `SetValue` | `(source, key, value)` | Set a dot-path property value |

---

## String Utilities

Namespace: `Phaser.Utils.String`

| Function | Signature | Description |
|---|---|---|
| `Format` | `(string, values)` | Replace `%1`, `%2`, etc. markers with array values |
| `Pad` | `(str, len?, pad?, dir?)` | Pad string to length. dir: 1=left, 2=right, default=both |
| `RemoveAt` | `(string, index)` | Remove character at index |
| `Reverse` | `(string)` | Reverse the string |
| `UppercaseFirst` | `(string)` | Capitalize first character |
| `UUID` | `()` | Generate RFC4122 v4 UUID string |

---

## Common Patterns

### Using Actions with Groups

```js
const enemies = this.add.group({ key: 'enemy', repeat: 9 });

// Position all children in a grid
Phaser.Actions.GridAlign(enemies.getChildren(), {
    width: 5, height: 2,
    cellWidth: 80, cellHeight: 80,
    x: 100, y: 50
});

// Fan out alpha across all enemies
Phaser.Actions.Spread(enemies.getChildren(), 'alpha', 0.3, 1);
```

### Step Parameter for Staggered Values

```js
// Place sprites starting at x=100, each one 50px further right
Phaser.Actions.SetX(sprites, 100, 50);
// Result: items[0].x=100, items[1].x=150, items[2].x=200, ...

// Increment rotation with increasing step
Phaser.Actions.Rotate(sprites, 0.1, 0.05);
// Result: items[0].rotation += 0.1, items[1].rotation += 0.15, items[2].rotation += 0.2, ...
```

### Scatter Then Constrain

```js
const bounds = new Phaser.Geom.Rectangle(0, 0, 800, 600);
// Random scatter
Phaser.Actions.RandomRectangle(sprites, bounds);
// Keep wrapped in bounds during update
Phaser.Actions.WrapInRectangle(sprites, bounds);
```

### GetValue for Config Parsing

```js
// Deep property access with fallback
const width = Phaser.Utils.Objects.GetValue(config, 'render.screen.width', 800);

// Fast top-level lookup (no dot-path, better performance)
const speed = Phaser.Utils.Objects.GetFastValue(config, 'speed', 100);
```

### NumberArray for Asset Keys

```js
// Generate frame key strings
const keys = Phaser.Utils.Array.NumberArray(1, 10, 'frame_', '.png');
// Result: ['frame_1.png', 'frame_2.png', ..., 'frame_10.png']
```

---

## Gotchas

- **Actions operate on plain arrays, not Groups directly.** Always call `group.getChildren()` to get the array.
- **PlaceOn/Random geometry actions need `Phaser.Geom` objects**, not Game Object shapes. For a `Phaser.GameObjects.Circle`, pass `circle.geom`.
- **`SetXY` defaults `y` to `x`** if `y` is `undefined` or `null`. Pass `0` explicitly if you want y=0 and x=something else.
- **`Spread` with a single item** places it at the midpoint `(min + max) / 2`, not at `min`.
- **`step` is multiplied by iteration index**, not added cumulatively. Item 0 gets `value + 0*step`, item 1 gets `value + 1*step`, etc.
- **`StableSort` uses native `Array.sort` when the engine supports stable sorting**, falling back to merge sort only when needed.
- **`Shuffle` (both Actions and Utils.Array) modifies the array in-place** and returns it.
- **`GetValue` vs `GetFastValue`**: Use `GetFastValue` when the key is always top-level (no dots). It skips dot-path parsing and is faster in hot loops.
- **`AddEffectBloom` / `AddEffectShine` / `AddMaskShape` are v4-only** filter-based effects. They return arrays of created effects instead of the input.

---

## Source File Map

| Area | Path |
|---|---|
| All Actions | `src/actions/` |
| Actions index | `src/actions/index.js` |
| Core set/inc helpers | `src/actions/PropertyValueSet.js`, `src/actions/PropertyValueInc.js` |
| GridAlign config typedef | `src/actions/typedefs/` |
| Array utilities | `src/utils/array/` |
| Array matrix utils | `src/utils/array/matrix/` |
| Object utilities | `src/utils/object/` |
| String utilities | `src/utils/string/` |
