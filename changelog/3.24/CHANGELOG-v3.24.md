# Phaser 3 Change Log

## Version 3.24.0 - Rem - 13th July 2020

### Arcade Physics New Features, Updates and Fixes

* When colliding physics groups with the search tree enabled, there was an unnecessary intersection test for each body returned by the search (thanks @samme)
* When doing an overlap collision, there was an unnecessary intersection test for each pair of overlapping bodies (thanks @samme)
* Sprite vs. Static Group collision tests now always use the static tree (thanks @samme)
* Fixed a bug where if you added a static body to a sprite with scale ≠ 1, the body position was incorrect (thanks @samme)
* If you passed in an array of `children` when creating a Physics Group, they didn't receive bodies. Fix #5152 (thanks @samme)
* New types allow for better docs / TypeScript defs especially in the Factory functions: `ArcadePhysicsCallback`, `GameObjectWithBody`, `GameObjectWithDynamicBody`, `GameObjectWithStaticBody`, `ImageWithDynamicBody`, `ImageWithStaticBody`, `SpriteWithDynamicBody` and `SpriteWithStaticBody`. Fix #4994 (thanks @samme @gnesher)
* `Body.updateFromGameObject` is a new method that extracts the relevant code from `preUpdate`, allowing you to read the body's new position and center immediately, before the next physics step. It also lets `refreshBody` work for dynamic bodies, where previously it would error (thanks @samme)
* Momentum exchange wasn't working correctly vs. immovable bodies. The movable body tended to stop. Fix #4770 (thanks @samme)
* The Body mass was decreasing the inertia instead of increasing it. Fix #4770 (thanks @samme)
* The separation vector seemed to be incorrect, causing the slip / slide collisions. The separation is now correct for circle–circle collisions (although not fully for circle–rectangle collisions), part fix #4770 (thanks @samme)
* The Arcade Body delta was incorrectly calculated on bodies created during the `update` step, causing the position to be off. Fix #5204 (thanks @zackexplosion @samme)
* `Arcade.Components.Size.setBodySize` is a new method available on Arcade Physics Game Objects that allows you to set the body size. This replaces `setSize` which is now deprecated. Fix #4786 (thanks @wingyplus)

### New Features

* The Animation component has a new property `nextAnimsQueue` which allows you to sequence Sprite animations to play in order, i.e: `this.mole.anims.play('digging').anims.chain('lifting').anims.chain('looking').anims.chain('lowering');` (thanks @tgroborsch)
* `Group.setActive` is a new method that will set the active state of a Group, just like it does on other Game Objects (thanks @samme)
* `Group.setName` is a new method that will set the name property of a Group, just like it does on other Game Objects (thanks @samme)
* `TWEEN_STOP` is a new event dispatched by a Tween when it stops playback (thanks @samme @RollinSafary)
* You can now specify an `onStop` callback when creating a Tween as part of the tween config, which is invoked when a Tween stops playback (thanks @samme @RollinSafary)
* Previously, if you created a timeline and passed no tweens in the config, the timeline would be created but all config properties were ignored. Now the timeline's own properties (completeDelay, loop, loopDelay, useFrames, onStart, onUpdate, onLoop, onYoyo, onComplete, etc.) are set from the config properly (thanks @samme)
* `TextStyle.wordWrapWidth` lets you set the maximum width of a line of text (thanks @mikewesthad)
* `TextStyle.wordWrapCallback` is a custom function that will is responsible for wrapping the text (thanks @mikewesthad)
* `TextStyle.wordWrapCallbackScope` is the scope that will be applied when the `wordWrapCallback` is invoked (thanks @mikewesthad)
* `TextStyle.wordWrapUseAdvanced` controls whether or not to use the advanced wrapping algorithm (thanks @mikewesthad)
* `KeyboardPlugin.removeAllKeys` is a new method that allows you to automatically remove all Key instances that the plugin has created, making house-keeping a little easier (thanks @samme)
* `Math.RotateTo` is a new function that will position a point at the given angle and distance (thanks @samme)
* `Display.Bounds.GetBounds` is a new function that will return the un-transformed bounds of the given Game Object as a Rectangle (thanks @samme)

