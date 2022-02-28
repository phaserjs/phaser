/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CalculateFacesWithin = require('./CalculateFacesWithin');
var PutTileAt = require('./PutTileAt');

/**
 * Puts an array of tiles or a 2D array of tiles at the given tile coordinates in the specified
 * layer. The array can be composed of either tile indexes or Tile objects. If you pass in a Tile,
 * all attributes will be copied over to the specified location. If you pass in an index, only the
 * index at the specified location will be changed. Collision information will be recalculated
 * within the region tiles were changed.
 *
 * @function Phaser.Tilemaps.Components.PutTilesAt
 * @since 3.0.0
 *
 * @param {(number[]|number[][]|Phaser.Tilemaps.Tile[]|Phaser.Tilemaps.Tile[][])} tile - A row (array) or grid (2D array) of Tiles or tile indexes to place.
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {boolean} recalculateFaces - `true` if the faces data should be recalculated.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var PutTilesAt = function (tilesArray, tileX, tileY, recalculateFaces, layer)
{
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    if (!Array.isArray(tilesArray))
    {
        return null;
    }

    // Force the input array to be a 2D array
    if (!Array.isArray(tilesArray[0]))
    {
        tilesArray = [ tilesArray ];
    }

    var height = tilesArray.length;
    var width = tilesArray[0].length;

    for (var ty = 0; ty < height; ty++)
    {
        for (var tx = 0; tx < width; tx++)
        {
            var tile = tilesArray[ty][tx];

            PutTileAt(tile, tileX + tx, tileY + ty, false, layer);
        }
    }

    if (recalculateFaces)
    {
        // Recalculate the faces within the destination area and neighboring tiles
        CalculateFacesWithin(tileX - 1, tileY - 1, width + 2, height + 2, layer);
    }
};

module.exports = PutTilesAt;
