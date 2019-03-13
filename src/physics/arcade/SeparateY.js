 /**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var FuzzyEqual = require('../../math/fuzzy/Equal');
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
    var result = GetOverlapY(body1, body2, overlapOnly, bias);

    var overlap = result[0];
    var faceTop = result[1];
    var faceBottom = !faceTop;

    var velocity1 = body1.velocity;
    var velocity2 = body2.velocity;

    var blocked1 = body1.blocked;
    var blocked2 = body2.blocked;

    var body1Immovable = (body1.physicsType === CONST.STATIC_BODY || body1.immovable);
    var body2Immovable = (body2.physicsType === CONST.STATIC_BODY || body2.immovable);

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || (body1Immovable && body2Immovable) || body1.customSeparateY || body2.customSeparateY)
    {
        //  return true if there was some overlap, otherwise false.
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    //  Adjust their positions and velocities accordingly based on the amount of overlap
    var v1 = velocity1.y;
    var v2 = velocity2.y;

    //  At this point, the velocity from gravity, world rebounds, etc has been factored in.
    //  The body is moving the direction it wants to, but may be blocked.

    // console.log('Collision - top face of body1?', faceTop);

    // console.log('body1', body1.gameObject.name);
    // console.log('blocked down', blocked1.down, 'blocked up', blocked1.up);
    // console.log('touching down', body1.touching.down, 'touching up', body1.touching.up);
    // console.log('world blocked down', body1.worldBlocked.down, 'world blocked up', body1.worldBlocked.up);
    // console.log('moving up?', (body1.deltaY() < 0), 'speed', body1.deltaY());
    // console.log('immovable', body1.immovable);
    // console.log('velocity', v1);

    // console.log('');

    // console.log('body2', body2.gameObject.name);
    // console.log('blocked down', blocked2.down, 'blocked up', blocked2.up);
    // console.log('touching down', body2.touching.down, 'touching up', body2.touching.up);
    // console.log('world blocked down', body2.worldBlocked.down, 'world blocked up', body2.worldBlocked.up);
    // console.log('moving up?', (body2.deltaY() < 0), 'speed', body2.deltaY());
    // console.log('immovable', body2.immovable);
    // console.log('velocity', v2);

    // debugger;

    var ny1 = v1;
    var ny2 = v2;

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
    }
    else if (body1Immovable)
    {
        //  Body1 is immovable, so carries on at the same speed regardless, adjust body2 speed
        // ny2 = v1 - v2 * body2.bounce.y;
        ny2 = v1 - v2;
    }
    else if (body2Immovable)
    {
        //  Body2 is immovable, so carries on at the same speed regardless, adjust body1 speed
        // ny1 = v2 - v1 * body1.bounce.y;
        ny1 = v2 - v1;
    }

    //  Velocities calculated, time to work out what moves where

    //  -------------------------------------------
    //  1) Bail out if nothing is blocking anything
    //  -------------------------------------------

    if (blocked1.none && blocked2.none)
    {
        if (overlap !== 0)
        {
            // var p1 = (faceBottom) ? body1.bottom - body2.y : body2.bottom - body1.y;
            // console.log('impact', v1, v2, 'overlap', overlap, p1);
    
            var share = overlap * 0.5;
            var amount1 = body1.getMoveY(share);
            var amount2 = body2.getMoveY(-share);
    
            if (amount1 !== share)
            {
                // console.log('diff1', share, amount1, amount2);
                amount2 -= (share - amount1);
            }
            else if (amount2 !== -share)
            {
                // console.log('diff2', share, amount1, amount2);
                amount1 += (share + amount2);
            }
    
            body1.y += amount1;
            body2.y += amount2;

            // var p2 = (faceBottom) ? body1.bottom - body2.y : body2.bottom - body1.y;
            // console.log('post-impact', p2);
        }
        // else
        // {
        //     console.log('zero overlap impact');
        // }

        // console.log('----------------------------------');

        velocity1.y = ny1;
        velocity2.y = ny2;

        return true;
    }
    else if (blocked1.none)
    {
        //  Body2 is blocked from moving, so Body1 needs to move

    }
    else if (blocked2.none)
    {
        //  Body1 is blocked from moving, so Body2 needs to move

    }
    else
    {
        //  Nothing can move anywhere!
    }

    //  -------------------------------------------
    //  2) Body1 motion checks
    //  -------------------------------------------

    if (body1.deltaY() < 0)
    {
        console.log('up1');

        //  Body1 is moving UP

        if (blocked1.up && blocked1.by === body2)
        {
            //  And is blocked
            if (faceTop)
            {
                //  Body1 top hit Body2 bottom and is blocked from moving up
                body1.y = body2.bottom;
            }
            else
            {
                //  Body1 bottom hit Body2 top and is blocked from moving up
                body1.bottom = body2.y;
            }

            if (ny1 < 0)
            {
                //  Velocity hasn't been reversed, so cancel it
                ny1 = 0;
            }
        }
    }
    else if (body1.deltaY() > 0)
    {
        console.log('down1');

        //  Body1 is moving DOWN

        if (blocked1.down && blocked1.by === body2)
        {
            //  And is blocked
            if (faceTop)
            {
                //  Body1 top hit Body2 bottom and is blocked from moving down
                body1.y = body2.bottom;
            }
            else
            {
                //  Body1 bottom hit Body2 top and is blocked from moving down
                body1.bottom = body2.y;
            }

            if (ny1 > 0)
            {
                //  Velocity hasn't been reversed, so cancel it
                ny1 = 0;
            }
        }
    }
    else if (FuzzyEqual(ny1, 0, 0.001))
    {
        //  Body1 is static, don't apply any more velocity
        console.log('static 1');
        ny1 = 0;
    }

    if (body2.deltaY() < 0)
    {
        console.log('up2');

        //  Body2 is moving UP

        if (blocked2.up && blocked2.by === body1)
        {
            //  And is blocked
            if (faceTop)
            {
                //  Body2 bottom hit Body1 top and is blocked from moving up
                body2.bottom = body1.y;
            }
            else
            {
                //  Body2 top hit Body1 bottom and is blocked from moving up
                body2.y = body1.bottom;
            }

            if (ny2 < 0)
            {
                //  Velocity hasn't been reversed, so cancel it
                ny2 = 0;
            }
        }
    }
    else if (body2.deltaY() > 0)
    {
        console.log('down2');

        //  Body2 is moving DOWN

        if (blocked2.down && blocked2.by === body1)
        {
            //  And is blocked
            if (faceTop)
            {
                //  Body2 bottom hit Body1 top and is blocked from moving down
                body2.bottom = body1.y;
            }
            else
            {
                //  Body2 top hit Body1 bottom and is blocked from moving down
                body2.y = body1.bottom;
            }

            if (ny2 > 0)
            {
                //  Velocity hasn't been reversed, so cancel it
                ny2 = 0;
            }
        }
    }
    else if (FuzzyEqual(ny2, 0, 0.001))
    {
        //  Body2 is static, don't apply any more velocity
        console.log('static2');
        ny2 = 0;
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
