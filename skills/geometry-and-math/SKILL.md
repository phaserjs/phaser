---
name: geometry-and-math
description: "Use this skill when using Phaser 4 math and geometry utilities. Covers vectors, rectangles, circles, triangles, polygons, random number generation, angles, distance, interpolation, and snapping. Triggers on: Vector2, Rectangle, Circle, math, distance, angle, random, lerp."
---

# Phaser 4 — Geometry and Math

> Geom classes (Circle, Ellipse, Line, Polygon, Rectangle, Triangle), intersection tests, and Math utilities (Vector2, Vector3, Matrix4, angles, distances, interpolation, easing, random, snap, clamp).

Related skills: graphics-and-shapes.md, physics-arcade.md

---

## Quick Start

```js
// Create geometry objects (these are data only, not renderable)
const rect = new Phaser.Geom.Rectangle(10, 20, 200, 100);
const circle = new Phaser.Geom.Circle(400, 300, 50);
const line = new Phaser.Geom.Line(0, 0, 100, 100);

// Point containment
rect.contains(50, 50);    // true
circle.contains(410, 310); // true

// Intersection test
Phaser.Geom.Intersects.CircleToRectangle(circle, rect); // boolean

// Math utilities
const v = new Phaser.Math.Vector2(3, 4);
v.length();      // 5
v.normalize();   // {x: 0.6, y: 0.8}

const dist = Phaser.Math.Distance.Between(0, 0, 100, 100);
const angle = Phaser.Math.Angle.Between(0, 0, 100, 100);
const clamped = Phaser.Math.Clamp(150, 0, 100); // 100
```

---

## Core Concepts

Geometry objects are pure data containers holding coordinates and dimensions. They are NOT game objects and cannot be added to the display list. To render geometry, use the Graphics game object or Shape game objects (see graphics-and-shapes.md).

Every geom class has a `type` property set to a `Phaser.Geom` constant for fast type checks.

All geom classes share a common instance method pattern:
- `contains(x, y)` -- point-in-shape test
- `getPoint(position, output?)` -- point at normalized position (0-1) on perimeter
- `getPoints(quantity, stepRate?, output?)` -- evenly spaced points on perimeter
- `getRandomPoint(output?)` -- random point inside the shape
- `setTo(...)` -- reset all properties
- `setEmpty()` -- zero out the shape
- `setPosition(x, y)` -- move origin/center

Each geom type also has a folder of static helper functions (e.g., `Phaser.Geom.Rectangle.Contains`, `Phaser.Geom.Circle.Area`).

---

## Geometry Classes

| Class | Namespace | Constructor | Key Properties |
|---|---|---|---|
| **Circle** | `Phaser.Geom.Circle` | `(x, y, radius)` | `x`, `y`, `radius`, `diameter`, `left`, `right`, `top`, `bottom` |
| **Ellipse** | `Phaser.Geom.Ellipse` | `(x, y, width, height)` | `x`, `y`, `width`, `height`, `left`, `right`, `top`, `bottom` |
| **Line** | `Phaser.Geom.Line` | `(x1, y1, x2, y2)` | `x1`, `y1`, `x2`, `y2`, `left`, `right`, `top`, `bottom` |
| **Polygon** | `Phaser.Geom.Polygon` | `(points)` | `area`, `points` (array of Vector2Like) |
| **Rectangle** | `Phaser.Geom.Rectangle` | `(x, y, width, height)` | `x`, `y`, `width`, `height`, `left`, `right`, `top`, `bottom`, `centerX`, `centerY` |
| **Triangle** | `Phaser.Geom.Triangle` | `(x1, y1, x2, y2, x3, y3)` | `x1`, `y1`, `x2`, `y2`, `x3`, `y3` |

### Rectangle Static Helpers

