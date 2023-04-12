# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Tilemap New Features

* The `Tilemap` and `TilemapLayer` classes have a new method `getTileCorners`. This method will return an array of Vector2s with each entry corresponding to the corners of the requested tile, in world space. This currently works for Orthographic and Hexagonal tilemaps.

## Tilemap Updates

* The Hexagonal Tilemap system now supports all 4 different types of layout as offered by Tiled: `staggeraxis-y + staggerindex-odd`, `staggeraxis-x + staggerindex-odd`, `staggeraxis-y + staggerindex-even` and `staggeraxis-x, staggerindex-even` (thanks @rexrainbow)

## Tilemap Bug Fixes


---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).
