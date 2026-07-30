# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Build and Webpack Config Updates

* Phaser 3 is now built with webpack 5 and all related packages have been updated.
* Lots of configuration objects now have full TypeScript definitions thanks to @16patsle
* The `path` package used by the TS Defs generator has been moved to `devDependencies` (thanks @antkhnvsk)

## Build and Webpack Config Updates Bug Fixes

* Several paths have been fixed in the `phaser-core.js` entry point (thanks @pavle-goloskokovic)
* Modified the way Phaser uses `require` statements in order to fix an issue in Google's closure-compiler when variables are re-assigned to new values (thanks @TJ09)

## Browser Specific Updates

* We've added a polyfill for the `requestVideoFrameCallback` API because not all current browsers support it, but the Video Game Object now relies upon it.
* IE9 Fix: Added 2 missing Typed Array polyfills (thanks @jcyuan)
* IE9 Fix: CanvasRenderer ignores frames with zero dimensions (thanks @jcyuan)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
