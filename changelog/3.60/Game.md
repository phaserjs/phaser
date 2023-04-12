# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Game, Config and Device New Features

* `GameConfig.stableSort` and `Device.features.stableSort` is a new property that will control if the internal depth sorting routine uses our own StableSort function, or the built-in browser `Array.sort`. Only modern browsers have a _stable_ `Array.sort` implementation, which Phaser requires. Older ones need to use our function instead. Set to 0 to use the legacy version, 1 to use the ES2019 version or -1 to have Phaser try and detect which is best for the browser (thanks @JernejHabjan)
* `Device.es2019` is a new boolean that will do a basic browser type + version detection to see if it supports ES2019 features natively, such as stable array sorting.
* `Game.pause` is a new method that will pause the entire game and all Phaser systems.
* `Game.resume` is a new method that will resume the entire game and resume all of Phaser's systems.
* `Game.isPaused` is a new boolean that tracks if the Game loop is paused, or not (and can also be toggled directly)

## Game, Config and Device Updates

* The `Device.Browser` checks for Opera and Edge have been updated to use the more modern user agent strings those browsers now use. This breaks compatibility with really old versions of those browsers but fixes it for modern ones (which is more important) (thanks @
ArtemSiz)
* `Device.safariVersion` is now set to the version of Safari running, previously it was always undefined.
* The `Game.registry`, which is a `DataManager` instance that can be used as a global store of game wide data will now use its own Event Emitter, instead of the Game's Event Emitter. This means it's perfectly safe for you to now use the Registry to emit and listen for your own custom events without conflicting with events the Phaser Game instance emits.

## Game, Config and Device Bug Fixes

* The `Game.headlessStep` method will now reset `SceneManager.isProcessing` before `PRE_RENDER`. This fixes issues in HEADLESS mode where the Scene Manager wouldn't process additionally added Scenes created after the Game had started. Fix #5872 #5974 (thanks @micsun-al @samme)
* Removed `Config.domBehindCanvas` property as it's never used internally. Fix #5749 (thanks @iamallenchang)
* When the device does not support WebGL, creating a game with the renderer type set to `Phaser.WEBGL` will now fail with an error. Previously, it would fall back to Canvas. Now it will not fall back to Canvas. If you require that feature, use the AUTO render type. Fix #5583 (thanks @samme)
* Including a `render` object within the Game Config will no longer erase any top-level config render settings. The `render` object will now take priority over the game config, but both will be used (thanks @vzhou842)
* Fixed issue in Game Config where having an empty object, such as `render: {}` would cause set properties to be overriden with the default value. Fix #6097 (thanks @michalfialadev)
* The `PluginManager.installScenePlugin` method will now check if the plugin is missing from the local keys array and add it back in, if it is (thanks @xiamidaxia)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
