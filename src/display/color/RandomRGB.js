/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Between = require('../../math/Between');
var Color = require('./Color');

/**
 * Creates a new Color object where the r, g, and b values have been set to random values
 * based on the given min max values.
 *
 * @function Phaser.Display.Color.RandomRGB
 * @since 3.0.0
 *
 * @param {integer} [min=0] - The minimum value to set the random range from (between 0 and 255)
 * @param {integer} [max=255] - The maximum value to set the random range from (between 0 and 255)
 *
 * @return {Phaser.Display.Color} A Color object.
 */
var RandomRGB = function (min, max)
{
    if (min === undefined) { min = 0; }
    if (max === undefined) { max = 255; }

    return new Color(Between(min, max), Between(min, max), Between(min, max));
};

module.exports = RandomRGB;
