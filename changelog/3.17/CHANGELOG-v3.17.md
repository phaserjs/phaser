# Phaser 3 Change Log

## Version 3.17.0 - Motoko - 10th May 2019

### Shaders

'Shader' is a new type of Game Object which allows you to easily add a quad with its own shader into the display list, and manipulate it as you would any other Game Object, including scaling, rotating, positioning and adding to Containers. Shaders can be masked with either Bitmap or Geometry masks and can also be used as a Bitmap Mask for a Camera or other Game Object. They can also be made interactive and used for input events.

They work by taking a reference to a `Phaser.Display.BaseShader` instance, as found in the Shader Cache. These can be created dynamically at runtime, or loaded in via the updated GLSL File Loader:

```javascript
function preload ()
{
    this.load.glsl('fire', 'shaders/fire.glsl.js');
}
 
function create ()
{
    this.add.shader('fire', 400, 300, 512, 512);
}
```

Please see the Phaser 3 Examples GitHub repo for examples of loading and creating shaders dynamically.

* `Display.BaseShader` is a new type of object that contain the fragment and vertex source, together with any uniforms the shader needs, and are used when creating the new `Shader` Game Objects. They are stored in the Shader cache.
* The Shader Cache `this.cache.shader` has been updated. Rather than holding plain text fragments, it now holds instances of the new `BaseShader` objects. As a result, using `cache.shader.get(key)` will now return a `BaseShader` instead of a text file.
* The `GLSLFile` loader has been updated with new arguments. As well as a URL to the shader file you can also specify if the file is a fragment or vertex shader. It then uses this value to help create or update a `BaseShader` instance in the shader cache.
* The `GLSLFile` loader now supports shader bundles. These allow for multiple shaders to be stored in a single file, with each shader separated by a block of front-matter that represents its contents. Example shader bundles can be found in the Phaser 3 Examples repo.

### DOM Elements

DOM Elements have finally left the experimental stage and are now part of the full Phaser release.

DOM Element Game Objects are a way to control and manipulate HTML Elements over the top of your game. In order for DOM Elements to display you have to enable them by adding the following to your game configuration object:

```javascript
dom {
  createContainer: true
}
```

When this is added, Phaser will automatically create a DOM Container div that is positioned over the top of the game canvas. This div is sized to match the canvas, and if the canvas size changes, as a result of settings within the Scale Manager, the dom container is resized accordingly.

You can create a DOM Element by either passing in DOMStrings, or by passing in a reference to an existing
Element that you wish to be placed under the control of Phaser. For example:

```javascript
this.add.dom(x, y, 'div', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
```

The above code will insert a div element into the DOM Container at the given x/y coordinate. The DOMString in the 4th argument sets the initial CSS style of the div and the final argument is the inner text. In this case, it will create a lime colored div that is 220px by 100px in size with the text Phaser in it, in an Arial font.

You should nearly always, without exception, use explicitly sized HTML Elements, in order to fully control alignment and positioning of the elements next to regular game content.

Rather than specify the CSS and HTML directly you can use the `load.html` File Loader to load it into the cache and then use the `createFromCache` method instead. You can also use `createFromHTML` and various other methods available in this class to help construct your elements.

Once the element has been created you can then control it like you would any other Game Object. You can set its position, scale, rotation, alpha and other properties. It will move as the main Scene Camera moves and be clipped at the edge of the canvas. It's important to remember some limitations of DOM Elements: The obvious one is that they appear above or below your game canvas. You cannot blend them into the display list, meaning you cannot have a DOM Element, then a Sprite, then another DOM Element behind it.

You can find lots of examples on using DOM Elements in the Phaser 3 Examples repo.

### Geometry and Bitmap Masks