### Updates

* The `Pointer.dragStartX/YGlobal` and `Pointer.dragX/Y` values are now populated from the `worldX/Y`, which means using those values directly in Input Drag callbacks will now work when the Camera is zoomed. Fix #4755 (thanks @braindx)
* The `browser` field has been added to the Phaser `package.json` pointing to the `dist/phaser.js` umd build (thanks @FredKSchott)
* Calling `TimeStep.wake()` while the loop is running will now cause nothing to happen, rather than sleeping and then waking again (thanks @samme)
* `Container.getBounds` will no longer set the temp rect bounds to the first child of the Container by default (which would error if the child had no bounds, like a Graphics object) and instead sets it as it iterates the children (thanks @blopa)
* `File.state` will now be set to the `FILE_LOADING` state while loading and `FILE_LOADED` after loading (thanks @samme)
* `BaseCamera.cull` now moves some of its calculations outside of the cull loop to speed it up (thanks @samme)
* `SceneManager.createSceneFromInstance` had a small refactor to avoid a pointless condition (thanks @samme)

### Bug Fixes

* Fixed a TypeError warning when importing JSON objects directly to the `url` argument of any of the Loader filetypes. Fix #5189 (thanks @awweather @samme)
* The `NOOP` function was incorrectly imported by the Mouse and Keyboard Manager. Fix #5170 (thanks @samme @gregolai)
* When Audio files failed to decode on loading, they would always show 'undefined' as the key in the error log, now they show the actual key (thanks @samme)
* When the Sprite Sheet parser results in zero frames, the warning will now tell you the texture name that caused it (thanks @samme)
* `KeyboardPlugin.checkDown` didn't set the `duration` to zero if the parameter was omitted, causing it to always return false. Fix #5146 (thanks @lozzajp)
* If you passed in an array of `children` when creating a Group, they were not added and removed correctly. Fix #5151 (thanks @samme)
* When using HTML5 Audio with `pauseOnBlur` (the default), if you play a sound, schedule stopping the sound (e.g., timer, tween complete callback), leave the page, and return to the page, the sound `stop()` will error (thanks @samme)
* Using a Render Texture when you're also using the headless renderer would cause an error (thanks @samme)
* `Ellipse.setWidth` would incorrectly set the `xRadius` to the diameter (thanks @rexrainbow)
* `Ellipse.setHeight` would incorrectly set the `yRadius` to the diameter (thanks @rexrainbow)
* When specifically setting the `parent` property in the Game Config to `null` the canvas was appended to the document body, when it should have been ignored (allowing you to add it to the dom directly). Fix #5191 (thanks @MerganThePirate)
* Containers will now apply nested masks correctly when using the Canvas Renderer specifically (thanks @scott20145)
* Calling `Scale.startFullScreen` would fail in Safari on Mac OS, throwing a `fullscreenfailed` error. It now triggers fullscreen mode correctly, as on other browsers. Fix #5143 (thanks @samme @novaknole)
* Calling `setCrop` on a Matter Physics Sprite would throw a TypeError, but will now crop correctly. Not that it only crops the texture, the body is unaffected. Fix #5211 (thanks @MatthewRorke @samme)
* The Static Tilemap Layer would ignore the layer rotation and parent transform when using WebGL (but worked in Canvas). Both modes now work in the same manner (thanks @cruzdanilo)
* Calling `getTextBounds` on a BitmapText object would return the incorrect values if the origin had been changed, but the text itself had not, as it was using out of date dimensions. Changing the origin now automatically triggers BitmapText to be dirty, forcing the bounds to be refreshed. Fix #5121 (thanks @thenonamezz)
* The ISO Triangle shape would skip rendering the left side of the first triangle in the batch. It now renders all ISO Triangles correctly. Fix #5164 (thanks @mattjennings)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@samme @SanderVanhove @SirJosh3917 @mooreInteractive @A-312 @lozzajp @mikewesthad @j-waters @futuremarc 
