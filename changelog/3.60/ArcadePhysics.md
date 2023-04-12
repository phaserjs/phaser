# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Arcade Physics New Features

* The Arcade Physics World has a new property `tileFilterOptions` which is an object passed to the `GetTilesWithin` methods used by the Sprite vs. Tilemap collision functions. These filters dramatically reduce the quantity of tiles being checked for collision, potentially saving thousands of redundant math comparisons from taking place.
* You can now optionally specify the `maxSpeed` value in the Arcade Physics Group config (thanks @samme)
* You can now optionally specify the `useDamping` boolean in the Arcade Physics Group config (thanks @samme)

## Arcade Physics Updates

* The Arcade Physics `World.enableBody` method will now only create and add a `Body` to an object if it has the Transform component, tested by checking the `hasTransformComponent` property. Without the Transform component, creating a Body would error with NaN values, causing the rest of the bodies in the world to fail.
* The `Physics.Arcade.Body.reset()` method will now call `Body.checkWorldBounds` as part of the process, moving the body outside of the bounds, should you have positioned it so they overlap during the reset. Fix #5978 (thanks @lukasharing)

## Arcade Physics Bug Fixes

* The `maxSpeed` setting in Arcade Physics wasn't recalculated during the Body update, prior to being compared, leading to inconsistent results. Fix #6329 (thanks @Bambosh)
* In Arcade Physics, Group vs. self collisions would cause double collision callbacks due to the use of the quad tree. For this specific conditions, the quad tree is now skipped. Fix #5758 (thanks @samme)
* The Arcade Physics Body will now recalculate its center after separation with a Tile in time for the values to be correct in the collision callbacks (thanks @samme)
* When destroying the Arcade Physics World it will now destroy the debug Graphics object, had one been created. Previously, these would continue to stack-up should you restart the physics world (thanks @samme)
* The "Skip intersects check by argument" change in Arcade Physics has been reverted. Fix #5956 (thanks @samme)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
