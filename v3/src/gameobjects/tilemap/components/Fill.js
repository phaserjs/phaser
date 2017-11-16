var GetTilesWithin = require('./GetTilesWithin');

var Fill = function (index, tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, layer);
    for (var i = 0; i < tiles.length; i++)
    {
        tiles[i].index = index;
    }
};

module.exports = Fill;
