/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var HSVToRGB: any;
/**
 * Get HSV color wheel values in an array which will be 360 elements in size.
 *
 * @function Phaser.Display.Color.HSVColorWheel
 * @since 3.0.0
 *
 * @param {number} [s=1] - The saturation, in the range 0 - 1.
 * @param {number} [v=1] - The value, in the range 0 - 1.
 *
 * @return {ColorObject[]} An array containing 360 elements, where each contains a single numeric value corresponding to the color at that point in the HSV color wheel.
 */
declare var HSVColorWheel: (s: any, v: any) => any[];
