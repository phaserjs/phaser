/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var body1;
var body2;
var body1Pushable;
var body2Pushable;
var body1MassImpact;
var body2MassImpact;
var body1FullImpact;
var body2FullImpact;
var body1MovingUp;
var body1MovingDown;
var body1Stationary;
var body2MovingUp;
var body2MovingDown;
var body2Stationary;
var body1OnTop;
var body2OnTop;
var overlap;

var Set = function (b1, b2, ov)
{
    body1 = b1;
    body2 = b2;
    body1Pushable = body1.pushable;
    body2Pushable = body2.pushable;

    //  Adjust their positions and velocities accordingly (if there was any overlap)
    var v1 = body1.velocity.y;
    var v2 = body2.velocity.y;

    body1MovingUp = body1._dy < 0;
    body1MovingDown = body1._dy > 0;
    body1Stationary = body1._dy === 0;

    body2MovingUp = body2._dy < 0;
    body2MovingDown = body2._dy > 0;
    body2Stationary = body2._dy === 0;

    body1OnTop = Math.abs(body1.bottom - body2.y) <= Math.abs(body2.bottom - body1.y);
    body2OnTop = !body1OnTop;

    var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
    var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
    var avg = (nv1 + nv2) * 0.5;

    nv1 -= avg;
    nv2 -= avg;

    body1MassImpact = avg + nv1 * body1.bounce.y;
    body2MassImpact = avg + nv2 * body2.bounce.y;

    body1FullImpact = v2 - v1 * body1.bounce.y;
    body2FullImpact = v1 - v2 * body2.bounce.y;

    //  negative delta = up, positive delta = down (inc. gravity)
    overlap = Math.abs(ov);

    return BlockCheck();
};

//  ------------------------------------------------------------------------------
//  Blocked Checks - Doesn't matter if they're pushable or not, blocked is blocked
//  ------------------------------------------------------------------------------

var BlockCheck = function ()
{
    //  Body1 is moving down and Body2 is blocked from going down any further
    if (body1MovingDown && body1OnTop && body2.blocked.down)
    {
        console.log('BlockY 1', body1.y, overlap);

        body1.y -= overlap;
        body1.blocked.down = true;
        body1.velocity.y = body1FullImpact;

        return 1;
    }

    //  Body2 is moving down and Body1 is blocked from going down any further
    if (body2MovingDown && body2OnTop && body1.blocked.down)
    {
        console.log('BlockY 2', body2.y, overlap);

        body2.y -= overlap;
        body2.blocked.down = true;
        body2.velocity.y = body2FullImpact;

        return 2;
    }

    //  Body1 is moving up and Body2 is blocked from going up any further
    if (body1MovingUp && body2OnTop && body2.blocked.up)
    {
        console.log('BlockY 3', body1.y, overlap);

        body1.y += overlap;
        body1.blocked.up = true;
        body1.velocity.y = body1FullImpact;

        return 3;
    }

    //  Body2 is moving up and Body1 is blocked from going up any further
    if (body2MovingUp && body1OnTop && body1.blocked.up)
    {
        console.log('BlockY 4', body2.y, overlap);

        body2.y += overlap;
        body2.blocked.up = true;
        body2.velocity.y = body2FullImpact;

        return 4;
    }

    return 0;
};

//  -----------------------------------------------------------------------
//  Pushable Checks
//  -----------------------------------------------------------------------

var Check = function (overlap)
{
    //  Body1 hits Body2 on the bottom side
    if (body1MovingUp && body2OnTop)
    {
        return Run(0, overlap, 'PushY1');
    }

    //  Body2 hits Body1 on the bottom side
    if (body2MovingUp && body1OnTop)
    {
        return Run(1, overlap, 'PushY2');
    }

    //  Body1 hits Body2 on the top side
    if (body1MovingDown && body1OnTop)
    {
        return Run(2, overlap, 'PushY3');
    }

    //  Body2 hits Body1 on the top side
    if (body2MovingDown && body2OnTop)
    {
        return Run(3, overlap, 'PushY4');
    }

    return false;
};

