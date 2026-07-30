# Phaser 3.85.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.85.md).

# World.js updates

* Added import statement `MatterRunner` from the `./lib/core/Runner` module.
* Added `timeBuffer` property to the default `runner` properties list. This property is used to accumulate the time elapsed between updates, enabling more controlled and precise update cycles in the physics simulation and game loop logic.

# Changes for `update` Method

*Enhanced Time Management*: Implemented a more robust handling of frame delta time calculation to accommodate edge cases such as 0, NaN, or unusually large frame deltas. This ensures smoother and more consistent updates.

*Frame Delta Smoothing*: Added a smoothing mechanism for frame delta values over a series of frames to reduce the impact of outliers and ensure smoother animations and physics simulations. This includes:

- Storing frame delta history.
- Sorting and sampling a central window from the delta history to limit the influence of outliers.
- Calculating a smoothed frame delta from the central window.

*Frame Delta Snapping*: Introduced an option to snap the frame delta to the nearest 1 Hz to stabilize updates in scenarios where frame rates are highly variable.

*Time Buffer Management*: Improved the management of the time buffer to ensure that it does not exceed the size of a single frame of updates. This includes clamping the time buffer to a maximum size based on the frame delta and engine delta.

*Performance Budgets*: Added checks to defer updates if the processing time is projected to exceed the maximum frame time budget. This helps maintain performance by limiting the number of updates per frame when necessary.

*Update Count Tracking*: Implemented tracking of the number of updates performed in a single frame, along with tracking of updates deferred due to exceeding performance budgets.

