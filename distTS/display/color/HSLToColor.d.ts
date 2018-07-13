/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Color: any;
declare var HueToComponent: any;
/**
 * Converts HSL (hue, saturation and lightness) values to a Phaser Color object.
 *
 * @function Phaser.Display.Color.HSLToColor
 * @since 3.0.0
 *
 * @param {number} h - The hue value in the range 0 to 1.
 * @param {number} s - The saturation value in the range 0 to 1.
 * @param {number} l - The lightness value in the range 0 to 1.
 *
 * @return {Phaser.Display.Color} A Color object created from the results of the h, s and l values.
 */
declare var HSLToColor: (h: any, s: any, l: any) => any;
