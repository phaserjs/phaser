/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Internal function to process the vertical separation of a physics body from a tile.
 *
 * Updates the body's blocked flags based on the direction of separation, adjusts the
 * body's vertical position by the separation amount, and then either zeroes the vertical
 * velocity or applies the body's bounce factor to reverse it.
 *
 * @function Phaser.Physics.Arcade.Tilemap.ProcessTileSeparationY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {number} y - The vertical separation amount, in pixels. A negative value indicates the body was blocked from above; a positive value indicates it was blocked from below.
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
    body.updateCenter();

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
