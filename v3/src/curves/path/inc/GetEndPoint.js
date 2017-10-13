var Vector2 = require('../../../math/Vector2');

var GetEndPoint = function (out)
{
    if (out === undefined) { out = new Vector2(); }

    if (this.curves.length > 0)
    {
        this.curves[this.curves.length - 1].getPoint(1, out);
    }
    else
    {
        out.copy(this.startPoint);
    }

    return out;
};

module.exports = GetEndPoint;
