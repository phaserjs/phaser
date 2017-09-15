//  Work out what % value is of the range between min and max.
//  If max isn't given then you get the % of value to min.
//  You can optionally specify an upperMax, which is a mid-way point in the range
//  that represents 100%, after which the % starts to go down to zero again.

var Percent = function (value, min, max, upperMax)
{
    if (max === undefined) { max = min + 1; }

    var percentage = (value - min) / (max - min);

    if (percentage > 1)
    {
        if (upperMax !== undefined)
        {
            percentage = ((upperMax - value)) / (upperMax - max);

            if (percentage < 0)
            {
                percentage = 0;
            }
        }
        else
        {
            percentage = 1;
        }
    }
    else if (percentage < 0)
    {
        percentage = 0;
    }

    return percentage;
};

module.exports = Percent;
