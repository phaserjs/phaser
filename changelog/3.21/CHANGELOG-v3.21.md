# Phaser 3 Change Log

## Version 3.21.0 - Senku - 22nd November 2019

### New Features

* You can now specify the mipmap filter level to be used when creating WebGL textures. This can be set in the Game Config using the new `mipmapFilter` property, which is a string, such as 'NEAREST_MIPMAP_NEAREST'. Or, you can set the new `WebGLRenderer.mipmapFilter` property to a valid GLenum. If you set it on the renderer, it will only impact any textures loaded _after_ it has been set, so do so in your Scene `init` method if you want it to be used for textures you're about to load. By changing the mipmap level you can drastically improve the quality when reducing large textures. Please note, due to WebGL1 limitations, this only works on power-of-two sized textures. It also works on textures created from Canvas, Videos or RenderTextures.
* `BitmapText.setMaxWidth` is a new method that allows you to set a maximum width (in pixels) for the BitmapText to take up when rendering. Lines of text longer than `maxWidth` will be wrapped, based on whitespace, to the next line. This allows you to do word-wrapping on BitmapText objects, something only previously possible on Text objects.
* `BitmapText.wordWrapCharCode` is a new property that works with `setMaxWidth` that allows you to control which character code causes a line-wrap. By default it is 32 (a space character).
* `ArcadePhysics.closest` now has an optional `targets` argument. The targets can be any Arcade Physics Game Object, Body or Static Body and it will return only the closet target from those given (thanks @samme)
* `ArcadePhysics.furthest` now has an optional `targets` argument. The targets can be any Arcade Physics Game Object, Body or Static Body and it will return only the furthest target from those given (thanks @samme)
* `Tilemaps.Parsers.Tiled.CreateGroupLayer` is a new function that parses a Tiled group layer and adds in support for Tiled layer groups (introduced in Tiled 1.2.0). Feature #4099 (thanks @Babeetlebum @Olliebrown)
* The Tilemap system now supports infinite Tilemaps from the Tiled map editor (thanks @Olliebrown)
* `Tilemap.getImageLayerNames` is a new method that returns a list of all valid imagelayer names loaded in the Tilemap (thanks @Olliebrown)
* `Tilemap.getObjectLayerNames` is a new method that returns a list of all valid objectgroup names loaded in the Tilemap (thanks @Olliebrown)
* `Tilemap.getTileLayerNames` is a new method that returns a list of all valid tilelayer names loaded in the Tilemap (thanks @Olliebrown)
* When `forceSetTimeOut` is set to `true` in the Game Config, you can now set the target frame rate by setting the `fps.target` value (thanks @pavels)
* Videos can now be loaded from a data URI, allowing for base64 encoded videos to be used in the Loader instead of file based ones. Although, as with all base64 encoded data, we strongly recommend against this (thanks @apasov)
* `Math.MIN_SAFE_INTEGER` is a new math const that stores the minimum safe integer for browsers that don't provide this, such as IE (thanks @jronn)
* `Math.MAX_SAFE_INTEGER` is a new math const that stores the maximum safe integer for browsers that don't provide this, such as IE (thanks @jronn)
* `KeyCodes.NUMPAD_ADD` has been added to the keycodes list (thanks @Martin-Antonov)
* `KeyCodes.NUMPAD_SUBTRACT` has been added to the keycodes list (thanks @Martin-Antonov)
* `Video.removeVideoElementOnDestroy` is a new boolean property that allows you to control if the Video element is removed from the DOM when the Video Game Object is destroyed.
* `Actions.SetScrollFactor` is a new Action that will set the scroll factor on an array of Game Objects, including stepped incremental changes per item (thanks @rexrainbow)
* `Actions.SetScrollFactorX` is a new Action that will set the horizontal scroll factor on an array of Game Objects, including stepped incremental changes per item (thanks @rexrainbow)
* `Actions.SetScrollFactorY` is a new Action that will set the horizontal scroll factor on an array of Game Objects, including stepped incremental changes per item (thanks @rexrainbow)
* The `Group` config object now supports use of the `setScrollFactor` property to set the value on each child of the Group (thanks @rexrainbow)
* `Group.propertyValueSet` is a new method that sets a given property on each Group member (thanks @rexrainbow)
* `Group.propertyValueInc` is a new method that adds an amount to a given property on each Group member (thanks @rexrainbow)
* `Group.setX` is a new method that sets the x coordinate on each Group member (thanks @rexrainbow)
* `Group.setY` is a new method that sets the y coordinate on each Group member (thanks @rexrainbow)
* `Group.setXY` is a new method that sets the x and y coordinate on each Group member (thanks @rexrainbow)
* `Group.incX` is a new method that increments the x coordinate on each Group member (thanks @rexrainbow)
* `Group.incY` is a new method that increments the y coordinate on each Group member (thanks @rexrainbow)
* `Group.incXY` is a new method that increments the x and y coordinate on each Group member (thanks @rexrainbow)
* `Group.shiftPosition` is a new method that iterates the Group members and shifts the position of each to the previous members position (thanks @rexrainbow)
* `Group.angle` is a new method that sets the angle property on each Group member (thanks @rexrainbow)
* `Group.rotate` is a new method that sets the rotation property on each Group member (thanks @rexrainbow)
* `Group.rotateAround` is a new method that rotates each Group member around the given point, by the given angle (thanks @rexrainbow)
* `Group.rotateAroundDistance` is a new method that rotates each Group member around the given point, by the given angle and distance (thanks @rexrainbow)
* `Group.setAlpha` is a new method that sets the alpha property on each Group member (thanks @rexrainbow)
* `Group.setTint` is a new method that sets the tint property on each Group member (thanks @rexrainbow)
* `Group.setOrigin` is a new method that sets the origin property on each Group member (thanks @rexrainbow)
* `Group.scaleX` is a new method that sets the x scale on each Group member (thanks @rexrainbow)
* `Group.scaleY` is a new method that sets the y scale on each Group member (thanks @rexrainbow)
* `Group.scaleXY` is a new method that sets the x and y scale on each Group member (thanks @rexrainbow)
* `Group.setBlendMode` is a new method that sets the blend mode on each Group member (thanks @rexrainbow)
* `Group.setHitArea` is a new method that passes all Group members to the Input Plugin to enable them for input (thanks @rexrainbow)
* `Group.shuffle` is a new method that shuffles all of the Group members in place (thanks @rexrainbow)
* `Group.setVisible` is a new method that sets the visible state on each Group member (thanks @rexrainbow)
* `WebAudioSoundManager.setAudioContext` is a new method that allows you to set the Sound Manager Audio Context to a different context instance. It will also disconnect and re-create the gain nodes on the new context.
* `Group.type` is a new property that holds a string-based name of the Game Object type, as with other GO's (thanks @samme)
* `Arade.Group.type` is a new property that holds a string-based name of the Game Object type, as with other GO's (thanks @samme)
* `Arcade.StaticGroup.type` is a new property that holds a string-based name of the Game Object type, as with other GO's (thanks @samme)
* `ArcadePhysics.overlapCirc` is a new method that allows you to return an array of all Arcade Physics bodies that overlap with the given circular area of the world. It can return either dynamic or static bodies, or a mixture of both (thanks @samme)

