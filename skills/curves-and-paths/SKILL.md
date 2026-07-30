---
name: curves-and-paths
description: "Use this skill when working with curves and paths in Phaser 4. Covers splines, bezier curves, lines, ellipses, path followers, and mathematical curve types. Triggers on: curve, path, spline, bezier, path follower."
---

# Curves and Paths
> Creating paths from curves, getting points along them, drawing them with Graphics, and making sprites follow paths automatically using PathFollower in Phaser 4.

**Key source paths:** `src/curves/`, `src/curves/path/`, `src/gameobjects/pathfollower/`, `src/gameobjects/components/PathFollower.js`
**Related skills:** ../sprites-and-images/SKILL.md, ../graphics-and-shapes/SKILL.md, ../tweens/SKILL.md

## Quick Start

```js
// In a Scene's create() method:

// 1. Create a Path starting at (50, 300)
const path = this.add.path(50, 300);

// 2. Add curves to the path
path.lineTo(200, 100);
path.splineTo([ new Phaser.Math.Vector2(300, 400), new Phaser.Math.Vector2(500, 200) ]);
path.lineTo(700, 300);

// 3. Draw the path using Graphics
const graphics = this.add.graphics();
graphics.lineStyle(2, 0xffffff, 1);
path.draw(graphics, 64);

// 4. Create a PathFollower sprite that moves along the path
const follower = this.add.follower(path, 50, 300, 'ship');
follower.startFollow({
    duration: 5000,
    rotateToPath: true,
    repeat: -1,
    yoyo: true
});
```

## Core Concepts

### Path

A `Phaser.Curves.Path` is a container that combines multiple Curves into one continuous compound curve. Curves in a Path do not need to be connected end-to-end. Only the order of curves affects point calculations along the path.

Created via factory: `this.add.path(x, y)` where x/y is the starting point.

Key properties:
- `curves` -- array of `Phaser.Curves.Curve` objects in the Path
- `startPoint` -- `Vector2`, the defined starting position
- `autoClose` -- boolean, if true `getPoints()` appends the first point at the end
- `defaultDivisions` -- number (default: 12), divisions per curve when calling `getPoints()`
- `name` -- string, empty by default, for developer use

### Curves

All curve types extend `Phaser.Curves.Curve` (the base class). Every curve supports:
- `getPoint(t, out)` -- get a point at position t (0-1) based on curve parameterization
- `getPointAt(u, out)` -- get a point at position u (0-1) based on arc length (evenly spaced)
- `getPoints(divisions, stepRate, out)` -- array of points along the curve
- `getSpacedPoints(divisions, stepRate, out)` -- array of equidistant points by arc length
- `getDistancePoints(distance)` -- points spaced by pixel distance
- `getLength()` -- total arc length in pixels
- `getBounds(out, accuracy)` -- bounding Rectangle
- `getTangent(t, out)` / `getTangentAt(u, out)` -- unit tangent vector
- `getStartPoint(out)` / `getEndPoint(out)` -- first/last points
- `getRandomPoint(out)` -- random point on the curve
- `draw(graphics, pointsTotal)` -- render the curve onto a Graphics object
- `active` -- boolean, when false the parent Path skips this curve

### PathFollower

A `Phaser.GameObjects.PathFollower` is a Sprite with the `Components.PathFollower` mixin. It uses an internal Tween (a number counter from 0 to 1) to advance along a Path each frame.

Created via factory: `this.add.follower(path, x, y, texture, frame)`

The PathFollower component provides:
- `path` -- the `Phaser.Curves.Path` being followed
- `pathTween` -- the internal Tween driving movement
- `pathOffset` -- `Vector2`, offset added to path coordinates
- `pathVector` -- `Vector2`, current position on the path
- `pathDelta` -- `Vector2`, distance traveled since last frame
- `rotateToPath` -- boolean, auto-rotate to face path direction
- `pathRotationOffset` -- number (degrees), added to auto-rotation

## Common Patterns

### Creating Paths with Chained Curves

Path has convenience methods that create curves starting from the previous end point:

