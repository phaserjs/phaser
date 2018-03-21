var Point = require('../point/Point');

/**
* Returns a uniformly distributed random point from anywhere within this Circle.
* 
* @method Phaser.Circle#random
* @param {Phaser.Point|object} [out] - A Phaser.Point, or any object with public x/y properties, that the values will be set in.
*     If no object is provided a new Phaser.Point object will be created. In high performance areas avoid this by re-using an existing object.
* @return {Phaser.Point} An object containing the random point in its `x` and `y` properties.
*/
var Random = function (circle, out)
{
    if (out === undefined) { out = new Point(); }

    var t = 2 * Math.PI * Math.random();
    var u = Math.random() + Math.random();
    var r = (u > 1) ? 2 - u : u;
    var x = r * Math.cos(t);
    var y = r * Math.sin(t);

    out.x = circle.x + (x * circle.radius);
    out.y = circle.y + (y * circle.radius);

    return out;
};

module.exports = Random;
