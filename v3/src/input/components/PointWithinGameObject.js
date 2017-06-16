//  x/y MUST be translated before being passed to this function, unless the gameObject is guarnateed to
//  be not rotated or scaled in any way

var PointWithinGameObject = function (gameObject, x, y)
{
    // var width = gameObject.width;
    // var height = gameObject.height;
    // var x1 = -width * gameObject.originX;

    // if (x >= x1 && x < x1 + width)
    // {
    //     var y1 = -height * gameObject.originY;

    //     if (y >= y1 && y < y1 + height)
    //     {
    //         return true;
    //     }
    // }

    // return false;

    return (x >= gameObject.x && x <= gameObject.x+gameObject.width && y >= gameObject.y && y <= gameObject.y+gameObject.height);

};

module.exports = PointWithinGameObject;
