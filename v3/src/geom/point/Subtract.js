var Subtract = function (point, x, y)
{
    point.x -= x;
    point.y -= y;

    return point;
};

module.exports = Subtract;
