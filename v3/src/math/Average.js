var Average = function ()
{
    var sum = 0;
    var len = arguments.length;

    for (var i = 0; i < len; i++)
    {
        sum += (+arguments[i]);
    }

    return sum / len;
};

module.exports = Average;
