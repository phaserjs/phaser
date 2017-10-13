var EllipseCurve = require('../curves/ellipse/EllipseCurve');

//  Creates an ellipse curve positioned at the previous end point, using the given parameters
var EllipseTo = function (xRadius, yRadius, startAngle, endAngle, clockwise, rotation)
{
    var ellipse = new EllipseCurve(0, 0, xRadius, yRadius, startAngle, endAngle, clockwise, rotation);

    var end = this.getEndPoint(this._tmpVec2A);

    //  Calculate where to center the ellipse
    var start = ellipse.getStartPoint(this._tmpVec2B);

    end.sub(start);

    ellipse.x = end.x;
    ellipse.y = end.y;

    return this.add(ellipse);
};

module.exports = EllipseTo;
