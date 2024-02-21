# Version 3.80.0 - Nino - 21st February 2024

# New Features - WebGL Context Loss Handling

* Phaser now performs a [WebGL Context Restore](WebGLContextRestore.md) to keep the game running after losing WebGL context. This affects many parts of the rendering system, but everything should work just the same unless you're doing something very technical. See the link for more details.

# New Feature - Base64 Loader

The Phaser LoaderPlugin and related classes have been updated so that they now work natively with base64 encoded files and Data URIs. This means you can now load a base64 encoded image, audio file or text file directly into the Loader. The Loader will then decode the data and process it as if it was a normal file. This is particularly useful for environments such as Playable Ads where you have to provide a single html file with all assets embedded and no XHR requests.

* `Loader.File.base64` is a new read-only boolean property that is set if the file contains a Data URI encoded string.
* `Loader.File.onBase64Load` is a new method that is called when the file has finished decoding from a Data URI.
* The `ImageFile` will now default to using the Image Load Element if a base64 file is detected, instead of throwing a console warning about unsupported types.
* The `XHRLoader` will now return a fake XHR result object containing the decoded base64 data if a base64 file is detected, skipping the creation of a real XML Http Request object.

# New Feature - Scale Manager Snap Mode

The Game Config has a new Scale Manager property called `snap`. This allows you to set a 'snapping' value for the width and height of your game. This is especially useful for games where you want to keep a fixed dimension: for example, you want the game to always snap to a multiple of 16 pixels for the width. Or, if you want to scale a pixel-art game up by integer values, you can now set the game size as the `snap` value and the Scale Manager will ensure the game size is always a multiple of that value.

* A new property is available in the Game Configuration specifically for setting the 'snap' values for the Scale Manager. You can now set `snap: { width, height }` in the game config. This is then passed to the display size by the Scale Manager and used to control the snap values. Fix #6629 (thanks @musjj @samme)
* `ScaleManager.setSnap` is a new method that allows you to set the snap values for the game size, should you need to do it post-boot and not in the game config.
* `Config#snapWidth` and `Config#snapHeight` are new properties in the Game Config that hold the parsed `snap` config values, as used by the Scale Manager.

# New Features

* The Scale Manager has a new scale mode called `EXPAND`. This is inspired by the Expand mode in Godot: "Keep aspect ratio when stretching the screen, but keep neither the base width nor height. Depending on the screen aspect ratio, the viewport will either be larger in the horizontal direction (if the screen is wider than the base size) or in the vertical direction (if the screen is taller than the original size)" (thanks @rexrainbow)
* The `Tilemap.createFromTiles` method has been updated. It will now copy the following properties, if set in the Tile, to the Sprites it creates: `rotation`, `flipX`, `flipY`, `alpha`, `visible` and `tint`. If these properties are declared in the `spriteConfig` passed to the method, those will be used instead, otherwise the Tile values are used. Fix #6711 (thanks @Nerodon)
* The `Tilemap.createFromTiles` method has a new property called `useSpriteSheet`. If this is set to `true` and you have loaded the tileset as a sprite sheet (not an image), then it will set the Sprite key and frame to match the sprite texture and tile index. Also, if you have not specified an `origin` in the spriteConfig, it will adjust the sprite positions by half the tile size, to position them accurately on the map.
* `Texture#getFrameBounds` is a new method that will return the bounds that all of the frames of a given Texture Source encompass. This is useful for things like calculating the bounds of a Sprite Sheet embedded within a Texture Atlas.
* `Math.RectangleLike` is a new typedef that defines a rectangle-like object with public `x`, `y`, `width` and `height` properties.

# WebGL Renderer Updates