`Phaser.Geom.Rectangle.*`: Area, Ceil, CeilAll, CenterOn, Clone, Contains, ContainsPoint, ContainsRect, CopyFrom, Decompose, Equals, FitInside, FitOutside, Floor, FloorAll, FromPoints, FromXY, GetAspectRatio, GetCenter, GetPoint, GetPoints, GetSize, Inflate, Intersection, MarchingAnts, MergePoints, MergeRect, MergeXY, Offset, OffsetPoint, Overlaps, Perimeter, PerimeterPoint, Random, RandomOutside, SameDimensions, Scale, Union.

### Circle Static Helpers

`Phaser.Geom.Circle.*`: Area, Circumference, CircumferencePoint, Clone, Contains, ContainsPoint, ContainsRect, CopyFrom, Equals, GetBounds, GetPoint, GetPoints, Offset, OffsetPoint, Random.

### Line Static Helpers

`Phaser.Geom.Line.*`: Angle, BresenhamPoints, CenterOn, Clone, CopyFrom, Equals, Extend, GetEasedPoints, GetMidPoint, GetNearestPoint, GetNormal, GetPoint, GetPoints, GetShortestDistance, Height, Length, NormalAngle, NormalX, NormalY, Offset, PerpSlope, Random, ReflectAngle, Rotate, RotateAroundPoint, RotateAroundXY, SetToAngle, Slope, Width.

### Triangle Static Helpers

`Phaser.Geom.Triangle.*`: Area, BuildEquilateral, BuildFromPolygon, BuildRight, CenterOn, Centroid, CircumCenter, CircumCircle, Clone, Contains, ContainsArray, ContainsPoint, CopyFrom, Decompose, Equals, GetPoint, GetPoints, InCenter, Offset, Perimeter, Random, Rotate, RotateAroundPoint, RotateAroundXY.

### Polygon Input Formats

The Polygon constructor accepts multiple formats for the `points` argument:
- Space-separated string: `'40 0 40 20 100 20 100 80'`
- Array of `{x, y}` objects
- Flat number array: `[x1, y1, x2, y2, ...]`
- Array of `[x, y]` sub-arrays

---

## Intersection Tests

All under `Phaser.Geom.Intersects`.

### Boolean Tests (return `true`/`false`)

| Function | Description |
|---|---|
| `CircleToCircle(circleA, circleB)` | Two circles overlap |
| `CircleToRectangle(circle, rect)` | Circle overlaps rectangle |
| `LineToCircle(line, circle)` | Line segment intersects circle |
| `LineToLine(line1, line2, out?)` | Two line segments cross; writes point to `out` |
| `LineToRectangle(line, rect)` | Line segment intersects rectangle |
| `PointToLine(point, line, lineThickness?)` | Point lies on/near line |
| `PointToLineSegment(point, line)` | Point lies on finite line segment |
| `RectangleToRectangle(rectA, rectB)` | Two rectangles overlap |
| `RectangleToTriangle(rect, triangle)` | Rectangle overlaps triangle |
| `RectangleToValues(rect, left, right, top, bottom, tolerance?)` | Rectangle overlaps LRTB bounds |
| `TriangleToCircle(triangle, circle)` | Triangle overlaps circle |
| `TriangleToLine(triangle, line)` | Triangle intersects line |
| `TriangleToTriangle(triA, triB)` | Two triangles overlap |

### Get Intersection Points (return `Vector2[]`)

| Function | Description |
|---|---|
| `GetCircleToCircle(circleA, circleB, out?)` | Intersection points of two circles |
| `GetCircleToRectangle(circle, rect, out?)` | Points where circle meets rectangle edges |
| `GetLineToCircle(line, circle, out?)` | Points where line crosses circle |
| `GetLineToLine(line1, line2, out?)` | Single intersection point of two lines |
| `GetLineToPoints(line, points, out?)` | Intersection with a series of points forming edges |
| `GetLineToPolygon(line, polygon, out?)` | Closest intersection with polygon edges |
| `GetLineToRectangle(line, rect, out?)` | Points where line crosses rectangle |
| `GetRaysFromPointToPolygon(x, y, polygon)` | Ray-cast from point to polygon edges |
| `GetRectangleIntersection(rectA, rectB, out?)` | Overlapping rectangle region |
| `GetRectangleToRectangle(rectA, rectB, out?)` | Edge intersection points |
| `GetRectangleToTriangle(rect, triangle, out?)` | Edge intersection points |
| `GetTriangleToCircle(triangle, circle, out?)` | Edge intersection points |
| `GetTriangleToLine(triangle, line, out?)` | Edge intersection points |
| `GetTriangleToTriangle(triA, triB, out?)` | Edge intersection points |

