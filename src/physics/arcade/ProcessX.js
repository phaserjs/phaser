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
var body1MovingLeft;
var body1MovingRight;
var body1Stationary;
var body2MovingLeft;
var body2MovingRight;
var body2Stationary;
var body1OnLeft;
var body2OnLeft;
var overlap;

var Set = function (b1, b2, ov)
{
    body1 = b1;
    body2 = b2;
    body1Pushable = body1.pushable;
    body2Pushable = body2.pushable;

    //  Adjust their positions and velocities accordingly (if there was any overlap)
    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    body1MovingLeft = body1._dx < 0;
    body1MovingRight = body1._dx > 0;
    body1Stationary = body1._dx === 0;

    body2MovingLeft = body2._dx < 0;
    body2MovingRight = body2._dx > 0;
    body2Stationary = body2._dx === 0;

    body1OnLeft = Math.abs(body1.right - body2.x) <= Math.abs(body2.right - body1.x);
    body2OnLeft = !body1OnLeft;

    var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
    var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
    var avg = (nv1 + nv2) * 0.5;

    nv1 -= avg;
    nv2 -= avg;

    body1MassImpact = avg + nv1 * body1.bounce.x;
    body2MassImpact = avg + nv2 * body2.bounce.x;

    body1FullImpact = v2 - v1 * body1.bounce.x;
    body2FullImpact = v1 - v2 * body2.bounce.x;

    //  negative delta = up, positive delta = down (inc. gravity)
    overlap = Math.abs(ov);

    return BlockCheck();
};

//  ------------------------------------------------------------------------------
//  Blocked Checks - Doesn't matter if they're pushable or not, blocked is blocked
//  ------------------------------------------------------------------------------

var BlockCheck = function ()
{
    //  Body1 is moving right and Body2 is blocked from going right any further
    if (body1MovingRight && body1OnLeft && body2.blocked.right)
    {
        console.log('BlockX 1', body1.x, overlap);

        body1.x -= overlap;
        body1.blocked.right = true;
        body1.velocity.x = body1FullImpact;

        return 1;
    }

    //  Body2 is moving right and Body1 is blocked from going right any further
    if (body2MovingRight && body2OnLeft && body1.blocked.right)
    {
        console.log('BlockX 2', body2.x, overlap);

        body2.x -= overlap;
        body2.blocked.right = true;
        body2.velocity.x = body2FullImpact;

        return 2;
    }

    //  Body1 is moving up and Body2 is blocked from going up any further
    if (body1MovingLeft && body2OnLeft && body2.blocked.left)
    {
        console.log('BlockX 3', body1.x, overlap);

        body1.x += overlap;
        body1.blocked.left = true;
        body1.velocity.x = body1FullImpact;

        return 3;
    }

    //  Body2 is moving up and Body1 is blocked from going up any further
    if (body2MovingLeft && body1OnLeft && body1.blocked.left)
    {
        console.log('BlockX 4', body2.x, overlap);

        body2.x += overlap;
        body2.blocked.left = true;
        body2.velocity.x = body2FullImpact;

        return 4;
    }

    return 0;
};

//  -----------------------------------------------------------------------
//  Pushable Checks
//  -----------------------------------------------------------------------