* `Camera.setMask` is a new method that allows you to set a geometry or bitmap mask on any camera. The mask can be set to remain fixed in position, or to translate along with the camera. It will impact anything the camera renders. A reference to the mask is stored in the `Camera.mask` property.
* `Camera.clearMask` is a new method that clears a previously set mask on a Camera.
* There is a new Game Config property `input.windowEvents` which is true by default. It controls if Phaser will listen for any input events on the Window. If you disable this, Phaser will stop being able to emit events like `POINTER_UP_OUTSIDE`, or be aware of anything that happens outside of the Canvas re: input.
* Containers can now contain masked children and have those masks respected, including the mask on the Container itself (if any). Masks work on any depth of child up to 255 children deep.
* Geometry Masks are now batched. Previously, using the same mask on multiple Game Objects would create brand new stencil operations for every single Game Object, causing performance to tank. Now, the mask is only set if it's different from the previously masked object in the display list, allowing you to mask thousands of Game Objects and retain batching through-out.
* `GeometryMask.setInvertAlpha` is a new method that allows you to set the `invertAlpha` property in a chainable call.
* Previously, setting a mask on a Particle Emitter wouldn't work (it had to be set on the Emitter Manager instance), even though the mask methods and properties existed. You can now set a geometry or bitmap mask directly on an emitter.
* The Particle Emitter Manager was missing the Mask component, even though it fully supported masking. The Mask component has now been added. You can now mask the manager, which impacts all emitters you create through it, or a specific emitter. Different emitters can have different masks, although they override the parent mask, if set.
* You can now apply a Bitmap Mask to a Camera or Container and a Geometry Mask to a child and have it work correctly.
* `WebGLRenderer.maskCount` is a new internal property that tracks the number of masks in the stack.
* `WebGLRenderer.maskStack` is a new internal array that contains the current mask stack.

### Arcade Physics

#### New Features

* `overlapTiles` is a new method that allows you to check for overlaps between a physics enabled Game Object and an array of Tiles. The Tiles don't have to have been enable for collision, or even be on the same layer, for the overlap check to work. You can provide your own process callback and/or overlap callback. This is handy for testing for overlap for a specific Tile in your map, not just based on a tile index. This is available via `this.physics.overlapTiles` and the World instance.
* `collideTiles` is a new method that allows you to check for collision between a physics enabled Game Object and an array of Tiles. The Tiles don't have to have been enable for collision, or even be on the same layer, for the collision to work. You can provide your own process callback and/or overlap callback. There are some limitations in using this method, please consult the API Docs for details, but on the whole, it allows for dynamic collision on small sets of Tile instances. This is available via `this.physics.collideTiles` and the World instance.
* `overlapRect` is a new method that allows you to return an array of all physics bodies within the given rectangular region of the World. It can return dynamic or static bodies and will use the RTree for super-fast searching, if enabled (which it is by default)
* The `Body.setCollideWorldBounds` method has two new optional arguments `bounceX` and `bounceY` which, if given, will set the World Bounce values for the body.

#### Updates

* `Body.preUpdate` is a new method that is called only once per game step. It resets all collision status properties and syncs the Body with the parent Game Object.
* `Body.update` has been rewritten to just perform one single physics step and no longer re-syncs with the Game Object. It can be called multiple times per game step, depending on the World FPS rate.
* `Body.postUpdate` has been rewritten to make it more compact. It syncs the body data back to the parent Game Object and is only called once per game step now (previously it was called whenever the Body updated)
* The `World.late` Set has been removed and is no longer populated, as it's no longer required.
* `World.update` now calls `Body.preUpdate` just once per game step, then calls `Body.update` as many times as is required as per the FPS setting, and no longer calls `Body.postUpdate` at all.
* `World.collideSpriteVsTilemapLayer` now returns a boolean if a collision or overlap happens, where-as before it didn't.
* `World.collideSpriteVsTilemapLayerHandler` is a new private method that handles all tilemap collision checks.
* The internal method `SeparateTile` now has a new argument `isLayer` which controls if the set comes from a layer or an array.
* The internal method `TileCheckX` now has a new argument `isLayer` which controls if the set comes from a layer or an array.
* The internal method `TileCheckY` now has a new argument `isLayer` which controls if the set comes from a layer or an array.
* `Body.isMoving` has been removed as it was never used internally.
* `Body.stopVelocityOnCollide` has been removed as it was never used internally.
* All of the Arcade Physics Components are now available directly under the `Phaser.Physics.Arcade.Components` namespace. Fix #4440 (thanks @jackfreak)
* `Phaser.Physics.Arcade.Events` is now exposed in the namespace, preventing it from erroring if you use them in TypeScript. Fix #4481 (thanks @danielalves)
* The Matter World configuration value `bodyDebugFillColor` has been renamed to `debugBodyFillColor` to be consistent with the rest of the options.
* The Matter World configuration has a new property: `debugStaticBodyColor` that sets the static body debug color.

