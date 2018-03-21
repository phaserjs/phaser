var GreaterThan = function (a, b, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return a > b - epsilon;
};

module.exports = GreaterThan;
