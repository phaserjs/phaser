# Phaser 3 Change Log

## Version 3.10.1 - Hayashi - 13th June 2018

### Bug Fixes

* The InputManager would only create 1 Pointer, even if Touch input was enabled in the config, which meant you couldn't use touch events unless you first called `addPointer` or specified one in the config. Now, it Touch is enabled in the config, it'll always create 2 pointers by default.
