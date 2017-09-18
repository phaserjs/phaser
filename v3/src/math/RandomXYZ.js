//  Position Vector randomly in a spherical area defined by the given radius
var RandomXYZ = function (vector, radius)
{
    if (radius === undefined) { radius = 1; }

    var r = Math.random() * 2 * Math.PI;
    var z = (Math.random() * 2) - 1;
    var zScale = Math.sqrt(1 - z * z) * radius;
    
    vector.x = Math.cos(r) * zScale;
    vector.y = Math.sin(r) * zScale;
    vector.z = z * radius;

    return vector;
};

module.exports = RandomXYZ;
