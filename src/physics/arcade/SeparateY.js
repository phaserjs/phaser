/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetOverlapY = require('./GetOverlapY');

/**
 * Separates two overlapping bodies on the Y-axis (vertically).
 *
 * Separation involves moving two overlapping bodies so they don't overlap anymore and adjusting their velocities based on their mass. This is a core part of collision detection.
 *
 * The bodies won't be separated if there is no vertical overlap between them, if they are static, or if either one uses custom logic for its separation.
 *
 * @function Phaser.Physics.Arcade.SeparateY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - If `true`, the bodies will only have their overlap data set and no separation will take place.
 * @param {number} bias - A value to add to the delta value during overlap checking. Used to prevent sprite tunneling.
 *
 * @return {boolean} `true` if the two bodies overlap vertically, otherwise `false`.
 */
var SeparateY = function (body1, body2, overlapOnly, bias)
{
    var overlap = GetOverlapY(body1, body2, overlapOnly, bias);

    var body1Pushable = body1.pushable;
    var body2Pushable = body2.pushable;
    var body1Immovable = body1.immovable;
    var body2Immovable = body2.immovable;

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1Immovable && body2Immovable) || body1.customSeparateY || body2.customSeparateY)
    {
        //  return true if there was some overlap, otherwise false
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    //  Adjust their positions and velocities accordingly (if there was any overlap)
    var v1 = body1.velocity.y;
    var v2 = body2.velocity.y;

    if (!body1Immovable && !body2Immovable)
    {
        //  negative delta = up, positive delta = down (inc. gravity)

        overlap = Math.abs(overlap);

        var body1MovingUp = body1._dy < 0;
        var body1MovingDown = body1._dy >= 0;

        var body2MovingUp = body2._dy < 0;
        var body2MovingDown = body2._dy >= 0;

        var body1OnTop = Math.abs(body1.bottom - body2.y) <= Math.abs(body2.bottom - body1.y);
        var body2OnTop = !body1OnTop;

        var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
        var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
        var avg = (nv1 + nv2) * 0.5;

        nv1 -= avg;
        nv2 -= avg;

        //  -----------------------------------------------------------------------
        //  Blocked / Ground Checks
        //  -----------------------------------------------------------------------

        //  Body1 is moving down and Body2 is blocked from going down any further
        if (body1MovingDown && body1OnTop && body2.blocked.down)
        {
            console.log('BlockY 1', body1.gameObject.name, 'vs', body2.gameObject.name, body1.y, overlap);

            body1.y -= overlap;

            body1.velocity.y = v2 - v1 * body1.bounce.y;

            return true;
        }

        //  Body2 is moving down and Body1 is blocked from going down any further
        if (body2MovingDown && body2OnTop && body1.blocked.down)
        {
            console.log('BlockY 2', body1.gameObject.name, 'vs', body2.gameObject.name, body2.y, overlap);

            body2.y -= overlap;

            body2.velocity.y = v1 - v2 * body2.bounce.y;

            return true;
        }

        //  Body1 is moving up and Body2 is blocked from going up any further
        if (body1MovingUp && body2OnTop && body2.blocked.up)
        {
            console.log('BlockY 3', body1.gameObject.name, 'vs', body2.gameObject.name, body1.y, overlap);

            body1.y += overlap;

            body1.velocity.y = v2 - v1 * body1.bounce.y;

            return true;
        }

        //  Body2 is moving up and Body1 is blocked from going up any further
        if (body2MovingUp && body1OnTop && body1.blocked.up)
        {
            console.log('BlockY 4', body1.gameObject.name, 'vs', body2.gameObject.name, body2.y, overlap);

            body2.y += overlap;

            body2.velocity.y = v1 - v2 * body2.bounce.y;

            return true;
        }

        //  -----------------------------------------------------------------------
        //  Pushable Checks
        //  -----------------------------------------------------------------------

        //  Body1 is moving down and on top - and Body2 is pushable
        if (body1MovingDown && !body1Pushable && body1OnTop && body2Pushable)
        {
            console.log('PushY 1', body1.gameObject.name, 'vs', body2.gameObject.name, body2.y, overlap);

            //  Body 2 gets it all
            body2.y += overlap;
            body2.velocity.y = v1;

            // body2.velocity.y = v1 - v2 * body2.bounce.y;

            return true;
        }

        //  Body1 is moving down and on top - and Body2 is pushable
        if (body2MovingDown && !body2Pushable && body2OnTop && body1Pushable)
        {
            console.log('PushY 2', body1.gameObject.name, 'vs', body2.gameObject.name, body2.y, overlap);

            //  Body 1 gets it all
            body1.y += overlap;
            body1.velocity.y = v2;

            // body1.velocity.y = v2 - v1 * body1.bounce.y;

            return true;
        }

        //  Insert Up versions here ^^^




        //  Body1 is moving down and on top - and Body2 is pushable
        if (body1MovingDown && body1OnTop && body2Pushable)
        {
            if (body1Pushable)
            {
                console.log('PushY 3', body1.gameObject.name, 'vs', body2.gameObject.name, body1.y, overlap);

                //  They're both pushable? They can share the separation then
                overlap *= 0.5;

                body1.y -= overlap;
                body2.y += overlap;

                body1.velocity.y = avg + nv1 * body1.bounce.y;
                body2.velocity.y = avg + nv2 * body2.bounce.y;
            }
            else
            {
                console.log('PushY 4', body1.gameObject.name, 'vs', body2.gameObject.name, body2.y, overlap);

                //  Body 2 gets it all
                body2.y += overlap;

                // body2.velocity.y = v1 - v2 * body2.bounce.y;
            }

            return true;
        }

        //  Body2 is moving down and on top - and Body1 is pushable
        if (body2MovingDown && body2OnTop && body1Pushable)
        {
            if (body2Pushable)
            {
                console.log('PushY 5', body1.gameObject.name, 'vs', body2.gameObject.name, body1.y, overlap);

                //  They're both pushable? They can share the separation then
                overlap *= 0.5;

                body1.y += overlap;
                body2.y -= overlap;

                body1.velocity.y = avg + nv1 * body1.bounce.y;
                body2.velocity.y = avg + nv2 * body2.bounce.y;
            }
            else
            {
                console.log('PushY 6', body1.gameObject.name, 'vs', body2.gameObject.name, body1.y, overlap);

                //  Body 1 gets it all
                body1.y += overlap;

                // body1.velocity.y = v2 - v1 * body1.bounce.y;
            }

            return true;
        }

        //  Body1 is moving up and on the bottom - and Body2 is pushable
        if (body1MovingUp && body2OnTop && body2Pushable)
        {
            if (body1Pushable)
            {
                console.log('PushY 7', body1.gameObject.name, 'vs', body2.gameObject.name, body1.y, overlap);

                //  They're both pushable? They can share the separation then
                overlap *= 0.5;

                body1.y += overlap;
                body2.y -= overlap;

                body1.velocity.y = avg + nv1 * body1.bounce.y;
                body2.velocity.y = avg + nv2 * body2.bounce.y;
            }
            else
            {
                console.log('PushY 8', body1.gameObject.name, 'vs', body2.gameObject.name, body2.y, overlap);

                //  Body 2 gets it all
                body2.y -= overlap;

                body2.velocity.y = v1 - v2 * body2.bounce.y;
            }

            return true;
        }

        //  Body2 is moving up and on the bottom - and Body1 is pushable
        if (body2MovingUp && body1OnTop && body1Pushable)
        {
            if (body2Pushable)
            {
                console.log('PushY 9', body1.gameObject.name, 'vs', body2.gameObject.name, body1.y, overlap);

                //  They're both pushable? They can share the separation then
                overlap *= 0.5;

                body1.y -= overlap;
                body2.y += overlap;

                body1.velocity.y = avg + nv1 * body1.bounce.y;
                body2.velocity.y = avg + nv2 * body2.bounce.y;
            }
            else
            {
                console.log('PushY 10', body1.gameObject.name, 'vs', body2.gameObject.name, body1.y, overlap);

                //  Body 1 gets it all
                body1.y -= overlap;

                body1.velocity.y = v2 - v1 * body1.bounce.y;
            }

            return true;
        }

        console.log('uh oh');
        console.log('body1MovingUp', body1MovingUp, 'body2MovingUp', body2MovingUp, 'body1OnTop', body1OnTop, 'body2OnTop', body2OnTop);

    }
    else if (!body1Immovable)
    {
        //  Body2 is immovable, so 1 gets all the separation no matter what
        body1.y -= overlap;

        body1.velocity.y = v2 - v1 * body1.bounce.y;

        //  This is special case code that handles things like horizontally moving platforms you can ride
        if (body2.moves)
        {
            body1.x += (body2.x - body2.prev.x) * body2.friction.x;
            body1._dx = body1.x - body1.prev.x;
        }
    }
    else if (!body2Immovable)
    {
        //  Body1 is immovable, so 2 gets all the separation no matter what
        body2.y += overlap;

        body2.velocity.y = v1 - v2 * body2.bounce.y;

        //  This is special case code that handles things like horizontally moving platforms you can ride
        if (body1.moves)
        {
            body2.x += (body1.x - body1.prev.x) * body1.friction.x;
            body2._dx = body2.x - body2.prev.x;
        }
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateY;