```js
const path = this.add.path(100, 500);

path.lineTo(300, 100);                          // straight line
path.cubicBezierTo(500, 100, 350, 50, 450, 50); // cubic bezier (endX, endY, cp1X, cp1Y, cp2X, cp2Y)
path.quadraticBezierTo(700, 400, 600, 100);     // quadratic bezier (endX, endY, cpX, cpY)
path.splineTo([                                  // spline through points
    new Phaser.Math.Vector2(750, 300),
    new Phaser.Math.Vector2(600, 500)
]);
path.ellipseTo(50, 80, 0, 270, false, 0);       // ellipse arc (xRadius, yRadius, startAngle, endAngle, clockwise, rotation)
path.circleTo(40);                               // shortcut for ellipseTo with equal radii and 0-360

// Jump to a new position without drawing (creates a gap)
path.moveTo(400, 400);
path.lineTo(500, 400);

// Close the path by connecting end to start
path.closePath();
```

### Adding Standalone Curve Objects

```js
const path = new Phaser.Curves.Path(0, 0);

// Add pre-constructed curve objects
const line = new Phaser.Curves.Line(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(200, 200));
path.add(line);

const spline = new Phaser.Curves.Spline([ 200, 200, 300, 100, 400, 300 ]);
path.add(spline);

const ellipse = new Phaser.Curves.Ellipse(400, 300, 100, 60, 0, 360, false, 0);
path.add(ellipse);
```

### Getting Points Along a Path

```js
// Array of points (uses defaultDivisions per curve)
const points = path.getPoints();

// With explicit divisions per curve
const detailed = path.getPoints(32);

// Equally spaced points along the entire path
const spaced = path.getSpacedPoints(100);

// Single point at normalized position (0-1)
const midpoint = path.getPoint(0.5);

// Tangent vector at a position
const tangent = path.getTangent(0.5);

// Total path length in pixels
const length = path.getLength();

// Bounding rectangle
const bounds = path.getBounds();
```

### Drawing Paths with Graphics

```js
const graphics = this.add.graphics();

// Draw entire path
graphics.lineStyle(2, 0x00ff00, 1);
path.draw(graphics, 64); // 64 = points per curve for smoothness

// Draw individual curves
graphics.lineStyle(1, 0xff0000, 1);
path.curves[0].draw(graphics, 32);

// Draw debug points
const points = path.getSpacedPoints(50);
points.forEach(p => {
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(p.x, p.y, 3);
});
```

### PathFollower Sprite

```js
const path = this.add.path(100, 200);
path.lineTo(400, 400);
path.lineTo(700, 200);

// Create follower
const enemy = this.add.follower(path, 100, 200, 'enemy');

// Start following with config
enemy.startFollow({
    duration: 3000,       // ms to traverse path
    positionOnPath: true, // snap to path start position
    rotateToPath: true,   // auto-rotate to face direction
    rotationOffset: 90,   // offset added to auto-rotation (degrees)
    repeat: -1,           // -1 = infinite repeat
    yoyo: true,           // reverse on each repeat
    from: 0,              // start position on path (0-1)
    to: 1,                // end position on path (0-1)
    startAt: 0,           // initial seek position
    ease: 'Sine.easeInOut' // any valid Phaser ease
});

// Control during playback
enemy.pauseFollow();
enemy.resumeFollow();
enemy.stopFollow();
enemy.isFollowing(); // returns boolean

// Change path at runtime
enemy.setPath(newPath);
enemy.setPath(newPath, { duration: 2000 }); // auto-starts

// Set rotation independently
enemy.setRotateToPath(true, 90); // (value, offsetDegrees)
```

### PathFollower with Simple Duration

```js
// Shorthand: pass just a duration number
enemy.startFollow(5000);

// Equivalent to:
enemy.startFollow({ duration: 5000 });
```

## All Curve Types

| Curve | Class | Constructor Params | Description |
|---|---|---|---|
| Line | `Phaser.Curves.Line` | `(p0, p1)` Vector2 endpoints, or `([x0,y0,x1,y1])` | Straight line segment between two points |
| Spline | `Phaser.Curves.Spline` | `(points)` array of Vector2, flat numbers, or nested arrays | Catmull-Rom spline through control points |
| CubicBezier | `Phaser.Curves.CubicBezier` | `(p0, p1, p2, p3)` or `([x0,y0,...x3,y3])` | Cubic Bezier with start, 2 control points, end |
| QuadraticBezier | `Phaser.Curves.QuadraticBezier` | `(p0, p1, p2)` or `([x0,y0,...x2,y2])` | Quadratic Bezier with start, 1 control point, end |
| Ellipse | `Phaser.Curves.Ellipse` | `(x, y, xRadius, yRadius, startAngle, endAngle, clockwise, rotation)` or config object | Elliptical arc; angles in degrees; yRadius defaults to xRadius |

