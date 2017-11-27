/**
 * Internally used method to set the colliding state of a tile.
 *
 * @param {Tile} tile - [description]
 * @param {boolean} [collides=true] - [description]
 */
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
