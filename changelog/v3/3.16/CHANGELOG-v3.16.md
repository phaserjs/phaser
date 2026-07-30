# Phaser 3 Change Log

## Version 3.16.0 / 3.16.1 - Ishikawa - 5th February 2019

Phaser 3.16 is a massive update. The single largest in the history of Phaser 3 and it contains _breaking changes_. If you're upgrading from an earlier version please do check the log entries below.

Please note: there is no difference between 3.16.0 and 3.16.1. The version bump was just to get around a stupid npm semver policy.

### Important Namespace Changes

* The `Phaser.Boot` namespace has been renamed to `Phaser.Core`. As a result, the `boot` folder has been renamed to `core`. This  impacts the `TimeStep` class and `VisibilityHandler` function, which have been moved to be under the new namespace.
* The `Phaser.Animations` namespace was incorrectly exposed in the Phaser entrypoints as `Animation` (note the lack of plural). This means that if you are creating any custom classes that extend Animation objects using the Phaser namespace, then please update them from `Phaser.Animation` to `Phaser.Animations`, i.e. `Phaser.Animation.AnimationFrame` to `Phaser.Animations.AnimationFrame`. This doesn't impact you if you created animations directly via the Animation Manager.
* The keyed Data Manager change data event string has changed from `changedata_` to `changedata-` to keep it consistent with other keyed events. Note the change from `_` to `-`.
* The Keyboard Plugin `keydown` dynamic event string has changed from `keydown_` to `keydown-` to keep it consistent with other keyed events. Note the change from `_` to `-`.
* The Keyboard Plugin `keyup` dynamic event string has changed from `keyup_` to `keyup-` to keep it consistent with other keyed events. Note the change from `_` to `-`.
* The `texturesready` event emitted by the Texture Manager has been renamed to `ready`.
* The `loadcomplete` event emitted by the Loader Plugin has been renamed to `postprocess` to be reflect what it's used for.
* Game Objects used to emit a `collide` event if they had an Arcade Physics Body with `onCollide` set, that collided with a Tile. This has changed. The event has been renamed to `tilecollide` and you should now listen for this event from the Arcade Physics World itself: `this.physics.world.on('tilecollide')`. Game Objects no longer emit this event.
* Game Objects used to emit an `overlap` event if they had an Arcade Physics Body with `onOverlap` set, that overlapped with a Tile. This has changed. The event has been renamed to `tileoverlap` and you should now listen for this event from the Arcade Physics World itself: `this.physics.world.on('tileoverlap')`. Game Objects no longer emit this event.
* The function `Phaser.Physics.Impact.SeperateX` has been renamed to `SeparateX` to correct the spelling mistake.
* The function `Phaser.Physics.Impact.SeperateY` has been renamed to `SeparateY` to correct the spelling mistake.
* The `ended` event in `WebAudioSound` has been renamed to `complete` to make it more consistent with the rest of the API.
* The `ended` event in `HTML5AudioSound` has been renamed to `complete` to make it more consistent with the rest of the API.
* The `Phaser.Utils.Objects` namespace was incorrectly exposed in the Phaser entrypoints as `Object` (note the lack of plural), this has now been fixed so all associated functions are properly namespaced.
* `Phaser.GameObjects.Blitter.Bob` has been renamed to `Phaser.GameObjects.Bob` to avoid namespace conflicts in TypeScript.
* `Phaser.GameObjects.Text.TextStyle` has been renamed to `Phaser.GameObjects.TextStyle` to avoid namespace conflicts in TypeScript.

### Important Changes to the Input System

In Phaser 3.15 and earlier the Input system worked using an event queue. All native DOM input events, such as from the Mouse, Touch or Keyboard, were picked up by event handlers and stored in a queue within the Input Manager. This queue was then processed during the next game step, all the events were dealt with and then it was cleared, ready to receive more events. As they were processed, the internal Phaser events such as `pointerdown` or `keyup` were dispatched to your game code.

This worked fine in that you were able to guarantee _exactly_ when the events would arrive, because it was always at the same time in the game step. However, it had the side effect of you not being able to do things like open external browser windows, or go into Full Screen mode, during your event handlers - because they weren't "real" events, so didn't pass the browser security checks. To this end, methods like `addUpCallback` were added to try and provide this support (although it was never possible for keyboard events).

In 3.16 this has changed. The DOM Events now trigger the respective internal events immediately, in the same invocation. So if you click on the canvas, the `pointerdown` event you receive in your game is still part of the 'native' event handler, so you're now free to do things like go into full screen mode, or open external windows, without any browser warnings or work-arounds.

It does, however, mean that the point at which these handlers are called is no longer always consistent, and is no longer bound to the speed of the Request Animation Frame update. We've tested as much as possible, and so far, things carry on working as before. We've noticed a slight increase in responsiveness, due to the removal of the fractional delay in processing the events, which feels good. However, if for whatever reason this change has broken your game then you're able to easily switch back to the previous version. In your Game Config, create an `input` object and give it the property `queue: true`. This will tell Phaser to use the legacy event queue system.

Please note that we _will_ remove this legacy system in the near future. So, please try and adapt your games to use the new system. If you've found an edge-case where something breaks because of it, please report it so we can look into it.

As a result of this change, the following are now deprecated:

* `InputPlugin.addUpCallback` method.
* `InputPlugin.addDownCallback` method.
* `InputPlugin.addMoveCallback` method.
* `InputManager.queue` property.
* `InputManager.domCallbacks` property.
* `InputManager._hasUpCallback` property.
* `InputManager._hasDownCallback` property.
* `InputManager._hasMoveCallback` property.
* `InputManager.processDomCallbacks` method.
* `InputManager.addUpCallback` method.
* `InputManager.addDownCallback` method.
* `InputManager.addMoveCallback` method.

### keydown and keyup changes

Due to unification across the event system, the `keydown_` and `keyup_` dynamic event strings have changed.

* In all cases the `keydown_KEY` event name has changed to `keydown-KEY`. Note the change from an underscore to a hyphen.
* In all cases the `keyup_KEY` event name has changed to `keyup-KEY`. Note the change from an underscore to a hyphen.

You should update your game code accordingly.

### Keyboard Input - New Features

The specificity of the Keyboard events has been changed to allow you more control over event handling. Previously, the Keyboard Plugin would emit the global `keydown-CODE` event first (where CODE was a keycode string, like `keydown-A`), then it would emit the global `keydown` event. In previous versions, `Key` objects, created via `this.input.keyboard.addKey()`, didn't emit events.

The `Key` class now extends EventEmitter and emits two new events directly: `down` and `up`. This means you can listen for an event from a Key you've created, i.e.: `yourKey.on('up', handler)`.

The order has also now changed. If it exists, the Key object will dispatch its `down` event first. Then the Keyboard Plugin will dispatch `keydown_CODE` and finally the least specific of them all, `keydown` will be dispatched.

