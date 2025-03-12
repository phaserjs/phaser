# Version 3.89 - Tsugumi - in dev

## New Features

* `GameObjects.Rectangle.setRounded` is a new method that will allow the Rectangle Shape Game Object to have rounded corners. Pass the radius to set for the corners, or pass a value of zero to disable rounded corners.
* `GameObjects.Rectangle.isRounded` is a new read-only boolean that can be used to determine if the Rectangle Shape Game Object has rounded corners, or not.
* `GameObjects.Rectangle.radius` is a new read-only number that is the size of the rounded corners. Do not set directly, instead use the method `setRounded`.

## Updates

* The `EXPAND` Scale Mode has been updated to now clamp the size of the canvas that is created, preventing it from growing too large on landscape ultra-wide displays. Fix #7027 (thanks @leha-games @rexrainbow)
* An Error will now be thrown if you try to create a DOM Game Object but haven't correctly configured the Game Config (thanks @samme)

## Bug Fixes

* An erroneous `console.log` was left in the Text Game Object. This has now been removed.

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@justin-calleja
