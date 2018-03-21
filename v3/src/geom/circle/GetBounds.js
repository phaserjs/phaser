var Rectangle = require('../rectangle/Rectangle');

var GetBounds = function (circle, out)
{
    if (out === undefined) { out = new Rectangle(); }

    out.x = circle.left;
    out.y = circle.top;
    out.width = circle.diameter;
    out.height = circle.diameter;

    return out;
};

module.exports = GetBounds;
