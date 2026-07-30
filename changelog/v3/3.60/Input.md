# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Input System Breaking Changes

There are breaking changes from previous versions of Phaser.

* The `InteractiveObject.alwaysEnabled` property has been removed. It is no longer checked within the `InputPlugin` and setting it will have no effect. This property has not worked correctly since version 3.52 when the new render list was implemented. Upon further investigation we decided to remove the property entirely, rather than shoe-horn it into the render list. If you need to create a non-rendering Interactive area, use the Zone Game Object instead.

## Input System New Features

* `InputPlugin.resetPointers` is a new method that will loop through all of the Input Manager Pointer instances and reset them all. This is useful if a 3rd party component, such as Vue, has stolen input from Phaser and you need to reset its input state again.
* `Pointer.reset` is a new method that will reset a Pointer instance back to its 'factory' settings.
* The `KeyboardPlugin.removeKey` method has a new optional parameter `removeCapture`. This will remove any keyboard capture events for the given Key. Fix #5693 (thanks @cyantree)
* The `KeyboardPlugin.removeAllKeys` method has a new optional parameter `removeCapture`. This will remove any keyboard capture events for all of the Keys owned by the plugin.
* `Scenes.Systems.canInput` is a new internal method that determines if a Scene can receive Input events, or not. This is now used by the `InputPlugin` instead of the previous `isActive` test. This allows a Scene to emit and handle input events even when it is running `init` or `preload`. Previously, it could only do this after `create` had finished running. Fix #6123 (thanks @yaasinhamidi)

## Input System Updates

* The `hitArea` parameter of the `GameObjects.Zone.setDropZone` method is now optional and if not given it will try to create a hit area based on the size of the Zone Game Object (thanks @rexrainbow)
* The Gamepad objects now have full TypeScript definitions thanks to @sylvainpolletvillard
* `TouchManager.onTouchOver` and `onTouchOut` have been removed, along with all of their related event calls as they're not used by any browser any more.
* `TouchManager.isTop` is a new property, copied from the MouseManager, that retains if the window the touch is interacting with is the top one, or not.
* The `InputManager.onTouchMove` method will now check if the changed touch is over the canvas, or not, via the DOM `elementFromPoint` function. This means if the touch leaves the canvas, it will now trigger the `GAME_OUT` and `GAME_OVER` events, where-as before this would only happen for a Mouse. If the touch isn't over the canvas, no Pointer touch move happens, just like with the mouse. Fix #5592 (thanks @rexrainbow)
* The right-click context menu used to be disabled on the document.body via the `disableContextMenu` function, but instead now uses the MouseManager / TouchManager targets, which if not specified defaults to the game canvas (thanks @lukashass)
* The `Key.reset` method no longer resets the `Key.enabled` or `Key.preventDefault` booleans back to `true` again, but only resets the state of the Key. Fix #6098 (thanks @descodifica)
* When setting the Input Debug Hit Area color it was previously fixed to the value given when created. The value is now taken from the object directly, meaning you can set `gameObject.hitAreaDebug.strokeColor` in real-time (thanks @spayton)
* If defined, the width and height of an input hit area will now be changed if the Frame of a Game Object changes. Fix #6144 (thanks @rexrainbow)

## Input System Bug Fixes

* When a Game Object had Input Debug Enabled the debug image would be incorrectly offset if the Game Object was attached to was scaled and the hit area shape was smaller, or offset, from the Game Object. Fix #4905 #6317 (thanks @PavelMishin @justinlueders)
* When calling `InputPlugin.clear` it will now call `removeDebug` on the Game Object, making sure it clears up any Input Debug Graphics left in the Scene. Fix #6137 (thanks @spayton)
* The `Input.Touch.TouchManager.stopListeners` forgot to remove the `touchcancel` handler. This is now removed correctly (thanks @teng-z)
* When the Pointer moves out of the canvas and is released it would trigger `Uncaught TypeError: Cannot read properties of undefined (reading 'renderList')` if multiple children existed in the pointer-out array. Fix #5867 #5699 (thanks @rexrainbow @lyger)
* If the Input Target in the game config was a string, it wouldn't be correctly parsed by the Touch Manager.
* `InputPlugin.disable` will now also reset the drag state of the Game Object as well as remove it from all of the internal temporary arrays. This fixes issues where if you disabled a Game Object for input during an input event it would still remain in the temporary internal arrays. This method now also returns the Input Plugin, to match `enable`. Fix #5828 (thank @natureofcode @thewaver)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
