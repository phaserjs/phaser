# Phaser 3 Change Log

## Version 3.52.0 - Crusch - 14th January 2021

### New Features

* The `getPostPipeline` method available on most Game Objects will now return an array of piplines if an instance is given and the Game Object has more than one of those pipelines set on it. If only one pipeline is set, it will be returned directly.

### Updates

* `BaseCamera.renderList` is a new array that is populated with all Game Objects that the camera has rendered in the current frame. It is automatically cleared during `Camera.preUpdate` and is an accurate representation of the Game Objects the Camera rendered. It's used internally by the Input Plugin, but exposed should you wish to read the contents or use it for profiling.
* `BaseCamera.addToRenderList` is a new method that will add the given Game Object to the Cameras current render list.
* The `InputPlugin.sortGameObjects` method now uses the new Camera render list to work out the display index depths.
* The `InputPlugin.sortDropZones` method is a new method, based on the old `sortGameObjects` method that is used for sorting input enabled drop zones.
* The background color behind the game url in the banner is now transparent, so it looks correct with dark dev tools themes (thanks @kainage)

### Bug Fixes

* `WebAudioSound.destroy` now checks to see if `pannerNode` exists before disabling it, preventing an error in Safari (thanks @jdcook)
* Fixed the cause of `Uncaught TypeError: Cannot read property 'getIndex' of null` by checking the display list property securely. Fix #5489 (thanks @actionmoon)
* Fixed an issue where adding input-enabled Game Objects to a Layer would have the input system ignore their depth settings. Fix #5483 (thanks @pr4xx)
* The method `TilemapLayer.weightedRandomize` has changed so that the parameter `weightedIndexes` is now first in the method and is non-optional. Previously, it was the 5th parameter and incorrectly flagged as optional. This change was made to the docs but not the parameters, but now works according to the docs (thanks Fantasix)
* The Mesh `GenerateVerts` function was returning an object with the property `verts` instead of `vertices` as expected by the `Mesh.addVertices` method. It now returns the correct name (thanks @lackhand)
* `AtlasJSONFile` will now call `File.pendingDestroy`, clearing up the resources it used during load and emitting a missing `FILE_COMPLETE` event. Fix #5495 (thanks @mikuso)
* `AtlasJSONFile`, `AtlasXMLFile`, `BitmapFontFile` and `UnityAtlasFile` will now call `File.pendingDestroy`, clearing up the resources it used during load and emiting a missing `FILE_COMPLETE` event. Fix #5495 (thanks @mikuso)
* Some Bitmap Text fonts were not rendering under Canvas due to the way in which the texture offset was calculated. It now uses the `__BASE` frame to get the texture offset, rather than the first frame in the set. Fix #5462 #5501 (thanks @monteiz @DPMakerQB)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@ygongdev Tucker @lackhand
