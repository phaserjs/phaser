var GetMagnitude = require('./GetMagnitude');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.SetMagnitude
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 * @param {number} magnitude - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var SetMagnitude = function (point, magnitude)
{
    if (point.x !== 0 || point.y !== 0)
    {
        var m = GetMagnitude(point);

        point.x /= m;
        point.y /= m;
    }

    point.x *= magnitude;
    point.y *= magnitude;

    return point;
};

module.exports = SetMagnitude;
