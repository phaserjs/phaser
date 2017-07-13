//  x/y MUST be translated before being passed to this function, unless the gameObject is guarnateed to
//  be not rotated or scaled in any way

var PointWithinGameObject = function (gameObject, x, y)
{
    if (!gameObject.hitArea)
    {
        return false;
    }

    return gameObject.hitAreaCallback(gameObject.hitArea, x, y);
};

module.exports = PointWithinGameObject;
