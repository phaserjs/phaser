
var GetAABB = function (polygon)
{
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -minX;
    var maxY = -minY;
    var p;

    for (var i = 0; i < polygon.points.length; i++)
    {
        p = polygon.points[i];

        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
};

module.exports = GetAABB;
