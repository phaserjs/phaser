# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Group, Layer and Game Object New Features

* When using `Group.createMultiple` it will now skip the post-creations options if they are not set in the config object used, or a Game Object constructor. Previously, things like alpha, position, etc would be over-written by the defaults if they weren't given in the config, but now the method will check to see if they are set and only use them if they are. This is a breaking change, but makes it more efficient and flexible (thanks @samme)
* `GameObjects.Layer.addToDisplayList` and `removeFromDisplayList` are new methods that allows for you to now add a Layer as a child of another Layer. Fix #5799 (thanks @samme)
* `GameObjects.Polygon.setTo` is a new method that allows you to change the points being used to render a Polygon Shape Game Object. Fix #6151 (thanks @PhaserEditor2D)

## Game Object Updates

* The `GameObject.getBounds` method will now return a `Geom.Rectangle` instance, rather than a plain Object (thanks @samme)
* The `GetBounds.getCenter` method now has an optional `includeParent` argument, which allows you to get the value in world space.
* The `Transform` Component has a new boolean read-only property `hasTransformComponent` which is set to `true` by default.

## DOM Element Game Object Updates

* The `DOMElement.preUpdate` method has been removed. If you overrode this method, please now see `preRender` instead.
* `DOMElement.preRender` is a new method that will check parent visibility and improve its behavior, responding to the parent even if the Scene is paused or the element is inactive. Dom Elements are also no longer added to the Scene Update List. Fix #5816 (thanks @prakol16 @samme)

## Light Game Object Updates

* The `Light` Game Object now has the `Origin` and `Transform` components, along with 4 new properties: `width`, `height`, `displayWidth` and `displayHeight`. This allows you to add a Light to a Container, or enable it for physics. Fix #6126 (thanks @jcoppage)

## Transform Matrix Updates

* `TransformMatrix.setQuad` is a new method that will perform the 8 calculations required to create the vertice positions from the matrix and the given values. The result is stored in the new `TransformMatrix.quad` Float32Array, which is also returned from this method.
* `TransformMatrix.multiply` now directly updates the Float32Array, leading to 6 less getter invocations.

## Game Object Bug Fixes

* The `renderFlags` property, used to determine if a Game Object will render, or not, would be calculated incorrectly depending on the order of the `scaleX` and `scaleY` properties. It now works regardless of the order (thanks @mizunokazumi)
* When calling `GameObject.getPostPipeline` and passing in a string for the pipeline name it would error with 'Uncaught TypeError: Right-hand side of 'instanceof' is not an object'. This is now handled correctly internally (thanks @neki-dev)
* The `GameObject.willRender` method will now factor in the parent `displayList`, if it has one, to the end result. This fixes issues like that where an invisible Layer will still process input events. Fix #5883 (thanks @rexrainbow)
* The `GetBounds` component has been removed from the Point Light Game Object. Fix #5934 (thanks @x-wk @samme)
* Although not recommended, when adding a `Layer` Game Object to another `Layer` Game Object, it will no longer error because it cannot find the `removeFromDisplayList` function. Fix #5595 (thanks @tringcooler)
* The DisplayList will now enter a while loop until all Game Objects are destroyed, rather than cache the list length. This prevents "cannot read property 'destroy' of undefined" errors in Scenes. Fix #5520 (thanks @schontz @astei)
* Layers will now destroy more carefully when children destroy themselves (thanks @rexrainbow)
* The `DisplayList.addChildCallback` method will now check to see if the child has a parent container, and if it does, remove it from there before adding it to the Scene Display List. Fix #6091 (thanks @michalfialadev)

## Rope Game Object Bug Fixes

* If `Rope.setPoints` was called with the exact same number of points as before, it wouldn't set the `dirty` flag, meaning the vertices were not updated on the next render (thanks @stupot)

## Rectangle Game Object Bug Fixes

* During a call to `GameObject.Shapes.Rectangle.setSize` it will now correctly update the Rectangle object's display origin and default hitArea (thanks @rexrainbow)

## Path Follower Game Object Bug Fixes

* If you start a `PathFollower` with a `to` value it will now tween and complete at that value, rather than the end of the path as before (thanks @samme)

## Polygon Game Object Bug Fixes

* The `Polygon` Game Object would ignore its `closePath` property when rendering in Canvas. Fix #5983 (thanks @optimumsuave)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
