/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var GetOverlapY = require('./GetOverlapY');
var IntersectsRect = require('./IntersectsRect');

/**
 * Separates two overlapping bodies on the Y-axis (vertically).
 *
 * Separation involves moving two overlapping bodies so they don't overlap anymore
 * and adjusting their velocities based on their mass. This is a core part of collision detection.
 *
 * The bodies won't be separated if there is no vertical overlap between them, if they are static,
 * or if either one uses custom logic for its separation.
 *
 * @function Phaser.Physics.Arcade.SeparateY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate. This is our priority body.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - If `true`, the bodies will only have their overlap data set and no separation will take place.
 * @param {number} bias - A value to add to the delta value during overlap checking. Used to prevent sprite tunneling.
 *
 * @return {boolean} `true` if the two bodies overlap vertically, otherwise `false`.
 */
var SeparateY = function (body1, body2, overlapOnly, bias)
{
    var result = GetOverlapY(body1, body2, overlapOnly, bias);

    var overlap = result.overlap;
    var topFace = result.topFace;
    var bottomFace = !topFace;
    var intersects = result.intersects;

    var velocity1 = body1.velocity;
    var velocity2 = body2.velocity;

    var blocked1 = body1.blocked;
    var blocked2 = body2.blocked;

    var bounce1 = body1.bounce;
    var bounce2 = body2.bounce;

    var worldBlocked1 = body1.worldBlocked;
    var worldBlocked2 = body2.worldBlocked;

    var body1Immovable = (body1.physicsType === CONST.STATIC_BODY || body1.immovable);
    var body2Immovable = (body2.physicsType === CONST.STATIC_BODY || body2.immovable);

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (!intersects || overlapOnly || (body1Immovable && body2Immovable) || body1.customSeparateY || body2.customSeparateY)
    {
        //  return true if there was some overlap, otherwise false.
        return ((intersects && overlap !== 0) || (body1.embedded && body2.embedded));
    }

    //  Adjust their positions and velocities accordingly based on the amount of overlap
    var v1 = velocity1.y;
    var v2 = velocity2.y;

    var ny1 = v1;
    var ny2 = v2;

    console.log(body1.gameObject.name, 'overlaps', body2.gameObject.name, 'on the', ((topFace) ? 'top' : 'bottom'));

    //  At this point, the velocity from gravity, world rebounds, etc has been factored in.
    //  The body is moving the direction it wants to, but may be blocked and rebound.

    var move1 = (!body1Immovable && (v1 >= 0 && !body1.isBlockedDown()) || (v1 < 0 && !body1.isBlockedUp()));
    var move2 = (!body2Immovable && (v2 >= 0 && !body2.isBlockedDown()) || (v2 < 0 && !body2.isBlockedUp()));

    if (move1 && move2)
    {
        //  Neither body is immovable, so they get a new velocity based on mass
        var mass1 = body1.mass;
        var mass2 = body2.mass;

        //  We don't need costly sqrts if both masses are the same
        if (mass1 === mass2)
        {
            var bnv1 = (v2 > 0) ? v2 : v2 * -1;
            var bnv2 = (v1 > 0) ? v1 : v1 * -1;

            var avg = (bnv1 + bnv2) * 0.5;

            var nv1 = bnv1 - avg;
            var nv2 = bnv2 - avg;
   
            ny1 = avg + nv1 * bounce1.y;
            ny2 = avg + nv2 * bounce2.y;
        }
        else
        {
            var bnv1 = Math.sqrt((v2 * v2 * mass2) / mass1) * ((v2 > 0) ? 1 : -1);
            var bnv2 = Math.sqrt((v1 * v1 * mass1) / mass2) * ((v1 > 0) ? 1 : -1);

            var avg = (bnv1 + bnv2) * 0.5;

            var nv1 = bnv1;
            var nv2 = bnv2;
    
            nv1 -= avg;
            nv2 -= avg;
    
            ny1 = avg + nv1 * bounce1.y;
            ny2 = avg + nv2 * bounce2.y;
        }

        // var total = v1 - v2;
        // ny1 = (((mass1 - mass2) * v1 + 2 * mass1 * v1) / (mass1 + mass2)) * bounce1.y;
        // ny2 = (total + ny1) * bounce2.y;
        // console.log('*1', ny1, ny2, 'vs', v1, v2, 'delta', body1.deltaY(), body2.deltaY());

        console.log('resolution');
        console.log('body1', ny1, 'body2', ny2);
        console.log('speed', body1.speed, body2.speed);
        console.log('v1', v1, 'v2', v2);
        console.log('avg', avg);
        console.log('nv', nv1, nv2);
        console.log('sqrt', bnv1, bnv2);
        console.log('delta', body1.deltaY(), body2.deltaY());

        // console.log('*1', ny1, ny2, 'vs', v1, v2, 'avg', avg, 'nv', nv1, nv2, 'bounce', body1.bounce.y, body2.bounce.y, 'delta', body1.deltaY(), body2.deltaY());
        // console.log('*1', ny1, ny2, 'vs', v1, v2, 'avg', avg, 'nv', nv1, nv2, 'bounce', body1.bounce.y, body2.bounce.y, 'delta', body1.deltaY(), body2.deltaY());
    }
    else if (body1Immovable)
    {
        //  Body1 is immovable, so adjust body2 speed
        ny2 = v1 - v2 * bounce2.y;
    }
    else if (body2Immovable)
    {
        //  Body2 is immovable, so adjust body1 speed
        ny1 = v2 - v1 * bounce1.y;
    }

    var totalA = 0;
    var totalB = 0;

    //  Velocities calculated, time to work out what moves where
    if (overlap !== 0)
    {
        //  Try and give 50% separation to each body (this could be improved to give a speed ratio amount to each body)
        var share = overlap * 0.5;

        if (topFace)
        {
            totalA = body1.getMoveY(share);

            if (totalA < share)
            {
                share += (share - totalA);
            }

            totalB = body2.getMoveY(-share);
        }
        else
        {
            totalB = body2.getMoveY(share);

            if (totalB < share)
            {
                share += (share - totalB);
            }

            totalA = body1.getMoveY(-share);
        }
    }
    
    console.log('split at', totalA, totalB, 'of', overlap);

    if (totalA === 0 && totalB === 0 && overlap !== 0)
    {
        console.log('two immovable bodies');

        velocity1.y = 0;
        velocity2.y = 0;

        return true;
    }

    // console.log('d1', body1.deltaY(), 'd2', body2.deltaY());

    //  By this stage the bodies have their separation distance calculated (stored in totalA/B)
    //  and they have their new post-impact velocity. So now we need to  work out block state based on direction.

    // Then, adjust for rebounded direction, if any.

    // console.log('preb', worldBlocked1.up, worldBlocked1.down, worldBlocked2.up, worldBlocked2.down);

    if (ny1 < 0)
    {
        //  Body1 is moving UP

        if (topFace)
        {
            //  The top of Body1 overlaps with the bottom of Body2
            if (body2.isBlockedUp())
            {
                body1.setBlockedUp(body2);
                console.log('ny1 < 0 topface up', body1.y);
            }
            else
            {
                body1.y += totalA;
                console.log('ny1 < 0 topface add', body1.y);
            }
        }
        else if (bottomFace)
        {
            //  The bottom of Body1 overlaps with the top of Body2
            if (body2.isBlockedDown())
            {
                body1.setBlockedDown(body2);
                console.log('ny1 < 0 bottomface down', body1.y);
            }
            else
            {
                body1.y += totalA;
                console.log('ny1 < 0 bottomface add', body1.y);
            }
        }

        //  If Body1 cannot move up, it doesn't matter what new velocity it has.
        if (body1.sleeping && body1.isBlockedUp())
        {
            ny1 = 0;
            console.log('ny1 < 0 zero sleep');
        }
    }
    else if (ny1 > 0)
    {
        //  Body1 is moving DOWN

        if (topFace)
        {
            //  The top of Body1 overlaps with the bottom of Body2
            if (body1.isBlockedUp())
            {
                body1.setBlockedUp(body2);
                console.log('ny1 > 0 topface up', body1.y);
            }
            else
            {
                body1.y += totalA;
                console.log('ny1 > 0 topface add', body1.y);
            }
        }
        else if (bottomFace)
        {
            //  The bottom of Body1 overlaps with the top of Body2
            if (body2.isBlockedDown())
            {
                body1.setBlockedDown(body2);
                console.log('ny1 > 0 bottomface down', body1.y);
            }
            else
            {
                body1.y += totalA;
                console.log('ny1 > 0 bottomface add', body1.y);
            }
        }

        //  If Body1 cannot move down, it doesn't matter what new velocity it has.
        if (body1.sleeping && body1.isBlockedDown())
        {
            ny1 = 0;
            console.log('ny1 > 0 zero sleep');
        }
    }
    else
    {
        //  Body1 is stationary
        body1.y += totalA;
        console.log('body1 stationary', body1.y);
    }

    if (ny2 < 0)
    {
        //  Body2 is moving UP

        if (topFace)
        {
            //  The bottom of Body2 overlaps with the top of Body1
            if (body1.isBlockedDown())
            {
                body2.setBlockedDown(body1);
                console.log('ny2 < 0 topface down', body2.y);
            }
            else
            {
                body2.y += totalB;
                console.log('ny2 < 0 topface add', body2.y);
            }
        }
        else if (bottomFace)
        {
            //  The top of Body2 overlaps with the bottom of Body1
            if (body1.isBlockedUp())
            {
                body2.setBlockedUp(body1);
                console.log('ny2 < 0 bottomface down', body2.y);
            }
            else
            {
                body2.y += totalB;
                console.log('ny2 < 0 bottomface add', body2.y);
            }
        }

        //  If Body2 cannot move up, it doesn't matter what new velocity it has.
        if (body2.sleeping && body2.isBlockedUp())
        {
            ny2 = 0;
            console.log('ny2 < 0 zero sleep');
        }
    }
    else if (ny2 > 0)
    {
        //  Body2 is moving DOWN

        if (topFace)
        {
            //  The bottom of Body2 overlaps with the top of Body1
            if (body1.isBlockedDown())
            {
                body2.setBlockedDown(body1);
                console.log('ny2 > 0 topface down', body2.y);
            }
            else
            {
                body2.y += totalB;
                console.log('ny2 > 0 topface add', body2.y);
            }
        }
        else if (bottomFace)
        {
            //  The top of Body2 overlaps with the bottom of Body1
            if (body1.isBlockedUp())
            {
                body2.setBlockedUp(body1);
                console.log('ny2 > 0 bottomface up', body2.y);
            }
            else
            {
                body2.y += totalB;
                console.log('ny2 > 0 bottomface add', body2.y);
            }
        }

        //  If Body2 cannot move down, it doesn't matter what new velocity it has.
        if (body2.sleeping && body1.isBlockedDown())
        {
            ny2 = 0;
            console.log('ny2 > 0 zero sleep');
        }
    }
    else
    {
        //  Body2 is stationary
        body2.y += totalB;
        console.log('body2 stationary', body2.y);
    }

    // console.log('postb', worldBlocked1.up, worldBlocked1.down, worldBlocked2.up, worldBlocked2.down);

    //  We disregard the new velocity when:
    //  Body is world blocked AND touching / blocked on the opposite face

    if (body1.isBlockedY())
    {
        ny1 = 0;
    }

    if (body2.isBlockedY())
    {
        ny2 = 0;
    }

    if (body1.sleeping)
    {
        if (Math.abs(ny1) < 10)
        {
            ny1 = 0;
        }
        else
        {
            console.log('waking body1 from', ny1, body1.prevVelocity.y);
            body1.wake();
        }
    }

    if (body2.sleeping)
    {
        if (Math.abs(ny2) < 10)
        {
            ny2 = 0;
        }
        else
        {
            body2.wake();
        }
    }

    velocity1.y = ny1;
    velocity2.y = ny2;

    //  TODO: This is special case code that handles things like horizontal moving platforms you can ride
    // if (body2.moves)
    // {
    //     body1.x += body1.getMoveX((body2.deltaX()) * body2.friction.x, true);
    // }

    console.log('---', Date.now());

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateY;
