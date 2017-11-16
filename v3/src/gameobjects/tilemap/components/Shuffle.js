var GetTilesWithin = require('./GetTilesWithin');
var ShuffleArray = require('../../../utils/array/Shuffle');

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
