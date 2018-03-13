/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Fuzzy.Ceil
 * @since 3.0.0
 *
 * @param {number} value - [description]
 * @param {float} [epsilon=0.0001] - [description]
 *
 * @return {number} [description]
 */
var Ceil = function (value, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.ceil(value - epsilon);
};

module.exports = Ceil;
