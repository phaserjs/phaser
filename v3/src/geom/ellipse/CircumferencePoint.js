var Point = require('../point/Point');

/**
 * Given an angle this will return a Point object containing the coordinates of the point
 * on the circumference of the ellipse.
 *
 * @function Phaser.Geom.Ellipse.CircumferencePoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {float} angle - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 *
 * @return {Phaser.Geom.Point|object} [description]
 */
var CircumferencePoint = function (ellipse, angle, out)
{
    if (out === undefined) { out = new Point(); }

    var halfWidth = ellipse.width / 2;
    var halfHeight = ellipse.height / 2;

    out.x = ellipse.x + halfWidth * Math.cos(angle);
    out.y = ellipse.y + halfHeight * Math.sin(angle);

    return out;
};

module.exports = CircumferencePoint;
