var SetTileCollision = function (tile, collides)
{
    if (collides)
    {
        tile.setCollision(true, true, true, true);
    }
    else
    {
        tile.resetCollision();
    }
};

module.exports = SetTileCollision;
