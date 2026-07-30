/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Extend = require('../../../utils/object/Extend');

/**
 * Iterates over all tiles in every layer of the given MapData and synchronizes each tile with its
 * parent tileset. For each valid tile, this function ensures the tile's dimensions match those
 * defined by its tileset (which is important for maps that use multiple tilesets with different
 * tile sizes), and then merges any custom properties defined for that tile type in the tileset
 * onto the tile instance. This is called as part of the Tiled map parsing pipeline to ensure that
 * per-tile-type metadata exported from the Tiled editor is available on the individual tile objects
 * at runtime.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.AssignTileProperties
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.MapData} mapData - The Map Data object.
 */
var AssignTileProperties = function (mapData)
{
    var layerData;
    var tile;
    var sid;
    var set;
    var row;

    // go through each of the map data layers
    for (var i = 0; i < mapData.layers.length; i++)
    {
        layerData = mapData.layers[i];

        set = null;

        // rows of tiles
        for (var j = 0; j < layerData.data.length; j++)
        {
            row = layerData.data[j];

            // individual tiles
            for (var k = 0; k < row.length; k++)
            {
                tile = row[k];

                if (tile === null || tile.index < 0)
                {
                    continue;
                }

                // find the relevant tileset
                sid = mapData.tiles[tile.index][2];
                set = mapData.tilesets[sid];

                // Ensure that a tile's size matches its tileset
                tile.width = set.tileWidth;
                tile.height = set.tileHeight;

                // if that tile type has any properties, add them to the tile object
                if (set.tileProperties && set.tileProperties[tile.index - set.firstgid])
                {
                    tile.properties = Extend(
                        tile.properties, set.tileProperties[tile.index - set.firstgid]
                    );
                }
            }
        }
    }
};

module.exports = AssignTileProperties;
