/**
* Get the X component of a point on the curve based on the `t` (time) value, which must be between 0 and 1.
*
* @method Phaser.Hermite#getX
* @param {number} [t=0] - The time value along the curve from which to extract a point. This is a value between 0 and 1, where 0 represents the start of the curve and 1 the end.
* @return {number} The X component of a point on the curve based on the `t` (time) value.
*/
var GetX = function (curve, t)
{
    if (t === undefined)
    {
        t = 0;
    }
    else
    {
        if (t < 0)
        {
            t = 0;
        }

        if (t > 1)
        {
            t = 1;
        }
    }

    var t2 = t * t;
    var t3 = t * t2;

    return (t3 * curve._ax + t2 * curve._bx + t * curve._v1x + curve._p1x);
};

module.exports = GetX;
