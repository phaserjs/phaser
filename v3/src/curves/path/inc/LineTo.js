var LineCurve = require('../../line/LineCurve');
var Vector2 = require('../../../math/Vector2');

//  Creates a line curve from the previous end point to x/y
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