---

## Math Functions by Category

All under `Phaser.Math` unless noted.

### Constants

| Constant | Value |
|---|---|
| `Phaser.Math.TAU` | PI * 2 (v4 addition) |
| `Phaser.Math.PI_OVER_2` | PI / 2 |
| `Phaser.Math.EPSILON` | 1.0e-6 |
| `Phaser.Math.DEG_TO_RAD` | PI / 180 |
| `Phaser.Math.RAD_TO_DEG` | 180 / PI |
| `Phaser.Math.RND` | Global `RandomDataGenerator` instance (seeded via game config `seed`) |

### Angle Functions (`Phaser.Math.Angle.*`)

| Function | Description |
|---|---|
| `Between(x1, y1, x2, y2)` | Angle in radians between two points |
| `BetweenPoints(point1, point2)` | Same, taking `{x,y}` objects |
| `BetweenY(x1, y1, x2, y2)` | Angle from vertical axis |
| `BetweenPointsY(point1, point2)` | Same, taking objects |
| `CounterClockwise(angle)` | Convert to counter-clockwise |
| `GetClockwiseDistance(from, to)` | Clockwise angular distance |
| `GetCounterClockwiseDistance(from, to)` | Counter-clockwise angular distance |
| `GetShortestDistance(from, to)` | Shortest angular distance (signed) |
| `Normalize(angle)` | Normalize to [0, 2PI) |
| `Random()` | Random angle in radians |
| `RandomDegrees()` | Random angle in degrees |
| `Reverse(angle)` | Reverse (add PI) |
| `RotateTo(currentAngle, targetAngle, lerp?)` | Step toward target angle |
| `ShortestBetween(angle1, angle2)` | Shortest difference in degrees |
| `Wrap(angle)` | Wrap to (-PI, PI] |
| `WrapDegrees(angle)` | Wrap to (-180, 180] |

### Distance Functions (`Phaser.Math.Distance.*`)

| Function | Description |
|---|---|
| `Between(x1, y1, x2, y2)` | Euclidean distance |
| `BetweenPoints(a, b)` | Same, taking `{x,y}` objects |
| `BetweenPointsSquared(a, b)` | Squared distance (avoids sqrt) |
| `Chebyshev(x1, y1, x2, y2)` | Chebyshev (chessboard) distance |
| `Power(x1, y1, x2, y2, pow)` | Minkowski distance with custom power |
| `Snake(x1, y1, x2, y2)` | Manhattan/taxicab distance |
| `Squared(x1, y1, x2, y2)` | Squared Euclidean distance |

### Interpolation (`Phaser.Math.Interpolation.*`)

| Function | Description |
|---|---|
| `BezierInterpolation(v, k)` | Bezier curve through control points |
| `CatmullRomInterpolation(v, k)` | Catmull-Rom spline through points |
| `CubicBezierInterpolation(t, p0, p1, p2, p3)` | Cubic Bezier between four values |
| `LinearInterpolation(v, k)` | Linear through array of values |
| `QuadraticBezierInterpolation(t, p0, p1, p2)` | Quadratic Bezier |
| `SmoothStepInterpolation(t, min, max)` | Hermite smooth step |
| `SmootherStepInterpolation(t, min, max)` | Ken Perlin's smoother step |

### Snap Functions (`Phaser.Math.Snap.*`)

| Function | Description |
|---|---|
| `To(value, gap, start?, divide?)` | Snap to nearest increment |
| `Floor(value, gap, start?, divide?)` | Snap down to increment |
| `Ceil(value, gap, start?, divide?)` | Snap up to increment |

### Fuzzy Comparison (`Phaser.Math.Fuzzy.*`)

