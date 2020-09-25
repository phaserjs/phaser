var BlockCheckX = function (body1, body2, overlap)
{
    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    var body1MovingUp = body1._dy < 0;
    var body1MovingDown = body1._dy > 0;

    var body2MovingUp = body2._dy < 0;
    var body2MovingDown = body2._dy > 0;

    var body1OnTop = Math.abs(body1.bottom - body2.x) <= Math.abs(body2.bottom - body1.x);
    var body2OnTop = !body1OnTop;

    var body1FullImpact = v2 - v1 * body1.bounce.x;
    var body2FullImpact = v1 - v2 * body2.bounce.x;

    //  ------------------------------------------------------------------------------
    //  Blocked Checks - Doesn't matter if they're pushable or not, blocked is blocked
    //  ------------------------------------------------------------------------------

    //  Body1 is moving down and Body2 is blocked from going down any further
    if (body1MovingDown && body1OnTop && body2.blocked.down)
    {
        console.log('BlockX 1', body1.x, overlap);

        body1.x -= overlap;
        body1.velocity.x = body1FullImpact;

        return 1;
    }

    //  Body2 is moving down and Body1 is blocked from going down any further
    if (body2MovingDown && body2OnTop && body1.blocked.down)
    {
        console.log('BlockX 2', body2.x, overlap);

        body2.x -= overlap;
        body2.velocity.x = body2FullImpact;

        return 2;
    }

    //  Body1 is moving up and Body2 is blocked from going up any further
    if (body1MovingUp && body2OnTop && body2.blocked.up)
    {
        console.log('BlockX 3', body1.x, overlap);

        body1.x += overlap;
        body1.velocity.x = body1FullImpact;

        return 3;
    }

    //  Body2 is moving up and Body1 is blocked from going up any further
    if (body2MovingUp && body1OnTop && body1.blocked.up)
    {
        console.log('BlockX 4', body2.x, overlap);

        body2.x += overlap;
        body2.velocity.x = body2FullImpact;

        return 4;
    }

    return 0;
};

module.exports = BlockCheckX;
