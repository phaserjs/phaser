var GetTileAt = function (tileX, tileY, layer, nonNull)
{
    if (nonNull === undefined) { nonNull = false; }

    if (tileX >= 0 && tileX < layer.width && tileY >= 0 && tileY < layer.height)
    {
        var tile = layer.data[tileY][tileX];
        if (tile.index === -1)
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
