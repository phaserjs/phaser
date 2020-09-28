/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlockCheckX = function (body1, body2, overlap)
{
    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    var body1MovingLeft = body1._dx < 0;
    var body1MovingRight = body1._dx > 0;

    var body2MovingLeft = body2._dx < 0;
    var body2MovingRight = body2._dx > 0;

    var body1OnLeft = Math.abs(body1.right - body2.x) <= Math.abs(body2.right - body1.x);
    var body2OnLeft = !body1OnLeft;

    var body1FullImpact = v2 - v1 * body1.bounce.x;
    var body2FullImpact = v1 - v2 * body2.bounce.x;

    //  ------------------------------------------------------------------------------
    //  Blocked Checks - Doesn't matter if they're pushable or not, blocked is blocked
    //  ------------------------------------------------------------------------------

    //  Body1 is moving right and Body2 is blocked from going right any further
    if (body1MovingRight && body1OnLeft && body2.blocked.right)
    {
        // console.log('BlockX 1', body1.x, overlap);

        body1.x -= overlap;
        body1.velocity.x = body1FullImpact;

        return 1;
    }

    //  Body2 is moving right and Body1 is blocked from going right any further
    if (body2MovingRight && body2OnLeft && body1.blocked.right)
    {
        // console.log('BlockX 2', body2.x, overlap);

        body2.x -= overlap;
        body2.velocity.x = body2FullImpact;

        return 2;
    }

    //  Body1 is moving up and Body2 is blocked from going up any further
    if (body1MovingLeft && body2OnLeft && body2.blocked.left)
    {
        // console.log('BlockX 3', body1.x, overlap);

        body1.x += overlap;
        body1.velocity.x = body1FullImpact;

        return 3;
    }

    //  Body2 is moving up and Body1 is blocked from going up any further
    if (body2MovingLeft && body1OnLeft && body1.blocked.left)
    {
        // console.log('BlockX 4', body2.x, overlap);

        body2.x += overlap;
        body2.velocity.x = body2FullImpact;

        return 4;
    }

    return 0;
};

module.exports = BlockCheckX;
