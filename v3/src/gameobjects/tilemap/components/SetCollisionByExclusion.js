var SetTileCollision = require('./SetTileCollision');
var CalculateFacesWithin = require('./CalculateFacesWithin');
var SetLayerCollisionIndex = require('./SetLayerCollisionIndex');

// Note: this only updates layer.collideIndexes for tile indexes found currently in the layer
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

    if (recalculateFaces) { CalculateFacesWithin(0, 0, layer.width, layer.height, layer); }
};

module.exports = SetCollisionByExclusion;
