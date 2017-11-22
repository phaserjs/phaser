var Tile = require('../Tile');
var IsInLayerBounds = require('./IsInLayerBounds');

// Put Phaser.Tile|number. Note: does not place a reference to tile, it copies the tile or creates a
// new one.
var PutTileAt = function (tile, tileX, tileY, layer)
{
    if (!IsInLayerBounds(tileX, tileY, layer)) { return null; }

    if (tile instanceof Tile)
    {
        if (layer.data[tileY][tileX] === null)
        {
            layer.data[tileY][tileX] = new Tile(layer, tile.index, tileX, tileY, tile.width, tile.height);
        }
        else
        {
            layer.data[tileY][tileX].copy(tile);
        }
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

    // TODO: collision & re-calculate faces
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

    return layer.data[tileY][tileX];
};

module.exports = PutTileAt;

