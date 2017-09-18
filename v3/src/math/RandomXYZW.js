var RandomXYZW = function (vector, scale)
{
    if (scale === undefined) { scale = 1; }

    // Not spherical; should fix this for more uniform distribution
    vector.x = (Math.random() * 2 - 1) * scale;
    vector.y = (Math.random() * 2 - 1) * scale;
    vector.z = (Math.random() * 2 - 1) * scale;
    vector.w = (Math.random() * 2 - 1) * scale;

    return vector;
};

module.exports = RandomXYZW;
