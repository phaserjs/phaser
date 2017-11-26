var GetTilesWithin = require('./GetTilesWithin');

var ForEachTile = function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, filteringOptions, layer);
    tiles.forEach(callback, context);
};

module.exports = ForEachTile;
