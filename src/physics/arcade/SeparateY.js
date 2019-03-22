/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var GetOverlapY = require('./GetOverlapY');

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
    console.log('');
    console.log('%c frame ' + body1.world._frame + '                                                                                     ', 'background-color: orange');
    console.log('body1:', body1.gameObject.name, 'vs body2:', body2.gameObject.name);
    console.log('pre-GetOverlap by = body1', body1.y, 'body2', body2.y);
    console.log('pre-GetOverlap gy = body1', body1.gameObject.y, 'body2', body2.gameObject.y);

    var collisionInfo = GetOverlapY(body1, body2, overlapOnly, bias);

    // console.log(collisionInfo);
    // console.log('post-GetOverlap by = body1', body1.y, 'body2', body2.y);
    // console.log('post-GetOverlap gy = body1', body1.gameObject.y, 'body2', body2.gameObject.y);

    var overlap = collisionInfo.overlapY;
    var topFace = collisionInfo.face === CONST.FACING_UP;
    var bottomFace = !topFace;
    var intersects = collisionInfo.intersects;

    var velocity1 = body1.velocity;
    var velocity2 = body2.velocity;

    var bounce1 = body1.bounce;
    var bounce2 = body2.bounce;

    var body1Immovable = (body1.physicsType === CONST.STATIC_BODY || body1.immovable);
    var body2Immovable = (body2.physicsType === CONST.STATIC_BODY || body2.immovable);

    console.log('body1 overlaps body2 across the', ((topFace) ? 'top' : 'bottom'), 'by', overlap, 'px');

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (!intersects || overlapOnly || (body1Immovable && body2Immovable) || body1.customSeparateY || body2.customSeparateY)
    {
        console.log('SeparateY aborted');

        //  return true if there was some overlap, otherwise false.
        return ((intersects && overlap !== 0) || (body1.embedded && body2.embedded));
    }

    //  Adjust their positions and velocities accordingly based on the amount of overlap
    var v1 = velocity1.y;
    var v2 = velocity2.y;

    var ny1 = v1;
    var ny2 = v2;

    //  At this point, the velocity from gravity, world rebounds, etc has been factored in.
    //  The body is moving the direction it wants to, but may be blocked and rebound.

    var moving1 = body1.movingY();
    var moving2 = body2.movingY();

    if (moving1 && moving2)
    {
        //  Neither body is immovable, so they get a new velocity based on mass
        var mass1 = body1.mass;
        var mass2 = body2.mass;

        //  We don't need costly sqrts if both masses are the same
        if (mass1 === mass2)
        {
            var bnv1 = Math.abs(v2) * ((v2 > 0) ? 1 : -1);
            var bnv2 = Math.abs(v1) * ((v1 > 0) ? 1 : -1);

            var avg = (bnv1 + bnv2) * 0.5;

            var nv1 = bnv1 - avg;
            var nv2 = bnv2 - avg;
   
            ny1 = avg + nv1 * bounce1.y;
            ny2 = avg + nv2 * bounce2.y;

            console.log('resolution 1');
            console.log('pre-impact v = body1', v1, 'body2', v2);
            console.log('post-impact v = body1', ny1, 'body2', ny2);
            // console.log('pre-impact y = body1', body1.gameObject.y, 'body2', body2.gameObject.y);
            console.log('wb = body1', body1.worldBlocked.down, 'body2', body2.worldBlocked.down);

            // console.log('avg', avg);
            // console.log('nv', nv1, nv2);
            // console.log('sqrt mult', bnv1, bnv2);
            // console.log('delta', body1.deltaY(), body2.deltaY());
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

            console.log('resolution 2');
            console.log('pre-impact v = body1', v1, 'body2', v2);
            console.log('post-impact v = body1', ny1, 'body2', ny2);
            // console.log('avg', avg);
            // console.log('nv', nv1, nv2);
            // console.log('sqrt', bnv1, bnv2);
            // console.log('delta', body1.deltaY(), body2.deltaY());
        }
    }
    else if (!moving1 && moving2)
    {
        //  Body1 is immovable, so adjust body2 speed
        ny2 = v1 - v2 * bounce2.y;

        console.log('%cresolution 3', 'background-color: red; color: white');
        console.log('pre-impact v = body1', v1, 'body2', v2);
        console.log('post-impact v = body1', ny1, 'body2', ny2);
        // console.log('pre-impact by = body1', body1.y, 'body2', body2.y);
        // console.log('pre-impact gy = body1', body1.gameObject.y, 'body2', body2.gameObject.y);
        console.log('wb = body1', body1.worldBlocked.down, 'body2', body2.worldBlocked.down);
        console.log('sleeping? = body1', body1.sleeping, 'body2', body2.sleeping);
    }
    else if (moving1 && !moving2)
    {
        //  Body2 is immovable, so adjust body1 speed
        ny1 = v2 - v1 * bounce1.y;

        console.log('resolution 4');
        console.log('pre-impact v = body1', v1, 'body2', v2);
        console.log('post-impact v = body1', ny1, 'body2', ny2);
        console.log('pre-impact y = body1', body1.gameObject.y, 'body2', body2.gameObject.y);
        console.log('wb = body1', body1.worldBlocked.down, 'body2', body2.worldBlocked.down);
        console.log('sleeping? = body1', body1.sleeping, 'body2', body2.sleeping);
    }
    else
    {
        console.log('neither moving, or both immovable');

        console.log('resolution 5');
        console.log('pre-impact v = body1', v1, 'body2', v2);
        console.log('post-impact v = body1', ny1, 'body2', ny2);
        console.log('sleeping? = body1', body1.sleeping, 'body2', body2.sleeping);

        ny1 = 0;
        ny2 = 0;
    }

    var totalA = collisionInfo.share1;
    var totalB = collisionInfo.share2;
    
    console.log('split at', totalA, totalB, 'of', overlap);

    if (totalA === 0 && totalB === 0 && overlap !== 0)
    {
        console.log('two immovable bodies');

        velocity1.y = 0;
        velocity2.y = 0;

        return true;
    }

    //  FLip flop?
    var flip1 = (v1 < 0 && ny1 > 0) || (v1 > 0 && ny1 < 0);
    var flip2 = (v2 < 0 && ny2 > 0) || (v2 > 0 && ny2 < 0);

    if (!body1.sleeping && flip1 && Math.abs(ny1) < body1.minVelocity.y)
    {
        console.log('body1 flip vel too small, zeroing');
        ny1 = 0;
    }

    if (!body2.sleeping && flip2 && Math.abs(ny2) < body2.minVelocity.y)
    {
        console.log('body2 flip vel too small, zeroing');
        ny2 = 0;
    }

    //  By this stage the bodies have their separation distance calculated (stored in totalA/B)
    //  and they have their new post-impact velocity. So now we need to  work out block state based on direction.

    if (ny1 < 0)
    {
        //  Body1 is moving UP

        if (topFace)
        {
            //  The top of Body1 overlaps with the bottom of Body2
            if (body2.isBlockedUp())
            {
                body1.setBlockedUp(collisionInfo, body2);
                console.log('ny1 < 0 topface up', body1.y);
            }
            else
            {
                body1.y += body1.getMoveY(totalA);
                console.log('ny1 < 0 topface add', body1.y);
            }
        }
        else if (bottomFace)
        {
            //  The bottom of Body1 overlaps with the top of Body2
            if (body2.isBlockedDown())
            {
                body1.setBlockedDown(collisionInfo, body2);
                console.log('ny1 < 0 bottomface down', body1.y);
            }
            else
            {
                body1.y += body1.getMoveY(totalA);
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
            if (body2.isBlockedUp())
            {
                body1.setBlockedUp(collisionInfo, body2);
                console.log('ny1 > 0 topface up', body1.y);
            }
            else
            {
                body1.y += body1.getMoveY(totalA);
                console.log('ny1 > 0 topface add', body1.y);
            }
        }
        else if (bottomFace)
        {
            //  The bottom of Body1 overlaps with the top of Body2
            if (body2.isBlockedDown())
            {
                body1.setBlockedDown(collisionInfo, body2);
                console.log('ny1 > 0 bottomface down', body1.y);
            }
            else
            {
                body1.y += body1.getMoveY(totalA);
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
        if (topFace)
        {
            //  The top of Body1 overlaps with the bottom of Body2
            if (totalA !== 0 && !body1.isBlockedDown())
            {
                console.log('body1 stationary topface add', body1.y);
                body1.y += body1.getMoveY(totalA);
            }

            if (body2.isBlockedUp())
            {
                body1.setBlockedUp(collisionInfo, body2);
                console.log('body1 stationary topface up', body1.y);
            }
        }
        else if (bottomFace)
        {
            //  The bottom of Body1 overlaps with the top of Body2
            if (totalA !== 0 && !body1.isBlockedDown())
            {
                body1.y += body1.getMoveY(totalA);
                console.log('body1 stationary bottomface add', body1.y);
            }

            if (body2.isBlockedDown())
            {
                body1.setBlockedDown(collisionInfo, body2);
                console.log('body1 stationary bottomface down', body1.y);
            }
        }
    }

    if (ny2 < 0)
    {
        //  Body2 is moving UP

        if (topFace)
        {
            //  The bottom of Body2 overlaps with the top of Body1
            if (body1.isBlockedDown())
            {
                body2.setBlockedDown(collisionInfo, body1);
                console.log('ny2 < 0 topface down', body2.y);
            }
            else
            {
                body2.y += body2.getMoveY(totalB);
                console.log('ny2 < 0 topface add', body2.y);
            }
        }
        else if (bottomFace)
        {
            //  The top of Body2 overlaps with the bottom of Body1
            if (body1.isBlockedUp())
            {
                body2.setBlockedUp(collisionInfo, body1);
                console.log('ny2 < 0 bottomface down', body2.y);
            }
            else
            {
                body2.y += body2.getMoveY(totalB);
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
                body2.setBlockedDown(collisionInfo, body1);
                console.log('ny2 > 0 topface down', body2.y);
            }
            else
            {
                body2.y += body2.getMoveY(totalB);
                console.log('ny2 > 0 topface add', body2.y);
            }
        }
        else if (bottomFace)
        {
            //  The top of Body2 overlaps with the bottom of Body1
            if (body1.isBlockedUp())
            {
                body2.setBlockedUp(collisionInfo, body1);
                console.log('ny2 > 0 bottomface up', body2.y);
            }
            else
            {
                body2.y += body2.getMoveY(totalB);
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
        if (topFace)
        {
            //  The bottom of Body2 overlaps with the top of Body1
            if (totalB !== 0 && !body2.isBlockedDown())
            {
                body2.y += body2.getMoveY(totalB);
                console.log('body2 stationary topface add', body2.y);
            }

            if (body1.isBlockedDown())
            {
                body2.setBlockedDown(collisionInfo, body1);
                console.log('body2 stationary topface down', body2.y);
            }
        }
        else if (bottomFace)
        {
            //  The top of Body2 overlaps with the bottom of Body1
            if (totalB !== 0 && !body2.isBlockedUp())
            {
                body2.y += body2.getMoveY(totalB);
                console.log('body2 stationary bottomface add', body2.y);
            }

            if (body1.isBlockedUp())
            {
                body2.setBlockedUp(collisionInfo, body1);
                console.log('body2 stationary bottomface down', body2.y);
            }
        }
    }

    //  We disregard the new velocity when a Body is world blocked AND blocked by something on the opposite face

    if (body1.isBlockedY())
    {
        ny1 = 0;
    }

    if (body2.isBlockedY())
    {
        ny2 = 0;
    }

    //  Wakey, wakey?

    if (body1.sleeping)
    {
        if (Math.abs(ny1) < body1.minVelocity.y)
        {
            //  Not enough new velocity to get out of bed for
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
        if (Math.abs(ny2) < body2.minVelocity.y)
        {
            //  Not enough new velocity to get out of bed for
            ny2 = 0;
        }
        else
        {
            console.log('waking body2 from', ny2, body2.prevVelocity.y);
            body2.wake();
        }
    }

    console.log('SepY End', ny1, ny2);

    velocity1.y = ny1;
    velocity2.y = ny2;

    //  TODO: This is special case code that handles things like horizontal moving platforms you can ride
    // if (body2.moves)
    // {
    //     body1.x += body1.getMoveX((body2.deltaX()) * body2.friction.x, true);
    // }

    console.log('');

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateY;