* Fix MIPmap filters being effectively disabled for compressed textures.
* `WebGLRenderer.getCompressedTextures` can now identify BPTC and RGTC support correctly. These were previously skipped.
* PVR compressed texture files now support sRGB color space in S3TCSRGB, ETC, and ASTC formats. Fix #6247 (thanks @dominikhalvonik)
* Compressed texture files which are incompatible with WebGL will now fail to load, and display a console warning explaining why. Previously they might seem to load, but not display properly.
* Add experimental support for BPTC compressed textures in PVR files.
* Change `S3TCRGB` to `S3TCSRGB` in `WebGLTextureCompression`, `CompressedTextureFileConfig`, and `FileConfig` typedefs.
* Fix generating spritesheets from members of texture atlases based on compressed textures (thanks @vladyslavfolkuian)
* The `BloomFX` and `BlurFX` and any custom pipeline that relies on using the `UtilityPipeline` full or half frame targets will now correctly draw even after the renderer size changes. Fix #6677 (thanks @Nerodon)
* The `PostFXPipeline.postBatch` method will now bind the current Render Target after the pipeline has booted for the first time. This fixes glitch errors on mobile devices where Post FX would appear corrupted for a single frame. Fix #6681 (thanks @moufmouf @tongliang999)
* Fix unpredictable text sizes failing to render in WebGL with `mipmapFilter` set. Fix #6721 (thanks @saintflow and @rexrainbow)
* The `UtilityPipeline` now sets `autoResize` to `true` in its Render Target Config, so that the global `fullFrame` and `halfFrame` Render Targets will automatically resize if the renderer changes.
* `WebGLPipeline.resizeUniform` is a new property that is defined in the `WebGLPipelineConfig`. This is a string that defines a `uResolution` property, or similar, within the pipeline shader. If the WebGL Renderer resizes, this uniform will now be updated automatically as part of the pipeline resize method. It has been added to both the Multi and Mobile pipelines as default. This fixes issues where the pipelines were rendering with old resolution values, causing graphical glitches in mostly pixel-art games. Fix #6674 #6678 (thanks @Nerodon @LazeKer)

# Spine Updates

* The Spine 3 and 4.1 Plugins will now call `preUpdate` automatically when the `play` method is called. This forces the new animation state to update and apply itself to the skeleton. This fixes an issue where Spine object would show the default frame in the Spine atlas for a single update before the animation started. Fix #5443 (thanks @spayton)
* `SpineGameObject.setSlotAlpha` is a new method that allows you to set the alpha on a specific slot in a Spine skeleton.
* The `SpineGameObject.setAlpha` method has had its 2nd parameter removed. This fixes needless slot look-ups during rendering when a Spine Game Object is inside a regular Container. If you need to set slot alpha, use the new `setSlotAlpha` method instead. Fix #6571 (thanks @spayton)
* The `SpineFile.onFileComplete` handler was running a regular expression against `file.src` instead of `file.url`, sometimes leading to double paths in the atlas paths on loading. Fix #6642 (thanks @rez23)

# Input Updates

The Phaser Input and related classes have been updated to be more consistent with each Game Object.

* If you enable a Game Object for Input Debugging, the debug shape will no longer be rendered if the Game Object itself is not visible. Fix #6364 (thanks @orjandh)
* `Mesh` based Game Objects now can use an input config with the `setInteractive` method, which supports the options `draggable`, `dropzone`, `cursor` and `userHandCursor`. Fix #6510 #6652 (thanks @Baegus @Neppord)
* The touch event handler `onTouchEndWindow` now stops pointer events when clicking through DOM elements to input. Fix #6697 (thanks @laineus)
* The `Input.InputPlugin` method `disable` which is called by `GameObjects.GameObject#disableInteractive` keeps its temp hit box value which stops propagation to interactive Game Objects in another scene. Fix #6601 (thanks @UnaiNeuronUp)
* Using `setInteractive` and `removeInteractive` methods of a Game Object outside of the game loop would cause an error in which `Input.InputManager#resetCursor` would lose input context. Fix #6387 (thanks @TomorrowToday)

# Updates