You also now have the ability to cancel this at any stage either on a local or global level. All event handlers are sent an event object which you can call `event.stopImmediatePropagation()` on. This will immediately stop any further listeners from being invoked in the current Scene. Therefore, if you call `stopImmediatePropagation()` in the `Key.on` handler, then the Keyboard Plugin will not emit either the `keydown-CODE` or `keydown` global events. You can also call `stopImmediatePropagation()` during the `keydown-CODE` handler, to stop it reaching the global `keydown` handler. As `keydown` is last, calling it there has no effect. 

There is also the `stopPropagation()` function. This works in the same way as `stopImmediatePropagation` but instead of being local, it works across all of the Scenes in your game. For example, if you had 3 active Scenes (A, B and C, with A at the top of the Scene list), all listening for the same key, calling `stopPropagation()` in Scene A would stop the event from reaching any handlers in Scenes B or C. Remember that events flow down the Scene list from top to bottom. So, the top-most rendering Scene in the Scene list has priority over any Scene below it.

All the above also works for `keyup` events.

New in 3.16 is the ability to receive a global `keydown` or `keyup` event from any key on the keyboard. Previously, it would only emit the event if it came from one of the keys listed in the KeyCodes file. Now, those global events will fire for any key, regardless of location.

#### Keyboard Captures

Key capturing is the way in which you stop a keyboard DOM event from activating anything else in the browser by calling `preventDefault` on it. For example, in tall web pages, pressing the SPACE BAR causes the page to scroll down. Obviously, if this is also the fire or jump button in your game, you don't want this to happen. So the key needs to be 'captured' to prevent it. Equally, you may wish to also capture the arrow keys, for similar reasons. Key capturing is done on a global level. If you set-up the capture of a key in one Scene, it will be captured globally across the whole game.

In 3.16 you now do this using the new `KeyboardPlugin.addCapture` method. This takes keycodes as its argument. You can either pass in a single key code (i.e. 32 for the Space Bar), an array of key codes, or a comma-delimited string - in which case the string is parsed and each code it can work out is captured.

To remove a capture you can use the `KeyboardPlugin.removeCapture` method, which takes the same style arguments as adding captures. To clear all captures call `KeyboardPlugin.clearCaptures`. Again, remember that these actions are global.

You can also temporarily enable and disable capturing using `KeyboardPlugin.enableGlobalCapture` and `KeyboardPlugin.disableGlobalCapture`. This means if you set-up a bunch of key captures, but then need to disable them all for a while (perhaps you swap focus to a DOM text field), you can call `disableGlobalCapture` to do this, and when finished in the DOM you can enable captures again with `enableGlobalCapture`, without having to clear and re-create them all.

Default captures can be defined in the Game Config in the `input.keyboard.captures` object. The captures are actually stored in the `KeyboardManager` class. The `KeyboardPlugin` is just a proxy to methods in the Keyboard Manager, but is how you should interface with it.

* `KeyboardPlugin.addCapture` is a new method that allows you to define a set of keycodes to have the default browser behaviors disabled on.
* `KeyboardPlugin.removeCapture` is a new method that removes specific previously set key captures.
* `KeyboardPlugin.clearCaptures` is a new method that removes all key captures.
* `KeyboardPlugin.getCaptures` is a new method that returns an array of all current key captures.
* `KeyboardPlugin.enableGlobalCapture` is a new method that enables any key captures that have been created.
* `KeyboardPlugin.disableGlobalCapture` is a new method that disables any key captures that have been created, without removing them from the captures list.
* `KeyboardPlugin.addKey` has a new boolean argument `enableCapture`, which is true by default, that will add a key capture for the Key being created.
* `KeyboardPlugin.addKeys` has a new boolean argument `enableCapture`, which is true by default, that will add a key capture for any Key created by the method.

#### Other Keyboard Updates and Fixes

* There is a new class called `KeyboardManager`. This class is created by the global Input Manager if keyboard access has been enabled in the Game config. It's responsible for handling all browser keyboard events. Previously, the `KeyboardPlugin` did this which meant that every Scene that had its own Keyboard Plugin was binding more native keyboard events. This was causing problems with parallel Scenes when needing to capture keys. the `KeyboardPlugin` class still exists, and is still the main point of interface when you call `this.input.keyboard` in a Scene, but DOM event handling responsibility has been taken away from it. This means there's now only 
one set of bindings ever created, which makes things a lot cleaner.
* There is a new Game and Scene Config setting `input.keyboard.capture` which is an array of KeyCodes that the Keyboard Plugin will capture all non-modified key events on. By default it is empty. You can populate it in the config, or use the new capture methods.
* The Keyboard Manager will now call `preventDefault` only on non-modified key presses, stopping the keyboard event from hitting the browser. Previously, capturing the R key, for example, would block a CTRL+R page reload, but it now ignores it because of the key modifier.
* If the browser Window loses focus, either from switching to another app, or another tab, all active Keys will be reset. This prevents issues with keys still reporting as being held down after leaving the game and returning to it again. Fix #4134 (thanks @Simplonium)
* `Key.emitOnRepeat` is a new boolean property that controls if the Key will continuously emit a `down` event while being held down (true), or emit the event just once, on first press, and then skip future events (false).
* `Key.setEmitOnRepeat` is a new chainable method for setting the `emitOnRepeat` property.
* The `KeyboardPlugin.addKeys` method has a new optional boolean `emitOnRepeat` which sets that property on all Key objects it creates as part of the call. It defaults to `false`.
* The `KeyboardPlugin.addKey` method has a new optional boolean `emitOnRepeat` which sets that property on the Key object it creates. It defaults to `false`.
* The `Key` class now extends EventEmitter and emits two events directly: `down` and `up`. This means you can listen for an event from a Key you've created, i.e.: `yourKey.on('up', handler)`.
* The following Key Codes have been added, which include some missing alphabet letters in Persian and Arabic: `SEMICOLON_FIREFOX`, `COLON`, `COMMA_FIREFOX_WINDOWS`, `COMMA_FIREFOX`, `BRACKET_RIGHT_FIREFOX` and `BRACKET_LEFT_FIREFOX` (thanks @wmateam)
* `Key.onDown` is a new method that handles the Key being pressed down, including down repeats.
* `Key.onUp` is a new method that handles the Key being released.
* `Key.destroy` is a new method that handles Key instance destruction. It is called automatically in `KeyboardPlugin.destroy`.
* The `Key.preventDefault` property has been removed. This is now handled by the global keyboard capture methods.
* `Key.metaKey` is a new boolean property which indicates if the Meta Key was held down when the Key was pressed. On a Mac the Meta Key is Command. On a Windows keyboard, it's the Windows key.
* `InputManager.keyboard` is a new property that instantiates the global Keyboard Manager, if enabled in the game config.
* The `KeyboardPlugin.addKey` method has a new boolean property `enableCapture` which automatically prevents default on the Key being created.
* The `KeyboardPlugin.addKeys` method has a new boolean property `enableCapture` which automatically prevents default on Keys being created.
* `Phaser.Input.Keyboard.ProcessKeyDown` has been removed as it's no longer required, `Key.onDown` handles it instead.
* `Phaser.Input.Keyboard.ProcessKeyUp` has been removed as it's no longer required, `Key.onUp` handles it instead.
* The Keyboard Manager has a property called `captures` which is an array of keycodes, as populated by the Game Config. Any key code in the array will have `preventDefault` called on it if pressed.
* `KeyboardPlugin.manager` is a new property that references the Keyboard Manager and is used internally.
* `KeyboardPlugin.target` has been removed as it's no longer used by the class.
* `KeyboardPlugin.queue` has been removed as it's no longer used by the class.
* `KeyboardPlugin.onKeyHandler` has been removed as it's no longer used by the class.
* `KeyboardPlugin.startListeners` has been removed as it's no longer used by the class.
* `KeyboardPlugin.stopListeners` has been removed as it's no longer used by the class.

