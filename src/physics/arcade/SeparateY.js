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
    var intersects = result[2];

    var velocity1 = body1.velocity;
    var velocity2 = body2.velocity;

    var blocked1 = body1.blocked;
    var blocked2 = body2.blocked;

    var body1BlockedY = (blocked1.up || blocked1.down);
    var body2BlockedY = (blocked2.up || blocked2.down);

    var body1Immovable = (body1.physicsType === CONST.STATIC_BODY || body1.immovable);
    var body2Immovable = (body2.physicsType === CONST.STATIC_BODY || body2.immovable);

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (!intersects || overlapOnly || (body1Immovable && body2Immovable) || body1.customSeparateY || body2.customSeparateY)
    {
        //  return true if there was some overlap, otherwise false.
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    if (blocked1.up && blocked1.down)
    {
        body1Immovable = true;
    }

    if (blocked2.up && blocked2.down)
    {
        body2Immovable = true;
    }

    //  Adjust their positions and velocities accordingly based on the amount of overlap
    var v1 = velocity1.y;
    var v2 = velocity2.y;

    //  At this point, the velocity from gravity, world rebounds, etc has been factored in.
    //  The body is moving the direction it wants to, but may be blocked.

    var ny1 = v1;
    var ny2 = v2;

    if (body1Immovable && body2Immovable)
    {
        //  Both bodies are equally blocked, we can't do anything with them
        console.log('Both bodies are equally blocked, kill velocity?');
        // ny1 = 0;
        // ny2 = 0;
    }
    else if (!body1Immovable && !body1BlockedY && !body2Immovable && !body2BlockedY)
    {
        //  Neither body is immovable or blocked, so they get a new velocity based on mass
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
    else if (body1BlockedY || body1Immovable)
    {
        //  Body1 is blocked or never changes speed, so adjust body2 speed
        ny2 = v1 - v2 * body2.bounce.y;
    }
    else if (body2BlockedY || body2Immovable)
    {
        //  Body2 is blocked or never changes speed, so adjust body1 speed
        ny1 = v2 - v1 * body1.bounce.y;
    }

    //  Velocities calculated, time to work out what moves where
    if (overlap !== 0)
    {
        var share = overlap * 0.5;
        var amount1 = body1.getMoveY(share);
        var amount2 = body2.getMoveY(-share);

        if (amount1 !== share)
        {
            amount2 -= (share - amount1);
        }
        else if (amount2 !== -share)
        {
            amount1 += (share + amount2);
        }

        body1.y += amount1;
        body2.y += amount2;
    }

    //  -------------------------------------------
    //  1) Bail out if nothing is blocking anything
    //  -------------------------------------------

    if (!body1BlockedY && !body2BlockedY)
    {
        velocity1.y = ny1;
        velocity2.y = ny2;

        return true;
    }

    //  -------------------------------------------
    //  2) Body1 motion checks
    //  -------------------------------------------

    if (body1.deltaY() < 0 && blocked1.up && blocked1.by === body2)
    {
        // console.log('up1');

        //  Body1 is moving UP and is blocked by Body2

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
    else if (body1.deltaY() > 0 && blocked1.down && blocked1.by === body2)
    {
        // console.log('down1');

        //  Body1 is moving DOWN and is blocked by Body2

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

    if (body2.deltaY() < 0 && blocked2.up && blocked2.by === body1)
    {
        // console.log('up2');

        //  Body2 is moving UP and is blocked by Body1

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
    else if (body2.deltaY() > 0 && blocked2.down && blocked2.by === body1)
    {
        // console.log('down2');

        //  Body2 is moving DOWN and is blocked by Body1

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
