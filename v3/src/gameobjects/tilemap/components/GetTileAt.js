var IsInLayerBounds = require('./IsInLayerBounds');

/**
 * Gets a tile at the given tile coordinates from the given layer.
 *
 * @param {number} tileX - X position to get the tile from (given in tile units, not pixels)
 * @param {number} tileY - Y position to get the tile from (given in tile units, not pixels)
 * @param {boolean} [nonNull=false] - If true getTile won't return null for empty tiles, but a Tile
 * object with an index of -1.
 * @param {LayerData} layer - [description]
 * @return {Tile} The tile at the given coordinates or null if no tile was found or the coordinates
 * were invalid.
 */
var GetTileAt = function (tileX, tileY, nonNull, layer)
{
    if (nonNull === undefined) { nonNull = false; }

    if (IsInLayerBounds(tileX, tileY, layer))
    {
        var tile = layer.data[tileY][tileX];
        if (tile === null)
        {
            return null;
        }
        else if (tile.index === -1)
        {
            return nonNull ? tile : null;
        }
        else
        {
            return tile;
        }
    }
    else
    {
        return null;
    }
};

module.exports = GetTileAt;
