//  Return an array of points, spaced out X distance pixels apart
var GetDistancePoints = function (distance)
{
    var len = this.getLength();

    var spaced = Math.max(1, len / distance);

    return this.getSpacedPoints(spaced);

    //  Get the t value for 200 pixels along the curve
    // var t = curve.getTFromDistance(200);
    //  = this.getUtoTmapping(0, distance, divisions)

    //  Get the point at t
    // var p = curve.getPoint(t);
};

module.exports = GetDistancePoints;
