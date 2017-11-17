var GetTilesWithin = require('./GetTilesWithin');

var ForEachTile = function (callback, context, tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, layer);
    tiles.forEach(callback, context);
};

module.exports = ForEachTile;
