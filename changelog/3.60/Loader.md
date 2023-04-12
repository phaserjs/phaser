# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Loader Updates

* `MultiFile.pendingDestroy` is a new method that is called by the Loader Plugin and manages preparing the file for deletion. It also emits the `FILE_COMPLETE` and `FILE_KEY_COMPLETE` events, fixing a bug where `MultiFile` related files, such as an Atlas JSON or a Bitmap Font File, wouldn't emit the `filecomplete` events for the parent file, only for the sub-files. This means you can now listen for the file completion event for `multiatlas` files, among others.
* `MultiFile.destroy` is a new method that clears down all external references of the file, helping free-up resources.
* `File.addToCache` no longer calls `File.pendingDestroy`, instead this is now handled by the Loader Plugin.
* There is a new File constant `FILE_PENDING_DESTROY` which is used to ensure Files aren't flagged for destruction more than once.
* `LoaderPlugin.localSchemes` is a new array of scheme strings that the Loader considers as being local files. This is populated by the new `Phaser.Core.Config#loaderLocalScheme` game / scene config property. It defaults to `[ 'file://', 'capacitor://' ]` but additional schemes can be defined or pushed onto this array. Based on #6010 (thanks @kglogocki)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).
