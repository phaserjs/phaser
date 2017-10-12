var InOut = function (v)
{
    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        return 0.5 * (1 - Math.cos(Math.PI * v));
    }
};

module.exports = InOut;
