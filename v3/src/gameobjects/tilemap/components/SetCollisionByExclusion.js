var SetTileCollision = require('./SetTileCollision');
var RecalculateFaces = require('./RecalculateFaces');
var SetLayerCollisionIndex = require('./SetLayerCollisionIndex');

var SetCollisionByExclusion = function (indexes, collides, recalculateFaces, layer)
{
    if (collides === undefined) { collides = true; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }
    if (!Array.isArray(indexes)) { indexes = [ indexes ]; }

    for (var ty = 0; ty < layer.height; ty++)
    {
        for (var tx = 0; tx < layer.width; tx++)
        {
            var tile = layer.data[ty][tx];
            if (tile && indexes.indexOf(tile.index) === -1)
            {
                SetTileCollision(tile, collides);
                SetLayerCollisionIndex(tile.index, collides, layer);
            }
        }
    }

    if (recalculateFaces) { RecalculateFaces(layer); }
};

module.exports = SetCollisionByExclusion;
