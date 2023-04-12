# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Text Game Object New Features

* `GameObjects.Text.appendText` is a new method that will append the given text, or array of text, to the end of the content already stored in the Text object.

## Text Game Object Updates

* When passing a `TextStyle` configuration object to the Text Game Objects `setStyle` method, it would ignore any `metrics` data it may contain and reset it back to the defaults. It will now respect the `metrics` config and use it, if present. Fix #6149 (thanks @michalfialadev)

## Text Game Object Bug Fixes

* The `Text.advancedWordWrap` function would incorrectly merge the current and next lines when wrapping words with carriage-returns in. Fix #6187 (thanks @Ariorh1337 @robinheidrich)
* When using RTL (right-to-left) `Text` Game Objects, the Text would vanish on iOS15+ if you changed the text or font style. The context RTL properties are now restored when the text is updated, fixing this issue. Fix #6121 (thanks @liorGameDev)
* `Text` with RTL enabled wouldn't factor in the left / right padding correctly, causing the text to be cut off. It will now account for padding in the line width calculations. Fix #5830 (thanks @rexrainbow)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
