/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');
var CalculateFacesWithin = require('./CalculateFacesWithin');

/**
 * Copies the tiles in the source rectangular area to a new destination (all specified in tile
 * coordinates) within the layer. This copies all tile properties & recalculates collision
 * information in the destination region.
 *
 * @function Phaser.Tilemaps.Components.Copy
 * @private
 * @since 3.0.0
 *
 * @param {integer} srcTileX - The x coordinate of the area to copy from, in tiles, not pixels.
 * @param {integer} srcTileY - The y coordinate of the area to copy from, in tiles, not pixels.
 * @param {integer} width - The width of the area to copy, in tiles, not pixels.
 * @param {integer} height - The height of the area to copy, in tiles, not pixels.
 * @param {integer} destTileX - The x coordinate of the area to copy to, in tiles, not pixels.
 * @param {integer} destTileY - The y coordinate of the area to copy to, in tiles, not pixels.
 * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var Copy = function (srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, layer)
{
    if (srcTileX < 0) { srcTileX = 0; }
    if (srcTileY < 0) { srcTileY = 0; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    var srcTiles = GetTilesWithin(srcTileX, srcTileY, width, height, null, layer);

    var offsetX = destTileX - srcTileX;
    var offsetY = destTileY - srcTileY;

    for (var i = 0; i < srcTiles.length; i++)
    {
        var tileX = srcTiles[i].x + offsetX;
        var tileY = srcTiles[i].y + offsetY;
        if (tileX >= 0 && tileX < layer.width && tileY >= 0 && tileY < layer.height)
        {
            if (layer.data[tileY][tileX])
            {
                layer.data[tileY][tileX].copy(srcTiles[i]);
            }
        }
    }

    if (recalculateFaces)
    {
        // Recalculate the faces within the destination area and neighboring tiles
        CalculateFacesWithin(destTileX - 1, destTileY - 1, width + 2, height + 2, layer);
    }
};

module.exports = Copy;
