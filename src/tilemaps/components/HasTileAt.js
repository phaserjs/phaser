var IsInLayerBounds = require('./IsInLayerBounds');

/**
 * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
 * false if there is no tile or if the tile at that location has an index of -1.
 *
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {LayerData} layer - [description]
 * @return {boolean}
 */
var HasTileAt = function (tileX, tileY, layer)
{
    if (IsInLayerBounds(tileX, tileY, layer))
    {
        var tile = layer.data[tileY][tileX];
        return (tile !== null && tile.index > -1);
    }
    else
    {
        return false;
    }

};

module.exports = HasTileAt;
