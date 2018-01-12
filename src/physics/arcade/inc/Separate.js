var SeparateX = require('./SeparateX');
var SeparateY = require('./SeparateY');

var Separate = function (body1, body2, processCallback, callbackContext, overlapOnly)
{
    if (
        !body1.enable ||
        !body2.enable ||
        body1.checkCollision.none ||
        body2.checkCollision.none ||
        !this.intersects(body1, body2))
    {
        return false;
    }

    //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
    if (processCallback && processCallback.call(callbackContext, body1.gameObject, body2.gameObject) === false)
    {
        return false;
    }

    //  Circle vs. Circle quick bail out
    if (body1.isCircle && body2.isCircle)
    {
        return this.separateCircle(body1, body2, overlapOnly);
    }

    // We define the behavior of bodies in a collision circle and rectangle
    // If a collision occurs in the corner points of the rectangle, the body behave like circles

    //  Either body1 or body2 is a circle
    if (body1.isCircle !== body2.isCircle)
    {
        var bodyRect = (body1.isCircle) ? body2 : body1;
        var bodyCircle = (body1.isCircle) ? body1 : body2;

        var rect = {
            x: bodyRect.x,
            y: bodyRect.y,
            right: bodyRect.right,
            bottom: bodyRect.bottom
        };

        var circle = bodyCircle.center;

        if (circle.y < rect.y || circle.y > rect.bottom)
        {
            if (circle.x < rect.x || circle.x > rect.right)
            {
                return this.separateCircle(body1, body2, overlapOnly);
            }
        }
    }

    var resultX = false;
    var resultY = false;

    //  Do we separate on x or y first?
    if (this.forceX || Math.abs(this.gravity.y + body1.gravity.y) < Math.abs(this.gravity.x + body1.gravity.x))
    {
        resultX = SeparateX(body1, body2, overlapOnly, this.OVERLAP_BIAS);

        //  Are they still intersecting? Let's do the other axis then
        if (this.intersects(body1, body2))
        {
            resultY = SeparateY(body1, body2, overlapOnly, this.OVERLAP_BIAS);
        }
    }
    else
    {
        resultY = SeparateY(body1, body2, overlapOnly, this.OVERLAP_BIAS);

        //  Are they still intersecting? Let's do the other axis then
        if (this.intersects(body1, body2))
        {
            resultX = SeparateX(body1, body2, overlapOnly, this.OVERLAP_BIAS);
        }
    }

    var result = (resultX || resultY);

    if (result)
    {
        if (overlapOnly && (body1.onOverlap || body2.onOverlap))
        {
            this.emit('overlap', body1.gameObject, body2.gameObject, body1, body2);
        }
        else if (body1.onCollide || body2.onCollide)
        {
            this.emit('overlap', body1.gameObject, body2.gameObject, body1, body2);
        }
    }

    return result;
};

module.exports = Separate;
