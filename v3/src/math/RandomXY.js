var RandomXY = function (vector, scale)
{
    if (scale === undefined) { scale = 1; }

    var r = Math.random() * 2 * Math.PI;

    vector.x = Math.cos(r) * scale;
    vector.y = Math.sin(r) * scale;

    return vector;
};

module.exports = RandomXY;