### Mouse and Touch Input - New Features, Updates and Fixes

* The Mouse Manager class has been updated to remove some commented out code and refine the `startListeners` method.
* When enabling a Game Object for input it will now use the `width` and `height` properties of the Game Object first, falling back to the frame size if not found. This stops a bug when enabling BitmapText objects for input and it using the font texture as the hit area size, rather than the text itself.
* `Pointer.smoothFactor` is a float-value that allows you to automatically apply smoothing to the Pointer position as it moves. This is ideal when you want something smoothly tracking a pointer in a game, or are need a smooth drawing motion for an art package. The default value is zero, meaning disabled. Set to a small number, such as 0.2, to enable.
* `Config.inputSmoothFactor` is a new property that allows you to set the smoothing factor for all Pointers the game creates. The default value is zero, which is disabled. Set in the game config as `input: { smoothFactor: value }`.
* `InputManager.transformPointer` has a new boolean argument `wasMove`, which controls if the pointer is being transformed after a move or up/down event.
* `Pointer.velocity` is a new Vector2 that contains the velocity of the Pointer, based on the current and previous positions. The velocity is smoothed out each frame according to the `Pointer.motionFactor` property. This is done for more accurate gesture recognition. The velocity is updated based on Pointer movement and doesn't require a button to be pressed first.
* `Pointer.angle` is a new property that contains the angle of the Pointer, in radians, based on the current and previous positions. The angle is smoothed out each frame according to the `Pointer.motionFactor` property. This is done for more accurate gesture recognition. The angle is updated based on Pointer movement and doesn't require a button to be pressed first.
* `Pointer.distance` is a new property that contains the distance of the Pointer, in radians, based on the current and previous positions. The distance is smoothed out each frame according to the `Pointer.motionFactor` property. This is done for more accurate gesture recognition. The distance is updated based on Pointer movement and doesn't require a button to be pressed first.
* `Pointer.motionFactor` is a new property that controls how much smoothing to apply to the Pointer positions each frame. This value is passed to the Smooth Step Interpolation that is used to calculate the velocity, angle and distance of the Pointer. It's applied every frame until the midPoint reaches the current position of the Pointer. The default value is 0.2.
* The Input Plugin was emitting a `preUpdate` event, with the capital U, instead of `preupdate`. This has now been corrected. Fix #4185 (thanks @gadelan)
* `Pointer.updateMotion` is a new method that is called automatically, each step, by the Input Manager. It's responsible for calculating the Pointer velocity, angle and distance properties.
* `Pointer.time` is a new property that holds the time the Pointer was last updated by the Game step.
* `Pointer.getDistance` has been updated. If called while a button is being held down, it will return the distance between the Pointer's current position and it's down position. If called when a Pointer doesn't have a button down, it will return the historic distance between the up and down positions.
* `Pointer.getDistanceX` is a new method that will return the horizontal distance between the Pointer's previous and current coordinates. If called while a button is being held down, it will return the distance between the Pointer's current position and it's down position. If called when a Pointer doesn't have a button down, it will return the historic distance between the up and down positions.
* `Pointer.getDistanceY` is a new method that will return the horizontal distance between the Pointer's previous and current coordinates. If called while a button is being held down, it will return the distance between the Pointer's current position and it's down position. If called when a Pointer doesn't have a button down, it will return the historic distance between the up and down positions.
* `Pointer.getDuration` is a new method that will return the duration the Pointer was held down for. If the Pointer has a button pressed down at the time this method is called, it will return the duration since the Pointer's button was pressed down. If no button is held down, it will return the last recorded duration, based on the time the Pointer button was released.
* `Pointer.getAngle` is a new method that will return the angle between the Pointer coordinates. If the Pointer has a button pressed down at the time this method is called, it will return the angle between the Pointer's `downX` and `downY` values and the current position. If no button is held down, it will return the last recorded angle, based on where the Pointer was when the button was released.
* In previous versions, the VisibilityHandler would create a `mousedown` listener for the game canvas and then call `window.focus` when detected (assuming the game config `autoFocus` property was `true`). Responsibility for this has now been moved to the Mouse Manager `onMouseDown` handler.
* In previous versions, the VisibilityHandler would create a `mouseout` listener for the game canvas and then set `game.isOver` when detected. Responsibility for this has now been moved to the Mouse Manager, which sets the new Input Manager `isOver` property directly.
* In previous versions, the VisibilityHandler would create a `mouseover` listener for the game canvas and then set `game.isOver` when detected. Responsibility for this has now been moved to the Mouse Manager, which sets the new Input Manager `isOver` property directly.
* The `Phaser.Game.isOver` property has been moved. You can now find it in the Input Manager and it's also accessible via the Input Plugin, which means you can do `this.input.isOver` from within a Scene. This makes more sense as it's input related and not a game level property.
* The Input Plugin has a new event you can listen to: `gameover`, which is triggered whenever the mouse or a pointer is moved over the Game canvas. Listen to it with  `this.input.on('gameover')` from within a Scene.
* The Input Plugin has a new event you can listen to: `gameout`, which is triggered whenever the mouse or a pointer leaves the Game canvas. Listen to it with  `this.input.on('gameout')` from within a Scene.
* The Game used to emit a `mouseover` event when the mouse entered the game canvas. This is no longer emitted by the Game itself and can instead be listened for using the new Input Plugin event `gameover`.
* The Game used to emit a `mouseout` event when the mouse left the game canvas. This is no longer emitted by the Game itself and can instead be listened for using the new Input Plugin event `gameout`.
* If the `window` object exists (which it will in normal browser environments) new `mouseup` and `touchend` event listeners are bound to it and trigger the normal `mouseup` or `touchend` events within the internal input system. This means you will now get a `pointerup` event from the Input Plugin even if the pointer is released outside of the game canvas. Pointers will also no longer think they are still 'down' if released outside the canvas and then moved inside again in their new state.
* The window will now have focus called on it by the Touch Manager, as well as the Mouse Manager, if the `autoFocus` game config property is enabled.
* The Input Plugin has a new event you can listen to: `pointerdownoutside`, which is triggered whenever the mouse or a pointer is pressed down while outside of the Game canvas. Listen to it with  `this.input.on('pointerdownoutside')` from within a Scene.
* The Input Plugin has a new event you can listen to: `pointerupoutside`, which is triggered whenever the mouse or a pointer is released while outside of the Game canvas. Listen to it with `this.input.on('pointerupoutside')` from within a Scene.
* `Pointer.downElement` is a new property that holds the target of the DOM Event that triggered when the Pointer was pressed down. If this is within the game, this will be the game canvas element.
* `Pointer.upElement` is a new property that holds the target of the DOM Event that triggered when the Pointer was released. If this is within the game, this will be the game canvas element.
* The `Pointer.dragState` property has been removed. This is no longer used internally as it has to be tracked per Scene, not on a global level.
* `InputPlugin.setDragState` is a new internal method that sets the drag state for the given Pointer.
* `InputPlugin.getDragState` is a new internal method that gets the drag state for the given Pointer.
* Draggable Game Objects would not work if you had multiple Scenes running in parallel, with draggable objects in both of them. Only the top-most Scene would work fully. Items in the bottom Scene would never finish their drag cycle, causing them to get stuck. Fix #4249 #4278 (thanks @probt @iArePJ)
* `Pointer.leftButtonDown` will now return an actual boolean, rather than the result of the bitwise op (which still evaluated as a boolean, but this is cleaner).
* `Pointer.rightButtonDown` will now return an actual boolean, rather than the result of the bitwise op (which still evaluated as a boolean, but this is cleaner).
* `Pointer.middleButtonDown` will now return an actual boolean, rather than the result of the bitwise op (which still evaluated as a boolean, but this is cleaner).
* `Pointer.backButtonDown` will now return an actual boolean, rather than the result of the bitwise op (which still evaluated as a boolean, but this is cleaner).
* `Pointer.forwardButtonDown` will now return an actual boolean, rather than the result of the bitwise op (which still evaluated as a boolean, but this is cleaner).
* `Pointer.up`, `Pointer.move` and `Pointer.down` now use `in` to check for the existance of the `buttons` property on the event, causing it to be set even if equal to zero, which it is when there are no buttons down. This also fixes an issue where the buttons didn't update during a move event (thanks @SonnyCampbell @rexrainbow)

