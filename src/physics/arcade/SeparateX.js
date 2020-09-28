/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlockCheckX = require('./BlockCheckX');
var GetOverlapX = require('./GetOverlapX');
var ProcessX = require('./ProcessX');

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
 * @return {boolean} `true` if the two bodies overlap vertically, otherwise `false`.
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

    var blockedState = BlockCheckX(body1, body2, Math.abs(overlap));

    //  Adjust their positions and velocities accordingly (if there was any overlap)
    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    var body1FullImpact = v2 - v1 * body1.bounce.x;
    var body2FullImpact = v1 - v2 * body2.bounce.x;

    if (!body1Immovable && !body2Immovable)
    {
        if (blockedState > 0)
        {
            return true;
        }

        //  negative delta = up, positive delta = down (inc. gravity)
        overlap = Math.abs(overlap);

        var body1MovingLeft = body1._dx < 0;
        var body1MovingRight = body1._dx > 0;
        var body1Stationary = body1._dx === 0;

        var body2MovingLeft = body2._dx < 0;
        var body2MovingRight = body2._dx > 0;
        var body2Stationary = body2._dx === 0;

        var body1OnLeft = Math.abs(body1.right - body2.x) <= Math.abs(body2.right - body1.x);
        var body2OnLeft = !body1OnLeft;

        var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
        var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
        var avg = (nv1 + nv2) * 0.5;

        nv1 -= avg;
        nv2 -= avg;

        var body1MassImpact = avg + nv1 * body1.bounce.y;
        var body2MassImpact = avg + nv2 * body2.bounce.y;

        ProcessX.SetProcessX(
            body1Pushable,
            body2Pushable,
            body1MassImpact,
            body2MassImpact,
            body1FullImpact,
            body2FullImpact
        );

        //  -----------------------------------------------------------------------
        //  Pushable Checks
        //  -----------------------------------------------------------------------

        //  Body1 hits Body2 on the right hand side
        if (body1MovingLeft && body2OnLeft)
        {
            return ProcessX.RunProcessX(body1, body2, overlap, -overlap, body2Stationary, body2MovingRight, body1, 'PushX1');
            // return ProcessX.RunProcessX(body1, body2, overlap, -overlap, body2Stationary, body2MovingRight, body1);
        }

        //  Body2 hits Body1 on the right hand side
        if (body2MovingLeft && body1OnLeft)
        {
            return ProcessX.RunProcessX(body1, body2, -overlap, overlap, body1Stationary, body1MovingRight, body2, 'PushX2');
            // return ProcessX.RunProcessX(body1, body2, -overlap, overlap, body1Stationary, body1MovingRight, body2);
        }

        //  Body1 hits Body2 on the left hand side
        if (body1MovingRight && body1OnLeft)
        {
            return ProcessX.RunProcessX(body1, body2, overlap, -overlap, body2Stationary, body2MovingLeft, body1, 'PushX3');
            // return ProcessX.RunProcessX(body1, body2, overlap, -overlap, body2Stationary, body2MovingLeft, body1);
        }

        //  Body2 hits Body1 on the left hand side
        if (body2MovingRight && body2OnLeft)
        {
            return ProcessX.RunProcessX(body1, body2, -overlap, overlap, body1Stationary, body1MovingLeft, body2, 'PushX4');
            // return ProcessX.RunProcessX(body1, body2, -overlap, overlap, body1Stationary, body1MovingLeft, body2);
        }

        console.log('uh oh');
    }
    else if (body1Immovable)
    {
        // console.log('SepX 1');

        //  Body1 is immovable
        if (blockedState === 1 || blockedState === 3)
        {
            //  But Body2 cannot go anywhere either, so we cancel out velocity
            body2.velocity.x = 0;
        }
        else
        {
            body2.x += overlap;
            body2.velocity.x = body2FullImpact;
        }

        //  This is special case code that handles things like vertically moving platforms you can ride
        if (body1.moves)
        {
            body2.y += (body1.y - body1.prev.y) * body1.friction.y;
            body2._dy = body2.y - body2.prev.y;
        }
    }
    else if (body2Immovable)
    {
        // console.log('SepX 2');

        //  Body2 is immovable
        if (blockedState === 2 || blockedState === 4)
        {
            //  But Body1 cannot go anywhere either, so we cancel out velocity
            body1.velocity.x = 0;
        }
        else
        {
            body1.x -= overlap;
            body1.velocity.x = body1FullImpact;
        }

        //  This is special case code that handles things like vertically moving platforms you can ride
        if (body2.moves)
        {
            body1.y += (body2.y - body2.prev.y) * body2.friction.y;
            body1._dy = body1.y - body1.prev.y;
        }
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateX;
