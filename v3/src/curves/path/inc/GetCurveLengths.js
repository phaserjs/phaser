var GetCurveLengths = function ()
{
    // We use cache values if curves and cache array are same length

    if (this.cacheLengths.length === this.curves.length)
    {
        return this.cacheLengths;
    }

    // Get length of sub-curve
    // Push sums into cached array

    var lengths = [];
    var sums = 0;

    for (var i = 0; i < this.curves.length; i++)
    {
        sums += this.curves[i].getLength();

        lengths.push(sums);
    }

    this.cacheLengths = lengths;

    return lengths;
};

module.exports = GetCurveLengths;
