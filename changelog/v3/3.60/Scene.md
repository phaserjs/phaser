# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Scene Manager New Features

* When running a Scene transition there is a new optional callback `onStart`, which is passed the parameters `fromScene`, `toScene` and `duration` allowing you to consolidate transition logic into a single callback, rather than split across the start and end events (thanks @rexrainbow)
* When starting a Scene and using an invalid key, Phaser will now raise a console warning informing you of this, instead of silently failing. Fix #5811 (thanks @ubershmekel)
* `Phaser.Scenes.Systems.getStatus` is a new method that will return the current status of the Scene.
* `Phaser.Scenes.ScenePlugin.getStatus` is a new method that will return the current status of the given Scene.

## Scene Manager Updates

* The `SceneManager.processQueue` method will no longer `return` if a new Scene was added, after starting it. This allows any other queued operations to still be run in the same frame, rather than being delayed until the next game frame. Fix #5359 (thanks @telinc1)
* `SceneManager.systemScene` is a new property that is set during the game boot and is a system Scene reference that plugins and managers can use, that lives outside of the Scene list.
* `SceneManager.stop` and `sleep` will now ignore the call if the Scene has already been shut down, avoiding potential problems with duplicate event handles. Fix #5826 (thanks @samme)
* `Scene.pause` will now check to see if the Scene is in either a RUNNING or CREATING state and throw a warning if not. You cannot pause non-running Scenes.
* If you start a Scene that is already starting (START, LOADING, or CREATING) then the start operation is now ignored (thanks @samme)
* If you start a Scene that is Sleeping, it is shut down before starting again. This matches how Phaser currently handles paused scenes (thanks @samme)

## Scene Manager Bug Fixes

* Shutting down a Scene that didn't have the `LoaderPlugin` would throw an error when removing event handlers. It now checks first, before removing (thanks @samme)
* An inactive Scene is no longer updated after a Scene transition completes. Previously, it will still update the Scene one final time. This fix also prevents the `POST_UPDATE` event from firing after the transition is over. Fix #5550 (thanks @mijinc0 @samme)
* The `SceneManager.bootScene` method will now always call `LoaderPlugin.start`, even if there are no files in the queue. This means that the Loader will always dispatch its `START` and `COMPLETE` events, even if the queue is empty because the files are already cached. You can now rely on the `START` and `COMPLETE` events to be fired, regardless, using them safely in your preload scene. Fix #5877 (thanks @sipals)
* `SceneManager.moveAbove` and `moveBelow` now take into account the modified indexes after the move (thanks @EmilSV)
* If you Paused or Stopped a Scene that was in a preload state, it would still call 'create' after the Scene had shutdown (thanks @samme)
* The `SceneManager.moveAbove` and `moveBelow` methods didn't check the order of the Scenes being moved, so moved them even if one was already above / below the other. Both methods now check the indexes first. Fix #6040 (thanks @yuupsup)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
