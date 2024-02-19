/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
 * `indexA` and swaps then with `indexB`. This only modifies the index and does not change collision
 * information.
 *
 * @function Phaser.Tilemaps.Components.SwapByIndex
 * @since 3.0.0
 *
 * @param {number} tileA - First tile index.
 * @param {number} tileB - Second tile index.
 * @param {number} tileX - The left most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} tileY - The top most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} width - How many tiles wide from the `tileX` index the area will be.
 * @param {number} height - How many tiles tall from the `tileY` index the area will be.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var SwapByIndex = function (indexA, indexB, tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    for (var i = 0; i < tiles.length; i++)
    {
        if (tiles[i])
        {
            if (tiles[i].index === indexA)
            {
                tiles[i].index = indexB;
            }
            else if (tiles[i].index === indexB)
            {
                tiles[i].index = indexA;
            }
        }
    }
};

module.exports = SwapByIndex;
