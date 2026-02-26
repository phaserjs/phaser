/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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

    // Float arithmetic can leave position at e.g. 63.9997, causing 1px
    // jitter. Snap near-integer results but preserve intentionally
    // fractional positions (non-integer body sizes from scaled sprites).
    var ry = Math.round(body.position.y);

    if (Math.abs(body.position.y - ry) < 0.01)
    {
        body.position.y = ry;
    }

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
