/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlockCheckY = function (body1, body2, overlap)
{
    var v1 = body1.velocity.y;
    var v2 = body2.velocity.y;

    var body1MovingUp = body1._dy < 0;
    var body1MovingDown = body1._dy > 0;

    var body2MovingUp = body2._dy < 0;
    var body2MovingDown = body2._dy > 0;

    var body1OnTop = Math.abs(body1.bottom - body2.y) <= Math.abs(body2.bottom - body1.y);
    var body2OnTop = !body1OnTop;

    var body1FullImpact = v2 - v1 * body1.bounce.y;
    var body2FullImpact = v1 - v2 * body2.bounce.y;

    //  ------------------------------------------------------------------------------
    //  Blocked Checks - Doesn't matter if they're pushable or not, blocked is blocked
    //  ------------------------------------------------------------------------------

    //  Body1 is moving down and Body2 is blocked from going down any further
    if (body1MovingDown && body1OnTop && body2.blocked.down)
    {
        console.log('BlockY 1', body1.y, overlap);

        body1.y -= overlap;
        body1.velocity.y = body1FullImpact;

        return 1;
    }

    //  Body2 is moving down and Body1 is blocked from going down any further
    if (body2MovingDown && body2OnTop && body1.blocked.down)
    {
        console.log('BlockY 2', body2.y, overlap);

        body2.y -= overlap;
        body2.velocity.y = body2FullImpact;

        return 2;
    }

    //  Body1 is moving up and Body2 is blocked from going up any further
    if (body1MovingUp && body2OnTop && body2.blocked.up)
    {
        console.log('BlockY 3', body1.y, overlap);

        body1.y += overlap;
        body1.velocity.y = body1FullImpact;

        return 3;
    }

    //  Body2 is moving up and Body1 is blocked from going up any further
    if (body2MovingUp && body1OnTop && body1.blocked.up)
    {
        console.log('BlockY 4', body2.y, overlap);

        body2.y += overlap;
        body2.velocity.y = body2FullImpact;

        return 4;
    }

    return 0;
};

module.exports = BlockCheckY;
