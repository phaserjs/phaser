---
name: graphics-and-shapes
description: "Use this skill when drawing shapes and graphics in Phaser 4. Covers the Graphics game object, lines, rectangles, circles, arcs, polygons, gradients, fill, stroke, and generated textures. Triggers on: Graphics, draw shape, fillRect, lineStyle, polygon, arc."
---

# Phaser 4 — Graphics and Shapes

> Drawing primitives with the Graphics game object, and using Shape game objects (Arc, Curve, Ellipse, Grid, IsoBox, IsoTriangle, Line, Polygon, Rectangle, Star, Triangle).

Related skills: sprites-and-images.md, game-object-components.md

---

## Quick Start

```js
// Draw a filled rectangle and stroked circle with Graphics
const gfx = this.add.graphics();

gfx.fillStyle(0x00aa00, 1);
gfx.fillRect(50, 50, 200, 100);

gfx.lineStyle(3, 0xff0000, 1);
gfx.strokeCircle(400, 150, 60);
```

```js
// Same shapes as standalone Shape game objects
const rect = this.add.rectangle(150, 100, 200, 100, 0x00aa00);
const circle = this.add.circle(400, 150, 60);
circle.setStrokeStyle(3, 0xff0000);
```

---

## Core Concepts — Graphics vs Shape Objects

Phaser offers two approaches for rendering primitives without textures.

### Graphics Game Object

Created with `this.add.graphics()`. An imperative drawing surface — you call methods like `fillRect`, `strokeCircle`, `beginPath`/`lineTo`/`strokePath` to build up a command buffer that replays each frame.

- Factory: `this.add.graphics(config?)` where config is `{ x?, y?, lineStyle?, fillStyle? }`.
- Supports paths, arcs, gradients, rounded rectangles, canvas transforms (`translateCanvas`, `scaleCanvas`, `rotateCanvas`), and `save`/`restore`.
- Can generate a Texture from the drawing via `generateTexture(key, width, height)`.
- Expensive to render, especially with complex shapes. Uses its own WebGL shader. Group Graphics objects together to minimize batch flushes.
- Components: AlphaSingle, BlendMode, Depth, Lighting, Mask, RenderNodes, Transform, Visible, ScrollFactor.
- Does NOT include Origin or GetBounds (position is set via options or `setPosition`).

### Shape Game Objects

Individual game objects (Arc, Rectangle, Star, etc.) extending the base `Shape` class. Each renders one predefined geometric shape with precomputed path data.

- Created via dedicated factory methods: `this.add.rectangle(...)`, `this.add.circle(...)`, etc.
- Fully featured game objects: can be tweened, scaled, added to groups/containers, enabled for input/physics.
- Style via `setFillStyle(color, alpha)` and `setStrokeStyle(lineWidth, color, alpha)`.
- Share the same WebGL batch as Graphics for efficient rendering.
- Do NOT support gradients, path detail threshold, or canvas transforms.
- Components: AlphaSingle, BlendMode, Depth, GetBounds, Lighting, Mask, Origin, RenderNodes, ScrollFactor, Transform, Visible.
- Include Origin and GetBounds (unlike Graphics).

**When to use which:**
- Use **Graphics** for dynamic drawing, complex paths, multiple shapes on one object, gradients, or generating textures.
- Use **Shape objects** for individual UI elements, simple indicators, physics-enabled shapes, or anything that benefits from game object features (origin, bounds, input).

---

## Common Patterns

### Fill and Stroke Styles (Graphics)

```js
const gfx = this.add.graphics();

// Solid fill — call before any fill* method
gfx.fillStyle(0xff0000, 1);          // (color, alpha)

// Line style — call before any stroke* method
gfx.lineStyle(4, 0x00ff00, 1);       // (width, color, alpha)

// Gradient fill (WebGL only) — 4 corner colors
gfx.fillGradientStyle(
    0xff0000, 0x00ff00, 0x0000ff, 0xffff00,  // tl, tr, bl, br colors
    1, 1, 1, 1                                 // tl, tr, bl, br alphas
);
gfx.fillRect(0, 0, 300, 200);

// Gradient line style (WebGL only)
gfx.lineGradientStyle(2, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 1);
```

