# Version 4.0.0 - in dev

Phaser v4 contains Phaser Beam, our brand-new and highly efficient WebGL renderer. The entire renderer from Phaser +v3 has been replaced.

Other changes include the following:

✔️ We have removed `Phaser.Struct.Set` and replaced it with a regular JS `Set` instance. This means methods like `iterateLocal` are gone.  
✔️ We have removed the `Create.GenerateTexture` function and all of the Create Palettes and the `create` folder.  
✔️ `TextureManager.generate` has been removed as a result of the GenerateTexture removal.  
✔️ We have removed the `phaser-ie9.js` entry-point.  
✔️ We have removed `Math.SinCosTableGenerator`.  
✔️ We have removed the following polyfills: Array.forEach, Array.isArray, AudioContextMonkeyPatch, console, Math.trunc, performance.now, requestAnimationFrame and Uint32Array.  
✔️ We have removed the Facebook Plugin detection constants from the core library.  
✔️ We have removed the Camera3D Plugin.  
✔️ We have removed the Layer3D Plugin.  
✔️ The `Geom.Point` class and all related functions will be removed. All functionality for this can be found in the existing Vector2 math classes. All Geometry classes that currently create and return Point objects will be updated to return Vector2 objects instead.  
* We are removing `Phaser.Struct.Map` and replacing it with a regular JS `Map` instance. This means methods like `contains` and `setAll` will be gone.  
* The Spine 3 and Spine 4 plugins will no longer be updated. You should now use the official Phaser Spine plugin created by Esoteric Software.  

`Point.Ceil` = `Vector2.ceil`
`Point.Floor` = `Vector2.floor`
`Point.Clone` = `Vector2.clone`
`Point.CopyFrom(src,dest)` = `dest.copy(src)`
`Point.Equals` = `Vector2.equals`
`Point.GetCentroid` = `Math.GetCentroid`
`Point.GetMagnitude` = `Vector2.length`
`Point.GetMagnitudeSq` = `Vector2.lengthSq`
`Point.Invert` = `Vector2.invert`
`Point.Negative` = `Vector2.negate`
`Point.SetMagnitude` = `Vector2.setLength`
`Point.Project` = `Vector2.project`
`Point.ProjectUnit` = `Vector2.projectUnit`
`Point.Interpolate` = `Math.LinearXY`
`Point.GetRectangleFromPoints` = `Math.GetVec2Bounds`

* `Vector2.ceil` is a new method that will apply Math.ceil to the x and y components of the vector. Use as a replacement for `Geom.Point.Ceil`.
* `Vector2.floor` is a new method that will apply Math.floor to the x and y components of the vector. Use as a replacement for `Geom.Point.Floor`.
* `Vector2.invert` is a new method that will swap the x and y components of the vector. Use as a replacement for `Geom.Point.Invert`.
* `Vector2.projectUnit` is a new method that will calculate the vector projection onto a non-zero target vector. Use as a replacement for `Geom.Point.ProjectUnit`.
* `Math.GetCentroid` is a new function that will get the centroid, or geometric center, of a plane figure from an array of Vector2 like objects. Use as a replacement for `Geom.Point.GetCentroid`.
* `Math.GetVec2Bounds` is a new function that will get the AABB bounds as a Geom.Rectangle from an array of Vector2 objects. Use as a replacement for `Geom.Point.GetRectangleFromPoints`.
* `Math.TAU` is now actually the value of tau! (i.e. PI * 2) instead of being PI / 2.
* `Math.PI2` has been removed. You can use `Math.TAU` instead. All internal use of PI2 has been replaced with TAU.
* `Math.PI_OVER_2` is a new constant for PI / 2 and all internal use of TAU has been updated to this new constant.
* `Geom.Circle.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Circle.CircumferencePoint`, `Circle.CircumferencePoint`, `Circle.GetPoint`, `Circle.GetPoints`, `Circle.OffsetPoint` and `Circle.Random` all now take and in some cases return Vector2 instances instead of Point objects.
* `Geom.Ellipse.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Ellipse.CircumferencePoint`, `Ellipse.CircumferencePoint`, `Ellipse.GetPoint`, `Ellipse.GetPoints`, `Ellipse.OffsetPoint` and `Ellipse.Random` all now take and in some cases return Vector2 instances instead of Point objects.
* `Geom.Line.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Line.GetEasedPoint`, `Line.GetMidPoint`, `Line.GetNearestPoint`, `Line.GetNormal`, `Line.GetPoint`, `Line.GetPoints`, `Line.Random` and `Line.RotateAroundPoint` all now take and in some cases return Vector2 instances instead of Point objects.
* The `Geom.Polygon.getPoints` method now returns Vector2 objects instead of Point.
* The functions `Geom.Polygon.ContainsPoint` and `Polygon.GetPoints` all now take and in some cases return Vector2 instances instead of Point objects.
* `Geom.Rectangle.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Rectangle.ContainsPoint`, `Rectangle.GetCenter`, `Rectangle.GetPoint`, `Rectangle.GetPoints`, `Rectangle.GetSize`, `Rectangle.MarchingAnts`, `Rectangle.MergePoints`, `Rectangle.OffsetPoint`, `Rectangle.PerimeterPoint`, `Rectangle.Random` and `Rectangle.RandomOutside` all now take and in some cases return Vector2 instances instead of Point objects.
* `Geom.Triangle.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Triangle.Centroid`, `Triangle.CircumCenter`, `Triangle.ContainsArray`, `Triangle.ContainsPoint`, `Triangle.GetPoint`, `Triangle.GetPoints`, `Triangle.InCenter`, `Triangle.Random` and `Triangle.RotateAroundPoint` all now take and in some cases return Vector2 instances instead of Point objects.
* `DynamicTexture` and `RenderTexture` must call `render()` to actually draw.

v4.0.0 Beta 2 Updates:

* Better roundPixels handling via bias.
* UUIDs for DynamicTexture names.
    * Masks work (again). Big feature!
* DynamicTexture can resize immediately after creation.
* Fix shader compilation issues on diverse systems.
        * Shapes/Graphics should work again in Firefox.
        * Issues with inTexDatum should be eliminated in affected Linux systems.
* Fix Extern and extend its rendering potential (see Beam Examples).
* TileSprite now assigns default dimensions to each dimension separately.
* BaseFilterShader now accesses loaded shader cache keys correctly.
