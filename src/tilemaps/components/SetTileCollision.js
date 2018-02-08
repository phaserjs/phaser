/**
 * Internally used method to set the colliding state of a tile. This does not recalculate
 * interesting faces.
 *
 * @function Phaser.Tilemaps.Components.SetTileCollision
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.Tile} tile - [description]
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