var Check = function (overlap)
{
    //  Body1 hits Body2 on the right hand side
    if (body1MovingLeft && body2OnLeft)
    {
        return Run(0, overlap, 'PushX1');
    }

    //  Body2 hits Body1 on the right hand side
    if (body2MovingLeft && body1OnLeft)
    {
        return Run(1, overlap, 'PushX2');
    }

    //  Body1 hits Body2 on the left hand side
    if (body1MovingRight && body1OnLeft)
    {
        return Run(2, overlap, 'PushX3');
    }

    //  Body2 hits Body1 on the left hand side
    if (body2MovingRight && body2OnLeft)
    {
        return Run(3, overlap, 'PushX4');
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
            console.log(debug + '-0 :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
        }

        //  Both pushable, or both moving at the same time, so equal rebound
        overlap *= 0.5;

        if (side === 0)
        {
            //  body1MovingLeft && body2OnLeft
            body1.x += overlap;
            body2.x -= overlap;
        }
        else if (side === 1)
        {
            // body2MovingLeft && body1OnLeft
            body1.x -= overlap;
            body2.x += overlap;
        }
        else if (side === 2)
        {
            //  body1MovingRight && body1OnLeft
            body1.x -= overlap;
            body2.x += overlap;
        }
        else
        {
            //  body2MovingRight && body2OnLeft
            body1.x += overlap;
            body2.x -= overlap;
        }

        body1.velocity.x = body1MassImpact;
        body2.velocity.x = body2MassImpact;
    }
    else if (body1Pushable && !body2Pushable)
    {
        //  Body1 pushable, Body2 not

        if (debug)
        {
            console.log(debug + '-1 :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
        }

        if (side === 0)
        {
            //  body1MovingLeft && body2OnLeft
            body1.x += overlap;
            body1.blocked.left = true;
        }
        else if (side === 1)
        {
            // body2MovingLeft && body1OnLeft
            body1.x -= overlap;
            body1.blocked.right = true;
        }
        else if (side === 2)
        {
            //  body1MovingRight && body1OnLeft
            body1.x -= overlap;
            body1.blocked.right = true;
        }
        else
        {
            //  body2MovingRight && body2OnLeft
            body1.x += overlap;
            body1.blocked.left = true;
        }

        body1.velocity.x = body1FullImpact;
    }
    else if (!body1Pushable && body2Pushable)
    {
        //  Body2 pushable, Body1 not

        if (debug)
        {
            console.log(debug + '-2 :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
        }

        if (side === 0)
        {
            //  body1MovingLeft && body2OnLeft
            body2.x -= overlap;
            body2.blocked.right = true;
        }
        else if (side === 1)
        {
            // body2MovingLeft && body1OnLeft
            body2.x += overlap;
            body2.blocked.left = true;
        }
        else if (side === 2)
        {
            //  body1MovingRight && body1OnLeft
            body2.x -= overlap;
            body2.blocked.left = true;
        }
        else
        {
            //  body2MovingRight && body2OnLeft
            body2.x -= overlap;
            body2.blocked.right = true;
        }

        body2.velocity.x = body2FullImpact;
    }
    else
    {
        //  Neither body is pushable, so base it on movement

        var halfOverlap = overlap * 0.5;

        if (side === 0)
        {
            //  body1MovingLeft && body2OnLeft
            body1.blocked.left = true;
            body2.blocked.right = true;

            if (body2Stationary)
            {
                if (debug)
                {
                    console.log(debug + '-3a :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                body1.x += overlap;
                body1.velocity.x = 0;
            }
            else if (body2MovingRight)
            {
                if (debug)
                {
                    console.log(debug + '-3b :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                body1.x += halfOverlap;
                body2.x -= halfOverlap;

                body1.velocity.x = 0;
                body2.velocity.x = 0;
            }
            else
            {
                if (debug)
                {
                    console.log(debug + '-3c :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                //  Body2 moving same direction as Body1
                body1.x += halfOverlap;
                body2.x -= halfOverlap;

                body1.velocity.x = body2.velocity.x;
            }
        }
        else if (side === 1)
        {
            // body2MovingLeft && body1OnLeft
            body1.blocked.right = true;
            body2.blocked.left = true;

            if (body1Stationary)
            {
                if (debug)
                {
                    console.log(debug + '-4a :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                body2.x += overlap;
                body2.velocity.x = 0;
            }
            else if (body1MovingRight)
            {
                if (debug)
                {
                    console.log(debug + '-4b :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                body1.x -= halfOverlap;
                body2.x += halfOverlap;

                body1.velocity.x = 0;
                body2.velocity.x = 0;
            }
            else
            {
                if (debug)
                {
                    console.log(debug + '-4c :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                //  Body1 moving same direction as Body2
                body1.x -= halfOverlap;
                body2.x += halfOverlap;

                body2.velocity.x = body1.velocity.x;
            }
        }
        else if (side === 2)
        {
            //  body1MovingRight && body1OnLeft
            body1.blocked.right = true;
            body2.blocked.left = true;

            if (body2Stationary)
            {
                if (debug)
                {
                    console.log(debug + '-5a :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                body1.x -= overlap;
                body1.velocity.x = 0;
            }
            else if (body2MovingLeft)
            {
                if (debug)
                {
                    console.log(debug + '-5b :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                body1.x -= halfOverlap;
                body2.x += halfOverlap;

                body1.velocity.x = 0;
                body2.velocity.x = 0;
            }
            else
            {
                if (debug)
                {
                    console.log(debug + '-5c :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                //  Body2 moving same direction as Body1
                body1.x -= halfOverlap;
                body2.x += halfOverlap;

                body1.velocity.x = body2.velocity.x;
            }
        }
        else if (side === 3)
        {
            //  body2MovingRight && body2OnLeft
            body1.blocked.left = true;
            body2.blocked.right = true;

            if (body1Stationary)
            {
                if (debug)
                {
                    console.log(debug + '-6a :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                body2.x -= overlap;
                body2.velocity.x = 0;
            }
            else if (body1MovingLeft)
            {
                if (debug)
                {
                    console.log(debug + '-6b :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                body1.x += halfOverlap;
                body2.x -= halfOverlap;

                body1.velocity.x = 0;
                body2.velocity.x = 0;
            }
            else
            {
                if (debug)
                {
                    console.log(debug + '-6c :: side: ', side, ' => body1', body1.x, 'body2', body2.x, 'overlap', overlap);
                }

                //  Body1 moving same direction as Body2
                body1.x += halfOverlap;
                body2.x -= halfOverlap;

                body1.velocity.x = body2.velocity.x;
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
        body2.velocity.x = 0;
    }
    else
    {
        if (body1OnLeft)
        {
            body2.x += overlap;
            body2.blocked.left = true;
        }
        else
        {
            body2.x -= overlap;
            body2.blocked.right = true;
        }

        body2.velocity.x = body2FullImpact;
    }

    //  This is special case code that handles things like vertically moving platforms you can ride
    if (body1.moves)
    {
        body2.y += (body1.y - body1.prev.y) * body1.friction.y;
        body2._dy = body2.y - body2.prev.y;
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
        body1.velocity.x = 0;
    }
    else
    {
        if (body2OnLeft)
        {
            body1.x += overlap;
            body1.blocked.left = true;
        }
        else
        {
            body1.x -= overlap;
            body1.blocked.right = true;
        }

        body1.velocity.x = body1FullImpact;
    }

    //  This is special case code that handles things like vertically moving platforms you can ride
    if (body2.moves)
    {
        body1.y += (body2.y - body2.prev.y) * body2.friction.y;
        body1._dy = body1.y - body1.prev.y;
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
