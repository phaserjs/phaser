// Get list of cumulative segment lengths

var GetLengths = function (divisions)
{
    if (divisions === undefined) { divisions = this.arcLengthDivisions; }

    if ((this.cacheArcLengths.length === divisions + 1) && !this.needsUpdate)
    {
        return this.cacheArcLengths;
    }

    this.needsUpdate = false;

    var cache = [];
    var current;
    var last = this.getPoint(0, this._tmpVec2A);
    var sum = 0;

    cache.push(0);

    for (var p = 1; p <= divisions; p++)
    {
        current = this.getPoint(p / divisions, this._tmpVec2B);

        sum += current.distance(last);

        cache.push(sum);

        last.copy(current);
    }

    this.cacheArcLengths = cache;

    return cache; // { sums: cache, sum:sum }; Sum is in the last element.
};

module.exports = GetLengths;
