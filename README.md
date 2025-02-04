# Phaser - HTML5 Game Framework

![Phaser Banner](changelog/assets/phaser-banner.png "Phaser Banner")

[![Discord](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
![JSDelivr](https://img.shields.io/jsdelivr/npm/hm/phaser?style=for-the-badge)
![GitHub](https://img.shields.io/github/downloads/phaserjs/phaser/total?style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers and has been actively developed for over 10 years.

Games can be built for the web, or as YouTube Playables, Discord Activities, Twitch Overlays or compiled to iOS, Android, Steam and native apps using 3rd party tools. You can use JavaScript or TypeScript for development. Phaser supports over 40 different front-end frameworks including React and Vue.

Phaser is commercially developed and maintained by **Phaser Studio Inc** along with our fantastic open source community. As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Interested in learning more? Click the image below to watch our intro video.

[![YouTube](http://i.ytimg.com/vi/jHTRu4iNTcA/maxresdefault.jpg)](https://www.youtube.com/watch?v=jHTRu4iNTcA)

## v4 Beta Release

You are looking at the Beta Release of Phaser v4. There are large internal differences between Phaser v3 and v4, although the public API has remained largely, but not entirely, the same.

Please only use this release if you wish to help beta test Phaser v4.

Phaser v4 contains Phaser Beam, our brand-new and highly efficient WebGL renderer. Virtually the entire renderer from v3 has been replaced and this transition will be documented in its own Change Log.

Other changes also include the following:

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


## Installing Phaser from NPM

Install via [npm](https://www.npmjs.com/package/phaser):

```bash
npm install phaser@beta
```

## Phaser TypeScript Definitions

Full TypeScript definitions can be found inside the [types folder](https://github.com/phaserjs/phaser/tree/master/types). They are also referenced in the `types` entry in `package.json`, meaning modern editors such as VSCode will detect them automatically.

Depending on your project, you may need to add the following to your `tsconfig.json` file:

```json
"lib": ["es6", "dom", "dom.iterable", "scripthost"],
"typeRoots": ["./node_modules/phaser/types"],
"types": ["Phaser"]
```

## Have fun!

Grab the source and join the fun!

Phaser wouldn't have been possible without the fantastic support of the community. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

[Rich](mailto:rich@phaser.io) and the whole team at Phaser Studio

![boogie](https://www.phaser.io/images/spacedancer.gif)

**Visit** the [Phaser website](https://phaser.io)<br />
**Play** some [amazing games](https://phaser.io/games)<br />
**Learn** By browsing our [API Docs](https://newdocs.phaser.io), [Support Forum](https://phaser.discourse.group/) and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code Examples?** We've over 2000 [Examples](https://phaser.io/examples) to learn from<br />
**Read** the weekly [Phaser World](https://phaser.world) Newsletter<br />
**Be Social:** Join us on [Discord](https://discord.gg/phaser) and [Reddit](https://phaser.io/community/reddit) or follow us on [Twitter](https://twitter.com/phaser_)<br />

Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2011 - 2024 Phaser Studio Inc.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata
