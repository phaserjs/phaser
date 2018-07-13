/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Color: any;
/**
 * Converts a CSS 'web' string into a Phaser Color object.
 *
 * The web string can be in the format `'rgb(r,g,b)'` or `'rgba(r,g,b,a)'` where r/g/b are in the range [0..255] and a is in the range [0..1].
 *
 * @function Phaser.Display.Color.RGBStringToColor
 * @since 3.0.0
 *
 * @param {string} rgb - The CSS format color string, using the `rgb` or `rgba` format.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
declare var RGBStringToColor: (rgb: any) => any;
