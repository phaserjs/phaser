/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.RandomXYZW
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector4} vec4 - [description]
 * @param {float} [scale=1] - [description]
 *
 * @return {Phaser.Math.Vector4} [description]
 */
var RandomXYZW = function (vec4, scale)
{
    if (scale === undefined) { scale = 1; }

    // Not spherical; should fix this for more uniform distribution
    vec4.x = (Math.random() * 2 - 1) * scale;
    vec4.y = (Math.random() * 2 - 1) * scale;
    vec4.z = (Math.random() * 2 - 1) * scale;
    vec4.w = (Math.random() * 2 - 1) * scale;

    return vec4;
};

module.exports = RandomXYZW;
