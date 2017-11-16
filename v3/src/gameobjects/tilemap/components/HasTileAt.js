var IsInLayerBounds = require('./IsInLayerBounds');

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
