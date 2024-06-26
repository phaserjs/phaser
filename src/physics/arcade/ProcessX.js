/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
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

/**
 * Sets all of the local processing values and calculates the velocity exchanges.
 *
 * Then runs `BlockCheck` and returns the value from it.
 *
 * This method is called by `Phaser.Physics.Arcade.SeparateX` and should not be
 * called directly.
 *
 * @function Phaser.Physics.Arcade.ProcessX.Set
 * @ignore
 * @since 3.50.0
 *
 * @param {Phaser.Physics.Arcade.Body} b1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} b2 - The second Body to separate.
 * @param {number} ov - The overlap value.
 *
 * @return {number} The BlockCheck result. 0 = not blocked. 1 = Body 1 blocked. 2 = Body 2 blocked.
 */
var Set = function (b1, b2, ov)
{
    body1 = b1;
    body2 = b2;

    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    body1Pushable = body1.pushable;
    body1MovingLeft = body1._dx < 0;
    body1MovingRight = body1._dx > 0;
    body1Stationary = body1._dx === 0;
    body1OnLeft = Math.abs(body1.right - body2.x) <= Math.abs(body2.right - body1.x);
    body1FullImpact = v2 - v1 * body1.bounce.x;

    body2Pushable = body2.pushable;
    body2MovingLeft = body2._dx < 0;
    body2MovingRight = body2._dx > 0;
    body2Stationary = body2._dx === 0;
    body2OnLeft = !body1OnLeft;
    body2FullImpact = v1 - v2 * body2.bounce.x;

    //  negative delta = up, positive delta = down (inc. gravity)
    overlap = Math.abs(ov);

    return BlockCheck();
};

/**
 * Blocked Direction checks, because it doesn't matter if an object can be pushed
 * or not, blocked is blocked.
 *
 * @function Phaser.Physics.Arcade.ProcessX.BlockCheck
 * @ignore
 * @since 3.50.0
 *
 * @return {number} The BlockCheck result. 0 = not blocked. 1 = Body 1 blocked. 2 = Body 2 blocked.
 */
var BlockCheck = function ()
{
    //  Body1 is moving right and Body2 is blocked from going right any further
    if (body1MovingRight && body1OnLeft && body2.blocked.right)
    {
        body1.processX(-overlap, body1FullImpact, false, true);

        return 1;
    }

    //  Body1 is moving left and Body2 is blocked from going left any further
    if (body1MovingLeft && body2OnLeft && body2.blocked.left)
    {
        body1.processX(overlap, body1FullImpact, true);

        return 1;
    }

    //  Body2 is moving right and Body1 is blocked from going right any further
    if (body2MovingRight && body2OnLeft && body1.blocked.right)
    {
        body2.processX(-overlap, body2FullImpact, false, true);

        return 2;
    }

    //  Body2 is moving left and Body1 is blocked from going left any further
    if (body2MovingLeft && body1OnLeft && body1.blocked.left)
    {
        body2.processX(overlap, body2FullImpact, true);

        return 2;
    }

    return 0;
};

/**
 * The main check function. Runs through one of the four possible tests and returns the results.
 *
 * @function Phaser.Physics.Arcade.ProcessX.Check
 * @ignore
 * @since 3.50.0
 *
 * @return {boolean} `true` if a check passed, otherwise `false`.
 */
var Check = function ()
{
    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
    var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
    var avg = (nv1 + nv2) * 0.5;

    nv1 -= avg;
    nv2 -= avg;

    body1MassImpact = avg + nv1 * body1.bounce.x;
    body2MassImpact = avg + nv2 * body2.bounce.x;

    //  Body1 hits Body2 on the right hand side
    if (body1MovingLeft && body2OnLeft)
    {
        return Run(0);
    }

    //  Body2 hits Body1 on the right hand side
    if (body2MovingLeft && body1OnLeft)
    {
        return Run(1);
    }

    //  Body1 hits Body2 on the left hand side
    if (body1MovingRight && body1OnLeft)
    {
        return Run(2);
    }

    //  Body2 hits Body1 on the left hand side
    if (body2MovingRight && body2OnLeft)
    {
        return Run(3);
    }

    return false;
};

/**
 * The main check function. Runs through one of the four possible tests and returns the results.
 *
 * @function Phaser.Physics.Arcade.ProcessX.Run
 * @ignore
 * @since 3.50.0
 *
 * @param {number} side - The side to test. As passed in by the `Check` function.
 *
 * @return {boolean} Always returns `true`.
 */
