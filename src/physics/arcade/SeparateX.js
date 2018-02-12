/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetOverlapX = require('./GetOverlapX');

/**
 * [description]
 *
 * @function Phaser.Physics.Arcade.SeparateX
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - [description]
 * @param {Phaser.Physics.Arcade.Body} body2 - [description]
 * @param {boolean} overlapOnly - [description]
 * @param {number} bias - [description]
 *
 * @return {boolean} [description]
 */
var SeparateX = function (body1, body2, overlapOnly, bias)
{
    var overlap = GetOverlapX(body1, body2, overlapOnly, bias);

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1.immovable && body2.immovable) || body1.customSeparateX || body2.customSeparateX)
    {
        //  return true if there was some overlap, otherwise false
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    //  Adjust their positions and velocities accordingly (if there was any overlap)
    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    if (!body1.immovable && !body2.immovable)
    {
        overlap *= 0.5;

        body1.x -= overlap;
        body2.x += overlap;

        var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
        var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
        var avg = (nv1 + nv2) * 0.5;

        nv1 -= avg;
        nv2 -= avg;

        body1.velocity.x = avg + nv1 * body1.bounce.x;
        body2.velocity.x = avg + nv2 * body2.bounce.x;
    }
    else if (!body1.immovable)
    {
        body1.x -= overlap;
        body1.velocity.x = v2 - v1 * body1.bounce.x;

        //  This is special case code that handles things like vertically moving platforms you can ride
        if (body2.moves)
        {
            body1.y += (body2.y - body2.prev.y) * body2.friction.y;
        }
    }
    else
    {
        body2.x += overlap;
        body2.velocity.x = v1 - v2 * body2.bounce.x;

        //  This is special case code that handles things like vertically moving platforms you can ride
        if (body1.moves)
        {
            body2.y += (body1.y - body1.prev.y) * body1.friction.y;
        }
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateX;