#### Bug Fixes

* The `Body.delta` values are now able to be read and acted upon during a Scene update, due to the new game step flow. This means you can now call `this.physics.collide` during a Scene `update` and it will work properly again. Fix #4370 (thanks @NokFrt)
* `ArcadePhysics.furthest` now iterates the bodies Set, rather than the RTree, which keeps it working even if the RTree has been disabled.
* `ArcadePhysics.closest` now iterates the bodies Set, rather than the RTree, which keeps it working even if the RTree has been disabled.
* `Body.setVelocity` caused the `speed` property to be set to `NaN` if you didn't provide a `y` argument.
* Passing an _array_ of configuration objects to `physics.add.group` would ignore them and none of the children would be assigned a physics body. Fix #4511 (thanks @rgk)
* A Body with `damping` and `drag` enabled would fail to move if it went from zero velocity to a new velocity inside an `update` loop. It will now reset its speed accordingly and retain its new velocity (thanks StealthGary)

### Facebook Instant Games Plugin

* The method `consumePurchases` has been renamed to `consumePurchase` to bring it in-line with the Facebook API.
* `getProduct` is a new method that will return a single Product from the product catalog based on the given Product ID. You can use this to look-up product details based on a purchase list.

### New Features

* A Scene will now emit the new `CREATE` event after it has been created by the Scene Manager. If the Scene has a `create` method this event comes after that, so is useful to knowing when a Scene may have finished creating Game Objects, etc. (thanks @jackfreak)
* `Tilemap.removeTile` is a new method that allows you to remove a tile, or an array of tiles, by passing in references to the tiles themselves, rather than coordinates. The tiles can be replaced with new tiles of the given index, or removed entirely, and the method can optionally recalculate interesting faces on the layer.
* `TweenManager.remove` is a new method that immediately removes the given Tween from all of its internal arrays.
* `Tween.remove` is a new method that immediately removes the Tween from the TweenManager, regardless of what state the tween is in. Once called the tween will no longer exist within any internal TweenManager arrays.
* `SceneManager.isPaused` is a new method that will return if the given Scene is currently paused or not (thanks @samme)
* `ScenePlugin.isPaused` is a new method that will return if the given Scene is currently paused or not (thanks @samme)
* `TextureManager.removeKey` is a new method that will remove a key from the Texture Manager without destroying the texture itself.
* `Matter.World.resetCollisionIDs` is a new method that will reset the collision IDs that Matter JS uses for body collision groups. You should call this before destroying your game if you need to restart the game again on the same page, without first reloading the page. Or, if you wish to consistently destroy a Scene that contains Matter.js and then run it again (thanks @clesquir)
* RenderTexture has two new optional constructor arguments `key` and `frame`. This allows you to create a RenderTexture pre-populated with the size and frame from an existing texture (thanks @TadejZupancic)
* `GameObjects.Components.PathFollower` is a new component that manages any type of Game Object following a path. The original Path Follower Game Object has been updated to use this new component directly, but it can be applied to any custom Game Object class.
* `Tilemap.removeLayer` is a new method that allows you to remove a specific layer from a Tilemap without destroying it.
* `Tilemap.destroyLayer` is a new method that allows you to destroy a layer and remove it from a Tilemap.
* `Tilemap.renderDebugFull` is a new method that will debug render all layers in the Tilemap to the given Graphics object.
* `Geom.Intersects.GetCircleToCircle` is a new function that will return the point/s of intersection between two circles (thanks @florianvazelle)
* `Geom.Intersects.GetCircleToRectangle` is a new function that will return the point/s of intersection between a circle and a rectangle (thanks @florianvazelle)
* `Geom.Intersects.GetLineToCircle` is a new function that will return the point/s of intersection between a line and a circle (thanks @florianvazelle)
* `Geom.Intersects.GetLineToRectangle` is a new function that will return the point/s of intersection between a line and a rectangle (thanks @florianvazelle)
* `Geom.Intersects.GetRectangleToRectangle` is a new function that will return the point/s of intersection between two rectangles (thanks @florianvazelle)
* `Geom.Intersects.GetRectangleToTriangle` is a new function that will return the point/s of intersection between a rectangle and a triangle (thanks @florianvazelle)
* `Geom.Intersects.GetTriangleToCircle` is a new function that will return the point/s of intersection between a triangle and a circle (thanks @florianvazelle)
* `Geom.Intersects.GetTriangleToLine` is a new function that will return the point/s of intersection between a triangle and a line (thanks @florianvazelle)
* `Geom.Intersects.GetTriangleToTriangle` is a new function that will return the point/s of intersection between two triangles (thanks @florianvazelle)
* `Size.setCSS` is a new method that will set the Size components width and height to the respective CSS style properties of the given element.
* `CSSFile` is a new Loader FileType that allows you to load css into the current document via the normal Phaser Loader, using the `load.css` method. As such, you can chain it with other load calls, load via config, use as part of a pack load or any other option available to all loader filetypes. The CSS is applied immediately to the document.
* `MultiScriptFile` is a new Loader FileType that allows you to load multiple script files into the document via the Phaser Loader, using the new `load.scripts` method. The difference between this and `load.script` is that you must pass an array of script file URLs to this method and they will be loaded in parallel but _processed_ (i.e. added to the document) in the exact order specified in the array. This allows you to load a bundle of scripts that have dependencies on each other.
* `Key.getDuration` is a new method that will return the duration, in ms, that the Key has been held down for. If the Key isn't down it will return zero.
* The `Container.setScrollFactor` method has a new optional argument `updateChildren`. If set, it will change the `scrollFactor` values of all the Container children as well as the Container. Fix #4466 #4475 (thanks @pinkkis @enriqueto)
* There is a new webpack config `FEATURE_SOUND` which is set to `true` by default, but if set to `false` it will exclude the Sound Manager and all of its systems from the build files. Fix #4428 (thanks @goldfire)
* `Scene.Systems.renderer` is a new property that is a reference to the current renderer the game is using.
* `Utils.Objects.SetValue` is a new function that allows you to set a value in an object by specifying a property key. The function can set a value to any depth by using dot-notation for the key, i.e. `SetValue(data, 'world.position.x', 100)`.
* `WebGLRenderer.glFuncMap` is a new object, populated during the `init` method, that contains uniform mappings from key to the corresponding gl function, i.e. `mat2` to `gl.uniformMatrix2fv`.
* `BaseCache.getKeys` is a new method that will return all keys in use in the current cache, i.e. `this.cache.shader.getKeys()`.

