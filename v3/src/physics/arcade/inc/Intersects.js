var DistanceBetween = require('../../../math/distance/DistanceBetween');

var Intersects = function (body1, body2)
{
    if (body1 === body2)
    {
        return false;
    }

    if (body1.isCircle)
    {
        if (body2.isCircle)
        {
            //  Circle vs. Circle
            return DistanceBetween(body1.center.x, body1.center.y, body2.center.x, body2.center.y) <= (body1.halfWidth + body2.halfWidth);
        }
        else
        {
            //  Circle vs. Rect
            return this.circleBodyIntersects(body1, body2);
        }
    }
    else if (body2.isCircle)
    {
        //  Rect vs. Circle
        return this.circleBodyIntersects(body2, body1);
    }
    else
    {
        //  Rect vs. Rect
        if (body1.right <= body2.position.x)
        {
            return false;
        }

        if (body1.bottom <= body2.position.y)
        {
            return false;
        }

        if (body1.position.x >= body2.right)
        {
            return false;
        }

        if (body1.position.y >= body2.bottom)
        {
            return false;
        }

        return true;
    }
};

module.exports = Intersects;
