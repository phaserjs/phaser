var Vector2 = require('../../../math/Vector2');

var GetStartPoint = function (out)
{
    if (out === undefined) { out = new Vector2(); }

    return out.copy(this.startPoint);
};

module.exports = GetStartPoint;
