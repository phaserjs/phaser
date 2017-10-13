var SplineCurve = require('../curves/spline/SplineCurve');

//  Creates a spline curve starting at the previous end point, using the given parameters
var SplineTo = function (points)
{
    points.unshift(this.getEndPoint());

    return this.add(new SplineCurve(points));
};

module.exports = SplineTo;
