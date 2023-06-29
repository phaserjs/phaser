# Bug Fixes

* `Particle.scaleY` would always be set to the `scaleX` value, even if given a different one within the config. It will now use its own value correctly.
* `Array.Matrix.RotateLeft` was missing the `total` parameter, which controls how many times to rotate the matrix.
* `Array.Matrix.RotateRight` was missing the `total` parameter, which controls how many times to rotate the matrix.
* `Array.Matrix.TranslateMatrix` didn't work with any translation values above 1 due to missing parameters in `RotateLeft` and `RotateRight`
