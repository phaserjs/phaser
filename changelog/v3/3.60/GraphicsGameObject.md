# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Graphics Game Object New Features

* The `Graphics.strokeRoundedRect` and `fillRoundedRect` methods can now accept negative values for the corner radius settings, in which case a concave corner is drawn instead (thanks @rexrainbow)
* Earcut has been updated to version 2.2.4. This release improves performance by 10-15% and fixes 2 rare race conditions that could leave to infinite loops. Earcut is used internally by Graphics and Shape game objects when triangulating polygons for complex shapes.

## Graphics Game Object Bug Fixes

* `Graphics.strokeRoundedRect` would incorrectly draw the rectangle if you passed in a radius greater than half of the smaller side. This is now clamped internally (thanks @temajm)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
