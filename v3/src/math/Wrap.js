var Wrap = function (value, min, max)
{
    var range = max - min;

    return (min + ((((value - min) % range) + range) % range));
};

module.exports = Wrap;
