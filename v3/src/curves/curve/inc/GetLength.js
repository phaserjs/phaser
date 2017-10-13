// Get total curve arc length

var GetLength = function ()
{
    var lengths = this.getLengths();

    return lengths[lengths.length - 1];
};

module.exports = GetLength;
