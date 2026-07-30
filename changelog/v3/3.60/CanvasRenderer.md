# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Canvas Renderer Updates

* `BlitterCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `ParticleManagerCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `CanvasSnapshot` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `TextureManager.getBase64` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `TilemapLayerCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.

## Canvas Renderer Bug Fixes

* The `CanvasRenderer.snapshotCanvas` method used an incorrect reference to the canvas, causing the operation to fail. It will now snapshot a canvas correctly. Fix #5792 #5448 (thanks @rollinsafary-inomma @samme @akeboshi1)
* With `roundPixels` set to true in the game or camera config, Sprites will no longer render at sub-pixel positions under CANVAS. Fix #5774 (thanks @samme)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
