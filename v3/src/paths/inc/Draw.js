var Draw = function (graphics, pointsTotal)
{
    for (var i = 0; i < this.curves.length; i++)
    {
        var curve = this.curves[i];

        if (!curve.active)
        {
            continue;
        }

        curve.draw(graphics, pointsTotal);
    }

    return graphics;
};

module.exports = Draw;
