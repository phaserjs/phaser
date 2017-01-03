var Point = require('./Point');

var Negative = function (point, out)
{
    if (out === undefined) { out = new Point(); }

    return out.setTo(-point.x, -point.y);
};

module.exports = Negative;
