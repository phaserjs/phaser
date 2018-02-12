/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Internal function to process the separation of a physics body from a tile.
 *
 * @function Phaser.Physics.Arcade.Tilemap.ProcessTileSeparationX
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {number} x - The x separation amount.
 */
var ProcessTileSeparationX = function (body, x)
{
    if (x < 0)
    {
        body.blocked.left = true;
    }
    else if (x > 0)
    {
        body.blocked.right = true;
    }

    body.position.x -= x;

    if (body.bounce.x === 0)
    {
        body.velocity.x = 0;
    }
    else
    {
        body.velocity.x = -body.velocity.x * body.bounce.x;
    }
};

module.exports = ProcessTileSeparationX;
