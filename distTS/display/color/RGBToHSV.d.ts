/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * @typedef {object} HSLColorObject
 *
 * @property {number} h - The hue color value. A number between 0 and 1
 * @property {number} s - The saturation color value. A number between 0 and 1
 * @property {number} l - The lightness color value. A number between 0 and 1
 */
/**
 * Converts an RGB color value to HSV (hue, saturation and value).
 * Conversion forumla from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes RGB values are contained in the set [0, 255] and returns h, s and v in the set [0, 1].
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @function Phaser.Display.Color.RGBToHSV
 * @since 3.0.0
 *
 * @param {integer} r - The red color value. A number between 0 and 255.
 * @param {integer} g - The green color value. A number between 0 and 255.
 * @param {integer} b - The blue color value. A number between 0 and 255.
 *
 * @return {HSLColorObject} An object with the properties `h`, `s` and `v`.
 */
declare var RGBToHSV: (r: any, g: any, b: any) => {
    h: number;
    s: number;
    v: number;
};
