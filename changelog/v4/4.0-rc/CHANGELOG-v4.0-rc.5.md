# Version 4.0 - Release Candidate 5

## New Features

- `Mask` filter now supports `scaleFactor` parameter, allowing the creation of scaled-down framebuffers. This can save memory in large games, but you must manage scaling logic yourself. Thanks to kimdanielarthur-cowlabs for developing the initial solution.
- `Camera` has the new property `isObjectInversion`, used internally to support special transforms for filters.
- `Shader` has the new method `renderImmediate`, which makes it straightforward to use `renderToTexture` when the object is not part of a display list, or otherwise needs updating outside the regular render loop.

## Improvements

- Drawing contexts, including filters, can now be larger than 4096 if the current device supports them. Thanks to kimdanielarthur-cowlabs for suggesting this.
- Balance rounded rectangle corners for smoothness on small corners while preventing excessive tesselation.

## Fixes

- `PhysicsGroup.add` and `StaticPhysicsGroup.add` will now check to see if the incoming child already has a body of the wrong type, and if so, will destroy it so the new correct type can be assigned.
- `Blocky` filter now has a minimum size of 1, which prevents the object from disappearing.
- `TilemapGPULayer` now takes the first tileset if it receives an array of tilesets (which is valid for Tilemaps but not for TilemapGPULayer). Thanks to ChrisCPI for the fix.
- Filters now correctly transform the camera to focus objects with intricate transforms.
- Filters now correctly handle parent transforms when focusing to the game camera.
- `DynamicTexture` method `startCapture` now handles nested parent transforms correctly. This is used in `Mask`, so masks within `Container` objects should behave correctly too.
- Children of filtered `Container`/`Layer` objects are correctly added to the current camera's `renderList`. This fixes an issue with input on overlapping interactive objects.