### Updates

* `Curve.getPoints` can now take an optional array as the 3rd parameter in which to store the points results (thanks @rexrainbow)
* `Line.arcLengthDivisions` now overrides the default Curve value and is set to 1 to optimize the amount of points returned for a Line curve (thanks @rexrainbow)
* `ArcadePhysics.closest` will now no longer ever return the source in the target results (thanks @samme)
* `ArcadePhysics.furthest` will now no longer ever return the source in the target results (thanks @samme)
* `RequestAnimationFrame.target` is a new property that controls the fps rate (in ms) when setTimeout is used (thanks @pavels)
* The `WebAudioSoundManager.unlock` method will now listen for `keydown` events in order to unlock the Audio Context, as well as touch and pointer events, making it more accessible (thanks Nick Tipping)
* The `requestAnimationFrame` polyfill no longer expects a Browserify environment and uses `window` through-out, it also no longer adds in the same as performance.now does.
* `BitmapText.getTextBounds` didn't reset the dirty flag, causing the `GetBitmapTextSize` function to be called every time the Bitmap Text was rendered. With enough text objects on-screen this could negatively impact performance. The flag is now reset every time the bounds are recalculated.

### Bug Fixes

* The Spine Plugin was not clearing down the resize event listener in WebGL, causing it to still fire even if the Scene was closed. Fix #4808 (thanks @RollinSafary)
* When a game is created with the HEADLESS renderer, `Game.destroy()` had no effect and the game kept on running. Now it destroys itself properly. Fix #4804 (thanks @samme)
* `DOM.GetScreenOrientation` was returning the wrong consts from the Scale Manager (thanks @jcyuan)
* When using `Input.enableDebug` on Game Objects it would not render the debug graphic correctly if the hit area had been offset. It now adjusts the debug correctly for all common hit-area geometry types. Fix #4722 (thanks @HaoboZ @Olliebrown)
* Light2D was not properly working for DynamicTilemapLayers due to a change in the way tilesets were stored, throwing an Uncaught TypeError at runtime. This is now handled correctly. Fix #4167 #4079 (thanks @koljakutschera @blackjack26 @kainage)
* `Input.dragDistanceThreshold` was not working correctly since 3.18, snapping to the wrong drag state unless the time threshold was also set. Fix #4667 (thanks @muliawanw @Olliebrown)
* `Tilemap.convertLayerToStatic` would throw an error when used multiple times, due to an error with the layer index count. Fix #4737 (thanks @Olliebrown @Vegita2)
* The `Tween` class now uses a cached MAX_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* The `StaggerBuilder` class now uses a cached MAX_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* The `Rectangle.FromPoints` function now uses a cached MIN_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* The `Video` class now uses a cached MIN_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* The `Path` class now uses a cached MIN_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* `Video.destroy` has been renamed to `Video.preDestroy`, so that it now destroys properly like all other Game Objects. Fix #4821 (thanks @rexrainbow)
* The Video Game Object will now check to see if the browser supports the `HTMLVideoElement` before creating one (thanks @jcyuan)
* The `DOM.GetScreenOrientation` functions would return out-dated consts (thanks @jcyuan)
* When calling `TileSprite.setTexture` or `setFrame`, if the new frame size didn't match the old one, the new fill pattern would become distorted and the `potWidth` and `potHeight` values would be incorrect.
* Timeline callbacks with extra parameters like `onStart`  would miss the first parameter when the callback was invoked. Fix #4810 (thanks @samme)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@samme (for contributing loads of new Arcade Physics examples) @dranitski @jcyuan @RollinSafary @ilyaryabchinski @jsoref @jcyuan @ghclark2 
