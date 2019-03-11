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
    var result = GetOverlapY(body1, body2, overlapOnly, bias);

    var overlap = result[0];
    var faceTop = result[1];
    var faceBottom = !faceTop;

    var velocity1 = body1.velocity;
    var velocity2 = body2.velocity;

    var blocked1 = body1.blocked;
    var blocked2 = body2.blocked;

    // console.log('----------> SY', overlap, 'faceTop?', faceTop);

    // console.log('SY', body1.gameObject.name, body2.gameObject.name, overlap, 'faceTop?', faceTop);

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

    if (faceTop)
    {
        body1.setTouchingUp();
        body2.setTouchingDown();

        if (blocked2.up)
        {
            // console.log('a1');
            body1.setBlockedUp(body2);
        }
        else if (blocked1.up)
        {
            // console.log('a2');
            body2.setBlockedUp(body1);
        }
        else if (blocked1.down)
        {
            // console.log('a3');
            body2.setBlockedDown(body1);
        }
        else if (blocked2.down)
        {
            // console.log('a4');
            body1.setBlockedDown(body2);
        }
        else if (body1Immovable)
        {
            if (v2 < 0)
            {
                // console.log('a5');
                body2.setBlockedUp(body1);
            }
            else if (v2 > 0)
            {
                // console.log('a6');
                body2.setBlockedDown(body1);
            }
        }
        else if (body2Immovable)
        {
            if (v1 < 0)
            {
                // console.log('a7');
                body1.setBlockedUp(body2);
            }
            else if (v1 > 0)
            {
                // console.log('a8');
                body1.setBlockedDown(body2);
            }
        }
        else
        {
            console.log('buma', blocked1.up, blocked2.up, blocked1.down, blocked2.down);
        }
    }
    else
    {
        body1.setTouchingDown();
        body2.setTouchingUp();

        if (blocked2.down)
        {
            // console.log('b1');
            body1.setBlockedDown(body2);
        }
        else if (blocked1.down)
        {
            // console.log('b2');
            body2.setBlockedDown(body1);
        }
        else if (blocked1.up)
        {
            // console.log('b3');
            body2.setBlockedUp(body1);
        }
        else if (blocked2.up)
        {
            // console.log('b4');
            body1.setBlockedUp(body2);
        }
        else if (body1Immovable)
        {
            if (v2 < 0)
            {
                // console.log('b5');
                body2.setBlockedUp(body1);
            }
            else if (v2 > 0)
            {
                // console.log('b6');
                body2.setBlockedDown(body1);
            }
        }
        else if (body2Immovable)
        {
            if (v1 < 0)
            {
                // console.log('b7');
                body1.setBlockedUp(body2);
            }
            else if (v1 > 0)
            {
                // console.log('b8');
                body1.setBlockedDown(body2);
            }
        }
        else
        {
            console.log('bumb', blocked1.up, blocked2.up, blocked1.down, blocked2.down);
        }
    }

    //  At this point, the velocity from gravity, world rebounds, etc has been factored in.
    //  The body is moving the direction it wants to, but may be blocked.

    if (!body1Immovable && !body2Immovable)
    {
        //  Neither body is immovable, so they get an equal amount of separation and a new velocity based on mass
        //  Share the overlap equally if both bodies are unblocked

        var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
        var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
        var avg = (nv1 + nv2) * 0.5;

        nv1 -= avg;
        nv2 -= avg;

        var ny1 = avg + nv1 * body1.bounce.y;
        var ny2 = avg + nv2 * body2.bounce.y;

        if (faceBottom && blocked2.down)
        {
            if (blocked1.by === body2)
            {
                body1.bottom = body2.y;

                if (body1.bounce.y === 0)
                {
                    ny1 = 0;
                }
            }
        }
        else if (faceTop && blocked1.down)
        {
            if (blocked2.by === body1)
            {
                body2.bottom = body1.y;

                if (body2.bounce.y === 0)
                {
                    ny2 = 0;
                }
            }
        }
        else if (faceBottom && blocked1.up)
        {
            if (blocked2.by === body1)
            {
                body2.y = body1.bottom;

                if (body2.bounce.y === 0)
                {
                    ny2 = 0;
                }
            }
        }
        else if (faceTop && blocked2.up)
        {
            if (blocked1.by === body2)
            {
                body1.y = body2.bottom;

                if (body1.bounce.y === 0)
                {
                    ny1 = 0;
                }
            }
        }
        else
        {
            overlap *= 0.5;
            body1.y -= body1.getMoveY(overlap);
            body2.y += body2.getMoveY(overlap);
        }

        velocity1.y = ny1;
        velocity2.y = ny2;
    }
    else if (body1Immovable)
    {
        //  Body1 is immovable, but Body2 can move, so it gets all the separation

        if (faceBottom)
        {
            body2.y = body1.bottom;
            // console.log('a');
        }
        else
        {
            body2.bottom = body1.y;
            // console.log('b');
        }

        velocity2.y = v1 - v2 * body2.bounce.y;

        //  This is special case code that handles things like horizontal moving platforms you can ride
        if (body1.moves)
        {
            body2.x += body2.getMoveX((body1.deltaX()) * body1.friction.x, true);
        }
    }
    else if (body2Immovable)
    {
        //  Body2 is immovable, but Body1 can move, so it gets all the separation

        if (faceBottom)
        {
            body1.bottom = body2.y;
            // console.log('a');
        }
        else
        {
            body1.y = body2.bottom;
            // console.log('b');
        }

        velocity1.y = v2 - v1 * body1.bounce.y;

        //  This is special case code that handles things like horizontal moving platforms you can ride
        if (body2.moves)
        {
            body1.x += body1.getMoveX((body2.deltaX()) * body2.friction.x, true);
        }
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateY;
