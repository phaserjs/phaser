//  x/y MUST be translated before being passed to this function,
//  unless the gameObject is guaranteed to not be rotated or scaled in any way

var PointWithinHitArea = function (gameObject, x, y)
{
    var input = gameObject.input;

    if (!input)
    {
        return false;
    }

    //  Normalize the origin
    x += gameObject.displayOriginX;
    y += gameObject.displayOriginY;

    if (input.hitAreaCallback(input.hitArea, x, y, gameObject))
    {
        input.localX = x;
        input.localY = y;

        return true;
    }
    else
    {
        return false;
    }
};

module.exports = PointWithinHitArea;