### Drawing Primitives (Graphics)

```js
const gfx = this.add.graphics();

// Rectangles
gfx.fillStyle(0x0000ff);
gfx.fillRect(x, y, width, height);
gfx.lineStyle(2, 0xffffff);
gfx.strokeRect(x, y, width, height);

// Circles
gfx.fillCircle(x, y, radius);
gfx.strokeCircle(x, y, radius);

// Ellipses
gfx.fillEllipse(x, y, width, height, smoothness);
gfx.strokeEllipse(x, y, width, height, smoothness);   // smoothness defaults to 32

// Triangles
gfx.fillTriangle(x0, y0, x1, y1, x2, y2);
gfx.strokeTriangle(x0, y0, x1, y1, x2, y2);

// Points (draws a small square)
gfx.fillPoint(x, y, size);                             // size defaults to 1

// Lines
gfx.lineBetween(x1, y1, x2, y2);
```

### Rounded Rectangles

```js
const gfx = this.add.graphics();

// Uniform radius (default 20)
gfx.fillStyle(0x333333);
gfx.fillRoundedRect(50, 50, 300, 200, 16);
gfx.lineStyle(2, 0xffffff);
gfx.strokeRoundedRect(50, 50, 300, 200, 16);

// Per-corner radius
gfx.fillRoundedRect(50, 50, 300, 200, {
    tl: 20, tr: 20, bl: 0, br: 0
});

// Concave corners (negative values)
gfx.fillRoundedRect(50, 50, 300, 200, { tl: -10, tr: -10, bl: -10, br: -10 });
```

### Path Drawing

```js
const gfx = this.add.graphics();

// Manual path
gfx.lineStyle(3, 0xffff00);
gfx.beginPath();
gfx.moveTo(100, 100);
gfx.lineTo(200, 50);
gfx.lineTo(300, 100);
gfx.lineTo(250, 200);
gfx.closePath();
gfx.strokePath();       // or gfx.stroke() — alias for strokePath

// Fill a path
gfx.fillStyle(0x00aaff);
gfx.beginPath();
gfx.moveTo(100, 100);
gfx.lineTo(200, 50);
gfx.lineTo(300, 100);
gfx.closePath();
gfx.fillPath();         // or gfx.fill() — alias for fillPath

// Arc within a path (angles in radians)
gfx.beginPath();
gfx.arc(200, 200, 80, 0, Math.PI / 2, false, 0);   // (x, y, radius, startAngle, endAngle, anticlockwise, overshoot)
gfx.strokePath();

// Pie slice
gfx.slice(200, 200, 80, 0, Math.PI / 3, false);     // auto begins/closes path
gfx.fillPath();

// Stroke/fill from point arrays
gfx.strokePoints(points, closeShape, closePath, endIndex);
gfx.fillPoints(points, closeShape, closePath, endIndex);
```

### Geom Shape Helpers

Graphics has convenience methods that accept Phaser.Geom objects directly:

```js
const circle = new Phaser.Geom.Circle(200, 200, 50);
const rect = new Phaser.Geom.Rectangle(50, 50, 100, 80);

gfx.fillCircleShape(circle);
gfx.strokeCircleShape(circle);
gfx.fillRectShape(rect);
gfx.strokeRectShape(rect);
gfx.fillTriangleShape(triangle);
gfx.strokeTriangleShape(triangle);
gfx.strokeLineShape(line);
gfx.fillEllipseShape(ellipse, smoothness);
gfx.strokeEllipseShape(ellipse, smoothness);
```

### Canvas Transforms (Graphics)

