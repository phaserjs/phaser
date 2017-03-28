var PositionAroundCircle = function (circle, startAngle, endAngle)
{
    if (startAngle === undefined) { startAngle = 0; }
    if (endAngle === undefined) { endAngle = 6.28; }

    var children = this.children.entries;

    var angle = startAngle;
    var angleStep = (endAngle - startAngle) / children.length;

    for (var i = 0; i < children.length; i++)
    {
        children[i].x = circle.x + (circle.radius * Math.cos(angle));
        children[i].y = circle.y + (circle.radius * Math.sin(angle));

        angle += angleStep;
    }
};

module.exports = PositionAroundCircle;
