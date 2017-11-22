var GetTilesWithin = require('./GetTilesWithin');

// Swaps indices, not other properties. Does not modify collisions. Matches v2 functionality.
var SwapByIndex = function (indexA, indexB, tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, layer);
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