### Changes as a result of the new Scale Manager

3.16 introduces the completed Scale Manager. This is fully documented, but the class, all methods and all properties. It also includes a folder full of examples in the Phaser Labs, so you're strongly recommended to start there.

* If you set the Game Config property `zoom` to be > 1 then it will automatically enable `pixelArt` mode, unless you set `pixelArt: false` in the config.
* There is a new property in the Game Config called `autoRound`, which controls if the canvas size and style sizes are passed through Math.floor or not. On some devices this can help with performance and anti-aliasing. The default is `false` (turned off).
* The Game Config property `autoResize` has been removed as it's now redundant.
* The WebGL and Canvas Renderers no longer change the Canvas size in their `resize` methods. They just update internal properties.
* The WebGL and Canvas Renderers now read the `width`, `height` and `resolution` values from the Scale Manager, not the Game Config.
* `CameraManager.baseScale` property has been removed as it's no longer used anywhere.
* The BaseCamera and Camera `preRender` methods now only take a resolution argument and use it internally for their transforms.
* `InputManager.scaleManager` is a new property that is a reference to the Scale Manager. This is populated in the `boot` method.
* The `InputManager.transformX` method has been removed. This is now available in the ScaleManager.
* The `InputManager.transformY` method has been removed. This is now available in the ScaleManager.
* The `InputManager.scale` property has been removed. This is now available in the ScaleManager under `displayScale`.
* The `InputManager.resize` method has been removed as this process is now handled by the ScaleManager.
* The `InputManager.bounds` property has been removed as this process is now handled by the ScaleManager.
* The `InputManager.updateBounds` method has been removed as this process is now handled by the ScaleManager.
* The `InputManager.getOffsetX` method has been removed as it's no longer required.
* The `InputManager.getOffsetY` method has been removed as it's no longer required.
* The `InputManager.getScaleX` method has been removed as it's no longer required.
* The `InputManager.getScaleY` method has been removed as it's no longer required.
* The `SceneManager.resize` method has been removed as it's no longer required.
* The `Scene.Systems.resize` method has been removed as it's no longer required.
* Scenes will no longer dispatch the `resize` event. You should now listen for this event from the Scale Manager instead.
* `BaseCamera.config` has been removed as it's no longer required.
* `BaseCamera.scaleManager` is a new property that references the Scale Manager and is used internally for size checks.
* The `Game.resize` method has been removed as it's no longer required. You should now call `ScaleManager.resize` instead.
* The Game will no longer dispatch the `resize` event. You should now listen for this event from the Scale Manager instead.

### Facebook Instant Games Updates and Fixes

* Added the `Leaderboard.getConnectedScores` method, to get a list of scores from player connected entries.
* The `loadPlayerPhoto` function in the Instant Games plugin now listens for the updated Loader event correctly, causing the `photocomplete` event to fire properly.
* `Leaderboard.setScore` now emits the LeaderboardScore object with the `setscore` event, as the documentation said it did.
* `Leaderboard.getPlayerScore` now only populates the `playerScore` property if the entry isn't `null`.
* If the `setScore` or `getPlayerScore` calls fail, it will return `null` as the score instance, instead of causing a run-time error.
* You can now pass an object or a string to `setScore` and objects will be automatically stringified.
* The `preloadAds` method will now only create an AdInstance object if the interstitial `loadSync` promise resolves.
* The `preloadVideoAds` method will now only create an AdInstance object if the interstitial `loadSync` promise resolves.
* The `preloadAds` method will now emit the `adsnofill` event, if there are no ads in the inventory to load.
* The `preloadVideoAds` method will now emit the `adsnofill` event, if there are no ads in the inventory to load.
* The `showAd` method will now emit the `adsnotloaded` event, if there are no ads loaded matching the given Placement ID.
* The `showVideo` method will now emit the `adsnotloaded` event, if there are no ads loaded matching the given Placement ID.
* Showing an ad will emit the `adfinished` event when the ad is closed, previously this event was called `showad` but the new name better reflects what has happened.
* The Facebook Plugin is now available in the `Phaser.Scene` class template under the `facebook` property (thanks @bryanwood)
* Fixed the `Leaderboard.getScores` method to now take the arguments into account. Fix #4271 (thanks @Oramy)
* Fixed an API validation error in the `chooseContext` method. Fix #4248 (thanks @yadurajiv)

### New Features

