/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var IsInLayerBounds = require('./IsInLayerBounds');

/**
 * Gets a tile at the given tile coordinates from the given layer.
 *
 * @function Phaser.Tilemaps.Components.GetTileAt
 * @since 3.0.0
 *
 * @param {integer} tileX - X position to get the tile from (given in tile units, not pixels).
 * @param {integer} tileY - Y position to get the tile from (given in tile units, not pixels).
 * @param {boolean} [nonNull=false] - If true getTile won't return null for empty tiles, but a Tile
 * object with an index of -1.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates
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
