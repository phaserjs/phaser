# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Utils New Features

* `Utils.Array.Flatten` is a new function that will return a flattened version of an array, regardless of how deeply-nested it is.
* `ProcessQueue.isActive` is a new method that tests if the given object is in the active list, or not.
* `ProcessQueue.isPending` is a new method that tests if the given object is in the pending insertion list, or not.
* `ProcessQueue.isDestroying` is a new method that tests if the given object is pending destruction, or not.
* `ProcessQueue.add` will no longer place the item into the pending list if it's already active or pending.
* `ProcessQueue.remove` will check if the item is in the pending list, and simply remove it, rather than destroying it.

## Math New Features

* `Math.LinearXY` is a new function that will interpolate between 2 given Vector2s and return a new Vector2 as a result (thanks @GregDevProjects)
* `Vector2.project` is a new method that will project the vector onto the given vector (thanks @samme)

## Utils Updates

* Previously, an Array Matrix would enforce it had more than 2 rows. This restriction has been removed, allowing you to define and rotate single-row array matrices (thanks @andriibarvynko)
* The `GetValue` function has a new optional parameter `altSource` which allows you to provide an alternative object to source the value from.

## Utils Bug Fixes

* The `Utils.Array.SafeRange` function would exclude valid certain ranges. Fix #5979 (thanks @ksritharan)
* Fixed issue in `Utils.Objects.GetValue` where it would return an incorrect result if a `source` and `altSource` were provided that didn't match in structure. Fix #5952 (thanks @rexrainbow)

## Actions Bug Fixes

* The `tempZone` used by `GridAlign` has now had `setOrigin(0, 0)` applied to it. This leads to more accurate / expected zone placement when aligning grid items.
* The `Actions.Spread` method will now place the final item correctly and abort early if the array only contains 1 or 0 items (thanks @EmilSV)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
