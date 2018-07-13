/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var ComponentToHex: (color: any) => any;
/**
 * Converts the color values into an HTML compatible color string, prefixed with either `#` or `0x`.
 *
 * @function Phaser.Display.Color.RGBToString
 * @since 3.0.0
 *
 * @param {integer} r - The red color value. A number between 0 and 255.
 * @param {integer} g - The green color value. A number between 0 and 255.
 * @param {integer} b - The blue color value. A number between 0 and 255.
 * @param {integer} [a=255] - The alpha value. A number between 0 and 255.
 * @param {string} [prefix=#] - The prefix of the string. Either `#` or `0x`.
 *
 * @return {string} A string-based representation of the color values.
 */
declare var RGBToString: (r: any, g: any, b: any, a: any, prefix: any) => string;
