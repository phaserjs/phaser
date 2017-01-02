var Rectangle = require('../rectangle/Rectangle');

var GetBounds = function (ellipse, out)
{
    if (out === undefined) { out = new Rectangle(); }

    out.x = ellipse.x - ellipse.width;
    out.y = ellipse.y - ellipse.height;
    out.width = ellipse.width;
    out.height = ellipse.height;

    return out;
};

module.exports = GetBounds;
