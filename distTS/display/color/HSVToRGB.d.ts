/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetColor: any;
/**
 * Converts an HSV (hue, saturation and value) color value to RGB.
 * Conversion formula from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes HSV values are contained in the set [0, 1].
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @function Phaser.Display.Color.HSVToRGB
 * @since 3.0.0
 *
 * @param {number} h - The hue, in the range 0 - 1.
 * @param {number} s - The saturation, in the range 0 - 1.
 * @param {number} v - The value, in the range 0 - 1.
 *
 * @return {ColorObject} An object with the red, green and blue values set in the r, g and b properties.
 */
declare var HSVToRGB: any;
