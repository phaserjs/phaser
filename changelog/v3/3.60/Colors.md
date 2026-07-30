# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Color and Display Updates

* Calling the `ColorMatrix.set`, `reset` and `getData` methods all now use the built-in Float32 Array operations, making them considerably faster.
* `ColorMatrix._matrix` and `_data` are now Float32Arrays.
* `ColorMatrix.BLACK_WHITE` is a new constant used by blackwhite operations.
* `ColorMatrix.NEGATIVE` is a new constant used by negative operations.
* `ColorMatrix.DESATURATE_LUMINANCE` is a new constant used by desaturation operations.
* `ColorMatrix.SEPIA` is a new constant used by sepia operations.
* `ColorMatrix.LSD` is a new constant used by LSD operations.
* `ColorMatrix.BROWN` is a new constant used by brown operations.
* `ColorMatrix.VINTAGE` is a new constant used by vintage pinhole operations.
* `ColorMatrix.KODACHROME` is a new constant used by kodachrome operations.
* `ColorMatrix.TECHNICOLOR` is a new constant used by technicolor operations.
* `ColorMatrix.POLAROID` is a new constant used by polaroid operations.
* `ColorMatrix.SHIFT_BGR` is a new constant used by shift BGR operations.

## Color and Display Bug Fixes

* The method `Color.setFromHSV` would not change the members `h`, `s` and `v`, only the RGB properties. It now correctly updates them both. Fix #6276 (thanks @rexrainbow)
* `Display.RGB.equals` will now return the correct result. Previously, it would always return `false` (thanks @samme)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
