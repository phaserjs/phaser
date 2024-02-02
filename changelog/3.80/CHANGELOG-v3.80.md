# Version 3.80.0 - Nino - in dev

# New Features

* The Scale Manager has a new scale mode called `EXPAND`. This is inspired by the Expand mode in Godot: "Keep aspect ratio when stretching the screen, but keep neither the base width nor height. Depending on the screen aspect ratio, the viewport will either be larger in the horizontal direction (if the screen is wider than the base size) or in the vertical direction (if the screen is taller than the original size)" (thanks @rexrainbow)
* Phaser now performs a [WebGL Context Restore](WebGLContextRestore.md) to keep the game running after losing WebGL context. This affects many parts of the rendering system, but everything should work just the same unless you're doing something very technical. See the link for more details.

# New Features - Base64 Loader

The Phaser LoaderPlugin and related classes have been updated so that they now work natively with base64 encoded files and Data URIs. This means you can now load a base64 encoded image, audio file or text file directly into the Loader. The Loader will then decode the data and process it as if it was a normal file. This is particularly useful for environments such as Playable Ads where you have to provide a single html file with all assets embedded and no XHR requests.

* `Loader.File.base64` is a new read-only boolean property that is set if the file contains a Data URI encoded string.
* `Loader.File.onBase64Load` is a new method that is called when the file has finished decoding from a Data URI.
* The `ImageFile` will now default to using the Image Load Element if a base64 file is detected, instead of throwing a console warning about unsupported types.
* The `XHRLoader` will now return a fake XHR result object containing the decoded base64 data if a base64 file is detected, skipping the creation of a real XML Http Request object.

# Spine Updates

* The Spine 3 and 4.1 Plugins will now call `preUpdate` automatically when the `play` method is called. This forces the new animation state to update and apply itself to the skeleton. This fixes an issue where Spine object would show the default frame in the Spine atlas for a single update before the animation started. Fix #5443 (thanks @spayton)
* `SpineGameObject.setSlotAlpha` is a new method that allows you to set the alpha on a specific slot in a Spine skeleton.
* The `SpineGameObject.setAlpha` method has had its 2nd parameter removed. This fixes needless slot look-ups during rendering when a Spine Game Object is inside a regular Container. If you need to set slot alpha, use the new `setSlotAlpha` method instead. Fix #6571 (thanks @spayton)
* The `SpineFile.onFileComplete` handler was running a regular expression against `file.src` instead of `file.url`, sometimes leading to double paths in the atlas paths on loading. Fix #6642 (thanks @rez23)

# Updates

* The `TweenChainBuilder` was incorrectly setting the `persist` flag on the Chain to `true`, which goes against what the documentation says. It now correctly sets it to `false`. This means if you previously had a Tween Chain that was persisting, it will no longer do so, so add the property to regain the feature.
* The `dropped` argument has now been adeded to the documentation for the `DRAG_END` and `GAMEOBJECT_DRAG_END` events. (thanks @samme)
* `Container.onChildDestroyed` is a new internal method used to destroy Container children. Previously, if you destroyed a Game Object in an exclusive Container, the game object would (momentarily) move onto the Scene display list and emit an ADDED_TO_SCENE event. Also, if you added a Sprite to a non-exclusive Container and stopped the Scene, you would get a TypeError (evaluating 'this.anims.destroy'). This happened because the fromChild argument in the DESTROY event was misinterpreted as destroyChild in the Container's remove(), and the Container was calling the Sprite's destroy() again. (thanks @samme)
* The `Text` and `TileSprite` Game Objects now place their textures into the global `TextureManager` and a `_textureKey` private string property has been added which contains a UUID to reference that texture.
* The `Tilemaps.Components.WeightedRandomize` method now uses the Phaser `Math.RND.frac` method with a seed instead of the `Math.Random` static method. (thanks @jorbascrumps)
* `Tilemaps.Components.IsometricCullTiles` does the `CheckIsoBounds` method check last when building the outputArray, as to help optimize in situations where the tile would not be visible anyways. (thanks @zegenie)
* `Tilemaps.Components.WeightedRandomize` now uses the Phaser `Math.RND.frac` method with a seed instead the `Math.Random` static method. (thanks @jorbascrumps)
* The `Layer` Game Object has had its `removeAll`, `remove` and `add` methods removed. These methods are all still available via the `List` class that Layer inherits, but the `destroyChild` parameters are no longer available.
* The `Renderer.Canvas` and `Renderer.WebGL` will now only be included in the build file if the corresponding feature flags `CANVAS_RENDERER` and/or `WEBGL_RENDERER` are set to `true`. For Canvas only builds this saves a lot of space in the build. (thanks @samme)
* You can now specify an `autoResize` boolean in the `RenderTargetConfig` which is passed to the Render Targets when they are created by a pipeline.
* The `UtilityPipeline` now sets `autoResize` to `true` in its Render Target Config, so that the global `fullFrame` and `halfFrame` Render Targets will automatically resize if the renderer changes.
* `Actions.PlaceOnLine` now has an added `ease` parameter which accepts a string from the EaseMap or a custom ease function to allow for different distrubutions along a line. (thanks @sB3p)
* If you enable a Game Object for Input Debugging, the debug shape will no longer be rendered if the Game Object itself is not visible. Fix #6364 (thanks @orjandh)
* The `XHRLoader` will now listen for `ontimeout` and if triggered it will hand over to the `File.onError` handler. This prevents the Loader from stalling if a file times out. Fix #6472 (thanks @343dev)

