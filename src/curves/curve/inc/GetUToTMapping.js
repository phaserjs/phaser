// Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getUtoTmapping
 * @since 3.0.0
 *
 * @param {float} u - [description]
 * @param {integer} distance - [description]
 * @param {integer} [divisions] - [description]
 *
 * @return {number} [description]
 */
var GetUtoTmapping = function (u, distance, divisions)
{
    var arcLengths = this.getLengths(divisions);

    var i = 0;
    var il = arcLengths.length;

    var targetArcLength; // The targeted u distance value to get

    if (distance)
    {
        //  Cannot overshoot the curve
        targetArcLength = Math.min(distance, arcLengths[il - 1]);
    }
    else
    {
        targetArcLength = u * arcLengths[il - 1];
    }

    // binary search for the index with largest value smaller than target u distance

    var low = 0;
    var high = il - 1;
    var comparison;

    while (low <= high)
    {
        i = Math.floor(low + (high - low) / 2); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

        comparison = arcLengths[i] - targetArcLength;

        if (comparison < 0)
        {
            low = i + 1;
        }
        else if (comparison > 0)
        {
            high = i - 1;
        }
        else
        {
            high = i;
            break;
        }
    }

    i = high;

    if (arcLengths[i] === targetArcLength)
    {
        return i / (il - 1);
    }

    // we could get finer grain at lengths, or use simple interpolation between two points

    var lengthBefore = arcLengths[i];
    var lengthAfter = arcLengths[i + 1];

    var segmentLength = lengthAfter - lengthBefore;

    // determine where we are between the 'before' and 'after' points

    var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;

    // add that fractional amount to t

    return (i + segmentFraction) / (il - 1);
};

module.exports = GetUtoTmapping;
