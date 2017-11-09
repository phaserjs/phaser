var GetOverlapX = function (body1, body2, overlapOnly, bias)
{
    var overlap = 0;
    var maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + bias;

    if (body1.deltaX() === 0 && body2.deltaX() === 0)
    {
        //  They overlap but neither of them are moving
        body1.embedded = true;
        body2.embedded = true;
    }
    else if (body1.deltaX() > body2.deltaX())
    {
        //  Body1 is moving right and / or Body2 is moving left
        overlap = body1.right - body2.x;

        if ((overlap > maxOverlap && !overlapOnly) || body1.checkCollision.right === false || body2.checkCollision.left === false)
        {
            overlap = 0;
        }
        else
        {
            body1.touching.none = false;
            body1.touching.right = true;
            body2.touching.none = false;
            body2.touching.left = true;
        }
    }
    else if (body1.deltaX() < body2.deltaX())
    {
        //  Body1 is moving left and/or Body2 is moving right
        overlap = body1.x - body2.width - body2.x;

        if ((-overlap > maxOverlap && !overlapOnly) || body1.checkCollision.left === false || body2.checkCollision.right === false)
        {
            overlap = 0;
        }
        else
        {
            body1.touching.none = false;
            body1.touching.left = true;
            body2.touching.none = false;
            body2.touching.right = true;
        }
    }

    //  Resets the overlapX to zero if there is no overlap, or to the actual pixel value if there is
    body1.overlapX = overlap;
    body2.overlapX = overlap;

    return overlap;
};

module.exports = GetOverlapX;
