# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Tilemap New Features

* The `Tilemap` and `TilemapLayer` classes have a new method `getTileCorners`. This method will return an array of Vector2s with each entry corresponding to the corners of the requested tile, in world space. This currently works for Orthographic and Hexagonal tilemaps.
* You can now control the drawing offset of tiles in a Tileset using the new optional property `Tileset.tileOffset` (which is a Vector2). This property is set automatically when Tiled data is parsed and found to contain it. Fix #5633 (thanks @moJiXiang @kainage)
* The `Tilemap.createFromObjects` method has been overhauled to support typed tiles from the Tiled Map Editor (https://doc.mapeditor.org/en/stable/manual/custom-properties/#typed-tiles). It will now also examine the Tileset to inherit properties based on the tile gid. It will also now attempt to use the same texture and frame as Tiled when creating the object (thanks @lackhand)
* Experimental feature: The `TilemapLayer` now has the `Mask` component - meaning you can apply a mask to tilemaps (thanks @samme)
* `TilemapLayer.setTint` is a new method that allows you to set the tint color of all tiles in the given area, optionally based on the filtering search options. This is a WebGL only feature.
* The Hexagonal Tilemap system now supports all 4 different types of layout as offered by Tiled: `staggeraxis-y + staggerindex-odd`, `staggeraxis-x + staggerindex-odd`, `staggeraxis-y + staggerindex-even` and `staggeraxis-x, staggerindex-even` (thanks @rexrainbow)

## Tilemap Updates

* `Tilemap.getLayerIndex` will now return `null` if a given TilemapLayer instance doesn't belong to the Tilemap or has been destroyed.
* `Tilemap.addTilesetImage` has a new optional parameter `tileOffset` which, if given, controls the rendering offset of the tiles. This was always available on the Tileset itself, but not from this function (thanks @imothee)
* The `MatterTileBody` class, which is created when you convert a Tilemap into a Matter Physics world, will now check to see if the Tile has `flipX` or `flipY` set on it and rotate the body accordingly. Fix #5893 (thanks @Olliebrown @phaserhelp)
* Removed the `HexagonalTileToWorldY` function as it cannot work without an X coordinate. Use `HexagonalTileToWorldXY` instead.
* Removed the `HexagonalWorldToTileY` function as it cannot work without an X coordinate. Use `HexagonalWorldToTileXY` instead.
* `TileMap.createBlankDynamicLayer` has now been removed as it was deprecated in 3.50.
* `TileMap.createDynamicLayer` has now been removed as it was deprecated in 3.50.
* `TileMap.createStaticLayer` has now been removed as it was deprecated in 3.50.

## Tilemap Bug Fixes

* `Matter.convertTilemapLayers` had an edge-case which could create composite bodies unintentionally. If any tiles had multiple colliders and you were providing body creation options, the `parts` property in the options would be modified and then concatenated with any bodies created after it. This could mean that some tiles would be combined when they shouldn't be, and on large maps would eventually hang once the convex hull got too big / complex. It now runs a copy on the object before using it (thanks @EddieCameron)
* The `TilemapLayer.skipCull` feature wasn't being applied correctly for Isometric, Hexagonal or Staggered tiles, only for Orthographic tiles (the default). It will now respect the `skipCull` property and return all tiles during culling if enabled. Fix #5524 (thanks @veleek)
* Recoded the point conversion math in the `HexagonalTileToWorldXY` function as it was incorrect. Now returns world coordinates correctly.
* `Tilemap.copy` would error if you copied a block of tiles over itself, even partially, as it tried to copy already replaced tiles as part of the function. It will now copy correctly, regardless of source or destination areas. Fix #6188 (thanks @Arkyris)
* `Tile.copy` will now use the `DeepCopy` function to copy the `Tile.properties` object, as otherwise it just gets copied by reference.
* Recoded the point conversion math in the `HexagonalWorldToTileXY` function as it was incorrect. Now detects any dimension hexagon correctly. Fix #5608 (thanks @stonerich)
* Fixed the point conversion math in the `IsometricWorldToTileXY` function and added optional boolean property that allows the setting of the tile origin to the top or base. Fix #5781 (thanks @benjamin-wilson)
* Calling `Tilemap.worldToTileX` or `worldToTileY` on a Isometric or Hexagonal Tilemap will now always return `null` instead of doing nothing, as you cannot convert to a tile index using just one coordinate for these map types, you should use `worldToTileXY` instead.
* The `Tilemap.destroyLayer` method would throw an error "TypeError: layer.destroy is not a function". It now correctly destroys the TilemapLayer. Fix #6268 (thanks @samme)
* `MapData` and `ObjectLayer` will now enforce that the `Tilemap.objects` property is always an array. Sometimes Tiled willl set it to be a blank object in the JSON data. This fix makes sure it is always an array. Fix #6139 (thanks @robbeman)
* The `ParseJSONTiled` function will now run a `DeepCopy` on the source Tiled JSON, which prevents object mutation, fixing an issue where Tiled Object Layer names would be duplicated if used across multiple Tilemap instances. Fix #6212 (thanks @temajm @wahur666)
* The `Tilemap.createFromObjects` method will now correctly place both tiles and other objects. Previously, it made the assumption that the origin was 0x1 for all objects, but Tiled only uses this for tiles and uses 0x0 for its other objects. It now handles both. Fix #5789 (thanks @samme)
* The `Tilemap.tileToWorldY` method incorrectly had the parameter `tileX`. It will worked, but didn't make sense. It is now `tileY` (thanks @mayacoda)
* The `Tilemap.convertTilemapLayer` method would fail for _isometric tilemaps_ by not setting the physic body alignment properly. It will now call `getBounds` correctly, allowing for use on non-orthagonal maps. Fix #5764 (thanks @mayacoda)
* The `ParseTileLayers` function has been updated so that it no longer breaks when using a Tiled infinite map with empty chunks (thanks @jonnytest1)
* The `PutTileAt` function will now set the Tile dimensions from the source Tileset, fixing size related issues when placing tiles manually. Fix #5644 (thanks @moJiXiang @stuffisthings)
* The new `Tileset.tileOffset` property fixes an issue with drawing isometric tiles when an offset had been defined in the map data (thanks @moJiXiang)
* The `Tilemaps.Tile.getBounds` method would take a `camera` parameter but then not pass it to the methods called internally, thus ignoring it. It now factors the camera into the returned Rectangle.
* `Tilemap.createFromObjects` has had the rendering of Tiled object layers on isometric maps fixed. Objects contained in object layers generated by Tiled use orthogonal positioning even when the map is isometric and this update accounts for that (thanks @lfarroco)
* The `TilemapLayer.getTilesWithinShape` method would not return valid results when used with a Line geometry object. Fix #5640 (thanks @hrecker @samme)
* When creating a `MatterTileBody` from an isometric tile the tiles top value would be incorrect. The `getTop` method has been fixed to address this (thanks @adamazmil)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
