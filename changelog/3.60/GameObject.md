# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Group and Layer New Features

* When using `Group.createMultiple` it will now skip the post-creations options if they are not set in the config object used, or a Game Object constructor. Previously, things like alpha, position, etc would be over-written by the defaults if they weren't given in the config, but now the method will check to see if they are set and only use them if they are. This is a breaking change, but makes it more efficient and flexible (thanks @samme)
* `GameObjects.Layer.addToDisplayList` and `removeFromDisplayList` are new methods that allows for you to now add a Layer as a child of another Layer. Fix #5799 (thanks @samme)

## Game Object Updates

Updates that apply to the base Game Object class and all of its children.

* The `GameObject.getBounds` method will now return a `Geom.Rectangle` instance, rather than a plain Object (thanks @samme)

## Game Object Bug Fixes

* The `renderFlags` property, used to determine if a Game Object will render, or not, would be calculated incorrectly depending on the order of the `scaleX` and `scaleY` properties. It now works regardless of the order (thanks @mizunokazumi)
* When calling `GameObject.getPostPipeline` and passing in a string for the pipeline name it would error with 'Uncaught TypeError: Right-hand side of 'instanceof' is not an object'. This is now handled correctly internally (thanks @neki-dev)
* The `GameObject.willRender` method will now factor in the parent `displayList`, if it has one, to the end result. This fixes issues like that where an invisible Layer will still process input events. Fix #5883 (thanks @rexrainbow)
* The `GetBounds` component has been removed from the Point Light Game Object. Fix #5934 (thanks @x-wk @samme)
* Although not recommended, when adding a `Layer` Game Object to another `Layer` Game Object, it will no longer error because it cannot find the `removeFromDisplayList` function. Fix #5595 (thanks @tringcooler)
* The DisplayList will now enter a while loop until all Game Objects are destroyed, rather than cache the list length. This prevents "cannot read property 'destroy' of undefined" errors in Scenes. Fix #5520 (thanks @schontz @astei)
* Layers will now destroy more carefully when children destroy themselves (thanks @rexrainbow)
* The `DisplayList.addChildCallback` method will now check to see if the child has a parent container, and if it does, remove it from there before adding it to the Scene Display List. Fix #6091 (thanks @michalfialadev)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).
