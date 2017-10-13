// Get point at relative position in curve according to arc length

// - u [0 .. 1]

var GetPointAt = function (u, out)
{
    var t = this.getUtoTmapping(u);

    return this.getPoint(t, out);
};

module.exports = GetPointAt;
