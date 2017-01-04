var Point = require('../point/Point');

var LineToLine = function (line1, line2, asSegment, out)
{
    if (asSegment === undefined) { asSegment = true; }
    if (out === undefined) { out = new Point(); }

    var a = line1.x1;
    var b = line1.y1;

    var e = line1.x2;
    var f = line1.y2;

    var a1 = b.y - a.y;
    var a2 = f.y - e.y;
    var b1 = a.x - b.x;
    var b2 = e.x - f.x;
    var c1 = (b.x * a.y) - (a.x * b.y);
    var c2 = (f.x * e.y) - (e.x * f.y);
    var denom = (a1 * b2) - (a2 * b1);

    if (denom === 0)
    {
        return null;
    }

    out.x = ((b1 * c2) - (b2 * c1)) / denom;
    out.y = ((a2 * c1) - (a1 * c2)) / denom;

    if (asSegment)
    {
        var uc = ((f.y - e.y) * (b.x - a.x) - (f.x - e.x) * (b.y - a.y));
        var ua = (((f.x - e.x) * (a.y - e.y)) - (f.y - e.y) * (a.x - e.x)) / uc;
        var ub = (((b.x - a.x) * (a.y - e.y)) - ((b.y - a.y) * (a.x - e.x))) / uc;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1)
        {
            return out;
        }
        else
        {
            return null;
        }
    }

    return out;
};

module.exports = LineToLine;
