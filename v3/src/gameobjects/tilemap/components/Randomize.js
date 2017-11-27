var GetTilesWithin = require('./GetTilesWithin');
var GetRandomElement = require('../../../utils/array/GetRandomElement');

/**
 * Randomizes the indices of a rectangular region of tiles (in tile coordinates) within the
 * specified layer. Each tile will recieve a new index. If an array of indices is passed in, then
 * those will be used for randomly assigning new tile indices. If an array is not provided, the
 * indices found within the region (excluding -1) will be used for randomly assigning new tile
 * indices. This method only modifies tile indexes and does not change collision information.
 *
 * @param {number} [tileX=0] - [description]
 * @param {number} [tileY=0] - [description]
 * @param {number} [width=max width based on tileX] - [description]
 * @param {number} [height=max height based on tileY] - [description]
 * @param {array} [indices] - An array of indices to randomly draw from during randomization.
 * @param {LayerData} layer - [description]
 */
var Randomize = function (tileX, tileY, width, height, indices, layer)
{
    var i;
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    // If no indicies are given, then find all the unique indices within the specified region
    if (indices === undefined)
    {
        indices = [];
        for (i = 0; i < tiles.length; i++)
        {
            if (indices.indexOf(tiles[i].index) === -1)
            {
                indices.push(tiles[i].index);
            }
        }
    }

    for (i = 0; i < tiles.length; i++)
    {
        tiles[i].index = GetRandomElement(indices);
    }
};

module.exports = Randomize;
