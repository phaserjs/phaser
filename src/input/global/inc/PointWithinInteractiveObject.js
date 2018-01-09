//  x/y MUST be translated before being passed to this function, unless the gameObject is guaranteed to
//  be not rotated or scaled in any way

var PointWithinInteractiveObject = function (object, x, y)
{
    if (!object.hitArea)
    {
        return false;
    }

    //  Normalize the origin
    x += object.gameObject.displayOriginX;
    y += object.gameObject.displayOriginY;

    object.localX = x;
    object.localY = y;

    return object.hitAreaCallback(object.hitArea, x, y, object);
};

module.exports = PointWithinInteractiveObject;