* The `TweenChainBuilder` was incorrectly setting the `persist` flag on the Chain to `true`, which goes against what the documentation says. It now correctly sets it to `false`. This means if you previously had a Tween Chain that was persisting, it will no longer do so, so add the property to regain the feature.
* The `dropped` argument has now been added to the documentation for the `DRAG_END` and `GAMEOBJECT_DRAG_END` events. (thanks @samme)
* `Container.onChildDestroyed` is a new internal method used to destroy Container children. Previously, if you destroyed a Game Object in an exclusive Container, the game object would (momentarily) move onto the Scene display list and emit an ADDED_TO_SCENE event. Also, if you added a Sprite to a non-exclusive Container and stopped the Scene, you would get a TypeError (evaluating 'this.anims.destroy'). This happened because the fromChild argument in the DESTROY event was misinterpreted as destroyChild in the Container's remove(), and the Container was calling the Sprite's destroy() again. (thanks @samme)
* The `Text` and `TileSprite` Game Objects now place their textures into the global `TextureManager` and a `_textureKey` private string property has been added which contains a UUID to reference that texture.
* The `Tilemaps.Components.WeightedRandomize` method now uses the Phaser `Math.RND.frac` method with a seed instead of the `Math.Random` static method. (thanks @jorbascrumps)
* `Tilemaps.Components.IsometricCullTiles` does the `CheckIsoBounds` method check last when building the outputArray, as to help optimize in situations where the tile would not be visible anyway. (thanks @zegenie)
* `Tilemaps.Components.WeightedRandomize` now uses the Phaser `Math.RND.frac` method with a seed instead the `Math.Random` static method. (thanks @jorbascrumps)
* The `Layer` Game Object has had its `removeAll`, `remove` and `add` methods removed. These methods are all still available via the `List` class that Layer inherits, but the `destroyChild` parameters are no longer available.
* The `Renderer.Canvas` and `Renderer.WebGL` will now only be included in the build file if the corresponding feature flags `CANVAS_RENDERER` and/or `WEBGL_RENDERER` are set to `true`. For Canvas only builds this saves a lot of space in the build. (thanks @samme)
* You can now specify an `autoResize` boolean in the `RenderTargetConfig` which is passed to the Render Targets when they are created by a pipeline.
* The `Actions` method `PlaceOnLine` now has an added `ease` parameter which accepts a string from the EaseMap or a custom ease function to allow for different distributions along a line. (thanks @sB3p)
* The `XHRLoader` will now listen for `ontimeout` and if triggered it will hand over to the `File.onError` handler. This prevents the Loader from stalling if a file times out. Fix #6472 (thanks @343dev)
* `LightPipeline.currentNormalMap` was incorrectly documented as being a property of `WebGLRenderer`.
* The `Video` Game Object now emits a `metadata` event, which emits once the video metadata is available.
* The `Time.Timeline` class now supports looping via the `repeat` method. `Types.Time.TimelineEvent` now has a `loop` callback which will be called before its next iteration. Fix #6560 (thanks @micsun-al)
* The `Curves.Path` methods `lineTo` and `moveTo` now support `Types.Math.Vector2Like` as the first parameter. Fix #6557 (thanks @wayfu)
* The `BitmapText.setFont` method will now set the texture, size and alignment even if the same font key has been given as is already in use. Fix #6740 (thanks @AlvaroNeuronup)
* `WebAudioSound` will now set `hasEnded = false` as part of `stopAndRemoveBufferSource`, after the source has been stopped and disconnected. This should prevent it from being left in a `true` state if the source `onended` callback fired late, after the sound had been re-played. Fix #6657 (thanks @Demeno)
* The `ScaleManager.orientationChange` event listener will now directly refresh the Scale Manager internals. This fixes an issue where the orientation change event would fire after the window resize event, causing the Scale Manager to incorrectly report the new orientation on Chrome on iOS. Fix #6484 #5762 (thanks @spayton @meetpatel1989)
* The `Tileset.updateTileData` method has two new optional parameters `offsetX` and `offsetY` which allow you to set the offset that the tile data starts from within the base source texture.

# Bug Fixes

