/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
        body.blocked.none = false;
        body.blocked.left = true;
    }
    else if (x > 0)
    {
        body.blocked.none = false;
        body.blocked.right = true;
    }

    body.position.x -= x;
    body.updateCenter();

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
