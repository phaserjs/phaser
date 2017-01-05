/**
* Get the angle of the curves entry point.
*
* @method Phaser.Hermite#getEntryTangent
* @param {Phaser.Point|Object} point - The Phaser.Point object, or an Object with public `x` and `y` properties, in which the tangent vector values will be stored.
* @return {Phaser.Point} A Point object containing the tangent vector of this Hermite curve.
*/
var GetEntryTangent = function (curve, point)
{
    point.x = curve._v1x;
    point.y = curve._v1y;

    return point;
};

module.exports = GetEntryTangent;
