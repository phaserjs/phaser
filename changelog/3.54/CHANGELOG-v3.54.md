# Phaser 3 Change Log

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
