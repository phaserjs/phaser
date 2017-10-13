var GetSpacedPoints = function (divisions)
{
    if (divisions === undefined) { divisions = 40; }

    var points = [];

    for (var i = 0; i <= divisions; i++)
    {
        points.push(this.getPoint(i / divisions));
    }

    if (this.autoClose)
    {
        points.push(points[0]);
    }

    return points;
};

module.exports = GetSpacedPoints;