```js
const gfx = this.add.graphics();

gfx.save();
gfx.translateCanvas(100, 100);
gfx.rotateCanvas(0.5);           // radians
gfx.scaleCanvas(2, 2);
gfx.fillStyle(0xff0000);
gfx.fillRect(0, 0, 50, 50);     // draws at translated/rotated/scaled position
gfx.restore();
```

### Generating Textures from Graphics

```js
const gfx = this.add.graphics();
gfx.fillStyle(0xff0000);
gfx.fillCircle(32, 32, 32);
gfx.generateTexture('redCircle', 64, 64);
gfx.destroy();

// Now use as a regular texture
this.add.image(400, 300, 'redCircle');
```

Note: `fillGradientStyle` will NOT appear in generated textures (Canvas API limitation).

### Shape Objects — Fill and Stroke

```js
// Shapes set fill via constructor or setFillStyle
const rect = this.add.rectangle(200, 150, 100, 80, 0xff0000, 1);

// Change fill later
rect.setFillStyle(0x00ff00, 0.8);

// Add stroke (not set by default)
rect.setStrokeStyle(3, 0xffffff, 1);  // (lineWidth, color, alpha)

// Remove fill or stroke
rect.setFillStyle();    // no args = isFilled becomes false
rect.setStrokeStyle();  // no args = isStroked becomes false

// Direct property access
rect.fillColor = 0x0000ff;
rect.fillAlpha = 0.5;
rect.strokeColor = 0xffffff;
rect.strokeAlpha = 1;
rect.lineWidth = 2;
rect.isFilled = true;
rect.isStroked = true;
rect.closePath = true;   // close stroke path (default true)
```

---

## All Shape Types

| Factory Method | Class | Parameters (after x, y) | Fill | Stroke | Notes |
|---|---|---|---|---|---|
| `this.add.arc(x, y, radius, startAngle, endAngle, anticlockwise, fillColor, fillAlpha)` | Arc | radius=128, startAngle=0, endAngle=360 (degrees), anticlockwise=false | Yes | Yes | Angles in degrees. Full circle by default. |
| `this.add.circle(x, y, radius, fillColor, fillAlpha)` | Arc | radius=128 | Yes | Yes | Alias for Arc with 0-360 angles. |
| `this.add.curve(x, y, curve, fillColor, fillAlpha)` | Curve | Phaser.Curves.Curve object | Yes | Yes | Has `smoothness` property / `setSmoothness()`. |
| `this.add.ellipse(x, y, width, height, fillColor, fillAlpha)` | Ellipse | width=128, height=128 | Yes | Yes | Equal w/h renders as circle. Has `smoothness`. |
| `this.add.grid(x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha)` | Grid | width=128, height=128, cellWidth=32, cellHeight=32 | Yes | No | Has `altFillColor`/`altFillAlpha` for checkerboard. Outline via outlineFillColor. |
| `this.add.isobox(x, y, size, height, fillTop, fillLeft, fillRight)` | IsoBox | size=48, height=32, fillTop=0xeeeeee, fillLeft=0x999999, fillRight=0xcccccc | Yes | No | Isometric box. `showTop`, `showLeft`, `showRight`, `projection`. |
| `this.add.isotriangle(x, y, size, height, reversed, fillTop, fillLeft, fillRight)` | IsoTriangle | size=48, height=32, reversed=false | Yes | No | Isometric pyramid. `showTop`, `showLeft`, `showRight`, `projection`, `reversed`. |
| `this.add.line(x, y, x1, y1, x2, y2, strokeColor, strokeAlpha)` | Line | x1=0, y1=0, x2=128, y2=0 | No | Yes | Stroke only. Constructor takes stroke color (not fill). |
| `this.add.polygon(x, y, points, fillColor, fillAlpha)` | Polygon | points (various formats) | Yes | Yes | Points: array of Vec2, `[x,y,...]` pairs, or `[[x,y],...]`. |
| `this.add.rectangle(x, y, width, height, fillColor, fillAlpha)` | Rectangle | width=128, height=128 | Yes | Yes | Change size via `width`/`height` properties. |
| `this.add.star(x, y, points, innerRadius, outerRadius, fillColor, fillAlpha)` | Star | points=5, innerRadius=32, outerRadius=64 | Yes | Yes | 4 points = diamond. More points = spikier. |
| `this.add.triangle(x, y, x1, y1, x2, y2, x3, y3, fillColor, fillAlpha)` | Triangle | x1=0,y1=128, x2=64,y2=0, x3=128,y3=128 | Yes | Yes | Always closed. Use Polygon for open shapes. |