### Ellipse Curve Properties

The Ellipse curve has get/set properties for runtime modification:
- `x`, `y` -- center position
- `xRadius`, `yRadius` -- radii
- `startAngle`, `endAngle` -- in degrees (get/set convert to/from radians internally)
- `clockwise` -- boolean
- `rotation` -- in radians
- `angle` -- rotation in degrees (alternative to `rotation`)
- `setWidth(value)` / `setHeight(value)` -- sets radius to value/2

## API Quick Reference

### Path (`Phaser.Curves.Path`)
| API | Type | Description |
|---|---|---|
| `add(curve)` | method | Append any Curve to the path |
| `lineTo(x, y)` | method | Add a Line from current end point |
| `splineTo(points)` | method | Add a Spline from current end point |
| `cubicBezierTo(x, y, cp1X, cp1Y, cp2X, cp2Y)` | method | Add CubicBezier from current end point |
| `quadraticBezierTo(x, y, cpX, cpY)` | method | Add QuadraticBezier from current end point |
| `ellipseTo(xR, yR, start, end, cw, rot)` | method | Add Ellipse arc from current end point |
| `circleTo(radius, clockwise, rotation)` | method | Shortcut for ellipseTo with equal radii |
| `moveTo(x, y)` | method | Move end point without drawing (creates gap) |
| `closePath()` | method | Add Line from end to start if not already closed |
| `getPoint(t, out)` | method | Point at normalized position (0-1) on entire path |
| `getPoints(divisions, stepRate)` | method | Array of points, divisions per curve |
| `getSpacedPoints(divisions)` | method | Equidistant points along entire path |
| `getRandomPoint(out)` | method | Random point anywhere on the path |
| `getStartPoint(out)` | method | Path starting point |
| `getEndPoint(out)` | method | Path ending point |
| `getTangent(t, out)` | method | Unit tangent vector at position t |
| `getCurveAt(t)` | method | Return the Curve at normalized position t |
| `getLength()` | method | Total path length in pixels |
| `getCurveLengths()` | method | Array of cumulative curve lengths |
| `getBounds(out, accuracy)` | method | Bounding Rectangle |
| `draw(graphics, pointsTotal)` | method | Draw all curves onto a Graphics object |
| `toJSON()` / `fromJSON(data)` | method | Serialization |
| `updateArcLengths()` | method | Force recalculation of cached lengths |
| `destroy()` | method | Clear internal references |

### Base Curve (`Phaser.Curves.Curve`)
| API | Type | Description |
|---|---|---|
| `getPoint(t, out)` | method | Point at parameter t (0-1) -- abstract, each subclass implements |
| `getPointAt(u, out)` | method | Point at arc-length position u (0-1) -- evenly spaced |
| `getPoints(divisions, stepRate, out)` | method | Array of points |
| `getSpacedPoints(divisions, stepRate, out)` | method | Equidistant points by arc length |
| `getDistancePoints(distance)` | method | Points spaced by pixel distance |
| `getLength()` | method | Total curve arc length |
| `getTangent(t, out)` / `getTangentAt(u, out)` | method | Unit tangent vector |
| `getTFromDistance(distance)` | method | Convert pixel distance to t value |
| `draw(graphics, pointsTotal)` | method | Render onto Graphics (default 32 points) |
| `getBounds(out, accuracy)` | method | Bounding Rectangle |
| `active` | `boolean` | When false, parent Path skips this curve |
| `defaultDivisions` | `number` | Default 5 for standalone curves |
| `arcLengthDivisions` | `number` | Precision for arc length calculations (default 100) |

### PathFollower Component
| API | Type | Description |
|---|---|---|
| `setPath(path, config)` | method | Set a new Path (optionally auto-start) |
| `startFollow(config, startAt)` | method | Begin following; config = duration number or PathConfig |
| `pauseFollow()` | method | Pause movement |
| `resumeFollow()` | method | Resume paused movement |
| `stopFollow()` | method | Stop following |
| `isFollowing()` | method | Returns true if actively moving on path |
| `setRotateToPath(value, offset)` | method | Enable/disable auto-rotation with offset |
| `path` | `Path` | Current path reference |
| `pathTween` | `Tween` | Internal tween driving movement |
| `pathOffset` | `Vector2` | Offset from path coordinates |
| `pathVector` | `Vector2` | Current position on the path |
| `pathDelta` | `Vector2` | Movement delta since last update |
| `rotateToPath` | `boolean` | Auto-rotate to path direction |
| `pathRotationOffset` | `number` | Rotation offset in degrees |

