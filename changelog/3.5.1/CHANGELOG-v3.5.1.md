# Phaser 3 Change Log

## Version 3.5.1 - Kirito - 17th April 2018

### Updates

* The change made in 3.5.0 with how the Scene systems lifecycle is handled has been tweaked. When a Scene is instantiated it will now emit a boot event, as before, and Systems that need it will listen for this event and set-up their internal properties as required. They'll also do the same under the 'start' event, allowing them to restart properly once shutdown. In 3.5 if a Scene was previously not launched or started you wouldn't be able to access all of its internal systems fully, but in 3.5.1 you can.

### Bug Fixes

* LoaderPlugin.destroy would try and remove an incorrect event listener.
* TileSprites would try to call `deleteTexture` on both renderers, but it's only available in WebGL (thanks @jmcriat)
* Using a geometry mask stopped working in WebGL. Fix #3582 (thanks @rafelsanso)
* The particle emitter incorrectly adjusted the vertex count, causing WebGL rendering issues. Fix #3583 (thanks @murteira)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@NemoStein @gabegordon @gazpachu @samme @cristlee @melissaelopez @dazigemm @tgrajewski
