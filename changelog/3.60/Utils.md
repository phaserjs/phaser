# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Utils New Features

* `Utils.Array.Flatten` is a new function that will return a flattened version of an array, regardless of how deeply-nested it is.
* `ProcessQueue.isActive` is a new method that tests if the given object is in the active list, or not.
* `ProcessQueue.isPending` is a new method that tests if the given object is in the pending insertion list, or not.
* `ProcessQueue.isDestroying` is a new method that tests if the given object is pending destruction, or not.
* `ProcessQueue.add` will no longer place the item into the pending list if it's already active or pending.
* `ProcessQueue.remove` will check if the item is in the pending list, and simply remove it, rather than destroying it.

## Utils Updates

* Previously, an Array Matrix would enforce it had more than 2 rows. This restriction has been removed, allowing you to define and rotate single-row array matrices (thanks @andriibarvynko)
* The `GetValue` function has a new optional parameter `altSource` which allows you to provide an alternative object to source the value from.

## Utils Bug Fixes

* The `Utils.Array.SafeRange` function would exclude valid certain ranges. Fix #5979 (thanks @ksritharan)
* Fixed issue in `Utils.Objects.GetValue` where it would return an incorrect result if a `source` and `altSource` were provided that didn't match in structure. Fix #5952 (thanks @rexrainbow)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).
