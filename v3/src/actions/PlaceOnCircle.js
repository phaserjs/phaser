var PlaceOnCircle = function (items, circle, startAngle, endAngle)
{
    if (startAngle === undefined) { startAngle = 0; }
    if (endAngle === undefined) { endAngle = 6.28; }

    var angle = startAngle;
    var angleStep = (endAngle - startAngle) / items.length;

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = circle.x + (circle.radius * Math.cos(angle));
        items[i].y = circle.y + (circle.radius * Math.sin(angle));

        angle += angleStep;
    }

    return items;
};

module.exports = PlaceOnCircle;
