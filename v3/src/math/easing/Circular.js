function In (v)
{
    return 1 - Math.sqrt(1 - v * v);
}

function Out (v)
{
    return Math.sqrt(1 - (--v * v));
}

function InOut (v)
{
    if ((v *= 2) < 1)
    {
        return -0.5 * (Math.sqrt(1 - v * v) - 1);
    }
    else
    {
        return 0.5 * (Math.sqrt(1 - (v -= 2) * v) + 1);
    }
}

module.exports = {

    In: In,
    Out: Out,
    InOut: InOut

};
