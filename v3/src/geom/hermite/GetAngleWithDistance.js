var GetAngle = require('./GetAngle');
var FindT = require('./FindT');

/**
* Calculate and return the angle, in radians, of the curves tangent at the given pixel distance along the curves length.
*
* @method Phaser.Hermite#getAngleWithDistance
* @param {number} [distance=0] - The distance along the curve to get the angle from, in pixels.
* @return {number} The angle of the line at the specified distance along the curve. The value is in radians.
*/
var GetAngleWithDistance = function (curve, distance)
{
    if (distance === undefined) { distance = 0; }

    if (distance <= 0)
    {
        return Math.atan2(this._v1y, this._v1x);
    }
    else
    {
        return GetAngle(curve, FindT(curve, distance));
    }
};

module.exports = GetAngleWithDistance;