---

## API Quick Reference — Graphics Methods

### Style Methods

| Method | Signature | Notes |
|---|---|---|
| `fillStyle` | `(color, alpha=1)` | Set fill for subsequent fill calls |
| `lineStyle` | `(lineWidth, color, alpha=1)` | Set stroke for subsequent stroke calls |
| `fillGradientStyle` | `(tl, tr, bl, br, aTL=1, aTR, aBL, aBR)` | WebGL only. 4 corner colors. |
| `lineGradientStyle` | `(lineWidth, tl, tr, bl, br, alpha=1)` | WebGL only. |
| `setDefaultStyles` | `(options)` | Set via `{ lineStyle: {width,color,alpha}, fillStyle: {color,alpha} }` |

### Path Methods

| Method | Signature | Notes |
|---|---|---|
| `beginPath` | `()` | Start a new path |
| `moveTo` | `(x, y)` | Move draw position |
| `lineTo` | `(x, y)` | Line to position |
| `arc` | `(x, y, radius, startAngle, endAngle, anticlockwise=false, overshoot=0)` | Angles in radians |
| `closePath` | `()` | Close current path |
| `fillPath` / `fill` | `()` | Fill the current path |
| `strokePath` / `stroke` | `()` | Stroke the current path |
| `slice` | `(x, y, radius, startAngle, endAngle, anticlockwise=false, overshoot=0)` | Pie slice. Auto begins/closes path. Angles in radians. |

### Shape Drawing Methods

| Method | Signature |
|---|---|
| `fillRect` | `(x, y, width, height)` |
| `strokeRect` | `(x, y, width, height)` |
| `fillRoundedRect` | `(x, y, width, height, radius=20)` |
| `strokeRoundedRect` | `(x, y, width, height, radius=20)` |
| `fillCircle` | `(x, y, radius)` |
| `strokeCircle` | `(x, y, radius)` |
| `fillEllipse` | `(x, y, width, height, smoothness=32)` |
| `strokeEllipse` | `(x, y, width, height, smoothness=32)` |
| `fillTriangle` | `(x0, y0, x1, y1, x2, y2)` |
| `strokeTriangle` | `(x0, y0, x1, y1, x2, y2)` |
| `fillPoint` | `(x, y, size=1)` |
| `lineBetween` | `(x1, y1, x2, y2)` |
| `strokePoints` | `(points, closeShape=false, closePath=false, endIndex)` |
| `fillPoints` | `(points, closeShape=false, closePath=false, endIndex)` |

### Geom Shape Methods

| Method | Signature |
|---|---|
| `fillRectShape` | `(rect)` |
| `strokeRectShape` | `(rect)` |
| `fillCircleShape` | `(circle)` |
| `strokeCircleShape` | `(circle)` |
| `fillTriangleShape` | `(triangle)` |
| `strokeTriangleShape` | `(triangle)` |
| `strokeLineShape` | `(line)` |
| `fillEllipseShape` | `(ellipse, smoothness=32)` |
| `strokeEllipseShape` | `(ellipse, smoothness=32)` |

### Transform and State Methods

