// Get sequence of points using getPointAt( u )

var GetSpacedPoints = function (divisions)
{
    if (divisions === undefined) { divisions = this.defaultDivisions; }

    var points = [];

    for (var d = 0; d <= divisions; d++)
    {
        var t = this.getUtoTmapping(d / divisions, null, divisions);

        points.push(this.getPoint(t));
    }

    return points;
};

module.exports = GetSpacedPoints;
