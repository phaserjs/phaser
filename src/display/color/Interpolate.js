/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Linear = require('../../math/Linear');

/**
 * @namespace Phaser.Display.Color.Interpolate
 * @memberof Phaser.Display.Color
 * @since 3.0.0
 */

/**
 * Interpolates between the two given color ranges over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.RGBWithRGB
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {number} r1 - Red value.
 * @param {number} g1 - Blue value.
 * @param {number} b1 - Green value.
 * @param {number} r2 - Red value.
 * @param {number} g2 - Blue value.
 * @param {number} b2 - Green value.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
var RGBWithRGB = function (r1, g1, b1, r2, g2, b2, length, index)
{
    if (length === undefined) { length = 100; }
    if (index === undefined) { index = 0; }

    var t = index / length;

    return {
        r: Linear(r1, r2, t),
        g: Linear(g1, g2, t),
        b: Linear(b1, b2, t)
    };
};

/**
 * Interpolates between the two given color objects over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.ColorWithColor
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {Phaser.Display.Color} color1 - The first Color object.
 * @param {Phaser.Display.Color} color2 - The second Color object.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
var ColorWithColor = function (color1, color2, length, index)
{
    if (length === undefined) { length = 100; }
    if (index === undefined) { index = 0; }

    return RGBWithRGB(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b, length, index);
};

/**
 * Interpolates between the Color object and color values over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.ColorWithRGB
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {Phaser.Display.Color} color1 - The first Color object.
 * @param {number} r - Red value.
 * @param {number} g - Blue value.
 * @param {number} b - Green value.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
var ColorWithRGB = function (color, r, g, b, length, index)
{
    if (length === undefined) { length = 100; }
    if (index === undefined) { index = 0; }

    return RGBWithRGB(color.r, color.g, color.b, r, g, b, length, index);
};

module.exports = {

    RGBWithRGB: RGBWithRGB,
    ColorWithRGB: ColorWithRGB,
    ColorWithColor: ColorWithColor

};
