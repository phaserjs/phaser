var Tile = require('../Tile');
var IsInLayerBounds = require('./IsInLayerBounds');
var RecalculateFacesAt = require('./RecalculateFacesAt');

// Put Phaser.Tile|number. Note: does not place a reference to tile, it copies the tile or creates a
// new one.
var PutTileAt = function (tile, tileX, tileY, recalculateFaces, layer)
{
    if (!IsInLayerBounds(tileX, tileY, layer)) { return null; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    var oldTile = layer.data[tileY][tileX];
    var oldTileCollides = oldTile && oldTile.collides;

    if (tile instanceof Tile)
    {
        if (layer.data[tileY][tileX] === null)
        {
            layer.data[tileY][tileX] = new Tile(layer, tile.index, tileX, tileY, tile.width, tile.height);
        }
        layer.data[tileY][tileX].copy(tile);
    }
    else
    {
        var index = tile;
        if (layer.data[tileY][tileX] === null)
        {
            layer.data[tileY][tileX] = new Tile(layer, index, tileX, tileY, layer.tileWidth, layer.tileHeight);
        }
        else
        {
            layer.data[tileY][tileX].index = index;
        }
    }

    // Updating colliding flag on the new tile
    var newTile = layer.data[tileY][tileX];
    if (layer.collideIndexes.indexOf(newTile.index) !== -1)
    {
        newTile.setCollision(true);
    }
    else
    {
        newTile.resetCollision();
    }

    // Recalculate faces only if the colliding flag at (tileX, tileY) has changed
    if (recalculateFaces && (oldTileCollides !== newTile.collides))
    {
        RecalculateFacesAt(tileX, tileY, layer);
    }

    return newTile;
};

module.exports = PutTileAt;