| Method | Signature | Notes |
|---|---|---|
| `translateCanvas` | `(x, y)` | Translate subsequent draws |
| `scaleCanvas` | `(x, y)` | Scale subsequent draws |
| `rotateCanvas` | `(radians)` | Rotate subsequent draws |
| `save` | `()` | Push state to stack |
| `restore` | `()` | Pop state from stack |
| `clear` | `()` | Clear command buffer, reset to default styles |
| `generateTexture` | `(key, width, height)` | Bake to a Texture (Canvas API) |

### Shape Base Class Methods

| Method | Signature | Notes |
|---|---|---|
| `setFillStyle` | `(color?, alpha=1)` | No args = disable fill |
| `setStrokeStyle` | `(lineWidth?, color?, alpha=1)` | No args = disable stroke |

---

## Gotchas

1. **Graphics arc() uses radians; Shape arc factory uses degrees.** The Graphics `arc` method takes start/end angles in radians. The `this.add.arc()` factory takes them in degrees (0-360). Mixing these up is the most common bug.

2. **Set style BEFORE drawing.** `fillStyle` and `lineStyle` must be called before the corresponding fill/stroke method. They are not retroactive.

3. **Graphics has no Origin or GetBounds.** Unlike Shape objects, Graphics does not include the Origin or GetBounds components. Use `setPosition(x, y)` and `displayOriginX`/`displayOriginY` instead.

4. **Shape isFilled/isStroked defaults.** Shapes created with a `fillColor` parameter have `isFilled = true`. But `isStroked` defaults to `false` — you must call `setStrokeStyle()` explicitly.

5. **Line shape is stroke-only.** The Line shape does not support fill. Its constructor takes `strokeColor`/`strokeAlpha` (not fillColor).

6. **IsoBox/IsoTriangle are fill-only.** These shapes cannot be stroked. Grid supports outline strokes via its constructor parameters (`outlineFillColor`, `outlineFillAlpha`).

7. **generateTexture uses Canvas API.** Gradient fills (`fillGradientStyle`) will not appear in textures generated with `generateTexture`. Only Canvas-compatible features are captured.

8. **Performance: Graphics is expensive.** Each frame the command buffer is replayed and geometry is rebuilt (WebGL decomposes to polygons). For static shapes, call `generateTexture` and use the resulting texture as a Sprite. Group Graphics objects together to minimize batch breaks.

9. **pathDetailThreshold (v4 new).** Graphics has a `pathDetailThreshold` property (default -1, uses config `render.pathDetailThreshold`). Path segments below this pixel threshold are combined, improving WebGL performance on complex shapes. Evaluated in screen pixels, so detail emerges when zoomed in.

10. **Rounded rect radius can be an object or number.** Pass `{ tl, tr, bl, br }` for per-corner control. Negative values create concave corners. Default is 20 when omitted.

11. **Shape closePath property.** The `closePath` property on Shape objects (default `true`) controls whether the stroke path is automatically closed. Set to `false` for open stroked shapes.

12. **Shape objects do NOT support tint methods.** Unlike Sprites and Images, Shape game objects do not have `setTint()` or `tint` properties. Use `setFillStyle(color, alpha)` and `setStrokeStyle(lineWidth, color, alpha)` instead.

13. **Polygon getBounds() incorrect with negative points.** If any polygon points have negative coordinates, `getBounds()` returns wrong values. Use `Phaser.Geom.Polygon.GetAABB(polygon.geom)` instead and adjust the returned Rectangle position.

---

## Shape-Specific Methods

### Star

```js
const star = this.add.star(400, 300, 5, 32, 64, 0xffff00);

star.setPoints(8);          // change number of points
star.setInnerRadius(20);    // change inner radius
star.setOuterRadius(80);    // change outer radius
```

### Line (Tapering)

```js
const line = this.add.line(400, 300, 0, 0, 200, 100, 0xffffff);

// setLineWidth(startWidth, endWidth) — endWidth is WebGL only (tapering effect)
line.setLineWidth(4, 1);   // tapers from 4px to 1px (Canvas uses startWidth only)
```

