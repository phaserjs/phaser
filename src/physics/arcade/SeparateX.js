/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetOverlapX = require('./GetOverlapX');

/**
 * Separates two overlapping bodies on the X-axis (horizontally).
 *
 * Separation involves moving two overlapping bodies so they don't overlap anymore and adjusting their velocities based on their mass. This is a core part of collision detection.
 *
 * The bodies won't be separated if there is no horizontal overlap between them, if they are static, or if either one uses custom logic for its separation.
 *
 * @function Phaser.Physics.Arcade.SeparateX
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - If `true`, the bodies will only have their overlap data set and no separation will take place.
 * @param {number} bias - A value to add to the delta value during overlap checking. Used to prevent sprite tunneling.
 *
 * @return {boolean} `true` if the two bodies overlap horizontally, otherwise `false`.
 */
var SeparateX = function (body1, body2, overlapOnly, bias)
{
    var overlap = GetOverlapX(body1, body2, overlapOnly, bias);

    var body1Pushable = body1.pushable;
    var body2Pushable = body2.pushable;
    var body1Immovable = body1.immovable;
    var body2Immovable = body2.immovable;

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1Immovable && body2Immovable) || body1.customSeparateX || body2.customSeparateX)
    {
        //  return true if there was some overlap, otherwise false
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    //  Adjust their positions and velocities accordingly (if there was any overlap)
    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    if (!body1Immovable && !body2Immovable)
    {
        if (body1Pushable === body2Pushable)
        {
            //  Both equally pushable (true/false doesn't matter)
            overlap *= 0.5;

            body1.x -= overlap;
            body2.x += overlap;
        }
        else if (body1Pushable && !body2Pushable)
        {
            //  Only body1 is pushable
            body1.x -= overlap;
        }
        else if (body2Pushable && !body1Pushable)
        {
            //  Only body2 is pushable
            body2.x += overlap;
        }
    }
    else if (!body1Immovable)
    {
        //  Body2 is immovable, so 1 gets all the separation no matter what
        body1.x -= overlap;

        body1.velocity.x = v2 - v1 * body1.bounce.x;

        //  This is special case code that handles things like vertically moving platforms you can ride
        if (body2.moves)
        {
            body1.y += (body2.y - body2.prev.y) * body2.friction.y;
            body1._dy = body1.y - body1.prev.y;
        }

        return true;
    }
    else if (!body2Immovable)
    {
        //  Body1 is immovable, so 2 gets all the separation no matter what
        body2.x += overlap;

        body2.velocity.x = v1 - v2 * body2.bounce.x;

        //  This is special case code that handles things like vertically moving platforms you can ride
        if (body1.moves)
        {
            body2.y += (body1.y - body1.prev.y) * body1.friction.y;
            body2._dy = body2.y - body2.prev.y;
        }

        return true;
    }

    //  Separation is over and we've 2 movable bodies, so now calculate velocity

    if (body1._dx > body2._dx && (body2.blocked.right || !body2Pushable))
    {
        //  Body1 is moving right and Body2 is blocked from going right any further, or isn't pushable
        body1.velocity.x = v2 - v1 * body1.bounce.x;
    }
    else if (body1._dx < body2._dx && (body2.blocked.left || !body2Pushable))
    {
        //  Body1 is moving left and Body2 is blocked from going left any further, or isn't pushable
        body1.velocity.x = v2 - v1 * body1.bounce.x;
    }
    else
    {
        //  If neither body is pushable, or are both pushable, they should both rebound equally

        var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
        var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
        var avg = (nv1 + nv2) * 0.5;

        nv1 -= avg;
        nv2 -= avg;

        body1.velocity.x = avg + nv1 * body1.bounce.x;
        body2.velocity.x = avg + nv2 * body2.bounce.x;
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateX;
