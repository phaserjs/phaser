/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Linear: any;
/**
 * Interpolates color values
 *
 * @namespace Phaser.Display.Color.Interpolate
 * @since 3.0.0
 */
/**
 * Interpolates between the two given color ranges over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.RGBWithRGB
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
 * @return {ColorObject} An object containing the interpolated color values.
 */
declare var RGBWithRGB: (r1: any, g1: any, b1: any, r2: any, g2: any, b2: any, length: any, index: any) => {
    r: any;
    g: any;
    b: any;
};
/**
 * Interpolates between the two given color objects over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.ColorWithColor
 * @since 3.0.0
 *
 * @param {Phaser.Display.Color} color1 - The first Color object.
 * @param {Phaser.Display.Color} color2 - The second Color object.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {ColorObject} An object containing the interpolated color values.
 */
declare var ColorWithColor: (color1: any, color2: any, length: any, index: any) => {
    r: any;
    g: any;
    b: any;
};
/**
 * Interpolates between the Color object and color values over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.ColorWithRGB
 * @since 3.0.0
 *
 * @param {Phaser.Display.Color} color1 - The first Color object.
 * @param {number} r - Red value.
 * @param {number} g - Blue value.
 * @param {number} b - Green value.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {ColorObject} An object containing the interpolated color values.
 */
declare var ColorWithRGB: (color: any, r: any, g: any, b: any, length: any, index: any) => {
    r: any;
    g: any;
    b: any;
};
