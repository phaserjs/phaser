# Phaser 3 Change Log

## Version 3.55.0 - Ichika - 24th May 2021

### New Features

* `GameObjects.DOMElement.pointerEvents` is a new property that allows you to set the `pointerEvents` attribute on the DOM Element CSS. This is `auto` by default and should not be changed unless you know what you're doing.
* `Core.Config.domPointerEvents` is a new config property set via `dom: { pointerEvents }` within the Game Config that allows you to set the `pointerEvents` css attribute on the DOM Element container.
* The `RenderTexture.endDraw` method has a new optional boolean `erase` which allows you to draw all objects in the batch using a blend mode of ERASE. This has the effect of erasing any filled pixels in the objects being drawn.
* All of the methods from the `GraphicsPipeline` have now been merged with the `MultiPipeline`, these include `batchFillRect`, `batchFillTriangle`, `batchStrokeTriangle`, `batchFillPath`, `batchStrokePath` and `batchLine`. The Graphics Game Object and all of the Shape Game Objects have been updated to use the new Multi Pipeline. This means that drawing Sprites and Graphics / Shapes will all batch together again. Fix #5553 #5500 (thanks @venarius @roberthook823)

### Updates

* The types have been improved for WebGL Compressed Textures (thanks @vforsh)
* `Container.moveAbove` is a new method that will move a Game Object above another in the same Container (thanks @rexrainbow)
* `Container.moveBelow` is a new method that will move a Game Object below another in the same Container (thanks @rexrainbow)
* `List.moveAbove` is a new method that will move a Game Object above another in the same List (thanks @rexrainbow)
* `List.moveBelow` is a new method that will move a Game Object below another in the same List (thanks @rexrainbow)
* The `MeasureText` function, as used by Text Game Objects, has had its performance enhanced by removing a duplicate image data check and also now checks for metrics properties correctly (thanks @valadaptive)
* `WebGLShader.setUniform1` has a new optional boolean parameter `skipCheck` which will force the function to set the values without checking against the previously held ones.
* `WebGLShader.setUniform2` has a new optional boolean parameter `skipCheck` which will force the function to set the values without checking against the previously held ones.
* `WebGLShader.setUniform3` has a new optional boolean parameter `skipCheck` which will force the function to set the values without checking against the previously held ones.
* `WebGLShader.setUniform4` has a new optional boolean parameter `skipCheck` which will force the function to set the values without checking against the previously held ones.
* The `WebGLShader.set1fv`, `set2fv`, `set3fv`, `set4fv`, `set1iv`, `set2iv`, `set3iv`, `set4iv`, `setMatrix2fv`, `setMatrix3fv` and `setMatrix4fv` methods no longer try to do array comparisons when setting the uniforms, but sets them directly. Fix #5670 (thanks @telinc1)

### Bug Fixes

* Have reverted all of the DOM Element CSS changes back to how they were in 3.52, causing both DOM Input and Phaser Input to work together properly again. Fix #5628 (thanks @sacharobarts)
* The `Mesh` Game Object would incorrectly cull faces if the Scene Camera scrolled. It now calculates the cull correctly, regardless of camera world position, zoom or rotation. Fix #5570 (thanks @hendrikras)
* `Math.ToXY` will now return an empty Vector 2 if the index is out of range, where before it would return the input Vector2 (thanks @Trissolo)
* The `UpdateList.shutdown` method will now remove the `PRE_UPDATE` handler from the ProcessQueue correctly (thanks @samme)
* When loading a Video with a config object, it would not get the correct `key` value from it (thanks @mattjennings)
* The `GameObjectFactory.existing` method will now accept `Layer` as a TypeScript type. Fix #5642 (thanks @michal-bures)
* The `Input.Pointer.event` property can now be a `WheelEvent` as well.
* Fixed an issue when loading audio files from a Phaser project wrapped in Capacitor native app shell on iOS (thanks @consolenaut)
* Video would not resume playing after regaining focus swapping from another browser tab. Fix #5377 (thanks @spayton)
* Container will now invoke `addToRenderList` before leaving the render method, fixing an issue with Container Input. Fix #5506 (thanks @vforsh @rexrainbow)
* The `Game.postBoot` callback was never being invoked due to an incorrect internal property setter. Fix #5689 (thanks @sebastianfast)
* The `Light` Game Object didn't set the shader uniforms correctly, causing it to appear to ignore image rotation with normal maps. Fix #5660 (thanks @sroboubi @telinc1)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@x-wk @samme @trynx @Palats @supertorpe @Pixelguy @Fractal @halgorithm @Golden @H0rn0chse @EmilSV @Patapits @karbassi

## Version 3.54.0 - Futaro - 26th March 2021

### New Features

* `Phaser.Math.Median` is a new function that will calculate the median of the given values. The values are sorted and the middle value is returned. In case of an even number of values, the average of the two middle values is returned (thanks @vforsh)
* `ScenePlugin.pluginKey` is a new string-based property, set by the `PluginManager` that contains the key of the plugin with the Scene Systems.

### Updates

* When the Scene-owned Input Plugin is shutdown (i.e. via a call to `Scene.stop`) it will now _remove_ any `Key` objects that the plugin created, not just reset them. This is a quality-of-life breaking change from how it worked previously (thanks @veleek)
* Thanks to a TS Parser update by @krotovic the JSDocs can now define `@this` tags. Fix #4669.
* The `Scenes.Systems.install` method has been removed. It's no longer required and would throw an error if called. Fix #5580 (thanks @Trissolo)
* The `WebAudioSoundManager.onFocus` method will now test to see if the state of the `AudioContext` is `interrupted`, as happens on iOS when leaving the page, and then resumes the context. Fix #5390 #5156 #4790 (thanks @SBCGames @micsun-al @AdamXA)

### Bug Fixes

* Adding a Game Object to a Container that already existed in another Container would leave a copy of it on the Display List. Fix #5618 (thanks Kromah @mariogarranz)
* Fixed missing `backgroundColor` property in GameConfig. Fix #5597 (thanks @eli-s-r)
* BitmapText wouldn't render correctly with the Canvas Renderer when the texture came from a Texture Atlas. Fix #5545 (thanks @vforsh)
* #5504 had broken DOM Elements being able to be clicked due to an oversight of the DOM Container. DOM Elements now correctly pick-up the default pointer events handler. Fix #5594 (thanks @pizkaz)
* The `RGBToString` function will no longer return CSS strings with decimal places if the input contained them (thanks @neil-h)
* Objects added to a `SpineContainer` were also added to the base Display List, causing them to appear twice. Fix #5599 (thanks @spayton)
* When an Animation has `skipMissedFrames` set it will now bail out of the skip catch-up loop if any of the frames cause the animation to complete. Fix #5620 (thanks @fenrir1990 @Aveyder)
* The `Spine Plugin` factory functions now use the local Scene Spine Plugin reference in order to create the objects, rather than the Scene belonging to the first instance of the plugin. This prevents errors when you have globally installed the Spine plugin, but then remove or destroy the first Scene using it (thanks stever1388 @samme)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme @masterT @krotovic @Kvisaz
