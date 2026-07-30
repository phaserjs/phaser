# Phaser 3 Change Log

## Version 3.55.1 - Ichika - 26th May 2021

### New Features

* The `GameObject.destroy` method has a new `fromScene` parameter, set automatically by Phaser. Fix #5716 (thanks @rexrainbow)
* The Game Object `DESTROY` event is now set the new `fromScene` boolean as the 2nd parameter, allowing you to determine what invoked the event (either user code or a Scene change). Fix #5716 (thanks @rexrainbow)

### Bug Fixes

* Fixed an issue with the TypeScript defs not recognising the Game Object Config properly. Fix #5713 (thanks @vforsh)
* Fixed an issue in the `FillPathWebGL` function which caused the filled versions of the Arc, Circle, Ellipse, Polygon and Star Shapes to not render. Fix #5712 (thanks @rexrainbow)
* Fixed rendering parameters in `IsoBox` and `IsoTriangle` Game Objects that stopped them from rendering correctly.
* Added the missing `WebGLPipelineUniformsConfig` type def. Fix #5718 (thanks @PhaserEditor2D)