### Updates

* Removed all references to CocoonJS from the API, including in the Device.OS object and elsewhere, as Cocoon is no longer.
* The MouseManager and TouchManager now use separate handlers for the Window level input events, which check to see if the canvas is the target or not, and redirect processing accordingly.
* `AnimationManager.generateFrameNumbers` can now accept a start number greater than the end number, and will generate them in reverse (thanks @cruzdanilo)
* The return from the `ScenePlugin.add` method has changed. Previously, it would return the ScenePlugin, but now it returns a reference to the Scene that was added to the Scene Manager, keeping it in-line with all other `add` methods in the API. Fix #4359 (thanks @BigZaphod)
* The `PluginManager.installScenePlugin` method has a new optional boolean parameter `fromLoader` which controls if the plugin is coming in from the result of a Loader operation or not. If it is, it no longer throws a console warning if the plugin already exists. This fixes an issue where if you return to a Scene that loads a Scene Plugin it would throw a warning and then not install the plugin to the Scene.
* The Scale Manager has a new event `FULLSCREEN_FAILED` which is fired if you try to enter fullscreen mode, but the browser rejects it for some reason.
* The `ScaleMode` Component has been removed from every Game Object, and along with it the `scaleMode` property and `setScaleMode` method. These did nothing anyway as they were not hooked to the render pipeline and scale mode should be set on the texture, not the Game Object. Fix #4413 (thanks @jcyuan)
* The `Clock.now` property value is now synced to be the `TimeStep.time` value when the Clock plugin boots and is no longer `Date.now()` until the first update (thanks @Antriel)
* `Graphics.strokePoints` has renamed the second argument from `autoClose` to `closeShape`. There is also a new third argument `closePath`, which defaults to `true` and automatically closes the path before stroking it. The `endIndex` argument is now the fourth argument, instead of the third.
* `Graphics.fillPoints` has renamed the second argument from `autoClose` to `closeShape`. There is also a new third argument `closePath`, which defaults to `true` and automatically closes the path before filling it. The `endIndex` argument is now the fourth argument, instead of the third.
* Calling `Texture.destroy` will now call `TextureManager.removeKey` to ensure the key is removed from the manager, should you destroy a texture directly, rather than going via `TextureManager.remove`. Fix #4461 (thanks @BigZaphod)
* `SpriteSheetFromAtlas` now adds in a `__BASE` entry for the Sprite Sheet it creates, keeping it consistent with the other frame parsers (thanks @Cirras)
* The `from` and `to` properties in the PathFollower Config can now be used to set the span of the follow duration (thanks @kensleebos)
* `Graphics.lineFxTo` and `Graphics.moveFxTo` have been removed as they were not being rendered anyway.
* You can now use "infinite" tilemaps as created in Tiled v1.1 and above. Support is basic in that it takes the chunk data and builds one giant map from it. However, at least you are still able to now load and use infinite maps, even if they don't chunk during the game (thanks @Upperfoot)
* `MapData.infinite` is a new boolean that controls if the map data is infinite or not.
* `DynamicTilemapLayer.destroy` will now remove the layer from the Tilemap it belongs to, clearing it from the layers array. Fix #4319 (thanks @APXEOLOG)
* `StaticTilemapLayer.destroy` will now remove the layer from the Tilemap it belongs to, clearing it from the layers array. Fix #4319 (thanks @APXEOLOG)
* `DynamicTilemapLayer.destroy` has a new optional boolean argument `removeFromTilemap` which will control if the layer is removed from the parent map or not.
* `StaticTilemapLayer.destroy` has a new optional boolean argument `removeFromTilemap` which will control if the layer is removed from the parent map or not.
* `Tilemap.copy` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.fill` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.forEachTile` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.putTilesAt` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.randomize` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.calculateFacesAt` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.renderDebug` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.replaceByIndex` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollision` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollisionBetween` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollisionByProperty` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollisionByExclusion` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollisionFromCollisionGroup` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setTileIndexCallback` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setTileLocationCallback` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.shuffle` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.swapByIndex` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.weightedRandomize` now actually returns `null` if an invalid layer was given, as per the docs.
* `BaseCamera.cameraManager` is a new property that is a reference to the Camera Manager, set in the `setScene` method.
* `CameraManager.default` is a new property that contains a single un-transformed instance of a Camera, that exists outside of the camera list and doesn't render. It's used by other systems as a default camera matrix.
* The `Graphics` Game Object now has 3 new Transform Matrix instances called `_tempMatrix1` to `_tempMatrix3`, which are used by it during the WebGL Rendering process. This is because Graphics objects can be used as Geometry Masks, which need to retain their own matrix state mid-render of another object, so cannot share the renderer temp matrices that other Game Objects can use. This also indirectly fixes an issue where masked children (such as emitters or container children) would get incorrect camera scroll values.
* The `Key` method signature has changed. It now expects to receive a reference to the KeyboardPlugin instance that is creating the Key as the first argument. This is now stored in the new `Key.plugin` property, and cleared in `destroy`.
* `KeyboardPlugin.removeKey` has a new optional argument `destroy` that will, if set, destroy the Key object being removed from the plugin.
* `InteractiveObject.customHitArea` is a new property that records if the hitArea for the Interactive Object was created based on texture size (false), or a custom shape (true)
* A Camera will pause following a Game Object for the duration of the Camera Pan Effect, as the two will clash over the Camera scroll position (thanks fruitbatinshades).
* `ParseXMLBitmapFont` has now been exposed as a static function on the `BitmapText` object, so you can access it easily from your own code (thanks @jcyuan)
* The math used in the circle to circle Arcade Physics collision has been updated to better handle horizontal collision, giving a more realistic response. Fix #4256 (thanks @akuskis @JeSuisUnCaillou)

### Bug Fixes

* The parent bounds are reset when exiting fullscreen mode in the Scale Manager. This fixes an issue when leaving fullscreen mode by pressing ESC (instead of programmatically) would leave the canvas in the full screen size. Fix #4357 (thanks @khutchins and @HeyStevenXu)
* `GetAdvancedValue` now uses the correct Math RND reference, which means anything that used the `randInt` or `randFloat` features of this function, such as creating a Sprite from a Config object, or Bitmap Text sizing, will no longer throw an error about a null object reference. Fix #4369 (thanks @sanadov)
* Trying to enter Fullscreen mode on Android / Chrome, or iOS / Safari, would throw an error regarding an unhandled Promise and a failure to invoke the event from a user gesture. This has been tightened up, using a proper Promise handler internally and the documentation clarified to explicitly say that you must call the function from a `pointerup` handler, and not `pointerdown`. Fix #4355 (thanks @matrizet)
* Camera fadeIn and fadeOut would sometimes leave a very low alpha-valued rectangle rendering to the camera. Fix #3833 (thanks @bdaenen)
* `Actions.Spread` would only use the `min` value to work out the step value but not apply it to the property being set (thanks @galman33)
* Calling `Tween.pause` returns the Tween instance, however, if it was already paused, it would return `undefined`, causing problems when chaining Tween methods (thanks @kyranet)
* Calling `TweenManager.makeActive` returns the TweenManager instance, however, if you create a tween externally and call `makeActive` with it, this would return `undefined`.
* Setting the `fixedWidth` and / or `fixedHeight` properties in the configuration of a `Text` would be ignored, they were only supported when calling the `setFixedSize` method. They now work via either option. Fix #4424 (thanks @rexrainbow)
* When calculating the width of a Text object for word wrapping it would ignore the extra spaces added from the wrap. It now accounts for these in the width. Fix #4187 (thanks @rexrainbow)
* `Utils.Array.Add` would act incorrectly when adding an object into an array in which it already belonged. This would manifest if, for example, adding a child into a display list it was already a part of. Fix #4411 (thanks @mudala @LoolzRules)
* `Tile.getCenterX` and `Tile.getCenterY` would return the wrong values for tiles on scaled layers. Fix #3845 (thanks @oloflarsson @florianvazelle)
* `Camera.startFollow` will now ensure that if the Camera is using bounds that the `scrollX` and `scrollY` values set after first following the Game Object do not exceed the bounds (thanks @snowbillr)
* Creating a Tween with a `duration` of zero would cause the tweened object properties to be set to `NaN`. Now they will tween for one single frame before being set to progress 1. Fix #4235 (thanks @BigZaphod)
* The First frame of a Texture would take on the appearance of the second frame in a Sprite Sheet created from trimmed Texture Atlas frames. Fix #4088 (thanks @Cirras)
* `Tween.stop` assumed that the parent was the TweenManager. If the Tween has been added to the Timeline, that was not true and the stop method crashed (thanks @TadejZupancic)
* Calling `Tween.restart` multiple times in a row would cause the tween to freeze. It will now disregard all additional calls to `restart` if it's already in a pending state (thanks @rgk)
* Tween Timelines would only apply the `delay` value of a child tween once and not on loop. Fix #3841 (thanks @Edwin222 @Antriel)
* `Texture.add` will no longer let you add a frame to a texture with the same name or index as one that already exists in the texture. Doing so will now return `null` instead of a Frame object, and the `frameTotal` will never be incremented. Fix #4459 (thanks @BigZaphod)
* The InputPlugin will now dispatch an update event, allowing the Gamepad Plugin to update itself every frame, regardless of DOM events. This allows Gamepads to work correctly again. Fix #4414 (thanks @CipSoft-Components)
* Calling `Tween.play` on a tween that had already finished and was pending removal will stop the tween from getting stuck in an `isPlaying` state and will restart the tween again from the beginning. Calling `play` on a Tween that is already playing does nothing. Fix #4184 (thanks @SamCode)
* Declared `Audio.dataset`, which fixes Internet Explorer 10 crashing when trying to access the dataset property of the object (thanks @SirLink)
* The `InputManager.update` method is now called every frame, as long as a native DOM event hasn't already fired it, which allows things like `setPollRate` to work again. Fix #4405 (thanks @Shucki)
* `Pointer.getDuration` would only return zero until the pointer was released, or moved (basically any action that generated a DOM event). It now returns the duration regardless of the DOM events. Fix #4444 (thanks @plazicx)
* `Keyboard.UpDuration` has been changed so the `duration` being checked is now against the current game clock. This means you can use it to check if a Key was released within `duration` ms ago, based on the time now, not the historic value of the Key.
* `Keyboard.DownDuration` has been changed so the `duration` being checked is now against the current game clock. This fixes an issue where it couldn't be used while the Key was actively being held down. Fix #4484 (thanks @belen-albeza)
* Keys would lose track of the state of a Scene when the Scene became paused. They're now updated regardless, stopping them from getting stuck if you pause and resume a Scene while holding them down. Fix #3822 (thanks @DannyT)
* Changing any aspect of a Text object, such as the font size or content, wouldn't update its `hitArea` if it had been enabled for input, causing it to carry on using the old hit area size. Now, as long as the Text was created _without_ a custom hitArea, the hitArea size will be changed to match the new texture size on update. If you have provided your own custom hitArea shape, you need to modify it when the Text changes size yourself. Fix #4456 (thanks @thanh-taro and @rexrainbow)
* `Camera.clearRenderToTexture` will check to see if the Scene is available before proceeding, avoiding potential errors when a Camera is destroyed multiple times during a Scene shutdown.
* Destroying a Game object during its `pointerup` event handler on a touch device will no longer cause `Uncaught TypeError: Cannot read property 'localX' of undefined`. All InputPlugin process handlers now check to see if the Game Object has been destroyed at any stage and abort if it has. Fix #4463 (thanks @PatrickSachs)
* `InputPlugin.clear` has a new argument `skipQueue` which is used to avoid clearing a Game Object twice. This, combined with the fix for 4463 means you will no longer get a `Cannot read property 'dragState'` error if you destroy a Game Object enabled for drag where another draggable object exists. Fix #4228 (thanks @YannCaron)
* `UpdateList.remove` will now move the removed child to the internal `_pendingRemoval` array, instead of slicing it directly out of the active list. The pending list is cleared at the start of the next game frame. Fix #4365 (thanks @jcyuan)
* Setting `pixelPerfect` when input enabling a Container would cause it to crash, because Containers don't have a texture to check. It will now throw a run-time warning and skip the Container for input. You should use a custom input callback instead. Fix #4492 (thanks @BigZaphod)
* Setting `fixedWidth` and `fixedHeight` on a Text object will now clamp the size of the canvas being created, as well as the width and height properties of the Text object itself (thanks @rexrainbow)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@sky-coding @G-Rath @S4n60w3n @rootasjey @englercj @josephmbustamante @Jason-Cooke @Zamiell @krzysztof-grzybek @S4n60w3n @m31271n @peterellisjones @martinlindhe @TylerMorley @samme @schomatis @BeLi4L @hizzd @OmarShehata @antoine-pous @digitsensitive

Also, thanks to @Osmose there is a new Dashing config added to the Phaser 3 Docs Repo, with a new command `build-docset` which will build a [Dash](https://kapeli.com/dash) compatible docset for those who like to use Dash for their docs.
