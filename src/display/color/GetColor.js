/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Packs three separate red, green, and blue color component values into a single 24-bit integer in the format 0xRRGGBB.
 *
 * @function Phaser.Display.Color.GetColor
 * @since 3.0.0
 *
 * @param {number} red - The red color value. A number between 0 and 255.
 * @param {number} green - The green color value. A number between 0 and 255.
 * @param {number} blue - The blue color value. A number between 0 and 255.
 *
 * @return {number} The packed color value as a 24-bit integer in the format 0xRRGGBB.
 */
var GetColor = function (red, green, blue)
{
    return red << 16 | green << 8 | blue;
};

module.exports = GetColor;
