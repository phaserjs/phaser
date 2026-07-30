/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var IsInLayerBounds = require('./IsInLayerBounds');

/**
 * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
 * false if there is no tile or if the tile at that location has an index of -1.
 *
 * @function Phaser.Tilemaps.Components.HasTileAt
 * @since 3.0.0
 *
 * @param {number} tileX - X position to get the tile from (given in tile units, not pixels).
 * @param {number} tileY - Y position to get the tile from (given in tile units, not pixels).
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {?boolean} Returns `true` if a valid tile (with an index greater than -1) exists at the given coordinates, or `false` if the coordinates are out of bounds, the tile is null, or the tile index is -1.
 */
var HasTileAt = function (tileX, tileY, layer)
{
    if (IsInLayerBounds(tileX, tileY, layer))
    {
        var tile = layer.data[tileY][tileX];

        return (tile !== null && tile.index > -1);
    }
    else
    {
        return false;
    }
};

module.exports = HasTileAt;
