var GetTilesWithin = require('./GetTilesWithin');

// Fills indices, not other properties. Does not modify collisions. Matches v2 functionality.
var Fill = function (index, tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);
    for (var i = 0; i < tiles.length; i++)
    {
        tiles[i].index = index;
    }
};

module.exports = Fill;
