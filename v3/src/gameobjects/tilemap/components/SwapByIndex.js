var GetTilesWithin = require('./GetTilesWithin');

/**
 * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
 * `indexA` and swaps then with `indexB`. This only modifies the index and does not change collision
 * information.
 *
 * @param {number} tileA - First tile index.
 * @param {number} tileB - Second tile index.
 * @param {number} [tileX=0] - [description]
 * @param {number} [tileY=0] - [description]
 * @param {number} [width=max width based on tileX] - [description]
 * @param {number} [height=max height based on tileY] - [description]
 * @param {LayerData} layer - [description]
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
