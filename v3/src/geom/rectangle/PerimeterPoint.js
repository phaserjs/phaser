var MATH_CONST = require('../../math/const');

//  deg = degrees (0-360)

var PerimeterPoint = function (rect, deg, out)
{
    if (out === undefined) { out = { x: 0, y: 0 }; }

    var theta = deg * MATH_CONST.DEG_TO_RAD;

    while (theta < -Math.PI)
    {
        theta += MATH_CONST.PI2;
    }

    while (theta > Math.PI)
    {
        theta -= MATH_CONST.PI2;
    }

    var rectAtan = Math.atan2(rect.height, rect.width);
    var tanTheta = Math.tan(theta);
    var thetaBounds = Math.PI - rectAtan;
    var region;
    var xFactor = 1;
    var yFactor = 1;

    if (theta > -rectAtan && theta <= rectAtan)
    {
        region = 1;
        yFactor = -1;
    }
    else if (theta > rectAtan && theta <= thetaBounds)
    {
        region = 2;
        yFactor = -1;
    }
    else if (theta > thetaBounds || theta <= -thetaBounds)
    {
        region = 3;
        xFactor = -1;
    }
    else
    {
        region = 4;
        xFactor = -1;
    }

    out.x = rect.x + (rect.width / 2);
    out.y = rect.y + (rect.height / 2);

    if (region === 1 || region === 3)
    {
        out.x += xFactor * (rect.width / 2);                                     // "Z0"
        out.y += yFactor * (rect.width / 2) * tanTheta;
    }
    else
    {
        out.x += xFactor * (rect.height / (2 * tanTheta));                        // "Z1"
        out.y += yFactor * (rect.height / 2);
    }

    return out;
};

module.exports = PerimeterPoint;
