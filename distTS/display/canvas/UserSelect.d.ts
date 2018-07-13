/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Sets the user-select property on the canvas style. Can be used to disable default browser selection actions.
 *
 * @function Phaser.Display.Canvas.UserSelect
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to have the style applied to.
 * @param {string} [value='none'] - The touch callout value to set on the canvas. Set to `none` to disable touch callouts.
 *
 * @return {HTMLCanvasElement} The canvas element.
 */
declare var UserSelect: (canvas: any, value: any) => any;