* `Factory.staticBody` had the wrong return type in the docs/TS defs. Fix #6693 (thanks @ddhaiby)
* The `Time.Timeline` class didn't show as extending the Event Emitter, or have `config` as an optional argument in the docs / TS defs. Fix #6673 (thanks @ghclark2)
* The `Animations.AnimationFrame` member `duration` is now the complete duration of the frame, which is a breaking change. Before this `Animations.AnimationState#msPerFrame` was combined with `Animations.AnimationFrame#duration` which wasn't intuitive. The fix to remove `Animations.AnimationState#msPerFrame` from `Animations.AnimationFrame#duration` has been removed from the `Animations.AnimationManager` method `createFromAseprite` because of this clarification. Fix #6712 (thanks @Nerodon @TomMalitz)
* The `NineSlice` Game Object method `setSize` now recalculates its origin by calling the `updateDisplayOrigin` method. Fix #6713 (thanks @dhashvir)
* The `NineSlice` Game Object method no longer defaults origin to `0.5`. Fix #6655 (thanks @michalfialadev)
* When a `Layer` Game Object is destroyed, i.e. from changing or restarting a Scene, it will no longer cause an error when trying to destroy the children on its display list. Fix #6675 (thanks @crockergd @gm0nk)
* `DynamicTexture` will now automatically call `setSize(width, height)` for both WebGL and Canvas. Previously it only did it for WebGL. This fixes an issue where DynamicTextures in Canvas mode would have a width and height of -1. Fix #6682 (thanks @samme)
* `DynamicTexture.setSize` will now check to see if the `glTexture` bound to the current frame is stale, and if so, destroy it before binding the one from the Render Target. This fixes an issue where constantly destroying and creating Dynamic Textures would cause a memory leak in WebGL. Fix #6669 (thanks @DavidTalevski)
* The `Matter.Body` function `scale` has been updated so if the Body originally had an `inertia` of `Infinity` this will be restored at the end of the call. This happens if you set a Matter Body to have fixed rotation. Fix #6369 (thanks @sushovande)
* Modified the `RandomDataGenerator.weightedPick` method to avoid sampling past the last element. Fix #6701 (thanks @jameskirkwood)
* The `Physics.Matter.Factory` method `pointerConstraint` no longer returns an error when it can't find the camera. Fix #6684 (thanks @spritus)
* The `Physics.Arcade.StaticBody` method `reset` now re-applies `offset` values. Fix #6729 (thanks @samme)
* The `Video` Game Object now has a starting texture, which stops errors with accessing `frame` before the video loads the first frame. Fix #6475 (thanks @rexrainbow @JoeSiu)
* The `Device.Browser.safari` regular expression has been strenghtened so it now captures versions with double or triple periods in. Previously it would fail for `Version/17.2.1` due to the minor value. (thanks watcher)
* The `Browser` Device class will no longer think that Chrome is Mobile Safari on iOS devices. Fix #6739 (thanks @michalfialadev)
* The `GameObjectCreator` method `container` now includes all children in the config, accessed via `Scene.make.container`. Fix #6743 (thanks @Fake)
* Tilemaps that have been created using Tiles taken from a Sprite Sheet embedded in a Texture Atlas (via `addSpriteSheetFromAtlas` and `Tilemap.addTilesetImage`) will now render correctly. Fix #6691 (thanks @Antriel)
* The `TilemapWebGLRenderer` function has been fixed so it now uses the TileSet width and height for the tile draw command. This fixes an issue where the Tilemap would render incorrectly if the base tile size was different to the tile size. Fix #5988 (thanks @samme)
* The `ArcadePhysics.World.collideSpriteVsTilemapLayer` method has been modified so that the body bounds are now expanded by the size of the scaled base tile in the Tilemap Layer. This fixes an issue where the check would skip over-sized tiles that were outside the bounds of the body. Mostly noticeable on layers that had a different base tile size to the map itself. Fix #4479 (thanks @KingCosmic)

## Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@actionmoon
@AlvaroEstradaDev
@Byvire
@Creepypoke
@Flashfyre
@orcomarcio
@paxperscientiam
@michalfialadev
@rafael-lua
@samme
@Stan-Stani
@stevenwithaph
@yaustar
@rexrainbow
