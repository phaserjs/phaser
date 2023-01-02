/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
 * `findIndex` and updates their index to match `newIndex`. This only modifies the index and does
 * not change collision information.
 *
 * @function Phaser.Tilemaps.Components.ReplaceByIndex
 * @since 3.0.0
 *
 * @param {number} findIndex - The index of the tile to search for.
 * @param {number} newIndex - The index of the tile to replace it with.
 * @param {number} tileX - The left most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} tileY - The top most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} width - How many tiles wide from the `tileX` index the area will be.
 * @param {number} height - How many tiles tall from the `tileY` index the area will be.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var ReplaceByIndex = function (findIndex, newIndex, tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    for (var i = 0; i < tiles.length; i++)
    {
        if (tiles[i] && tiles[i].index === findIndex)
        {
            tiles[i].index = newIndex;
        }
    }
};

module.exports = ReplaceByIndex;
