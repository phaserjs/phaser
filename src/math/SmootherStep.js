/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.SmootherStep
 * @since 3.0.0
 *
 * @param {number} x - [description]
 * @param {number} min - [description]
 * @param {number} max - [description]
 *
 * @return {number} [description]
 */
var SmootherStep = function (x, min, max)
{
    x = Math.max(0, Math.min(1, (x - min) / (max - min)));

    return x * x * x * (x * (x * 6 - 15) + 10);
};

module.exports = SmootherStep;
