/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets the strokeStyle and lineWidth on the target context based on the given Shape.
 *
 * @method Phaser.GameObjects.Shape#LineStyleCanvas
 * @since 3.13.0
 * @private
 *
 * @param {CanvasRenderingContext2D} ctx - The context to set the stroke style on.
 * @param {Phaser.GameObjects.Shape} src - The Game Object to set the stroke style from.
 */
var LineStyleCanvas = function (ctx, src)
{
    var strokeColor = src.strokeColor;
    var strokeAlpha = src.strokeAlpha;

    var red = ((strokeColor & 0xFF0000) >>> 16);
    var green = ((strokeColor & 0xFF00) >>> 8);
    var blue = (strokeColor & 0xFF);

    ctx.strokeStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + strokeAlpha + ')';
    ctx.lineWidth = src.lineWidth;
};

module.exports = LineStyleCanvas;
