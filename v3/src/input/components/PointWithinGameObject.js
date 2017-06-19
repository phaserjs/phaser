//  x/y MUST be translated before being passed to this function, unless the gameObject is guarnateed to
//  be not rotated or scaled in any way

var PointWithinGameObject = function (gameObject, x, y)
{
    var width = gameObject.displayWidth;
    var height = gameObject.displayHeight;

    var x1 = -width * gameObject.originX;

    if (x >= x1 && x < x1 + width)
    {
        var y1 = -height * gameObject.originY;

        if (y >= y1 && y < y1 + height)
        {
            return true;
        }
    }

    return false;
};

module.exports = PointWithinGameObject;
