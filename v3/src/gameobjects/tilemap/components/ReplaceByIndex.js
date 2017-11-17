var GetTilesWithin = require('./GetTilesWithin');

var ReplaceByIndex = function (findIndex, newIndex, tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, layer);
    for (var i = 0; i < tiles.length; i++)
    {
        if (tiles[i] && tiles[i].index === findIndex)
        {
            tiles[i].index = newIndex;
        }
    }
};

module.exports = ReplaceByIndex;