### PathConfig (`Phaser.Types.GameObjects.PathFollower.PathConfig`)
| Property | Type | Default | Description |
|---|---|---|---|
| `duration` | `number` | 1000 | Time in ms to traverse the path |
| `from` | `number` | 0 | Start position on path (0-1) |
| `to` | `number` | 1 | End position on path (0-1) |
| `positionOnPath` | `boolean` | false | Snap follower to path start on begin |
| `rotateToPath` | `boolean` | false | Auto-rotate to face path direction |
| `rotationOffset` | `number` | 0 | Degrees added to auto-rotation |
| `startAt` | `number` | 0 | Initial seek position on path (0-1) |

The config also accepts all standard Tween properties: `ease`, `repeat`, `yoyo`, `delay`, `hold`, `onComplete`, etc.

## Gotchas

1. **`getPoint(t)` vs `getPointAt(u)` on curves.** `getPoint` uses the raw curve parameter t, which does not produce evenly spaced points on most curve types. `getPointAt` maps through arc length for even spacing. On a Path, `getPoint` already accounts for arc length across the whole path.

2. **Path `moveTo` creates an inactive curve.** The `MoveTo` pseudo-curve has `active: false` and zero length. It only repositions the end point for the next curve. It does not draw anything and is skipped by `getPoints()` and `draw()`.

3. **PathFollower uses a Tween internally.** The `startFollow` config is passed to `scene.tweens.addCounter()`. All tween properties (ease, delay, repeat, yoyo, callbacks) work. The tween is set to `persist: true` automatically.

4. **PathFollower offset behavior.** When `positionOnPath: false` (default), the follower's current position becomes the offset from the path start. When `positionOnPath: true`, the follower snaps to the path's start point and the offset is zeroed.

5. **Ellipse angles are in degrees.** The constructor and `startAngle`/`endAngle` properties accept degrees. Internally they are stored as radians. The `rotation` property is in radians, but `angle` is in degrees.

6. **`closePath` vs `autoClose`.** `closePath()` adds an explicit Line curve from end to start. `autoClose = true` only affects `getPoints()` and `getSpacedPoints()` output by appending the first point, without adding a curve.

7. **Cached lengths can go stale.** `getCurveLengths()` caches results based on array length only. If you modify a curve's control points, call `path.updateArcLengths()` to force recalculation.

8. **`cubicBezierTo` parameter order with numbers.** When passing numbers: `cubicBezierTo(endX, endY, cp1X, cp1Y, cp2X, cp2Y)`. The end point comes first, not the control points. When passing Vector2 objects: `cubicBezierTo(cp1, cp2, endPoint)`.

9. **Spline needs at least 4 points.** The Catmull-Rom interpolation used by Spline works best with 4+ points. With fewer points, the curve may not behave as expected.

10. **Line curve `arcLengthDivisions` is 1.** Unlike other curves (default 100), Line overrides this to 1 since a line is inherently uniform. No need to adjust it.

## Source File Map

| File | Purpose |
|---|---|
| `src/curves/path/Path.js` | Path class -- combines multiple curves, factory registered as `this.add.path` |
| `src/curves/path/MoveTo.js` | MoveTo pseudo-curve for creating gaps in paths |
| `src/curves/Curve.js` | Base Curve class -- shared methods for all curve types |
| `src/curves/LineCurve.js` | Line curve (two-point segment) |
| `src/curves/SplineCurve.js` | Spline curve (Catmull-Rom through multiple points) |
| `src/curves/CubicBezierCurve.js` | Cubic Bezier curve (4 control points) |
| `src/curves/QuadraticBezierCurve.js` | Quadratic Bezier curve (3 control points) |
| `src/curves/EllipseCurve.js` | Ellipse/arc curve with angle and rotation support |
| `src/gameobjects/pathfollower/PathFollower.js` | PathFollower Game Object (extends Sprite + PathFollower mixin) |
| `src/gameobjects/pathfollower/PathFollowerFactory.js` | `this.add.follower` factory registration |
| `src/gameobjects/components/PathFollower.js` | PathFollower component mixin (setPath, startFollow, pathUpdate, etc.) |
| `src/gameobjects/pathfollower/typedefs/PathConfig.js` | PathConfig typedef |
