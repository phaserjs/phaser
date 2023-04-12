# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Geometry Breaking Changes

The following are API-breaking, in that a new optional parameter has been inserted prior to the output parameter. If you use any of the following functions, please update your code:

* The `Geom.Intersects.GetLineToLine` method has a new optional parameter `isRay`. If `true` it will treat the first line parameter as a ray, if false, as a line segment (the default).
* The `Geom.Intersects.GetLineToPoints` method has a new optional parameter `isRay`. If `true` it will treat the line parameter as a ray, if false, as a line segment (the default).
* The `Geom.Intersects.GetLineToPolygon` method has a new optional parameter `isRay`. If `true` it will treat the line parameter as a ray, if false, as a line segment (the default).
* `Geom.Intersects.GetRaysFromPointToPolygon` uses the new `isRay` parameter to enable this function to work fully again.

## Geometry Updates

* `Geom.Intersects.LineToLine` will no longer create an internal `Point` object, as it's not required internally (thanks @Trissolo)

## Geometry Bug Fixes

* Fixed issue in `Geom.Intersects.GetLineToLine` function that would fail with colinear lines (thanks @Skel0t)

## Curves New Features

* `Curves.Path.getCurveAt` is a new method that will return the curve that forms the path at the given location (thanks @natureofcode)

## Path Bug Fixes

* The `Path.fromJSON` function would use the wrong name for a Quadratic Bezier curve class, meaning it would be skipped in the exported JSON. It's now included correctly (thanks @natureofcode)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
