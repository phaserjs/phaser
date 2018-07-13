/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Returns an object containing dimensions of the Text object.
 *
 * @function Phaser.GameObjects.Text.GetTextSize
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text} text - The Text object to calculate the size from.
 * @param {TextMetrics} size - The Text metrics to use when calculating the size.
 * @param {array} lines - The lines of text to calculate the size from.
 *
 * @return {object} An object containing dimensions of the Text object.
 */
declare var GetTextSize: (text: any, size: any, lines: any) => {
    width: number;
    height: number;
    lines: any;
    lineWidths: any[];
    lineSpacing: any;
    lineHeight: any;
};