| Function | Description |
|---|---|
| `Equal(a, b, epsilon?)` | a approximately equals b |
| `LessThan(a, b, epsilon?)` | a < b within epsilon |
| `GreaterThan(a, b, epsilon?)` | a > b within epsilon |
| `Ceil(value, epsilon?)` | Fuzzy ceiling |
| `Floor(value, epsilon?)` | Fuzzy floor |

### Easing Functions (`Phaser.Math.Easing.*`)

Each type has `.In`, `.Out`, `.InOut` variants. Used primarily by tweens (pass string names like `'Sine.easeOut'`).

| Type | String Keys |
|---|---|
| Back | `Back.easeIn`, `Back.easeOut`, `Back.easeInOut` |
| Bounce | `Bounce.easeIn`, `Bounce.easeOut`, `Bounce.easeInOut` |
| Circular | `Circ.easeIn`, `Circ.easeOut`, `Circ.easeInOut` |
| Cubic | `Cubic.easeIn`, `Cubic.easeOut`, `Cubic.easeInOut` |
| Elastic | `Elastic.easeIn`, `Elastic.easeOut`, `Elastic.easeInOut` |
| Expo | `Expo.easeIn`, `Expo.easeOut`, `Expo.easeInOut` |
| Linear | `Linear` (no variants) |
| Quadratic | `Quad.easeIn`, `Quad.easeOut`, `Quad.easeInOut` |
| Quartic | `Quart.easeIn`, `Quart.easeOut`, `Quart.easeInOut` |
| Quintic | `Quint.easeIn`, `Quint.easeOut`, `Quint.easeInOut` |
| Sine | `Sine.easeIn`, `Sine.easeOut`, `Sine.easeInOut` |
| Stepped | `Stepped` (no variants) |

Power aliases: `Power0` = Linear, `Power1` = Quad.Out, `Power2` = Cubic.Out, `Power3` = Quart.Out, `Power4` = Quint.Out.

Short names also work: `'Quad'` = Quad.Out, `'Sine'` = Sine.Out, etc.

### Core Math Helpers (directly on `Phaser.Math`)

| Function | Description |
|---|---|
| `Between(min, max)` | Random integer in [min, max] |
| `FloatBetween(min, max)` | Random float in [min, max] |
| `Clamp(value, min, max)` | Constrain value to range |
| `Wrap(value, min, max)` | Wrap value within range |
| `Within(a, b, tolerance)` | Check if a is within tolerance of b |
| `Percent(value, min, max, upperMax?)` | Value as percentage of range |
| `FromPercent(percent, min, max)` | Value from percentage of range |
| `DegToRad(degrees)` | Convert degrees to radians |
| `RadToDeg(radians)` | Convert radians to degrees |
| `Linear(p0, p1, t)` | Lerp between two values |
| `LinearXY(v1, v2, t, out?)` | Lerp between two Vector2Like objects |
| `SmoothStep(x, min, max)` | Hermite smooth step |
| `SmootherStep(x, min, max)` | Perlin smoother step |
| `Average(values)` | Mean of number array |
| `Median(values)` | Median of number array |
| `CeilTo(value, place?, base?)` | Ceil to decimal place |
| `FloorTo(value, place?, base?)` | Floor to decimal place |
| `RoundTo(value, place?, base?)` | Round to decimal place |
| `RoundAwayFromZero(value)` | Round away from zero |
| `MaxAdd(value, amount, max)` | Add clamped to max |
| `MinSub(value, amount, min)` | Subtract clamped to min |
| `Difference(a, b)` | Absolute difference |
| `IsEven(value)` | Integer is even |
| `IsEvenStrict(value)` | Strictly even (not zero) |
| `Factorial(value)` | Factorial |
| `Rotate(point, angle)` | Rotate point around origin |
| `RotateAround(point, cx, cy, angle)` | Rotate point around custom center |
| `RotateAroundDistance(point, cx, cy, angle, dist)` | Rotate at fixed distance |
| `TransformXY(x, y, posX, posY, rotation, scaleX, scaleY, output?)` | Full 2D transform |
| `GetSpeed(distance, time)` | Speed from distance and time |
| `RandomXY(vector, scale?)` | Set vector to random unit direction |

