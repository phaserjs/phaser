/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Given an alpha and 3 color values this will return an integer representation of it.
 *
 * @function Phaser.Display.Color.GetColor32
 * @since 3.0.0
 *
 * @param {integer} red - The red color value. A number between 0 and 255.
 * @param {integer} green - The green color value. A number between 0 and 255.
 * @param {integer} blue - The blue color value. A number between 0 and 255.
 * @param {integer} alpha - The alpha color value. A number between 0 and 255.
 *
 * @return {number} The combined color value.
 */
var GetColor32 = function (red, green, blue, alpha)
{
    return alpha << 24 | red << 16 | green << 8 | blue;
};

module.exports = GetColor32;
