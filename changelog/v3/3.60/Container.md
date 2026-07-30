# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Container Updates

* `Container.addHandler` will now call `GameObject.addedToScene`.
* `Container.removeHandler` will now call `GameObject.removedFromScene`.

## Container Bug Fixes

* Game Objects that were created and destroyed (or moved to Containers) in the same frame were not correctly removed from the UpdateList. Fix #5803 (thanks @samme)
* `Container.removeHandler` now specifies the context for `Events.DESTROY`, fixing an issue where objects moved from one container, to another, then destroyed, would cause `sys` reference errors. Fix 5846 (thanks @sreadixl)
* `Container.removeAll` (which is also called when a Container is destroyed) will now directly destroy the children, if the given parameter is set, rather than doing it after removing them via the event handler. This fixes an issue where nested Containers would add destroyed children back to the Scene as part of their shutdown process. Fix #6078 (thanks @BenoitFreslon)
* Sprites created directly (not via the Game Object Factory) which are then added to a Container would fail to play their animations, because they were not added to the Scene Update List. Fix #5817 #5818 #6052 (thanks @prakol16 @adomas-sk)
* The `Container.pointToContainer` method would ignore the provided `output` parameter, but now uses it (thanks @vforsh)
* `ContainerCanvasRenderer` would pass in a 5th `container` parameter to the child `renderCanvas` call, which was breaking the `GraphicsCanvasRenderer` and isn't needed by any Game Object, so has been removed. Fix #6093 (thanks @Antriel)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
