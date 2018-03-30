/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Position Vector randomly in a spherical area defined by the given radius
/**
 * [description]
 *
 * @function Phaser.Math.RandomXYZ
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector3} vec3 - [description]
 * @param {number} [radius=1] - [description]
 *
 * @return {Phaser.Math.Vector3} [description]
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
