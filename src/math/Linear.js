/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Linear
 * @since 3.0.0
 *
 * @param {number} p0 - [description]
 * @param {number} p1 - [description]
 * @param {float} t - [description]
 *
 * @return {number} [description]
 */
var Linear = function (p0, p1, t)
{
    return (p1 - p0) * t + p0;
};

module.exports = Linear;
