/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * No scaling, anchor, rotation or effects, literally draws the frame directly to the canvas.
 *
 * @function Phaser.Renderer.Canvas.BlitImage
 * @since 3.0.0
 *
 * @param {number} dx - The x coordinate to render the Frame to.
 * @param {number} dy - The y coordinate to render the Frame to.
 * @param {Phaser.Textures.Frame} frame - The Frame to render.
 */
var BlitImage = function (dx, dy, frame)
{
    var ctx = this.currentContext;
    var cd = frame.canvasData;

    ctx.drawImage(
        frame.source.image,
        cd.sx,
        cd.sy,
        cd.sWidth,
        cd.sHeight,
        dx,
        dy,
        cd.dWidth,
        cd.dHeight
    );
};

module.exports = BlitImage;
