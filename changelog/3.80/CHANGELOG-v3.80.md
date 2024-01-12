# Version 3.80.0 - Yotsuba - in dev

# Updates

* The `TweenChainBuilder` was incorrectly setting the `persist` flag on the Chain to `true`, which goes against what the documentation says. It now correctly sets it to `false`. This means if you previously had a Tween Chain that was persisting, it will no longer do so, so add the property to regain the feature.
* The `dropped` argument has now been adeded to the documentation for the `DRAG_END` and `GAMEOBJECT_DRAG_END` events (thanks @samme)

# Bug Fixes

* The `InputManager.onTouchMove` function has been fixed so it now correctly handles touch events on pages that have scrolled horizontally or vertically and shifted the viewport. Fix #6489 (thanks @somechris @hyewonjo)


## Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@AlvaroEstradaDev
@stevenwithaph
