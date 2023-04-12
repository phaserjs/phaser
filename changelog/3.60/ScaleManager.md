# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Scale Manager New Features

* `ScaleManager.getViewPort` is a new method that will return a Rectangle geometry object that matches the visible area of the screen, or the given Camera instance (thanks @rexrainbow)

## Scale Manager Updates

* `ScaleManager.listeners` has been renamed to `domlisteners` to avoid conflicting with the EventEmitter listeners object. Fix #6260 (thanks @x-wk)

## Scale Manager Bug Fixes

* `ScaleManager.getParentBounds` will now also check to see if the canvas bounds have changed x or y position, and if so return `true`, causing the Scale Manager to refresh all of its internal cached values. This fixes an issue where the canvas may have changed position on the page, but not its width or height, so a refresh wasn't triggered. Fix #5884 (thanks @jameswilddev)
* Setting `scale.mode` in the Game Config would be ignored. It now accepts either this, or `scaleMode` directly. Fix #5970 (thanks @samme)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