# Bug Fixes

* The `InputManager.onTouchMove` function has been fixed so it now correctly handles touch events on pages that have scrolled horizontally or vertically and shifted the viewport. Fix #6489 (thanks @somechris @hyewonjo)
* `Factory.staticBody`  had the wrong return type in the docs/TS defs. Fix #6693 (thanks @ddhaiby)
* The `Time.Timeline` class didn't show as extending the Event Emitter, or have `config` as an optional argument in the docs / TS defs. Fix #6673 (thanks @ghclark2)
* The `Animations.AnimationFrame` member `duration` is now the complete duration of the frame, which is a breaking change. Before this `Animations.AnimationState#msPerFrame` was combined with `Animations.AnimationFrame#duration` which wasn't intuitive. The fix to remove `Animations.AnimationState#msPerFrame` from `Animations.AnimationFrame#duration` has been removed from the `Animations.AnimationManager` method `createFromAseprite` because of this clarification. Fix #6712 (thanks @Nerodon @TomMalitz)
* The `NineSlice` Game Object method `setSize` now recalculates its origin by calling the `updateDisplayOrigin` method. (thanks @dhashvir)
* When a `Layer` Game Object is destroyed, i.e. from changing or restarting a Scene, it will no longer cause an error when trying to destroy the children on its display list. Fix #6675 (thanks @crockergd @gm0nk)
* `DynamicTexture` will now automatically call `setSize(width, height)` for both WebGL and Canvas. Previously it only did it for WebGL. This fixes an issue where DynamicTextures in Canvas mode would have a width and height of -1. Fix #6682 (thanks @samme)
* `DynamicTexture.setSize` will now check to see if the `glTexture` bound to the current frame is stale, and if so, destroy it before binding the one from the Render Target. This fixes an issue where constantly destroying and creating Dynamic Textures would cause a memory leak in WebGL. Fix #6669 (thanks @DavidTalevski)
* The `BloomFX` and `BlurFX` and any custom pipeline that relies on using the `UtilityPipeline` full or half frame targets will now correctly draw even after the renderer size changes. Fix #6677 (thanks @Nerodon)
* The `PostFXPipeline.postBatch` method will now skip `onDraw` if the pipeline hasn't booted, introducing an artificial frame skip. This should potentially fix glitch errors on mobile devices where Post FX would appear corrupted for a single frame. Fix #6681 (thanks @moufmouf @tongliang999)
* The `Matter.Body` function `scale` has been updated so if the Body originally had an `inertia` of `Infinity` this will be restored at the end of the call. This happens if you set a Matter Body to have fixed rotation. Fix #6369 (thanks @sushovande)
* Modified the `RandomDataGenerator.weightedPick` method to avoid sampling past the last element. Fix #6701 (thanks @jameskirkwood)
* The touch event handler `onTouchEndWindow` now stops pointer events when clicking through DOM elements to input. Fix #6697 (thanks @laineus)
* The `Physics.Matter.Factory` method `pointerConstraint` no longer returns an error when it can't find the camera. Fix #6684 (thanks @spritus)
* The `Physics.Arcade.StaticBody` method `reset` now re-applies `offset` values. Fixes #6729 (thanks @samme)
* The `Input.InputPlugin` method `disable` which is called by `GameObjects.GameObject#disableInteractive` keeps its temp hit box value which stops propagation to interactive Game Objects in another scene. Fixes #6601 (thanks @UnaiNeuronUp)

## Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@AlvaroEstradaDev
@stevenwithaph
@paxperscientiam
@samme
@actionmoon
@rafael-lua
@Byvire
