# Version 3.87 - Aoi - in dev

## Updates

* The Particle Animation State is now optional. A Particle will not create an Animation State controller unless the `anim` property exists within the emitter configuration. By not creating the controller it leads to less memory overhead and a much faster clean-up time when destroying particles. Fix #6482 (thanks @samme)

## Bug Fixes

* Fixed the calculation of the index in `GetBitmapTextSize` that would lead to incorrect indexes vs. the docs and previous releases (thanks @bagyoni)
* `Utils.String.RemoveAt` would incorrectly calculate the slice index if it was > 0. It will now remove the correctly specified character.

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@Jessime
@drakang4
@BenAfonso
