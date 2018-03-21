function In (v)
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
        return 1 - Math.cos(v * Math.PI / 2);
    }
}

function Out (v)
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
        return Math.sin(v * Math.PI / 2);
    }
}

function InOut (v)
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
}

module.exports = {

    In: In,
    Out: Out,
    InOut: InOut

};
