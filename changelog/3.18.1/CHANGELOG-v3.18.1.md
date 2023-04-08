# Phaser 3 Change Log

## Version 3.18.1 - Raphtalia - 20th June 2019

### Bug Fixes

* `InputManager.preRender` didn't get the `time` property correctly, causing input plugin methods that relied on it to fail.
* `KeyboardPlugin.time` wasn't being set to the correct value, causing `checkDown` to fail constantly.
