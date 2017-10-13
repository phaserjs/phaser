var SplineCurve = require('../../spline/SplineCurve');

//  Creates a spline curve starting at the previous end point, using the given parameters

/**
 * [description]
 *
 * @method Phaser.Curves.Path#splineTo
 * @since 3.0.0
 *
 * @param {[type]} points - [description]
 *
 * @return {Phaser.Curves.Path} [description]
 */
var SplineTo = function (points)
{
    points.unshift(this.getEndPoint());

    return this.add(new SplineCurve(points));
};

module.exports = SplineTo;
