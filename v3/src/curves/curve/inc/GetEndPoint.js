var Vector2 = require('../../../math/Vector2');

var GetEndPoint = function (out)
{
    if (out === undefined) { out = new Vector2(); }

    return this.getPointAt(1, out);
};

module.exports = GetEndPoint;
