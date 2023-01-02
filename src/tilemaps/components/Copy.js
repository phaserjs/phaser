/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CalculateFacesWithin = require('./CalculateFacesWithin');
var GetTilesWithin = require('./GetTilesWithin');
var IsInLayerBounds = require('./IsInLayerBounds');
var Tile = require('../Tile');

/**
 * Copies the tiles in the source rectangular area to a new destination (all specified in tile
 * coordinates) within the layer. This copies all tile properties and recalculates collision
 * information in the destination region.
 *
 * @function Phaser.Tilemaps.Components.Copy
 * @since 3.0.0
 *
 * @param {number} srcTileX - The x coordinate of the area to copy from, in tiles, not pixels.
 * @param {number} srcTileY - The y coordinate of the area to copy from, in tiles, not pixels.
 * @param {number} width - The width of the area to copy, in tiles, not pixels.
 * @param {number} height - The height of the area to copy, in tiles, not pixels.
 * @param {number} destTileX - The x coordinate of the area to copy to, in tiles, not pixels.
 * @param {number} destTileY - The y coordinate of the area to copy to, in tiles, not pixels.
 * @param {boolean} recalculateFaces - `true` if the faces data should be recalculated.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var Copy = function (srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, layer)
{
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    //  Returns an array of Tile references
    var srcTiles = GetTilesWithin(srcTileX, srcTileY, width, height, null, layer);

    //  Create a new array of fresh Tile objects
    var copyTiles = [];

    srcTiles.forEach(function (tile)
    {
        var newTile = new Tile(
            tile.layer,
            tile.index,
            tile.x,
            tile.y,
            tile.width,
            tile.height,
            tile.baseWidth,
            tile.baseHeight
        );

        newTile.copy(tile);

        copyTiles.push(newTile);
    });

    var offsetX = destTileX - srcTileX;
    var offsetY = destTileY - srcTileY;

    for (var i = 0; i < copyTiles.length; i++)
    {
        var copy = copyTiles[i];
        var tileX = copy.x + offsetX;
        var tileY = copy.y + offsetY;

        if (IsInLayerBounds(tileX, tileY, layer))
        {
            if (layer.data[tileY][tileX])
            {
                copy.x = tileX;
                copy.y = tileY;
                copy.updatePixelXY();

                layer.data[tileY][tileX] = copy;
            }
        }
    }

    if (recalculateFaces)
    {
        // Recalculate the faces within the destination area and neighboring tiles
        CalculateFacesWithin(destTileX - 1, destTileY - 1, width + 2, height + 2, layer);
    }

    srcTiles.length = 0;
    copyTiles.length = 0;
};

module.exports = Copy;