### Grid (Alternating Colors, Stroke, Padding)

```js
const grid = this.add.grid(400, 300, 320, 240, 32, 32, 0x222222);

// Alternating cell color (checkerboard)
grid.setAltFillStyle(0x444444, 1);  // no args = disable alternating cells

// Grid uses setStrokeStyle for cell outlines (inherited from Shape)
grid.setStrokeStyle(1, 0x666666, 1);

// v4: control outside edge stroke
grid.strokeOutside = true;             // stroke the outer border
grid.strokeOutsideIncomplete = false;  // skip partial cells on right/bottom edges

// Cell padding (default 0.5) — gutter between cells is 2x this value
grid.cellPadding = 1;
```

### IsoBox / IsoTriangle

```js
const box = this.add.isobox(200, 200, 48, 32, 0xeeeeee, 0x999999, 0xcccccc);

box.setFaces(true, true, false);  // showTop, showLeft, showRight
box.setProjection(4);             // isometric projection value

const tri = this.add.isotriangle(400, 200, 48, 32, false, 0xeeeeee, 0x999999, 0xcccccc);

tri.setReversed(true);            // flip upside down
tri.setFaces(true, true, true);
tri.setProjection(4);
```

---

## Source File Map

| File | Purpose |
|---|---|
| `src/gameobjects/graphics/Graphics.js` | Graphics class — all drawing methods |
| `src/gameobjects/graphics/GraphicsFactory.js` | `this.add.graphics()` factory |
| `src/gameobjects/graphics/Commands.js` | Internal command constants for the command buffer |
| `src/gameobjects/graphics/GraphicsRender.js` | Render dispatch |
| `src/gameobjects/shape/Shape.js` | Base Shape class (fill/stroke/path data, setFillStyle, setStrokeStyle) |
| `src/gameobjects/shape/arc/Arc.js` | Arc shape (also used for circle) |
| `src/gameobjects/shape/arc/ArcFactory.js` | `this.add.arc()` and `this.add.circle()` factories |
| `src/gameobjects/shape/curve/Curve.js` | Curve shape |
| `src/gameobjects/shape/curve/CurveFactory.js` | `this.add.curve()` factory |
| `src/gameobjects/shape/ellipse/Ellipse.js` | Ellipse shape |
| `src/gameobjects/shape/ellipse/EllipseFactory.js` | `this.add.ellipse()` factory |
| `src/gameobjects/shape/grid/Grid.js` | Grid shape |
| `src/gameobjects/shape/grid/GridFactory.js` | `this.add.grid()` factory |
| `src/gameobjects/shape/isobox/IsoBox.js` | IsoBox shape |
| `src/gameobjects/shape/isobox/IsoBoxFactory.js` | `this.add.isobox()` factory |
| `src/gameobjects/shape/isotriangle/IsoTriangle.js` | IsoTriangle shape |
| `src/gameobjects/shape/isotriangle/IsoTriangleFactory.js` | `this.add.isotriangle()` factory |
| `src/gameobjects/shape/line/Line.js` | Line shape |
| `src/gameobjects/shape/line/LineFactory.js` | `this.add.line()` factory |
| `src/gameobjects/shape/polygon/Polygon.js` | Polygon shape |
| `src/gameobjects/shape/polygon/PolygonFactory.js` | `this.add.polygon()` factory |
| `src/gameobjects/shape/rectangle/Rectangle.js` | Rectangle shape |
| `src/gameobjects/shape/rectangle/RectangleFactory.js` | `this.add.rectangle()` factory |
| `src/gameobjects/shape/star/Star.js` | Star shape |
| `src/gameobjects/shape/star/StarFactory.js` | `this.add.star()` factory |
| `src/gameobjects/shape/triangle/Triangle.js` | Triangle shape |
| `src/gameobjects/shape/triangle/TriangleFactory.js` | `this.add.triangle()` factory |
