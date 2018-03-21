/**
* Convert a distance along this curve into a `time` value which will be between 0 and 1.
* 
* For example if this curve has a length of 100 pixels then `findT(50)` would return `0.5`.
*
* @method Phaser.Hermite#findT
* @param {integer} distance - The distance into the curve in pixels. Should be a positive integer.
* @return {number} The time (`t`) value, a float between 0 and 1.
*/
var FindT = function (curve, distance)
{
    if (distance <= 0)
    {
        return 0;
    }

    //  Find the _points which bracket the distance value
    var ti = Math.floor(distance / curve.length * curve._accuracy);

    while (ti > 0 && curve._points[ti] > distance)
    {
        ti--;
    }

    while (ti < curve._accuracy && curve._points[ti] < distance)
    {
        ti++;
    }

    //  Linear interpolation to get a more accurate fix
    var dt = curve._points[ti] - curve._points[ti - 1];
    var d = distance - curve._points[ti - 1];

    return ((ti - 1) / curve._accuracy) + d / (dt * curve._accuracy);
};

module.exports = FindT;
