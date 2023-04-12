# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Input System Updates

There are breaking changes from previous versions of Phaser.

* The `InteractiveObject.alwaysEnabled` property has been removed. It is no longer checked within the `InputPlugin` and setting it will have no effect. This property has not worked correctly since version 3.52 when the new render list was implemented. Upon further investigation we decided to remove the property entirely, rather than shoe-horn it into the render list. If you need to create a non-rendering Interactive area, use the Zone Game Object instead.

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).
