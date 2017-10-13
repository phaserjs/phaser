var GetPoints = function (divisions)
{
    if (divisions === undefined) { divisions = 12; }

    var points = [];
    var last;

    for (var i = 0; i < this.curves.length; i++)
    {
        var curve = this.curves[i];

        if (!curve.active)
        {
            continue;
        }

        var resolution = curve.getResolution(divisions);

        var pts = curve.getPoints(resolution);

        for (var j = 0; j < pts.length; j++)
        {
            var point = pts[j];

            if (last && last.equals(point))
            {
                // ensures no consecutive points are duplicates
                continue;
            }

            points.push(point);

            last = point;
        }
    }

    if (this.autoClose && points.length > 1 && !points[points.length - 1].equals(points[0]))
    {
        points.push(points[0]);
    }

    return points;
};

module.exports = GetPoints;
