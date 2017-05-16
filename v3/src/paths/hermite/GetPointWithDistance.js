var Point = require('../point/Point');
var GetPoint = require('./GetPoint');
var FindT = require('./FindT');

/**
* Get a point on the curve using the distance, in pixels, along the curve.
*
* @method Phaser.Hermite#getPointWithDistance
* @param {integer} [distance=0] - The distance along the curve to get the point from, given in pixels.
* @param {Phaser.Point|Object} [point] - An optional Phaser.Point, or Object containing public `x` and `y` properties. If given the resulting values will be stored in the Objects `x` and `y` properties. If omitted a new Phaser.Point object is created.
* @return {Phaser.Point} The point on the line at the specified 'distance' along the curve.
*/
var GetPointWithDistance = function (curve, distance, out)
{
    if (distance === undefined) { distance = 0; }
    if (out === undefined) { out = new Point(); }

    if (distance <= 0)
    {
        out.x = this._p1x;
        out.y = this._p1y;
    }
    else
    {
        GetPoint(curve, FindT(curve, distance), out);
    }
    
    return out;
};

module.exports = GetPointWithDistance;
