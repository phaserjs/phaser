var Rectangle = require('../../../geom/rectangle/Rectangle');

var GetBounds = function (out, accuracy)
{
    if (out === undefined) { out = new Rectangle(); }
    if (accuracy === undefined) { accuracy = 16; }

    out.x = Number.MAX_SAFE_INTEGER;
    out.y = Number.MAX_SAFE_INTEGER;

    var bounds = new Rectangle();
    var maxRight = Number.MIN_SAFE_INTEGER;
    var maxBottom = Number.MIN_SAFE_INTEGER;

    for (var i = 0; i < this.curves.length; i++)
    {
        var curve = this.curves[i];

        if (!curve.active)
        {
            continue;
        }

        curve.getBounds(bounds, accuracy);

        out.x = Math.min(out.x, bounds.x);
        out.y = Math.min(out.y, bounds.y);

        maxRight = Math.max(maxRight, bounds.right);
        maxBottom = Math.max(maxBottom, bounds.bottom);
    }

    out.right = maxRight;
    out.bottom = maxBottom;

    return out;
};

module.exports = GetBounds;
