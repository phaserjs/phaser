var Dot = require('./Dot');
var Point = require('./Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.ProjectUnit
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} pointA - [description]
 * @param {Phaser.Geom.Point} pointB - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var ProjectUnit = function (pointA, pointB, out)
{
    if (out === undefined) { out = new Point(); }

    var amt = Dot(pointA, pointB);

    if (amt !== 0)
    {
        out.x = amt * pointB.x;
        out.y = amt * pointB.y;
    }

    return out;
};

module.exports = ProjectUnit;
