# Version 3.80.0 - Nino - in dev

# New Features

* The Scale Manager has a new scale mode called `EXPAND`. This is inspired by the Expand mode in Godot: "Keep aspect ratio when stretching the screen, but keep neither the base width nor height. Depending on the screen aspect ratio, the viewport will either be larger in the horizontal direction (if the screen is wider than the base size) or in the vertical direction (if the screen is taller than the original size)" (thanks @rexrainbow)

# Updates

* The `TweenChainBuilder` was incorrectly setting the `persist` flag on the Chain to `true`, which goes against what the documentation says. It now correctly sets it to `false`. This means if you previously had a Tween Chain that was persisting, it will no longer do so, so add the property to regain the feature.
* The `dropped` argument has now been adeded to the documentation for the `DRAG_END` and `GAMEOBJECT_DRAG_END` events (thanks @samme)
* `Container.onChildDestroyed` is a new internal method used to destroy Container children. Previously, if you destroyed a Game Object in an exclusive Container, the game object would (momentarily) move onto the Scene display list and emit an ADDED_TO_SCENE event. Also, if you added a Sprite to a non-exclusive Container and stopped the Scene, you would get a TypeError (evaluating 'this.anims.destroy'). This happened because the fromChild argument in the DESTROY event was misinterpreted as destroyChild in the Container's remove(), and the Container was calling the Sprite's destroy() again. (thanks @samme)

# Bug Fixes

* The `InputManager.onTouchMove` function has been fixed so it now correctly handles touch events on pages that have scrolled horizontally or vertically and shifted the viewport. Fix #6489 (thanks @somechris @hyewonjo)
* `Factory.staticBody`  had the wrong return type in the docs/TS defs. Fix #6693 (thanks @ddhaiby)
* The `Time.Timeline` class didn't show as extending the Event Emitter, or have `config` as an optional argument in the docs / TS defs. Fix #6673 (thanks @ghclark2)

## Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@AlvaroEstradaDev
@stevenwithaph
@paxperscientiam

