/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Internally used method to set the colliding state of a tile. This does not recalculate
 * interesting faces.
 *
 * @function Phaser.Tilemaps.Components.SetTileCollision
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.Tile} tile - The Tile to set the collision on.
 * @param {boolean} [collides=true] - Should the tile index collide or not?
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
