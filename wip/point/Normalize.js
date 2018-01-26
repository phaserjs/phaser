var GetMagnitude = require('./GetMagnitude');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.Normalize
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Normalize = function (point)
{
    if (point.x !== 0 || point.y !== 0)
    {
        var m = GetMagnitude(point);

        point.x /= m;
        point.y /= m;
    }

    return point;
};

module.exports = Normalize;
