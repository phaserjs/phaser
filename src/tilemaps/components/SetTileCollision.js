/**
 * Internally used method to set the colliding state of a tile. This does not recalculate
 * interesting faces.
 *
 * @param {Tile} tile - [description]
 * @param {boolean} [collides=true] - [description]
 */
var SetTileCollision = function (tile, collides)
{
    if (collides)
    {
        tile.setCollision(true, true, true, true, false);
    }
    else
    {
        tile.resetCollision(false);
    }
};

module.exports = SetTileCollision;
