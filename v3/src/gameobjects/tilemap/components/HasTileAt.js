var HasTileAt = function (tileX, tileY, layer)
{
    if (layer.data[tileY] === undefined || layer.data[tileY][tileX] === undefined)
    {
        return false;
    }

    var tile = layer.data[tileY][tileX];
    return (tile !== null && tile.index > -1);
};

module.exports = HasTileAt;
