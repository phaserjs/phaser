/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compute a random position vector in a spherical area, optionally defined by the given radius.
 *
 * @function Phaser.Math.RandomXYZ
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector3} vec3 - The Vector to compute random values for.
 * @param {number} [radius=1] - The radius.
 *
 * @return {Phaser.Math.Vector3} The given Vector.
 */
var RandomXYZ = function (vec3, radius)
{
    if (radius === undefined) { radius = 1; }

    var r = Math.random() * 2 * Math.PI;
    var z = (Math.random() * 2) - 1;
    var zScale = Math.sqrt(1 - z * z) * radius;

    vec3.x = Math.cos(r) * zScale;
    vec3.y = Math.sin(r) * zScale;
    vec3.z = z * radius;

    return vec3;
};

module.exports = RandomXYZ;
