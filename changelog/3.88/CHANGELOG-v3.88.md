# Version 3.88 - Minami - in dev

## New Features

## Updates

* `Tween.isNumberTween` is a new boolean property that tells if the Tween is a NumberTween, or not.
* The `TransformMatrix.setTransform` method has been updated so that it uses the old way of passing in matrix values for Canvas 2D. This fixes the error "Failed to execute 'setTransform' on 'CanvasRenderingContext2D': 6 arguments required, but only 1 present." in old legacy browsers such as Chromium Embedded Framework. Fix #6965 (thanks @rafa-fie)

## Bug Fixes

* `TweenData.update` will now check if the Tween is a Number Tween and apply the final start/end value to the result on completion, instead of the eased value as calculated by the change made in v3.87.

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

