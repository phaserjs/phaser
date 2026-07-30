/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Internal function to process the horizontal separation of a physics body from a tile.
 * It updates the body's left or right blocked flags based on the direction of separation,
 * moves the body by the separation amount along the x-axis, updates its center, and then
 * either zeroes the horizontal velocity or applies a bounce depending on the body's bounce coefficient.
 *
 * @function Phaser.Physics.Arcade.Tilemap.ProcessTileSeparationX
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {number} x - The x-axis separation distance, in pixels. A negative value indicates the body is blocked on the left; a positive value indicates it is blocked on the right.
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
