var Tile = require('../Tile');
var IsInLayerBounds = require('./IsInLayerBounds');
var RecalculateFacesAt = require('./RecalculateFacesAt');

// Remove and return Tile with option for placing a -1 index tile or null.
var RemoveTileAt = function (tileX, tileY, replaceWithNull, recalculateFaces, layer)
{
    if (replaceWithNull === undefined) { replaceWithNull = false; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }
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

    // Recalculate faces only if the removed tile was a colliding tile
    if (recalculateFaces && tile && tile.collides)
    {
        RecalculateFacesAt(tileX, tileY, layer);
    }

    return tile;
};

module.exports = RemoveTileAt;
