var CircleTo = function (radius, clockwise, rotation)
{
    if (clockwise === undefined) { clockwise = false; }

    return this.ellipseTo(radius, radius, 0, 360, clockwise, rotation);
};

module.exports = CircleTo;
