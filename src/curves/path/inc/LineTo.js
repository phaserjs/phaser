var LineCurve = require('../../line/LineCurve');
var Vector2 = require('../../../math/Vector2');

//  Creates a line curve from the previous end point to x/y

/**
 * [description]
 *
 * @method Phaser.Curves.Path#lineTo
 * @since 3.0.0
 *
 * @param {number|Phaser.Math.Vector2} x - [description]
 * @param {number} [y] - [description]
 *
 * @return {Phaser.Curves.Path} [description]
 */
var LineTo = function (x, y)
{
    if (x instanceof Vector2)
    {
        this._tmpVec2B.copy(x);
    }
    else
    {
        this._tmpVec2B.set(x, y);
    }

    var end = this.getEndPoint(this._tmpVec2A);

    return this.add(new LineCurve([ end.x, end.y, this._tmpVec2B.x, this._tmpVec2B.y ]));
};

module.exports = LineTo;
