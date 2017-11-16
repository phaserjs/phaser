var IsInLayerBounds = require('./IsInLayerBounds');

var GetTileAt = function (tileX, tileY, nonNull, layer)
{
    if (nonNull === undefined) { nonNull = false; }

    if (IsInLayerBounds(tileX, tileY, layer))
    {
        var tile = layer.data[tileY][tileX];
        if (tile === null)
        {
            return null;
        }
        else if (tile.index === -1)
        {
            return nonNull ? tile : null;
        }
        else
        {
            return tile;
        }
    }
    else
    {
        return null;
    }
};

module.exports = GetTileAt;
