//  Checks if rectB is fully contained within rectA

var ContainsRect = function (rectA, rectB)
{
    //  Volume check (if rectB volume > rectA then rectA cannot contain it)
    if ((rectB.width * rectB.height) > (rectA.width * rectA.height))
    {
        return false;
    }

    return (
        (rectB.x > rectA.x && rectB.x < rectA.right) &&
        (rectB.right > rectA.x && rectB.right < rectA.right) &&
        (rectB.y > rectA.y && rectB.y < rectA.bottom) && 
        (rectB.bottom > rectA.y && rectB.bottom < rectA.bottom)
    );
};

module.exports = ContainsRect;
