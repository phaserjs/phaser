var GetTilesWithin = require('./GetTilesWithin');
var GetRandomElement = require('../../../utils/array/GetRandomElement');

var Shuffle = function (tileX, tileY, width, height, indices, layer)
{
    var i;
    var tiles = GetTilesWithin(tileX, tileY, width, height, layer);

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

module.exports = Shuffle;
