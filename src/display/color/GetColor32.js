/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Packs four ARGB component values (red, green, blue, and alpha) into a single 32-bit integer in ARGB format.
 *
 * @function Phaser.Display.Color.GetColor32
 * @since 3.0.0
 *
 * @param {number} red - The red color value. A number between 0 and 255.
 * @param {number} green - The green color value. A number between 0 and 255.
 * @param {number} blue - The blue color value. A number between 0 and 255.
 * @param {number} alpha - The alpha color value. A number between 0 and 255.
 *
 * @return {number} The packed 32-bit ARGB color value.
 */
var GetColor32 = function (red, green, blue, alpha)
{
    return alpha << 24 | red << 16 | green << 8 | blue;
};

module.exports = GetColor32;
