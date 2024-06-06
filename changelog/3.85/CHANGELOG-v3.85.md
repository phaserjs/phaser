# Version 3.85.0 - Itsuki - in development

# New Features

# WebGL Rendering Updates

* `WebGLTextureWrapper.update` expanded:
  * `source` parameter is now type `?object`, so it can be used for anything that is valid in the constructor.
  * New `format` parameter can update the texture format.

# Updates

* Calling `Timeline.pause` will now pause any currently active Tweens that the Timeline had started (thanks @monteiz)
* Calling `Timeline.resume` will now resume any currently paused Tweens that the Timeline had started (thanks @monteiz)
* Calling `Timeline.clear` and `Timeline.destroy` will now destroy any currently active Tweens that the Timeline had created. Previously, active tweens would continue to play to completion (thanks @monteiz)
* `TimelineEvent` has a new property called `tweenInstance`. If the Timeline event has a tween that has been activated, this will hold a reference to it.

# Bug Fixes

* The `activePointers` game config option is now the correct amount of touch input pointers set. Fix #6783 (thanks @samme)
* The method `TextureManager.checkKey` will now return `false` if the key is not a string, which fixes issues where a texture could be created if a key was given that was already in use (thanks Will Macfarlane).
* Added all of the missing Loader Config values (such as `imageLoadType`) to LoaderConfig, so they now appear in the TypeScript defs.
* The `EXPAND` scale mode had a bug that prevented it from using the world bounds cameras, cutting rendering short. Fix #6767 (thanks @Calcue-dev @rexrainbow)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

