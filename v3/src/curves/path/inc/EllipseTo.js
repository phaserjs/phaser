var EllipseCurve = require('../../ellipse/EllipseCurve');

//  Creates an ellipse curve positioned at the previous end point, using the given parameters

/**
 * [description]
 *
 * @method Phaser.Curves.Path#ellipseTo
 * @since 3.0.0
 *
 * @param {number} xRadius - [description]
 * @param {number} yRadius - [description]
 * @param {number} startAngle - [description]
 * @param {number} endAngle - [description]
 * @param {boolean} clockwise - [description]
 * @param {number} rotation - [description]
 *
 * @return {Phaser.Curves.Path} [description]
 */
var EllipseTo = function (xRadius, yRadius, startAngle, endAngle, clockwise, rotation)
{
    var ellipse = new EllipseCurve(0, 0, xRadius, yRadius, startAngle, endAngle, clockwise, rotation);

    var end = this.getEndPoint(this._tmpVec2A);

    //  Calculate where to center the ellipse
    var start = ellipse.getStartPoint(this._tmpVec2B);

    end.subtract(start);

    ellipse.x = end.x;
    ellipse.y = end.y;

    return this.add(ellipse);
};

module.exports = EllipseTo;
