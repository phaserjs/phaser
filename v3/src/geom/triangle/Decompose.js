/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.Decompose
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {array} [out] - [description]
 *
 * @return {array} [description]
 */
var Decompose = function (triangle, out)
{
    if (out === undefined) { out = []; }

    out.push({ x: triangle.x1, y: triangle.y1 });
    out.push({ x: triangle.x2, y: triangle.y2 });
    out.push({ x: triangle.x3, y: triangle.y3 });

    return out;
};

module.exports = Decompose;
