/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var CanvasPool: any;
/**
 * Calculates the ascent, descent and fontSize of a given font style.
 *
 * @function Phaser.GameObjects.Text.MeasureText
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text.TextStyle} textStyle - The TextStyle object to measure.
 *
 * @return {object} An object containing the ascent, descent and fontSize of the TextStyle.
 */
declare var MeasureText: (textStyle: any) => {
    ascent: number;
    descent: number;
    fontSize: number;
};
