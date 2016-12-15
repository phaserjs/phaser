function In (v)
{
    return v * v * v * v;
}

function Out (v)
{
    return 1 - (--v * v * v * v);
}

function InOut (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v * v * v;
    }
    else
    {
        return -0.5 * ((v -= 2) * v * v * v - 2);
    }
}

module.exports = {

    In: In,
    Out: Out,
    InOut: InOut

};
