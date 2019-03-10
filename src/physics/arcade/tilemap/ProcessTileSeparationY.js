/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Internal function to process the separation of a physics body from a tile.
 *
 * @function Phaser.Physics.Arcade.Tilemap.ProcessTileSeparationY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {number} y - The y separation amount.
 */
var ProcessTileSeparationY = function (body, y)
{
    if (y < 0)
    {
        body.blocked.none = false;
        body.blocked.up = true;
    }
    else if (y > 0)
    {
        body.blocked.none = false;
        body.blocked.down = true;
    }

    body.position.y -= y;

    if (body.bounce.y === 0)
    {
        body.velocity.y = 0;
    }
    else
    {
        body.velocity.y = -body.velocity.y * body.bounce.y;
    }
};

module.exports = ProcessTileSeparationY;
