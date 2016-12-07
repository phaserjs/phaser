function In (v)
{
    return v * v;
}

function Out (v)
{
    return v * (2 - v);
}

function InOut (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v;
    }
    else
    {
        return -0.5 * (--v * (v - 2) - 1);
    }
}

module.exports = {

    In: In,
    Out: Out,
    InOut: InOut

};
