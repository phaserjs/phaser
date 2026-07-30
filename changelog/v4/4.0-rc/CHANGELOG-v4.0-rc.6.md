# Version 4.0.0 - Release Candidate 6

## New Features

- `Texture#setWrap()` provides easy access to texture wrap mode in WebGL, which would otherwise be very technical to alter on `WebGLTextureWrapper` objects. This is probably of most use to shader authors. Thanks @Legend-Master for raising an issue where power-of-two sprites had unexpected wrapping artifacts.
- `Phaser.Textures.WrapMode.CLAMP_TO_EDGE` is always available.
- `Phaser.Textures.WrapMode.REPEAT` will only be applied to textures with width and height equal to powers of 2.
- `Phaser.Textures.WrapMode.MIRRORED_REPEAT` likewise requires powers of 2.
- Added new optional `sortByY` parameter to the Tilemap `createFromObjects` method (thanks @saintflow47)

## Clarifications

- Clarified that `Tilemap.createLayer()` with `gpu` flag enabled only works with orthographic layers, not hexagonal or isometric. Thanks @amirking59!

## Updates

- Gamepad buttons initialize as not being pressed, which created a problem when reading Gamepads in one Scene, and then reading them in another Scene. If the player held the button down for even a fraction of a second in the first scene, the second scene would see a bogus Button down event. The `Button` class now has a new optional `isPressed` boolean parameter which the `Gamepad` class uses to resolve this, initializing the current pressed state of the Button (thanks @cryonautlex)

## Fixes

- `Blend` filter parameter `texture` now correctly documented as `string`.
- `ColorMatrix` filter correctly blends input alpha.
- `ColorMatrix.desaturate` is no longer documented as `saturation`.
- `Container` now updates the blend mode it passes to children more accurately, preventing blend modes from leaking from one child into another child's filters. Thanks @leemanhopeter!
- `Filters` now correctly handles non-central object origins when the object is flipped. Thanks @ChrisCPI!
- `Glow` filter acts consistently when `knockout` is active.
- `Grid` shape now sets stroke correctly from optional initialization parameters, at 1px wide. (Use `Grid#setStrokeStyle()` to customize it further.) Thanks @Grimshad!
- `Mask` filter now correctly resizes and clears when the game resizes to an odd width or height, fixing a bug where masks might overdraw themselves over time. Thanks @leemanhopeter!
- `ParallelFilters` filter memory leak eliminated (this would occur when both passes had active filters).
- `TilemapGPULayer` now respects camera translation. Thanks @aroman!
- Fixed a crash in `TweenBuilder` when the targets array contains null or undefined elements (thanks @aomsir)
- The Loader `GetURL` function did not treat `file://` URLs as absolute. When a baseURL is set, it gets prepended to an already-absolute path, producing double-prefixed URLs (thanks @aomsir)
- Fixed a bug where multiple `Timeline` events with `once` set to `true` would silently break the timeline and prevent all future events from firing. Fix #7147 (thanks @TomorrowToday)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@chavaenc
@Urantij
@justin-calleja
@DayKev
@samme
@ospira
