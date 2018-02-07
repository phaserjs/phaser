var GetTilesWithin = require('./GetTilesWithin');

/**
 * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
 * `findIndex` and updates their index to match `newIndex`. This only modifies the index and does
 * not change collision information.
 *
 * @param {integer} findIndex - [description]
 * @param {integer} newIndex - [description]
 * @param {integer} [tileX=0] - [description]
 * @param {integer} [tileY=0] - [description]
 * @param {integer} [width=max width based on tileX] - [description]
 * @param {integer} [height=max height based on tileY] - [description]
 * @param {LayerData} layer - [description]
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
