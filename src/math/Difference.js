/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Difference
 * @since 3.0.0
 *
 * @param {number} a - [description]
 * @param {number} b - [description]
 *
 * @return {number} [description]
 */
var Difference = function (a, b)
{
    return Math.abs(a - b);
};

module.exports = Difference;
