var Draw = function (graphics, pointsTotal)
{
    if (pointsTotal === undefined) { pointsTotal = 32; }

    var start = this.getStartPoint();
    var points = this.getPoints(pointsTotal);

    graphics.beginPath();

    graphics.moveTo(start.x, start.y);

    for (var i = 1; i < points.length; i++)
    {
        graphics.lineTo(points[i].x, points[i].y);
    }

    graphics.strokePath();
    graphics.closePath();

    //  So you can chain graphics calls
    return graphics;
};

module.exports = Draw;
