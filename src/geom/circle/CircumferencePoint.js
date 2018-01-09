var Point = require('../point/Point');

//  Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.

/**
 * [description]
 *
 * @function Phaser.Geom.Circle.CircumferencePoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get the circumference point on.
 * @param {number} angle - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 *
 * @return {Phaser.Geom.Point|object} [description]
 */
var CircumferencePoint = function (circle, angle, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = circle.x + (circle.radius * Math.cos(angle));
    out.y = circle.y + (circle.radius * Math.sin(angle));

    return out;
};

module.exports = CircumferencePoint;
