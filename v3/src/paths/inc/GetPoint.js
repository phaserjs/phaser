var Vector2 = require('../../math/Vector2');

// To get accurate point with reference to
// entire path distance at time t,
// following has to be done:

// 1. Length of each sub path have to be known
// 2. Locate and identify type of curve
// 3. Get t for the curve
// 4. Return curve.getPointAt(t')

var GetPoint = function (t, out)
{
    if (out === undefined) { out = new Vector2(); }

    var d = t * this.getLength();
    var curveLengths = this.getCurveLengths();
    var i = 0;

    while (i < curveLengths.length)
    {
        if (curveLengths[i] >= d)
        {
            var diff = curveLengths[i] - d;
            var curve = this.curves[i];

            var segmentLength = curve.getLength();
            var u = (segmentLength === 0) ? 0 : 1 - diff / segmentLength;

            return curve.getPointAt(u, out);
        }

        i++;
    }

    // loop where sum != 0, sum > d , sum+1 <d
    return null;
};

module.exports = GetPoint;
