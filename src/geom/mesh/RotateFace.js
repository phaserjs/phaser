/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates the vertices of a Face to the given angle.
 *
 * The actual vertex positions are adjusted, not their transformed positions.
 *
 * Therefore, this updates the vertex data directly.
 *
 * @function Phaser.Geom.Mesh.RotateFace
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Mesh.Face} face - The Face to rotate.
 * @param {number} angle - The angle to rotate to, in radians.
 * @param {number} [cx] - An optional center of rotation. If not given, the Face in-center is used.
 * @param {number} [cy] - An optional center of rotation. If not given, the Face in-center is used.
 */
var RotateFace = function (face, angle, cx, cy)
{
    var x;
    var y;

    //  No point of rotation? Use the inCenter instead, then.
    if (cx === undefined && cy === undefined)
    {
        var inCenter = face.getInCenter();

        x = inCenter.x;
        y = inCenter.y;
    }

    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var v1 = face.vertex1;
    var v2 = face.vertex2;
    var v3 = face.vertex3;

    var tx = v1.x - x;
    var ty = v1.y - y;

    v1.set(tx * c - ty * s + x, tx * s + ty * c + y);

    tx = v2.x - x;
    ty = v2.y - y;

    v2.set(tx * c - ty * s + x, tx * s + ty * c + y);

    tx = v3.x - x;
    ty = v3.y - y;

    v3.set(tx * c - ty * s + x, tx * s + ty * c + y);
};

module.exports = RotateFace;
