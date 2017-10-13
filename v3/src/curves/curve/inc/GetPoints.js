// Get sequence of points using getPoint( t )

var GetPoints = function (divisions)
{
    if (divisions === undefined) { divisions = this.defaultDivisions; }

    var points = [];

    for (var d = 0; d <= divisions; d++)
    {
        points.push(this.getPoint(d / divisions));
    }

    return points;
};

module.exports = GetPoints;
