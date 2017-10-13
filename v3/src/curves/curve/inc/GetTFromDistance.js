//  Given a distance in pixels, get a t to find p.
var GetTFromDistance = function (distance, divisions)
{
    if (distance <= 0)
    {
        return 0;
    }

    return this.getUtoTmapping(0, distance, divisions);
};

module.exports = GetTFromDistance;
