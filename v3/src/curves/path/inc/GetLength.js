var GetLength = function ()
{
    var lens = this.getCurveLengths();

    return lens[lens.length - 1];
};

module.exports = GetLength;
