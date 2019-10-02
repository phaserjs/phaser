/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Given 3 separate color values this will return an integer representation of it.
 *
 * @function Phaser.Display.Color.GetColor
 * @since 3.0.0
 *
 * @param {integer} red - The red color value. A number between 0 and 255.
 * @param {integer} green - The green color value. A number between 0 and 255.
 * @param {integer} blue - The blue color value. A number between 0 and 255.
 *
 * @return {number} The combined color value.
 */
var GetColor = function (red, green, blue)
{
    return red << 16 | green << 8 | blue;
};

module.exports = GetColor;
