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

    var overlap = result[0];
    var topFace = result[1];
    var bottomFace = !topFace;
    var intersects = result[2];

    var velocity1 = body1.velocity;
    var velocity2 = body2.velocity;

    var blocked1 = body1.blocked;
    var blocked2 = body2.blocked;

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

    // console.log(body1.gameObject.name, 'overlaps', body2.gameObject.name, 'on the', ((topFace) ? 'top' : 'bottom'));

    //  At this point, the velocity from gravity, world rebounds, etc has been factored in.
    //  The body is moving the direction it wants to, but may be blocked and rebound.

    if (!body1Immovable && !body2Immovable)
    {
        //  Neither body is immovable, so they get a new velocity based on mass
        var mass1 = body1.mass;
        var mass2 = body2.mass;

        var nv1 = Math.sqrt((v2 * v2 * mass2) / mass1) * ((v2 > 0) ? 1 : -1);
        var nv2 = Math.sqrt((v1 * v1 * mass1) / mass2) * ((v1 > 0) ? 1 : -1);

        var avg = (nv1 + nv2) * 0.5;

        nv1 -= avg;
        nv2 -= avg;

        ny1 = avg + nv1 * body1.bounce.y;
        ny2 = avg + nv2 * body2.bounce.y;

        // console.log('*1', ny1, ny2, 'vs', v1, v2, 'avg', avg, 'nv', nv1, nv2, body1.bounce.y, body2.bounce.y);
    }
    else if (body1Immovable)
    {
        //  Body1 is immovable, so adjust body2 speed
        ny2 = v1 - v2 * body2.bounce.y;
    }
    else if (body2Immovable)
    {
        //  Body2 is immovable, so adjust body1 speed
        ny1 = v2 - v1 * body1.bounce.y;
    }

    //  Velocities calculated, time to work out what moves where
    if (overlap !== 0)
    {
        var share = overlap * 0.2;
        var totalA = 0;
        var totalB = 0;

        for (var i = 0; i < 12; i++)
        {
            var amount1 = (topFace) ? body1.getMoveY(share) : body1.getMoveY(-share);
            var amount2 = (topFace) ? body2.getMoveY(-share) : body2.getMoveY(share);

            totalA += amount1;
            totalB += amount2;

            if (Math.abs(totalA) + Math.abs(totalB) >= overlap)
            {
                break;
            }
        }

        // console.log('split at', totalA, totalB, 'of', overlap);

        body1.y += totalA;
        body2.y += totalB;

        // var share = overlap * 0.5;
        // var amount1 = (topFace) ? body1.getMoveY(share) : body1.getMoveY(-share);
        // var amount2 = (topFace) ? body2.getMoveY(-share) : body2.getMoveY(share);

        // if (topFace && amount1 !== share && !worldBlocked2.up)
        // {
        //     amount2 -= (share - amount1);
        // }
        // else if (bottomFace && amount1 !== -share && !worldBlocked2.down)
        // {
        //     amount2 += (share + amount1);
        // }

        // body1.y += amount1;
        // body2.y += amount2;

        // if (amount1)
        // {
        //     body1.wake();
        // }

        // if (amount2)
        // {
        //     body2.wake();
        // }

        // if (body2.gameObject.name === 'block2')
        // {
        //     var stillIntersects = IntersectsRect(body1, body2);

        //     console.log(ny1, ny2);
        //     console.log('split rates', share, amount1, amount2);
        //     console.log(body1.y, body1.bottom);
        //     console.log(body2.y, body2.bottom);
        //     console.log('still?', stillIntersects);
        //     debugger;
        // }

        //  Still intersecting?

        /*
        if (IntersectsRect(body1, body2))
        {
            console.log('intersect adjustment');

            if (body1Immovable)
            {
                if (topFace)
                {
                    console.log('ad1');
                    body2.bottom = body1.y;
                }
                else
                {
                    console.log('ad2');
                    body2.y = body1.bottom;
                }
            }
            else if (!body1Immovable)
            {
                if (topFace)
                {
                    console.log('ad3');
                    body1.y = body2.bottom;
                }
                else
                {
                    console.log('ad4');
                    body1.bottom = body2.y;
                }
            }
        }
        */
    }

    /*
    if (body1.deltaY() < 0)
    {
        //  Body1 is moving UP
    }
    else if (body1.deltaY() > 0)
    {
        //  Body1 is moving DOWN
    }
    else
    {
        //  Body1 is stationary
    }
    */

    /*
    if (topFace)
    {
        //  The top of Body1 overlaps with the bottom of Body2

        if (worldBlocked2.up && !body1Immovable)
        {
            body1.setWorldBlockedUp(body2.bottom);
        }
        else if (worldBlocked2.down && !body1Immovable)
        {
            body1.setWorldBlockedDown(body2.y);
        }
    }
    else if (bottomFace)
    {
        //  The bottom of Body1 overlaps with the top of Body2

        if (worldBlocked2.down && !body1Immovable)
        {
            body1.setWorldBlockedDown(body2.y);
        }
        else if (worldBlocked2.up && !body1Immovable)
        {
            body1.setWorldBlockedUp(body2.bottom);
        }
    }
    */

    /*
    if (body1.deltaY() < 0)
    {
        //  Body1 is moving UP
        console.log('up1');

        if (topFace)
        {
            //  The top of Body1 hit the bottom of Body2

            if (worldBlocked2.up)
            {
                body1.setWorldBlockedUp(body2.bottom);
            }
            else if (worldBlocked2.down)
            {
                body1.setWorldBlockedDown(body2.bottom);
            }
        }
        else if (bottomFace)
        {
            //  The bottom of Body1 hit the top of Body2

            if (worldBlocked2.up)
            {
                body1.setWorldBlockedUp(body2.y);
            }
            else if (worldBlocked2.down)
            {
                body1.setWorldBlockedDown(body2.y);
            }
        }

        if (ny1 < 0)
        {
            //  Velocity hasn't been reversed, so cancel it
            ny1 = 0;
        }
    }
    else if (body1.deltaY() > 0)
    {
        //  Body1 is moving DOWN
        console.log('down1');

        if (topFace)
        {

        }

        if (ny1 > 0)
        {
            //  Velocity hasn't been reversed, so cancel it
            ny1 = 0;
        }
    }
    
    if (body2.deltaY() < 0)
    {
        //  Body2 is moving UP
        console.log('up2');

        if (topFace && worldBlocked1.up)
        {
            //  The bottom of Body2 hit the top of Body1 and is blocked from moving up
            body1.setWorldBlockedUp(body2.bottom);
        }
        else if (topFace)
        {
            //  The top of Body1 hit the bottom of Body2, but isn't blocked. However, we still don't want penetration.
            body1.y = body2.bottom;
        }

        if (ny1 < 0)
        {
            //  Velocity hasn't been reversed, so cancel it
            ny1 = 0;
        }
    }
    else if (body1.deltaY() > 0)
    {
        //  Body1 is moving DOWN
        console.log('down1');

        if (bottomFace && worldBlocked2.down)
        {
            //  The bottom of Body1 hit the top of Body2 and is blocked from moving down
            body1.setWorldBlockedDown(body2.y);
        }
        else if (bottomFace)
        {
            //  The bottom of Body1 hit the top of Body2, but isn't blocked. However, we still don't want penetration.
            body1.bottom = body2.y;
        }

        if (ny1 > 0)
        {
            //  Velocity hasn't been reversed, so cancel it
            ny1 = 0;
        }
    }
    */

    //  If body was asleep, we only wake it up for significant changes in velocity
    // if (body1.sleeping && Math.abs(ny1) > 10)
    // {
    //     body1.wake();
    // }

    // if (body2.sleeping && Math.abs(ny2) > 10)
    // {
    //     body2.wake();
    // }

    if (body1.sleeping && Math.abs(ny1) < 10)
    {
        ny1 = 0;
    }
    else
    {
        body1.wake();
    }

    if (body2.sleeping && Math.abs(ny2) < 10)
    {
        ny2 = 0;
    }
    else
    {
        body2.wake();
    }

    velocity1.y = ny1;
    velocity2.y = ny2;

    //  TODO: This is special case code that handles things like horizontal moving platforms you can ride
    // if (body2.moves)
    // {
    //     body1.x += body1.getMoveX((body2.deltaX()) * body2.friction.x, true);
    // }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateY;
