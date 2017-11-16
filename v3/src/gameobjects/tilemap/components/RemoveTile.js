var Tile = require('../Tile');
var IsInLayerBounds = require('./IsInLayerBounds');

// Remove and return Tile with option for placing a -1 index tile or null.
var RemoveTile = function (tileX, tileY, replaceWithNull, layer)
{
    if (replaceWithNull === undefined) { replaceWithNull = false; }

    if (!IsInLayerBounds(tileX, tileY, layer)) { return null; }

    var tile = layer.data[tileY][tileX];
    if (tile === null)
    {
        return null;
    }
    else
    {
        layer.data[tileY][tileX] = replaceWithNull
            ? null
            : new Tile(layer, -1, tileX, tileY, tile.width, tile.height);
    }

    // TODO: re-calculate faces

    return tile;
};

module.exports = RemoveTile;
