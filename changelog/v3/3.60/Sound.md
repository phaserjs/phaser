# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Sound Manager New Features

* `BaseSoundManager.gameLostFocus` is a new boolean property that is set to `true` when the game loses focus and `false` when it regains focus.
* `BaseSoundManager.getAllPlaying` is a new method that will return all currently playing sounds in the Sound Manager.

## Sound Manager Updates

* If no Audio URLs match the given device a new warning is now displayed in the console (thanks @samme)
* The `BaseSoundManager.getAll` method used to require a `key` parameter, to return Sounds matching the key. This is now optional and if not given, all Sound instances are returned.
* The `WebAudioSoundManager` will now detect if the Audio Context enters a 'suspended' or 'interrupted' state as part of its update loop and if so it'll try to resume the context. This can happen if you change or disable the audio device, such as plugging in headphones with built-in audio drivers then disconnecting them, or swapping tabs on iOS. Fix #5353 (thanks @helloyoucan)
* The `Device.Audio` module has been rewritten to use a new internal `CanPlay` function that cuts down on the amount of code required greatly.
* `Device.Audio.aac` is a new boolean property that defines if the browser can play aac audio files or not, allowing them to be loaded via the Loader (thanks @Ariorh1337)
* `Device.Audio.flac` is a new boolean property that defines if the browser can play flac audio files or not, allowing them to be loaded via the Loader (thanks @Ariorh1337)
* The `NoAudioSoundManager` now has all of the missing methods, such as `removeAll` and `get` to allow it to be a direct replacement for the HTML5 and WebAudio Sound Managers (thanks @orjandh @samme)

## Sound Manager Bug Fixes

* Setting `SoundManager.pauseOnBlur` to `true` would not stop the audio if a game lost focus on certain browsers (like Firefox and Chrome on Android 13). This is now enforced via the new `gameLostFocus` flag. Fix #6354 (thanks @klaritan @michalfialadev)
* Destroying a `WebAudioSound` in the same game step as destroying the Game itself would cause an error when trying to disconnect already disconnected Web Audio nodes. `WebAudioSound` will now bail out of its destroy sequence if it's already pending removal.
* Audio will now unlock properly again on iOS14 and above in Safari. Fix #5696 (thanks @laineus)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
