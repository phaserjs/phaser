var GetTilesWithin = require('./GetTilesWithin');
var ShuffleArray = require('../../../utils/array/Shuffle');

// Shuffles indices, not other properties. Does not modify collisions. Matches v2 functionality.
var Shuffle = function (tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, layer);

    var indices = tiles.map(function (tile) { return tile.index; });
    ShuffleArray(indices);

    for (var i = 0; i < tiles.length; i++)
    {
        tiles[i].index = indices[i];
    }
};

module.exports = Shuffle;