var Run = function (side)
{
    if (body1Pushable && body2Pushable)
    {
        //  Both pushable, or both moving at the same time, so equal rebound
        overlap *= 0.5;

        if (side === 0 || side === 3)
        {
            //  body1MovingLeft && body2OnLeft
            //  body2MovingRight && body2OnLeft
            body1.processX(overlap, body1MassImpact);
            body2.processX(-overlap, body2MassImpact);
        }
        else
        {
            //  body2MovingLeft && body1OnLeft
            //  body1MovingRight && body1OnLeft
            body1.processX(-overlap, body1MassImpact);
            body2.processX(overlap, body2MassImpact);
        }
    }
    else if (body1Pushable && !body2Pushable)
    {
        //  Body1 pushable, Body2 not

        if (side === 0 || side === 3)
        {
            //  body1MovingLeft && body2OnLeft
            //  body2MovingRight && body2OnLeft
            body1.processX(overlap, body1FullImpact, true);
        }
        else
        {
            //  body2MovingLeft && body1OnLeft
            //  body1MovingRight && body1OnLeft
            body1.processX(-overlap, body1FullImpact, false, true);
        }
    }
    else if (!body1Pushable && body2Pushable)
    {
        //  Body2 pushable, Body1 not

        if (side === 0 || side === 3)
        {
            //  body1MovingLeft && body2OnLeft
            //  body2MovingRight && body2OnLeft
            body2.processX(-overlap, body2FullImpact, false, true);
        }
        else
        {
            //  body2MovingLeft && body1OnLeft
            //  body1MovingRight && body1OnLeft
            body2.processX(overlap, body2FullImpact, true);
        }
    }
    else
    {
        //  Neither body is pushable, so base it on movement

        var halfOverlap = overlap * 0.5;

        if (side === 0)
        {
            //  body1MovingLeft && body2OnLeft

            if (body2Stationary)
            {
                body1.processX(overlap, 0, true);
                body2.processX(0, null, false, true);
            }
            else if (body2MovingRight)
            {
                body1.processX(halfOverlap, 0, true);
                body2.processX(-halfOverlap, 0, false, true);
            }
            else
            {
                //  Body2 moving same direction as Body1
                body1.processX(halfOverlap, body2.velocity.x, true);
                body2.processX(-halfOverlap, null, false, true);
            }
        }
        else if (side === 1)
        {
            //  body2MovingLeft && body1OnLeft

            if (body1Stationary)
            {
                body1.processX(0, null, false, true);
                body2.processX(overlap, 0, true);
            }
            else if (body1MovingRight)
            {
                body1.processX(-halfOverlap, 0, false, true);
                body2.processX(halfOverlap, 0, true);
            }
            else
            {
                //  Body1 moving same direction as Body2
                body1.processX(-halfOverlap, null, false, true);
                body2.processX(halfOverlap, body1.velocity.x, true);
            }
        }
        else if (side === 2)
        {
            //  body1MovingRight && body1OnLeft

            if (body2Stationary)
            {
                body1.processX(-overlap, 0, false, true);
                body2.processX(0, null, true);
            }
            else if (body2MovingLeft)
            {
                body1.processX(-halfOverlap, 0, false, true);
                body2.processX(halfOverlap, 0, true);
            }
            else
            {
                //  Body2 moving same direction as Body1
                body1.processX(-halfOverlap, body2.velocity.x, false, true);
                body2.processX(halfOverlap, null, true);
            }
        }
        else if (side === 3)
        {
            //  body2MovingRight && body2OnLeft

            if (body1Stationary)
            {
                body1.processX(0, null, true);
                body2.processX(-overlap, 0, false, true);
            }
            else if (body1MovingLeft)
            {
                body1.processX(halfOverlap, 0, true);
                body2.processX(-halfOverlap, 0, false, true);
            }
            else
            {
                //  Body1 moving same direction as Body2
                body1.processX(halfOverlap, body2.velocity.y, true);
                body2.processX(-halfOverlap, null, false, true);
            }
        }
    }

    return true;
};

/**
 * This function is run when Body1 is Immovable and Body2 is not.
 *
 * @function Phaser.Physics.Arcade.ProcessX.RunImmovableBody1
 * @ignore
 * @since 3.50.0
 *
 * @param {number} blockedState - The block state value.
 */
var RunImmovableBody1 = function (blockedState)
{
    if (blockedState === 1)
    {
        //  But Body2 cannot go anywhere either, so we cancel out velocity
        //  Separation happened in the block check
        body2.velocity.x = 0;
    }
    else if (body1OnLeft)
    {
        body2.processX(overlap, body2FullImpact, true);
    }
    else
    {
        body2.processX(-overlap, body2FullImpact, false, true);
    }

    //  This is special case code that handles things like vertically moving platforms you can ride
    if (body1.moves)
    {
        var body1Distance = body1.directControl ? (body1.y - body1.autoFrame.y) : (body1.y - body1.prev.y);

        body2.y += body1Distance * body1.friction.y;
        body2._dy = body2.y - body2.prev.y;
    }
};

/**
 * This function is run when Body2 is Immovable and Body1 is not.
 *
 * @function Phaser.Physics.Arcade.ProcessX.RunImmovableBody2
 * @ignore
 * @since 3.50.0
 *
 * @param {number} blockedState - The block state value.
 */
var RunImmovableBody2 = function (blockedState)
{
    if (blockedState === 2)
    {
        //  But Body1 cannot go anywhere either, so we cancel out velocity
        //  Separation happened in the block check
        body1.velocity.x = 0;
    }
    else if (body2OnLeft)
    {
        body1.processX(overlap, body1FullImpact, true);
    }
    else
    {
        body1.processX(-overlap, body1FullImpact, false, true);
    }

    //  This is special case code that handles things like vertically moving platforms you can ride
    if (body2.moves)
    {
        var body2Distance = body2.directControl ? (body2.y - body2.autoFrame.y) : (body2.y - body2.prev.y);

        body1.y += body2Distance * body2.friction.y;
        body1._dy = body1.y - body1.prev.y;
    }
};

/**
 * @namespace Phaser.Physics.Arcade.ProcessX
 * @ignore
 */

module.exports = {
    BlockCheck: BlockCheck,
    Check: Check,
    Set: Set,
    Run: Run,
    RunImmovableBody1: RunImmovableBody1,
    RunImmovableBody2: RunImmovableBody2
};
