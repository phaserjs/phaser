/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../../math/Clamp');

/**
 * [description]
 *
 * @function Phaser.Physics.Impact.GetVelocity
 * @since 3.0.0
 *
 * @param {number} delta - [description]
 * @param {number} vel - [description]
 * @param {number} accel - [description]
 * @param {number} friction - [description]
 * @param {number} max - [description]
 *
 * @return {number} [description]
 */
var GetVelocity = function (delta, vel, accel, friction, max)
{
    if (accel)
    {
        return Clamp(vel + accel * delta, -max, max);
    }
    else if (friction)
    {
        var frictionDelta = friction * delta;
        
        if (vel - frictionDelta > 0)
        {
            return vel - frictionDelta;
        }
        else if (vel + frictionDelta < 0)
        {
            return vel + frictionDelta;
        }
        else
        {
            return 0;
        }
    }

    return Clamp(vel, -max, max);
};

module.exports = GetVelocity;