### Power-of-Two (`Phaser.Math.Pow2.*`)

| Function | Description |
|---|---|
| `GetPowerOfTwo(value)` | Next power of two >= value |
| `IsValuePowerOfTwo(value)` | Check if value is power of two |
| `IsSizePowerOfTwo(width, height)` | Check if both dimensions are power of two |

---

## Vector2 Quick Reference

`Phaser.Math.Vector2` -- 2D vector used throughout Phaser for positions, velocities, directions.

Constructor: `new Vector2(x?, y?)` or `new Vector2({x, y})`. If only `x` given, `y` defaults to `x`.

| Method | Returns | Description |
|---|---|---|
| `set(x, y)` / `setTo(x, y)` | this | Set components |
| `setToPolar(angle, length?)` | this | Set from angle + length |
| `copy(src)` / `setFromObject(obj)` | this | Copy from Vector2Like |
| `clone()` | Vector2 | New copy |
| `add(src)` / `subtract(src)` | this | Component-wise add/subtract |
| `multiply(src)` / `divide(src)` | this | Component-wise multiply/divide |
| `scale(value)` | this | Multiply both components by scalar |
| `negate()` | this | Flip sign of both components |
| `normalize()` | this | Set length to 1 |
| `normalizeRightHand()` | this | Perpendicular (right-hand rule) |
| `normalizeLeftHand()` | this | Perpendicular (left-hand rule) |
| `limit(max)` | this | Cap length to max |
| `setLength(length)` | this | Scale to exact length |
| `length()` | number | Magnitude |
| `lengthSq()` | number | Squared magnitude (no sqrt) |
| `distance(src)` | number | Distance to another vector |
| `distanceSq(src)` | number | Squared distance |
| `dot(src)` | number | Dot product |
| `cross(src)` | number | 2D cross product (scalar) |
| `angle()` | number | Angle in radians from positive x-axis |
| `setAngle(angle)` | this | Rotate to angle, keeping length |
| `rotate(delta)` | this | Rotate by delta radians |
| `lerp(src, t)` | this | Linear interpolate toward src |
| `reflect(normal)` | this | Reflect off surface normal |
| `mirror(axis)` | this | Mirror across axis vector |
| `project(src)` | this | Project onto another vector |
| `equals(v)` | boolean | Exact equality |
| `fuzzyEquals(v, epsilon?)` | boolean | Approximate equality |
| `ceil()` / `floor()` / `invert()` | this | Component transforms |
| `reset()` | this | Set to (0, 0) |
| `transformMat3(mat)` | this | Transform by Matrix3 |
| `transformMat4(mat)` | this | Transform by Matrix4 |

Static: `Vector2.ZERO`, `Vector2.RIGHT`, `Vector2.LEFT`, `Vector2.UP`, `Vector2.DOWN`, `Vector2.ONE`.

---

## Vector3 Quick Reference

`Phaser.Math.Vector3` -- 3D vector for camera projections, lighting, 3D math.

Constructor: `new Vector3(x?, y?, z?)` or `new Vector3({x, y, z})`.

Key methods (same patterns as Vector2 plus): `up()`, `min(v)`, `max(v)`, `addVectors(a, b)`, `subVectors(a, b)`, `crossVectors(a, b)`, `cross(v)`, `addScalar(s)`, `addScale(v, scale)`, `fromArray(array, offset?)`, `setFromMatrixPosition(mat4)`, `setFromMatrixColumn(mat4, index)`, `applyMatrix3(mat)`, `applyMatrix4(mat)`, `transformCoordinates(mat)`, `transformQuat(q)`, `project(mat)`, `projectViewMatrix(view, proj)`, `unproject(viewport, invProjView)`.

---

## Matrix4 Quick Reference

`Phaser.Math.Matrix4` -- 4x4 matrix for 3D transforms, projection, and view matrices. Backed by `Float32Array(16)`.

