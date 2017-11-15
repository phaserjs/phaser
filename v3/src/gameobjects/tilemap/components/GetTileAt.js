var GetTileAt = function (x, y, layer, nonNull)
{
    if (nonNull === undefined) { nonNull = false; }

    if (x >= 0 && x < layer.width && y >= 0 && y < layer.height)
    {
        var tile = layer.data[y][x];
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
