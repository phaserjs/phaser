# Version 3.90 - Tsugumi - 23rd May 2025

## New Features

* `GameObjects.Rectangle.setRounded` is a new method that will allow the Rectangle Shape Game Object to have rounded corners. Pass the radius to set for the corners, or pass a value of zero to disable rounded corners.
* `GameObjects.Rectangle.isRounded` is a new read-only boolean that can be used to determine if the Rectangle Shape Game Object has rounded corners, or not.
* `GameObjects.Rectangle.radius` is a new read-only number that is the size of the rounded corners. Do not set directly, instead use the method `setRounded`.
* Added `Phaser.Math.Angle.GetClockwiseDistance()` to get the shortest nonnegative angular distance between two angles. PR #7092 (thanks @samme)
* Added `Phaser.Math.Angle.GetCounterClockwiseDistance()` gets the shortest nonpositive angular distance between two angles. PR #7092 (thanks @samme)
* Added `Phaser.Math.Angle.GetShortestDistance()` gets the shortest signed angular distance between two angles. (This is like `Phaser.Math.Angle.ShortestBetween()` but in radians.) PR #7092 (thanks @samme)
* Added `Phaser.GameObjects.BitmapText#setDisplaySize` method to `BitmapText` to get the original scaled size of 1. PR #6623 (thanks @samme)
* Added fallback for Web Audio on Firefox. Firefox doesn't implement `positionX`, `positionY` and `positionZ` properties on the AudioListener instances at the moment. This prevents the follow feature from WebAudioSound to operate on Firefox. PR #7083 (thanks @raaaahman)

## Updates

* The `EXPAND` Scale Mode has been updated to now clamp the size of the canvas that is created, preventing it from growing too large on landscape ultra-wide displays. Fix #7027 (thanks @leha-games @rexrainbow)
* An Error will now be thrown if you try to create a DOM Game Object but haven't correctly configured the Game Config (thanks @samme)

## Bug Fixes

* An erroneous `console.log` was left in the Text Game Object. This has now been removed.
* Particle emitter color RGB arrays are cleared before repopulating. Fix #7069 (thanks @Golen87 @samme)
* `Phaser.Animations.AnimationFrame` correctly uses frame duration when it is set. Fix #7070 (thanks @sylvainpolletvillard)
* Particle emitter custom `moveTo` functions can now move particles. Fix #7063 (thanks @samme)
* Changed ImageCollections default Tileset values from `null` to `undefined`. Fix #7053 (thanks @Snoturky)
* Chained tweens now `persist` correctly even after calling `Phaser.Tweens.BaseTween#stop`. Fix #7048 (thanks @FranciscoCaetano88)
* New left-to-right `Text` Game Objects now includes the default `canvas.dir = 'ltr` and `context.direction = 'ltr';`. Fixes a bug in Chrome 134 & Edge 134 where calling `destroy()` on a right-to-left `Text` Game Object prevents the next created left-to-right `Text` Game Object from rendering. Fix #7077 (thanks @Demeno)
* `Grid` Game Objects renders `lineWidth` correctly in WebGL mode. Fix #7029 (thanks @AlvaroNeuronup)
* Added `collisionMask` and `collisionCategory` checks to `Phaser.Physics.Arcade.World#separate` to allow individual physics game objects within a physics group to have it's own unique collision categories. Fix #7034 (thanks @frederikocmr)
* Fixed Arcade Physics bug causing immovable circle objects to move when pushed by polygons. Fix #7054 (thanks @hunkydoryrepair)
* Fixed `createFromTiles` to handle multiple tilesets when using sprite sheets. Fix #7122 (thanks @vikerman)
* Fixed audio files not loading from Base64 data URIs (thanks @bagyoni)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@justin-calleja
@ixonstater
@DayKev
