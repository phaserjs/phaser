/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlockCheckY = require('./BlockCheckY');
var GetOverlapY = require('./GetOverlapY');
var ProcessY = require('./ProcessY');

/**
 * Separates two overlapping bodies on the Y-axis (vertically).
 *
 * Separation involves moving two overlapping bodies so they don't overlap anymore and adjusting their velocities based on their mass. This is a core part of collision detection.
 *
 * The bodies won't be separated if there is no vertical overlap between them, if they are static, or if either one uses custom logic for its separation.
 *
 * @function Phaser.Physics.Arcade.SeparateY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - If `true`, the bodies will only have their overlap data set and no separation will take place.
 * @param {number} bias - A value to add to the delta value during overlap checking. Used to prevent sprite tunneling.
 *
 * @return {boolean} `true` if the two bodies overlap vertically, otherwise `false`.
 */
var SeparateY = function (body1, body2, overlapOnly, bias)
{
    var overlap = GetOverlapY(body1, body2, overlapOnly, bias);

    var body1Pushable = body1.pushable;
    var body2Pushable = body2.pushable;
    var body1Immovable = body1.immovable;
    var body2Immovable = body2.immovable;

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1Immovable && body2Immovable) || body1.customSeparateY || body2.customSeparateY)
    {
        //  return true if there was some overlap, otherwise false
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    var blockedState = BlockCheckY(body1, body2, Math.abs(overlap));

    //  Adjust their positions and velocities accordingly (if there was any overlap)
    var v1 = body1.velocity.y;
    var v2 = body2.velocity.y;

    var body1FullImpact = v2 - v1 * body1.bounce.y;
    var body2FullImpact = v1 - v2 * body2.bounce.y;

    if (!body1Immovable && !body2Immovable)
    {
        if (blockedState > 0)
        {
            return true;
        }

        //  negative delta = up, positive delta = down (inc. gravity)
        overlap = Math.abs(overlap);

        var body1MovingUp = body1._dy < 0;
        var body1MovingDown = body1._dy > 0;
        var body1Stationary = body1._dy === 0;

        var body2MovingUp = body2._dy < 0;
        var body2MovingDown = body2._dy > 0;
        var body2Stationary = body2._dy === 0;

        var body1OnTop = Math.abs(body1.bottom - body2.y) <= Math.abs(body2.bottom - body1.y);
        var body2OnTop = !body1OnTop;

        var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
        var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
        var avg = (nv1 + nv2) * 0.5;

        nv1 -= avg;
        nv2 -= avg;

        var body1MassImpact = avg + nv1 * body1.bounce.y;
        var body2MassImpact = avg + nv2 * body2.bounce.y;

        ProcessY.SetProcessY(
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

        //  Body1 hits Body2 from below
        if (body1MovingUp && body2OnTop)
        {
            return ProcessY.RunProcessY(body1, body2, overlap, -overlap, body2Stationary, body2MovingDown, 'PushY1');
        }

        //  Body2 hits Body1 from below
        if (body2MovingUp && body1OnTop)
        {
            return ProcessY.RunProcessY(body1, body2, -overlap, overlap, body1Stationary, body1MovingDown, 'PushY2');
        }

        //  Body1 hits Body2 from above
        if (body1MovingDown && body1OnTop)
        {
            return ProcessY.RunProcessY(body1, body2, overlap, -overlap, body2Stationary, body2MovingUp, 'PushY3');
        }

        //  Body2 hits Body1 from above
        if (body2MovingDown && body2OnTop)
        {
            return ProcessY.RunProcessY(body1, body2, -overlap, overlap, body1Stationary, body1MovingUp, 'PushY4');
        }

        console.log('uh oh');
        console.log('body1MovingUp', body1MovingUp, 'body2MovingUp', body2MovingUp, 'body1OnTop', body1OnTop, 'body2OnTop', body2OnTop);

    }
    else if (body1Immovable)
    {
        console.log('SepY 1');

        //  Body1 is immovable
        if (blockedState === 1 || blockedState === 3)
        {
            //  But Body2 cannot go anywhere either, so we cancel out velocity
            body2.velocity.y = 0;
        }
        else
        {
            body2.y += overlap;
            body2.velocity.y = body2FullImpact;
        }

        //  This is special case code that handles things like horizontally moving platforms you can ride
        if (body1.moves)
        {
            body2.x += (body1.x - body1.prev.x) * body1.friction.x;
            body2._dx = body2.x - body2.prev.x;
        }
    }
    else if (body2Immovable)
    {
        console.log('SepY 2');

        //  Body2 is immovable
        if (blockedState === 2 || blockedState === 4)
        {
            //  But Body1 cannot go anywhere either, so we cancel out velocity
            body1.velocity.y = 0;
        }
        else
        {
            body1.y -= overlap;
            body1.velocity.y = body1FullImpact;
        }

        //  This is special case code that handles things like horizontally moving platforms you can ride
        if (body2.moves)
        {
            body1.x += (body2.x - body2.prev.x) * body2.friction.x;
            body1._dx = body1.x - body1.prev.x;
        }
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateY;