Constructor: `new Matrix4(m?)` -- copies from existing Matrix4, or defaults to identity.

Key methods: `clone()`, `set(src)`, `copy(src)`, `identity()`, `transpose()`, `invert()`, `adjoint()`, `determinant()`, `multiply(src)`, `multiplyLocal(src)`, `translate(v)`, `scale(v)`, `rotate(angle, axis)`, `rotateX(angle)`, `rotateY(angle)`, `rotateZ(angle)`, `fromRotationTranslation(q, v)`, `fromQuat(q)`, `frustum(...)`, `perspective(fovy, aspect, near, far)`, `perspectiveLH(width, height, near, far)`, `ortho(left, right, bottom, top, near, far)`, `lookAt(eye, center, up)`, `lookAtRH(eye, target, up)`, `setWorldMatrix(rotation, position, scale, viewMatrix?, projectionMatrix?)`.

Also: `Phaser.Math.Matrix3` -- 3x3 matrix for 2D transforms and normal matrices.

---

## RandomDataGenerator

`Phaser.Math.RandomDataGenerator` -- seeded PRNG. Global instance at `Phaser.Math.RND` (seeded via game config `seed` property).

```js
const rnd = Phaser.Math.RND; // or new Phaser.Math.RandomDataGenerator(['my-seed'])

rnd.integer();              // random integer in [0, 2^32]
rnd.frac();                 // random float in [0, 1)
rnd.between(1, 10);         // random integer in [1, 10]
rnd.integerInRange(1, 10);  // alias for between
rnd.realInRange(0.5, 1.5);  // random float in [0.5, 1.5]
rnd.normal();               // normal distribution around 0
rnd.angle();                // random angle in radians (-PI to PI)
rnd.rotation();             // random rotation in radians (same range)
rnd.pick(array);            // random element from array
rnd.weightedPick(array);    // weighted toward end of array
rnd.sign();                 // -1 or 1
rnd.uuid();                 // RFC4122 v4 UUID string
rnd.shuffle(array);         // in-place Fisher-Yates shuffle
rnd.state(state?);          // get/set serializable state for save/load
```

Create reproducible sequences by providing seeds: `new RandomDataGenerator(['level-42'])`.

---

## Color Utilities

### Color Class (`Phaser.Display.Color`)

A mutable RGBA color representation with automatic conversion to WebGL floats, HSV, CSS strings, and packed integers.

```js
// Construction
const color = new Phaser.Display.Color(255, 0, 0, 255);     // RGBA (0-255)

// Creation helpers (return Color instances)
const c1 = Phaser.Display.Color.ValueToColor('#ff0000');     // hex string, integer, or object
const c2 = Phaser.Display.Color.HexStringToColor('#ff0000');
const c3 = Phaser.Display.Color.RGBStringToColor('rgb(255,0,0)');
const c4 = Phaser.Display.Color.HSVToRGB(0.5, 1, 1);        // returns { r, g, b, color }

// Properties
color.r; color.g; color.b; color.a;   // 0-255 integers
color.redGL; color.greenGL; color.blueGL; color.alphaGL;  // 0-1 floats (WebGL)
color.color;    // packed 24-bit integer (0xRRGGBB)
color.color32;  // packed 32-bit integer (0xAARRGGBB)
color.rgba;     // CSS string 'rgba(r,g,b,a)'
color.h; color.s; color.v;  // HSV representation (read-only, auto-updated)
```

### Color Manipulation

```js
// Adjustment methods (amount is typically 0-100, returns the Color instance)
color.brighten(25);      // increase brightness
color.saturate(50);      // increase saturation
color.desaturate(30);    // decrease saturation
color.lighten(20);       // increase lightness
color.darken(10);        // decrease lightness

// Utility methods
color.random();          // set to random RGB values (optional min/max range)
color.gray(128);         // set to grayscale shade (0-255)

// Setting values
color.setTo(255, 128, 0, 255);           // RGBA
color.setFromRGB({ r: 255, g: 128, b: 0, a: 255 });
color.setFromHSV(0.1, 0.8, 1.0);        // HSV (0-1 range)
```

