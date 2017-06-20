//  x/y MUST be translated before being passed to this function, unless the gameObject is guarnateed to
//  be not rotated or scaled in any way

var PointWithinGameObject = function (gameObject, x, y)
{
    var width = gameObject.width;
    var height = gameObject.height;

    var x1 = -width * gameObject.originX;
    var y1 = -height * gameObject.originY;

    return (x >= x1 && x < (x1 + width) && y >= y1 && y < (y1 + height));
};

module.exports = PointWithinGameObject;
