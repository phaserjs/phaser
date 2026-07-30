# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Bitmap Text Game Object New Features

* `BitmapText.setLineSpacing` is a new method that allows you to set the vertical spacing between lines in multi-line BitmapText Game Objects. It works in the same was as spacing for Text objects and the spacing value can be positive or negative. See also `BitmapText.lineSpacing` for the property rather than the method.

## Bitmap Text Game Object Updates

* The `BitmapText` Game Object has two new read-only properties `displayWidth` and `displayHeight`. This allows the BitmapText to correctly use the `GetBounds` component.
* The `BitmapText` Game Object now has the `GetBounds` component added to it, meaning you can now correctly get its dimensions as part of a Container. Fix #6237 (thanks @likwidgames)
* The `GetBitmapTextSize` function now includes an extra property in the resulting `BitmapTextCharacter` object called `idx` which is the index of the character within the Bitmap Text, without factoring in any word wrapping (thanks @JaroVDH)

## Bitmap Text Game Object Bug Fixes

* BitmapText rendering wouldn't correctly apply per-character kerning offsets. These are now implemented during rendering (thanks @arbassic)
* An error in the `GetBitmapTextSize` function caused kerning to not be applied correctly to Bitmap Text objects. This now works across WebGL and Canvas (thanks @arbassic @TJ09)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
