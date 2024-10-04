# Version 3.85.3 - Itsuki - in development

## Bug Fixes

* The `Array.MoveAbove` function didn't recalculate the baseIndex after the splice, meaning the item would end up in the wrong location.
* The `HexagonalTileToWorldXY` function incorrectly used `this` instead of `layer` causing it to error in hex tilemaps with x axis staggering. Fix #6913 (thanks @jummy123)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

