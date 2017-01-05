var GetPoint = require('./GetPoint');

/**
* Calculate and return the angle, in radians, of the curves tangent based on time.
*
* @method Phaser.Hermite#getAngle
* @param {number} [t=0] - The `t` (time) value at which to find the angle. Must be between 0 and 1.
* @return {number} The angle of the line at the specified `t` time value along the curve. The value is in radians.
*/
var GetAngle = function (curve, t)
{
    if (t === undefined) { t = 0; }

    GetPoint(curve, t - 0.01, curve._temp1);
    GetPoint(curve, t + 0.01, curve._temp2);

    return Math.atan2(curve._temp2.y - curve._temp1.y, curve._temp2.x - curve._temp1.x);
};

module.exports = GetAngle;
