# Version 3.80.1 - Nino - 27th February 2024

Please also see the [3.80](changelog/3.80/CHANGELOG-v3.80.md) Change Log for details about the major 3.80 release.

## Bug Fixes

* Fix `RenderTexture` crashing in the presence of a light.
* Fix failure to restore compressed textures after WebGL context loss.
* Fix a single WebGL error, with no visual side-effects, from occurring while calling `Shader.setRenderToTexture()` after the game has started running. Actually, the root cause was leaving new WebGL textures bound after creation.
* Ensure that `TextureSource.setFlipY` always updates the texture.
* Remove unsynced `flipY` from render textures in `Shader` and `DynamicTexture`.
* Reverted a change made in `TouchManager` that would prevent clicks from outside the game window from being registered. Fix #6747 (thanks @ulsoftnaver @jaxtheking)

## Updates

* Modified `onMouseUpWindow` and `onMouseDownWindow` in the `MouseManager` so they now check for `sourceCapabilities.firesTouchEvents` and if found, abort registering the event. This new browser event property is designed to prevent you accidentally registering a Mouse Event when a Touch Event has just occurred (see https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceCapabilities/firesTouchEvents)
