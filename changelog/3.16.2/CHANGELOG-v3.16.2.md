# Phaser 3 Change Log

## Version 3.16.2 - Ishikawa - 11th February 2019

This is point release primarily fixes a few important issues that surfaced in 3.16.0.

### Matter Pointer Constraint Changes

The following changes all effect the Matter JS Pointer Constraint class:

* Pointer handling has been changed to make more sense. In the previous version, pressing down and then moving the Pointer _over_ a body would start it being dragged, even if the pointer was pressed down well outside of the body bounds. Now, a body can only be dragged by actually pressing down on it, or any of its parts, which is more in-line with how input events should work.
* Previously, releasing ANY pointer would stop an object being dragged, even if it wasn't the one actually dragging a body, as in a multi-touch game. Bodies are now bound to the pointer which started their drag and only the release of that pointer will stop them.
* There is a new Matter Physics Event `DRAG_START` which is emitted by a Pointer Constraint when it starts dragging a body. Listen for this event from the Matter World instance.
* There is a new Matter Physics Event `DRAG` which is emitted by a Pointer Constraint as it drags a body. Listen for this event from the Matter World instance.
* There is a new Matter Physics Event `DRAG_END` which is emitted by a Pointer Constraint when it stops dragging a body. Listen for this event from the Matter World instance.
* The `camera` property can no longer be set in the config object. Instead it is set every time the Pointer is pressed down on a Body, this resolves issues where you have a multi-camera Scene and want to drag a body in the non-main camera.
* `body` is a new property that holds a reference to the Body being dragged, if any.
* `part` is a new property that holds a reference to the Body part that was clicked on which started the drag.
* The internal `getBodyPart` method has been renamed to `hitTestBody` to more accurately reflect what it does.
* The class no longer listens for the pointer `up` event, instead of tracks the active pointer and waits for that to be released. This has reduced the complexity and size of the `update` method considerably.
* `stopDrag` is a new method that allows you to manually stop an object being dragged, even if the pointer isn't released.
* This class now has 100% JSDocs.

### Updates

* `TileSprite.setTileScale` has been updated so that the `y` argument is optional and set to match the `x` argument, like `setScale` elsewhere in the API.
* `InputManager.time` is a new property that holds the most recent time it was updated from the Game step, which plugins can access.
* `InputManager.preStep` is a new method that populates some internal properties every step.
* `KeyboardPlugin.time` has moved from being a property to being a getter, which returns the time from the InputManager.
* The `scale` property has been added to the `Scene` class (thanks @strangeweekend)
* `Matter.World.remove` now uses the `Composite.remove` method internally. Previously, it used `Composite.removeBody` which only allowed it to remove bodies from the simulation. Now, it can remove any type of Matter object.
* When the Matter World creates its wall bounds, the left and right walls now extend further up and down than before, so that in a 4-wall setting there are no gaps in the corners, which previously allowed for fast moving objects that hit a corner intersection point to sometimes travel through it.
* Touch inputs will now trigger a `POINTER_OUT` event if they leave the game (i.e. are released), where-as before they would only trigger the `POINTER_UP` event. Now, both happen (thanks @rgk)

### Bug Fixes

* The `Mesh.setAlpha` method has been restored, even though it's empty and does nothing, to prevent runtime errors when adding a Mesh or Quad object to a Container. Fix #4338 #4343 (thanks @pfdtravalmatic @charmingny)
* `KeyboardPlugin.checkDown` would always fail if using the new event system, because the time value it was checking wasn't updated.
* Entering `Fullscreen` mode in the Scale Manager and then pressing ESC would leave the injected fullsceen div in the DOM, causing it to throw a node insertion failure the second time you wanted to enter fullscreen mode. Fix #4352 (thanks @ngdevr)
* Due to the changes in the Input event system, the `GAME_OUT` event would never fire unless the input system was in legacy mode. The OUT and OVER handlers have been refactored and will now fire as soon as the DOM event happens. As a result the `InputManager._emitIsOverEvent` property has been removed, as the native event is sent directly to the handler and doesn't need storing locally any more. Fix #4344 (thanks @RademCZ)
* Added `Zone.setBlendMode` method as a NOOP function, fixing a bug where if you added a Zone to a Container when running under Canvas it would fail. Fix #4295 (thanks @emanuel15)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@maretana @CipSoft-Components @brian-lui
