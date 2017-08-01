var Angle = require('./Angle');
var NormalAngle = require('./NormalAngle');

/**
* Returns the reflected angle between two lines.
* This is the outgoing angle based on the angle of Line 1 and the normalAngle of Line 2.
*/
var ReflectAngle = function (lineA, lineB)
{
    return (2 * NormalAngle(lineB) - Math.PI - Angle(lineA));
};

module.exports = ReflectAngle;