### Color Interpolation (`Phaser.Display.Color.Interpolate`)

Interpolate between colors over a given length. Returns `{ r, g, b, a, color }`.

```js
// Between raw RGB values
const result = Phaser.Display.Color.Interpolate.RGBWithRGB(
    255, 0, 0,    // start color (r, g, b)
    0, 0, 255,    // end color (r, g, b)
    100,          // length (number of steps)
    50            // index (current step)
);  // returns midpoint purple { r, g, b, a, color }

// Between two Color objects
const mid = Phaser.Display.Color.Interpolate.ColorWithColor(color1, color2, 100, 50);

// HSV interpolation (v4): smooth hue transition
const hsvResult = Phaser.Display.Color.Interpolate.HSVWithHSV(0, 1, 1, 0.5, 1, 1, 100, 50);
```

---

## Gotchas

1. **Geom objects are not game objects.** They have no `scene`, no `setPosition` from the display list, no texture. Use Graphics or Shape game objects to render them.

2. **Point class removed in v4.** Use `Phaser.Math.Vector2` or plain `{x, y}` objects instead. The `GEOM_CONST.POINT` (3) exists but the Point class does not.

3. **Angles are in radians** throughout the math API. Use `Phaser.Math.DegToRad()` and `RadToDeg()` for conversion. The `Phaser.Math.TAU` constant (2 * PI) is new in v4.

4. **Vector2 methods mutate in place** and return `this` for chaining. Call `.clone()` first if you need to preserve the original: `const result = v.clone().add(other)`.

5. **Squared distance is faster** than Euclidean distance (avoids `Math.sqrt`). Use `Distance.Squared` or `vec.distanceSq()` for comparisons where the actual distance value is not needed.

6. **Intersection Get* functions allocate arrays.** Pass a reusable `out` array to avoid garbage collection pressure in hot loops.

7. **EaseMap short names** default to the `.Out` variant. `'Quad'` means `Quadratic.Out`, not `Quadratic.In`. Use full string keys like `'Quad.easeIn'` for other variants.

8. **RandomDataGenerator state is serializable.** Call `rnd.state()` to get a string you can store, and `rnd.state(savedString)` to restore it for deterministic replay.

9. **Polygon.contains uses ray-casting** (even/odd rule). Complex self-intersecting polygons may give unexpected results.

10. **Matrix4.val is a Float32Array.** Access elements directly via `mat.val[index]` using column-major order (OpenGL convention).

---

## Source File Map

| Area | Path |
|---|---|
| Geom classes | `src/geom/{circle,ellipse,line,polygon,rectangle,triangle}/` |
| Geom constants | `src/geom/const.js` |
| Intersection tests | `src/geom/intersects/` |
| Vector2 | `src/math/Vector2.js` |
| Vector3 | `src/math/Vector3.js` |
| Vector4 | `src/math/Vector4.js` |
| Matrix3 | `src/math/Matrix3.js` |
| Matrix4 | `src/math/Matrix4.js` |
| Quaternion | `src/math/Quaternion.js` |
| Euler | `src/math/Euler.js` |
| Angle functions | `src/math/angle/` |
| Distance functions | `src/math/distance/` |
| Easing functions | `src/math/easing/` (+ `EaseMap.js` for string keys) |
| Fuzzy comparison | `src/math/fuzzy/` |
| Interpolation | `src/math/interpolation/` |
| Snap functions | `src/math/snap/` |
| Power-of-two | `src/math/pow2/` |
| RandomDataGenerator | `src/math/random-data-generator/RandomDataGenerator.js` |
| Math constants | `src/math/const.js` |
| Color class | `src/display/color/Color.js` |
| Color utilities | `src/display/color/` (ValueToColor, HexStringToColor, RGBStringToColor, HSVToRGB, Interpolate) |
| Core math helpers | `src/math/` (Clamp.js, Between.js, Wrap.js, Linear.js, etc.) |