* You can now load external Scene files using the new `load.sceneFile` method. This allows you to dynamically load a Scene into the Scene Manager of your game, and swap to it at will. Please see the documentation and examples for further details.
* The data object being sent to the Dynamic Bitmap Text callback now has a new property `parent`, which is a reference to the Bitmap Text instance that owns the data object (thanks ornyth)
* The WebGL Renderer has a new method `clearPipeline`, which will clear down the current pipeline and reset the blend mode, ready for the context to be passed to a 3rd party library.
* The WebGL Renderer has a new method `rebindPipeline`, which will rebind the given pipeline instance, reset the blank texture and reset the blend mode. This is useful for recovering from 3rd party libs that have modified the gl context.
* Game Objects have a new property called `state`. Use this to track the state of a Game Object during its lifetime. For example, it could move from a state of 'moving', to 'attacking', to 'dead'. Phaser itself will never set this property, although plugins are allowed to.
* Game Objects have a new method called `setState` which will set the state property in a chainable call.
* `BlendModes.ERASE` is a new blend mode that will erase the object being drawn. When used in conjunction with a Render Texture it allows for effects that require you to erase parts of the texture, in either Canvas or WebGL. When used with a transparent game canvas, it allows you to erase parts of the canvas, showing the web page background through.
* `BlendModes.SOURCE_IN` is a new Canvas-only blend mode that allows you to use the `source-in` composite operation when rendering Game Objects.
* `BlendModes.SOURCE_OUT` is a new Canvas-only blend mode that allows you to use the `source-out` composite operation when rendering Game Objects.
* `BlendModes.SOURCE_ATOP` is a new Canvas-only blend mode that allows you to use the `source-atop` composite operation when rendering Game Objects.
* `BlendModes.DESTINATION_OVER` is a new Canvas-only blend mode that allows you to use the `destination-over` composite operation when rendering Game Objects.
* `BlendModes.DESTINATION_IN` is a new Canvas-only blend mode that allows you to use the `destination-in` composite operation when rendering Game Objects.
* `BlendModes.DESTINATION_OUT` is a new Canvas-only blend mode that allows you to use the `destination-out` composite operation when rendering Game Objects.
* `BlendModes.DESTINATION_ATOP` is a new Canvas-only blend mode that allows you to use the `destination-atop` composite operation when rendering Game Objects.
* `BlendModes.LIGHTER` is a new Canvas-only blend mode that allows you to use the `lighter` composite operation when rendering Game Objects.
* `BlendModes.COPY` is a new Canvas-only blend mode that allows you to use the `copy` composite operation when rendering Game Objects.
* `BlendModes.XOR` is a new Canvas-only blend mode that allows you to use the `xor` composite operation when rendering Game Objects.
* `RenderTexture.erase` is a new method that will take an object, or array of objects, and draw them to the Render Texture using an ERASE blend mode, resulting in them being removed from the Render Texture. This is really handy for making a bitmap masked texture in Canvas or WebGL (without using an actual mask), or for 'cutting away' part of a texture.
* There is a new boolean Game Config property called `customEnvironment`. If set to `true` it will skip the internal Feature checks when working out which type of renderer to create, allowing you to run Phaser under non-native web environments. If using this value, you _must_ set an explicit `renderType` of either CANVAS or WEBGL. It cannot be left as AUTO. Fix #4166 (thanks @jcyuan)
* `Animation.nextFrame` will advance an animation to the next frame in the sequence instantly, regardless of the animation time or state. You can call this on a Sprite: `sprite.anims.nextFrame()` (thanks rgk25)
* `Animation.previousFrame` will set an animation to the previous frame in the sequence instantly, regardless of the animation time or state. You can call this on a Sprite: `sprite.anims.previousFrame()` (thanks rgk25)
* `Geom.Intersects.PointToLine` has a new optional argument `lineThickness` (which defaults to 1). This allows you to determine if the point intersects a line of a given thickness, where the line-ends are circular (not square).
* `Geom.Line.GetNearestPoint` is a new static method that will return the nearest point on a line to the given point.
* `Geom.Line.GetShortestDistance` is a new static method that will return the shortest distance from a line to the given point.
* `Camera.getBounds` is a new method that will return a rectangle containing the bounds of the camera.
* `Camera.centerOnX` will move the camera horizontally to be centered on the given coordinate without changing its vertical placement.
* `Camera.centerOnY` will move the camera vertically to be centered on the given coordinate without changing its horizontally placement.
* `AnimationManager.exists` is a new method that will check to see if an Animation using the given key already exists or not and returns a boolean.
* `animationstart-key` is a new Animation key specific event emitted by a Game Object. For example, if you had an animation with a key of 'explode' you can now listen for `animationstart-explode`.
* `animationrestart-key` is a new Animation key specific event emitted by a Game Object. For example, if you had an animation with a key of 'explode' you can now listen for `animationrestart-explode`.
* `animationcomplete-key` is a new Animation key specific event emitted by a Game Object. For example, if you had an animation with a key of 'explode' you can now listen for `animationcomplete-explode`.
* `animationupdate-key` is a new Animation key specific event emitted by a Game Object. For example, if you had an animation with a key of 'explode' you can now listen for `animationupdate-explode`.
* The Animation class now extends the Event Emitter and dispatches events itself. This allows you to listen for events from a specific Animation, rather than via a Game Object. This is handy, for example, if you had an explosion animation that you wanted to trigger a sound effect when it started. You can now listen for the events from the Animation object directly.
* The Animation class now emits the `start` event when played (either forward, or in reverse) by any Game Object.
* The Animation class now emits the `restart` event when it restarts playing on any Game Object.
* The Animation class now emits the `complete` event when it finishes playing on any Game Object.
* The Animation Component has a new method called `chain` which allows you to line-up another animation to start playing as soon as the current one stops, no matter how it stops (either by reaching its natural end, or directly by having stop called on it). You can chain a new animation at any point, including before the current one starts playing, during it, or when it ends (via its `animationcomplete` callback). Chained animations are specific to a Game Object, meaning different Game Objects can have different chained animations without impacting the global animation they're playing.
* `CanvasTexture.drawFrame` is a new method that allows you to draw a texture frame to the CanvasTexture based on the texture key and frame given.
* `CanvasTexture.getIndex` is a new method that will take an x/y coordinate and return the Image Data index offset used to retrieve the pixel values.
* `CanvasTexture.getPixels` is a new method that will take a region as an x/y and width/height and return all of the pixels in that region from the CanvasTexture.
* `CanvasTexture.setPixel` is a new method that sets the given pixel in the CanvasTexture to the color and alpha values provided.
* `CanvasTexture.getData` is a new method that will extract an ImageData block from the CanvasTexture from the region given.
* `CanvasTexture.putData` is a new method that will put an ImageData block at the given coordinates in a CanvasTexture.
* `Line.Extend` is a new static function that allows you extend the start and/or end points of a Line by the given amounts.
* `Vector2.LEFT` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector2.RIGHT` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector2.UP` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector2.DOWN` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector2.ONE` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector3.ZERO` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector3.LEFT` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector3.RIGHT` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector3.UP` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector3.DOWN` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector3.FORWARD` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector3.BACK` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* `Vector3.ONE` is a new constant that can be used in Vector comparison operations (thanks @Aedalus)
* Geometery Mask has a new property called `invertAlpha` in WebGL, which works in the same way as the flag on the Bitmap Mask and allows you to invert the function of the stencil buffer, i.e. non-drawn shapes become invisible, and drawn shapes visible (thanks @tfelix)
* The Arcade Physics Body has a new property `maxSpeed` which limits the vector length of the Body velocity. You can set it via the method `setMaxSpeed` and it is applied in the `World.computeVelocity` method (thanks @Edwin222 @rexrainbow)
* `WebGLRenderer.snapshotArea` is a new method that allows you to grab an image of the given region of the canvas during the post-render step and have it sent to your defined callback. This is the same as `snapshot` except you control the area being grabbed, so is more efficient if you only need a smaller area.
* `WebGLRenderer.snapshotPixel` is a new method that allows you to grab a single pixel from the game canvas, post-render. It returns the result as a `Color` object to your specified callback.
* `CanvasRenderer.snapshotArea` is a new method that allows you to grab an image of the given region of the canvas during the post-render step and have it sent to your defined callback. This is the same as `snapshot` except you control the area being grabbed, so is more efficient if you only need a smaller area.
* `CanvasRenderer.snapshotPixel` is a new method that allows you to grab a single pixel from the game canvas, post-render. It returns the result as a `Color` object to your specified callback.
* `SceneManager.getScenes` is a new method that will return all current Scenes being managed by the Scene Manager. You can optionally return only active scenes and reverse the order in which they are returned in the array.
* `DOM.GetTarget` is a new helper function that will return a reference to a DOM Element based on the given string or node.
* `GameObjects.Extern` is a new special type of Game Object that allows you to pass rendering off to a 3rd party. When you create an Extern and place it in the display list of a Scene, the renderer will process the list as usual. When it finds an Extern it will flush the current batch, clear down the pipeline and prepare a transform matrix which your render function can take advantage of, if required. The Extern Game Object is used heavily by the Spine Plugin, but can also be used by other libraries such as three.js, allowing them to render directly into a Phaser game.

### Updates

* You can now modify `this.physics.world.debugGraphic.defaultStrokeWidth` to set the stroke width of any debug drawn body, previously it was always 1 (thanks @samme)
* `TextStyle.setFont` has a new optional argument `updateText` which will sets if the text should be automatically updated or not (thanks @DotTheGreat)
* `ProcessQueue.destroy` now sets the internal `toProcess` counter to zero.
* The `PathFollower.pathRotationVerticalAdjust` property has been removed. It was supposed to flipY a follower when it reversed path direction, but after some testing it appears it has never worked and it's easier to do this using events, so the property and associated config value are removed. The `verticalAdjust` argument from the `setRotateToPath` method has been removed as well.
* The config value `preserveDrawingBuffer` has been removed as it has never been used by the WebGL Renderer.
* `PluginManager.install` returns `null` if the plugin failed to install in all cases.
* `PluginFile` will now install the plugin into the _current_ Scene as long as the `start` or `mapping` arguments are provided.
* MATH_CONST no longer requires or sets the Random Data Generator, this is now done in the Game Config, allowing you to require the math constants without pulling in a whole copy of the RNG with it.
* The Dynamic Bitmap Text Canvas Renderer was creating a new data object every frame for the callback. It now uses the `callbackData` object instead, like the WebGL renderer does.
* `WebGLRenderer.setBlendMode` has a new optional argument `force`, which will force the given blend mode to be set, regardless of the current settings.
* The method `DisplayList.sortGameObjects` has been removed. It has thrown a runtime error since v3.3.0(!) which no-one even spotted which is a good indication of how little the method was used. The display list is automatically sorted anyway, so if you need to sort a small section of it, just use the standard JavaScript Array sort method (thanks ornyth)
* The method `DisplayList.getTopGameObject` has been removed. It has thrown a runtime error since v3.3.0(!) which no-one even spotted which is a good indication of how little the method was used (thanks ornyth)
* `WebGLRenderer.setFramebuffer` has a new optional boolean argument `updateScissor`, which will reset the scissor to match the framebuffer size, or clear it.
* `WebAudioSoundManager.onFocus` will not try to resume the Audio Context if it's still locked.
* `WebAudioSoundManager.onBlur` will not try to suspend the Audio Context if it's still locked.
* When using `ScenePlugin.add`, to add a new Scene to the Scene Manager, it didn't allow you to include the optional Scene data object. You can now pass this in the call (thanks @kainage)
* `Graphics.stroke` is a new alias for the `strokePath` method, to keep the calls consistent with the Canvas Rendering Context API.
* `Graphics.fill` is a new alias for the `fillPath` method, to keep the calls consistent with the Canvas Rendering Context API.
* `LoaderPlugin.sceneManager` is a new property that is a reference to the global Scene Manager, useful for Plugins.
* Whenever `Camera.roundPixels` was enabled it would use a bitwise operation to truncate the float (`x |= 0`) - this has been replaced across all files that used it, with a call to `Math.round` instead. This gives far better results when zooming cameras both in and out of a Scene, stopping thin gaps appearing between closely packed Game Objects.
* `AnimationManager.create` will now return a boolean `false` if the given key is invalid (i.e. undefined or falsey).
* `AnimationManager.create` will no longer raise a console warning if the animation key is already in use. Instead, it will return the animation belonging to that key. A brand new animation will only be created if the key isn't already in use. When this happens, the `add` event is emitted by the Animation Manager. If no event is emitted, the animation already existed.
* `ArcadePhysics.Body.destroy` will now only add itself to the World `pendingDestroy` list if the world property exists. This prevents `Cannot read property 'pendingDestroy' of undefined` errors if you try to delete a physics body in a callback and then immediately change Scene (which tells the physics work to also delete all bodies)
* The Animation Component `restart` method has had is sole `key` argument removed. Previously, you had to pass in the key of the animation you wished to reverse, but now you can just call the method directly, and as long as there is an animation playing, it will automatically start playing in reverse, without the nee for a key (the way it should have been originally)
* `Animation.play` and `playReverse` will now accept either a string-based key of the animation to play (like before), or you can pass in an Animation instance, and it will play that animation.
* `CanvasTexture.clear` now has 4 new optional arguments: `x, y, width, height` which allow you to define the region of the texture to be cleared. If not provided it will clear the whole texture, which is the same behavior as before.
* EarCut, the polygon triangulation library used by the Graphics and WebGL classes, has been upgraded from 2.1.1 to 2.1.4. 2.1.2 fixed a few race conditions where bad input would cause an error. 2.1.3 improved performance for bigger inputs (5-12%) and 2.1.4 fixed a race condition that could lead to a freeze on degenerate input.
* `TextureTintPipeline.batchQuad` and `batchTri` have two new optional arguments `texture` and `unit` which are used to re-set the batch texture should the method cause a batch flush.
* `TextureTintPipeline.requireTextureBatch` is a new internal method that helps speed-up the creation of texture batches. It is used in conjunction with `setTexture2D` and `pushBatch`.
* `TextureTintPipeline.flush` and `TextureTintPipeline.pushBatch` have been optimized to handle zero based texture units as priority. They've also been refactored to avoid creation of empty texture batches.
* The `WebGLRenderer.setTexture2D` method has a new optional argument `flush` which controls if the pipeline is flushed if the given texture is new, or not. This is used internally to skip flushing during an existing flush.
* The Tilemap Layer `width` and `height` properties are now based on the tilemap tile sizes multiplied by the layer dimensions. This corrects an issue with layer sizes being wrong if you called `setBaseTileSize` on a Map.
* The WebGLRenderer will now clear the framebuffer at the start of every render.
* `WebGLRenderer.setScissor` now has a new optional argument `drawingBufferHeight` which allows you to specify the drawing buffer height, rather than use the renderers default value.
* `WebGLRenderer.pushScissor` now has a new optional argument `drawingBufferHeight` which allows you to specify the drawing buffer height, rather than use the renderers default value.
* `WebGLRenderer.preRender` now calls `gl.clearColor` in order to restore the background clear color in case something, like a Render Texture, has changed it.
* `Map.set` will now update an existing value if you provide it with a key that already exists within the Map. Previously, if you tried to set the value of a key that existed it would be skipped.
* `MatterSprite` would set its `type` property to be `Image`. It now sets it to be `Sprite` as it should do.
* `Matter.TileBody.setFromTileCollision` no longer checks if the shape is concave or convex before modifying the vertices, as the update to the Matter.js lib in 3.12 stopped this from working with Tiled collision shapes.
* The Scene `transitionstart` event is now dispatched by the Target Scene of a transition, regardless if the Scene has a `create` method or not. Previously, it was only dispatched if the Scene had a create method.
* The Loader will now allow an XHR status of 0 as success too. Normally only status 200 would be accepted as success, but 0 is returned when a file is loaded from the local filesystem (file://). This happens, for example, when opening the index.html of a game in a browser directly, or when using Cordova on iOS. Fix #3464 (thanks @Ithamar)
* `Tween.restart` now returns the Tween instance (thanks @rexrainbow)
* `Tween.play` now returns the Tween instance (thanks @rexrainbow)
* `Tween.seek` now returns the Tween instance (thanks @rexrainbow)
* `Tween.complete` now returns the Tween instance (thanks @rexrainbow)
* `Tween.stop` now returns the Tween instance (thanks @rexrainbow)
* `List.sort` now has an optional parameter `handler` which allows you to provide your own sort handling function (thanks @jcyuan)
* `Container.sort` now has an optional parameter `handler` which allows you to provide your own sort handling function (thanks @jcyuan)
* The WebGLRenderer method `canvasToTexture` will now only set the filter to be `NEAREST` if `antialias` is disabled in the game config (i.e. when running in pixelArt mode). This means that Text objects, and other Canvas backed textures, now render with anti-aliasing if everything else does. You can disable this on a per-object basis by calling `texture.setFilter(1)` on them.
* `CanvasRenderer.snapshotCallback`, `snapshotType` and `snapshotEncoder` have all been removed as they are no longer required.
* `CanvasRenderer.snapshotState` is a new object that contains the snapshot configuration data, the same as the WebGL Renderer.
* The signature of the `WebGLSnapshot` function has changed. It now takes a Snapshot Configuration object as the second parameter.
* The signature of the `CanvasSnapshot` function has changed. It now takes a Snapshot Configuration object as the second parameter.
* A Tween Timeline will now set it's internal destroy state _before_ calling either the `onComplete` callback or sending the `COMPLETE` event. This means you can now call methods that will change the state of the Timeline, such as `play`, during the callback handlers, where-as before doing this would have had the internal state changed immediately, preventing it (thanks Lucas Knight)
* The `AddToDOM` method has had the `overflowHidden` argument removed. The DOM element the canvas is inserted into no longer has `overflow: hidden` applied to its style. If you wish to have this, please add it directly via CSS.

### Bug Fixes

* The Rectangle Shape object wouldn't render if it didn't have a stroke, or any other objects on the display list (thanks mliko)
* When using a font string instead of setting `fontFamily`, `fontSize` and `fontStyle` in either `Text.setStyle` or `setFont`, the style properties wouldn't get set. This isn't a problem while creating the text object, only if modifying it later (thanks @DotTheGreat)
* `Text.toJSON` wasn't saving the font style when using the "font" shorthand to create it. It now saves it correctly. Fix #4141 (thanks @divillysausages)
* Disabling camera bounds and then moving the camera to an area in a Tilemap that did not have any tile information would throw an `Uncaught Reference error` as it tried to access tiles that did not exist (thanks @Siyalatas)
* Fixed an issue where Sprite Sheets being extracted from a texture atlas would fail if the sheet was either just a single column or single row of sprites. Fix #4096 (thanks @Cirras)
* If you created an Arcade Physics Group without passing a configuration object, and passing an array of non-standard children, it would throw a classType runtime error. It now creates a default config object correctly (thanks @pierpo)
* The `Camera.cull` method has been restructured so it now calculates if a Game Object is correctly in view or not before culling it. Although not used internally, if you need to cull objects for a camera, you can now safely use this method. Fix #4092 (thanks @Cirras)
* The Tiled Parser would ignore animated tile data if it was in the new Tiled 1.2 format. This is now accounted for, as well as 1.0 (thanks @nkholski)
* `Array.Matrix.ReverseRows` was actually reversing the columns, but now reverses the rows.
* `Array.Matrix.ReverseColumns` was actually reversing the rows, but now reverses the columns.
* UnityAtlas now sets the correct file type key if using a config file object.
* Starting with version 3.13 in the Canvas Renderer, it was possible for long-running scripts to start to get bogged-down in `fillRect` calls if the game had a background color set. The context is now saved properly to avoid this. Fix #4056 (thanks @Aveyder)
* Render Textures created larger than the size of the default canvas would be automatically clipped when drawn to in WebGL. They now reset the gl scissor and drawing height property in order to draw to their full size, regardless of the canvas size. Fix #4139 (thanks @chaoyang805 @iamchristopher)
* The `cameraFilter` property of a Game Object will now allow full bitmasks to be set (a value of -1), instead of just those > 0 (thanks @stuartkeith)
* The `PathFollower.startFollow` method now properly uses the `startAt` argument to the method, so you can start a follower off at any point along the path. Fix #3688 (thanks @DannyT @diteix)
* Static Circular Arcade Physics Bodies now render as circles in the debug display instead of showing their rectangle bounds (thanks @maikthomas)
* Changing the mute flag on an `HTML5AudioSound` instance, via the `mute` setter, now works as it does via the Sound Manager (thanks @Waclaw-I @neon-dev)
* Changing the volume on an `HTML5AudioSound` instance, via the `volume` setter, now works as it does via the Sound Manager (thanks @Waclaw-I)
* The Dynamic Tilemap Layer WebGL renderer was drawing tiles at the incorrect position if the layer was scaled. Fix #4104 (thanks @the-realest-stu)
* `Tile.tileset` now returns the specific Tileset associated with the tile rather than an array of them. Fix #4095 (thanks @quadrupleslap)
* `Tile.getCollisionGroup` wouldn't return the correct Group after the change to support multiple Tilesets. It now returns the group properly (thanks @jbpuryear)
* `Tile.getTileData` wouldn't return the correct data after the change to support multiple Tilesets. It now returns the tile data properly (thanks @jbpuryear)
* The `GetTileAt` and `RemoveTileAt` components would error with "Cannot read property 'index' of undefined" if the tile was undefined rather than null. It now handles both cases (thanks @WaSa42)
* Changing `TileSprite.width` or `TileSprite.height` will now flag the texture as dirty and call `updateDisplayOrigin`, allowing you to resize TileSprites dynamically in both Canvas and WebGL.
* `RandomDataGenerator.shuffle` has been fixed to use the proper modifier in the calculation allowing for a more even distribution (thanks wayfinder)
* The Particle Emitter was not recycling dead particles correctly so it was creating new objects every time it emitted (the old particles were then left to the browsers gc to clear up). This has now been recoded so the emitter will properly keep track of dead particles and re-use them (thanks @Waclaw-I for the initial PR)
* `ParticleEmitter.indexSortCallback` has been removed as it's no longer required.
* `Particle.index` has been removed as it's no longer required. Particles don't need to keep track of their index any more.
* The Particle Emitter no longer needs to call the StableSort.inplace during its preUpdate, saving cpu.
* `Particle.resetPosition` is a new method that is called when a particle dies preparing it for firing again in the future.
* The Canvas `SetTransform` method would save the context state, but it wasn't restored at the end in the following Game Objects: Dynamic Bitmap Text, Graphics, Arc, Curve, Ellipse, Grid, IsoBox, IsoTriangle, Line, Polygon, Rectangle, Star and Triangle. These now all restore the context, meaning if you're using non-canvas sized cameras in Canvas mode, it will now render beyond just the first custom camera.
* `Utils.Array.MoveUp` wouldn't let you move an array element to the top-most index in the array. This also impacted `Container.moveUp`.
* The Texture Tint Pipeline had a logic error that would cause every 2001st quad to either be invisible, or pick-up the texture of the 2000th quad by mistake. The `batchQuad` and `batchTri` methods how handle re-assigning the batch texture if they cause a batch flush as part of their process.
* Rotating Sprites that used a Normal Map wouldn't rotate the normal map with it causing the lighting effects to become irregular. The normal map vectors are now rotated correctly (thanks @sercant for the PR and @fazzamatazz and @ysraelJMM for the report)
* Changing `scaleX` or `scaleY` on a `MatterImage` or `MatterSprite` would cause the body scale to become distorted as the setters didn't use the correct factor when resetting the initial scale. Fix #4206 (thanks @YannCaron)
* `StaticBody.reset` in Arcade Physics would ignore the `x` and `y` values given to it. If given, they're now used to reset the parent Game Object before the body is updated. Fix #4224 (thanks @samme)
* Static Tilemap Layers wouldn't render correctly if the layer used a tileset with a different size to the base map data (set via `setBaseTileSize`). They now render correctly in WebGL and Canvas regardless of the base tile size.
* When using `RenderTexture.fill`, the `alpha` argument would be ignored in Canvas mode. It's now used when filling the RenderTexture.
* Fixed an issue in `WebGLRenderer.setScissor` where it was possible to try and compare the scissor size to a non-current scissor if called outside of the render loop (i.e. from `RenderTexture.fill`) (thanks @hackhat)
* `RenderTexture.fill` in WebGL would use `gl.clear` and a clear color to try and fill the Render Texture. This only worked for full-canvas sized RenderTextures that didn't have a camera zoom applied. It has now been swapped to use the `drawFillRect` method of the Texture Tint Pipeline, allowing it to work properly regardless of camera zoom or size.
* `Container.getFirst` was using an incorrect Array Utils function `GetFirstElement` when it should have been using `GetFirst`. It now uses the correct function. Fix #4244 (thanks @miran248)
* `List.getFirst` was using an incorrect Array Utils function `GetFirstElement` when it should have been using `GetFirst`. It now uses the correct function. Fix #4244 (thanks @miran248)
* Fixed an issue where changing the viewport or size of a Camera belonging to a RenderTexture wouldn't impact the rendering and objects will still render outside of the viewport range. It's now converted to a proper gl scissor rect by the renderer, meaning you can limit the area rendered to by adjusting the internal Render Texture cameras viewport. Fix #4243 (thanks @hackhat)
* `CanvasTexture.destroy` is a new method that specifically handles the destruction of the CanvasTexture and all of its associated typed arrays. This prevents a memory leak when creating and destroying lots of RenderTextures (which are CanvasTexture backed). Fix #4239 (thanks @sjb933)
* The Alpha, Flip and Origin components have been removed from the Mesh Game Object (and by extension, Quad as well) as they are not used in the renderer and should be manipulated via the Mesh properties. Fix #4188 (thanks @enriqueto)
* The `processDomCallbacks` method in the Input Manager wasn't correctly clearing the `once` arrays. Responsibility for this has now been passed to the queue methods `queueTouchStart`, `queueTouchMove`, `queueTouchEnd`, `queueMouseDown`, `queueMouseMove` and `queueMouseUp`. Fix #4257 (thanks @iArePJ)
* Arcade Physics now manages when `postUpdate` should be applied better, stopping it from gaining a zero delta during a further check in the same frame. This fixes various issues, including the mass collision test demo. Fix #4154 (thanks @samme)
* Arcade Physics could trigger a `collide` event on a Body even if it performing an overlap check, if the `onCollide` property was true (thanks @samme)
* TileSprites no longer cause a crash when using the Headless mode renderer. Fix #4297 (thanks @clesquir)
* The WebGLRenderer will now apply a transparent background if `transparent = true` in the game config (thanks @gomachan7)
* `List.sort` was missing the scope required for the sort handler, this is now correctly provided internally. Fix #4241 (thanks @jcyuan)
* `Container.sort` was missing the scope required for the sort handler, this is now correctly provided internally. Fix #4241 (thanks @jcyuan)
* `DataManager.pop` would emit the DataManager instance, instead of the parent, as the first event argument. It now emits the parent as it should do. Fix #4186 (thanks @gadelan)
* The `GetValue` function wasn't checking for the existance of '.' in the config property name correctly, causing the branch to always be taken (thanks @kyranet)
* Safari had permission problems playing HTML5 Audio files on Mac OS. Due to the changes in the input event system audio now plays properly based on user interactions. You still can't play it automatically, though, it will always require a user gesture to begin. Fix #4217 (thanks @increpare)

### Examples and TypeScript

Thanks to the following for helping with the Phaser 3 Examples and TypeScript definitions, either by reporting errors, or even better, fixing them:

@guilhermehto @samvieten @darkwebdev @RoryO @snowbillr @slothyrulez @jcyuan @jestarray @CzBiX

### Phaser Doc Jam

The Phaser Doc Jam was a community-backed effort to try and get the Phaser 3 API documentation to 100% coverage. The Doc Jam is now over and I offer my thanks to the following who helped with docs in this release:

@16patsle - @gurungrahul2 - @icbat - @samme - @telinc1 - anandu pavanan - blackhawx - candelibas - Diego Romero - doronlinder - Elliott Wallace - eric - Georges Gabereau - Haobo Zhang - henriacle - jak6jak - Jake Jensen - James Van Roose - JamesSkemp - joelahoover - Joey - madclaws - marc136 - Mihail Ilinov - naum303 - NicolasRoehm - nuane - rejacobson - Robert Kowalski - rodri042 - rootasjey - sawamara - scottwestover - sir13tommy - stetso - therealsamf - Tigran - willblackmore - zenwaichi

Also, the following helped with the docs outside of the Doc Jam:

@bryanwood @jestarray @matosummer @tfelix @imilo @BigZaphod @OmarShehata @16patsle @jcyuan @iam13islucky @FractalBobz Endre