//  -----------------------------------------------------------------------
//  Run the various checks
//  -----------------------------------------------------------------------

var Run = function (side, debug)
{
    if (body1Pushable && body2Pushable)
    {
        //  Both pushable
        if (debug)
        {
            console.log(debug + '-0 :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
        }

        //  Both pushable, or both moving at the same time, so equal rebound
        overlap *= 0.5;

        if (side === 0)
        {
            //  body1MovingUp && body2OnTop
            body1.y += overlap;
            body2.y -= overlap;
        }
        else if (side === 1)
        {
            // body2MovingUp && body1OnTop
            body1.y -= overlap;
            body2.y += overlap;
        }
        else if (side === 2)
        {
            //  body1MovingDown && body1OnTop
            body1.y -= overlap;
            body2.y += overlap;
        }
        else
        {
            //  body2MovingDown && body2OnTop
            body1.y += overlap;
            body2.y -= overlap;
        }

        body1.velocity.y = body1MassImpact;
        body2.velocity.y = body2MassImpact;
    }
    else if (body1Pushable && !body2Pushable)
    {
        //  Body1 pushable, Body2 not

        if (debug)
        {
            console.log(debug + '-1 :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
        }

        if (side === 0)
        {
            //  body1MovingUp && body2OnTop
            body1.y += overlap;
            body1.blocked.up = true;
        }
        else if (side === 1)
        {
            // body2MovingUp && body1OnTop
            body1.y -= overlap;
            body1.blocked.down = true;
        }
        else if (side === 2)
        {
            //  body1MovingDown && body1OnTop
            body1.y -= overlap;
            body1.blocked.down = true;
        }
        else
        {
            //  body2MovingDown && body2OnTop
            body1.y += overlap;
            body1.blocked.up = true;
        }

        body1.velocity.y = body1FullImpact;
    }
    else if (!body1Pushable && body2Pushable)
    {
        //  Body2 pushable, Body1 not

        if (debug)
        {
            console.log(debug + '-2 :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
        }

        if (side === 0)
        {
            //  body1MovingUp && body2OnTop
            body2.y -= overlap;
            body2.blocked.down = true;
        }
        else if (side === 1)
        {
            // body2MovingUp && body1OnTop
            body2.y += overlap;
            body2.blocked.up = true;
        }
        else if (side === 2)
        {
            //  body1MovingDown && body1OnTop
            body2.y += overlap;
            body2.blocked.up = true;
        }
        else
        {
            //  body2MovingDown && body2OnTop
            body2.y -= overlap;
            body2.blocked.down = true;
        }

        body2.velocity.y = body2FullImpact;
    }
    else
    {
        //  Neither body is pushable, so base it on movement

        var halfOverlap = overlap * 0.5;

        if (side === 0)
        {
            //  body1MovingUp && body2OnTop
            body1.blocked.up = true;
            body2.blocked.down = true;

            if (body2Stationary)
            {
                if (debug)
                {
                    console.log(debug + '-3a :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                body1.y += overlap;

                body1.velocity.y = 0;
            }
            else if (body2MovingDown)
            {
                if (debug)
                {
                    console.log(debug + '-3b :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                body1.y += halfOverlap;
                body2.y -= halfOverlap;

                body1.velocity.y = 0;
                body2.velocity.y = 0;
            }
            else
            {
                if (debug)
                {
                    console.log(debug + '-3c :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                //  Body2 moving same direction as Body1
                body1.y += halfOverlap;
                body2.y -= halfOverlap;

                body1.velocity.y = body2.velocity.y;
            }
        }
        else if (side === 1)
        {
            // body2MovingUp && body1OnTop
            body1.blocked.down = true;
            body2.blocked.up = true;

            if (body1Stationary)
            {
                if (debug)
                {
                    console.log(debug + '-4a :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                body2.y += overlap;
                body2.velocity.y = 0;
            }
            else if (body1MovingDown)
            {
                if (debug)
                {
                    console.log(debug + '-4b :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                body1.y -= halfOverlap;
                body2.y += halfOverlap;

                body1.velocity.y = 0;
                body2.velocity.y = 0;
            }
            else
            {
                if (debug)
                {
                    console.log(debug + '-4c :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                //  Body1 moving same direction as Body2
                body1.y -= halfOverlap;
                body2.y += halfOverlap;

                body2.velocity.y = body1.velocity.y;
            }
        }
        else if (side === 2)
        {
            //  body1MovingDown && body1OnTop
            body1.blocked.down = true;
            body2.blocked.up = true;

            if (body2Stationary)
            {
                if (debug)
                {
                    console.log(debug + '-5a :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                body1.y -= overlap;
                body1.velocity.y = 0;
            }
            else if (body2MovingUp)
            {
                if (debug)
                {
                    console.log(debug + '-5b :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                body1.y -= halfOverlap;
                body2.y += halfOverlap;

                body1.velocity.y = 0;
                body2.velocity.y = 0;
            }
            else
            {
                if (debug)
                {
                    console.log(debug + '-5c :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                //  Body2 moving same direction as Body1
                body1.y -= halfOverlap;
                body2.y += halfOverlap;

                body1.velocity.y = body2.velocity.y;
            }
        }
        else if (side === 3)
        {
            //  body2MovingDown && body2OnTop
            body1.blocked.up = true;
            body2.blocked.down = true;

            if (body1Stationary)
            {
                if (debug)
                {
                    console.log(debug + '-6a :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                body2.y -= overlap;
                body2.velocity.y = 0;
            }
            else if (body1MovingUp)
            {
                if (debug)
                {
                    console.log(debug + '-6b :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                body1.y += halfOverlap;
                body2.y -= halfOverlap;

                body1.velocity.y = 0;
                body2.velocity.y = 0;
            }
            else
            {
                if (debug)
                {
                    console.log(debug + '-6c :: side: ', side, ' => body1', body1.y, 'body2', body2.y, 'overlap', overlap);
                }

                //  Body1 moving same direction as Body2
                body1.y += halfOverlap;
                body2.y -= halfOverlap;

                body1.velocity.y = body2.velocity.y;
            }
        }
    }

    return true;
};

//  -----------------------------------------------------------------------
//  Body1 is Immovable
//  -----------------------------------------------------------------------

var RunImmovableBody1 = function (blockedState)
{
    //  Body1 is immovable

    if (blockedState === 1 || blockedState === 3)
    {
        //  But Body2 cannot go anywhere either, so we cancel out velocity
        //  Separation happened in the block check
        body2.velocity.y = 0;
    }
    else
    {
        if (body1OnTop)
        {
            body2.y += overlap;
            body2.blocked.up = true;
        }
        else
        {
            body2.y -= overlap;
            body2.blocked.down = true;
        }

        body2.velocity.y = body2FullImpact;
    }

    //  This is special case code that handles things like horizontally moving platforms you can ride
    if (body1.moves)
    {
        body2.x += (body1.x - body1.prev.x) * body1.friction.x;
        body2._dx = body2.x - body2.prev.x;
    }
};

//  -----------------------------------------------------------------------
//  Body2 is Immovable
//  -----------------------------------------------------------------------

var RunImmovableBody2 = function (blockedState)
{
    //  Body2 is immovable

    if (blockedState === 2 || blockedState === 4)
    {
        //  But Body1 cannot go anywhere either, so we cancel out velocity
        //  Separation happened in the block check
        body1.velocity.y = 0;
    }
    else
    {
        if (body2OnTop)
        {
            body1.y += overlap;
            body1.blocked.up = true;
        }
        else
        {
            body1.y -= overlap;
            body1.blocked.down = true;
        }

        body1.velocity.y = body1FullImpact;
    }

    //  This is special case code that handles things like horizontally moving platforms you can ride
    if (body2.moves)
    {
        body1.x += (body2.x - body2.prev.x) * body2.friction.x;
        body1._dx = body1.x - body1.prev.x;
    }
};

module.exports = {
    BlockCheck: BlockCheck,
    Check: Check,
    Set: Set,
    Run: Run,
    RunImmovableBody1: RunImmovableBody1,
    RunImmovableBody2: RunImmovableBody2
};
