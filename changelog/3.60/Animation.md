# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Animation System New Features

* `AnimationManager.getAnimsFromTexture` is a new method that will return all global Animations, as stored in the Animation Manager, that have at least one frame using the given Texture. This will not include animations created directly on local Sprites.
* `Animation.showBeforeDelay` is a new optional boolean property you can set when creating, or playing an animation. If the animation has a delay before playback starts this controls if it should still set the first frame immediately, or after the delay has expired (the default).
* You will now get a warning from the `AnimationManager` and `AnimationState` if you try to add an animation with a key that already exists. Fix #6434.

## Animation System Updates

* `Animation.stop` is always called when a new animation is loaded, regardless if the animation was playing or not and the `delayCounter` is reset to zero. This stops animations with delays preventing other animations from being started until the delay has expired. Fix #5680 (thanks @enderandpeter)
* `Animations.AnimationManager.createFromAseprite` has a new optional 3rd parameter `target`. This allows you to create the animations directly on a Sprite, instead of in the global Animation Manager (thanks Telemako)
* `Animations.AnimationState.createFromAseprite` is a new method that allows you to create animations from exported Aseprite data directly on a Sprite, rather than always in the global Animation Manager (thanks Telemako)

## Animation System Bug Fixes

* When playing a chained animation, the `nextAnim` property could get set to `undefined` which would stop the next animation in the queue from being set. The check now handles all falsey cases. Fix #5852 (thanks @Pythux)
* `Animation.createFromAseprite` would calculate an incorrect frame duration if the frames didn't all have the same speed.
* The frame duration calculations in the `AnimationManager.createFromAseprite` method would be incorrect if they contained a mixture of long and very short duration frames (thanks @martincapello)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
