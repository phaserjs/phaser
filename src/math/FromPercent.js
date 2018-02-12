/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('./Clamp');

/**
 * Return a value based on the range between `min` and `max` and the percentage given.
 *
 * @function Phaser.Math.FromPercent
 * @since 3.0.0
 *
 * @param {float} percent - A value between 0 and 1 representing the percentage.
 * @param {number} min - [description]
 * @param {number} [max] - [description]
 *
 * @return {number} [description]
 */
var FromPercent = function (percent, min, max)
{
    percent = Clamp(percent, 0, 1);

    return (max - min) * percent;
};

module.exports = FromPercent;
