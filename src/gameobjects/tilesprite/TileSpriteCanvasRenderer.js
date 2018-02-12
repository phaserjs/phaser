/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../GameObject');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.TileSprite#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.TileSprite} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var TileSpriteCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    var ctx = renderer.currentContext;
    var frame = src.frame;

    //  Blend Mode

    if (renderer.currentBlendMode !== src.blendMode)
    {
        renderer.currentBlendMode = src.blendMode;
        ctx.globalCompositeOperation = renderer.blendModes[src.blendMode];
    }

    //  Alpha

    if (renderer.currentAlpha !== src.alpha)
    {
        renderer.currentAlpha = src.alpha;
        ctx.globalAlpha = src.alpha;
    }

    //  Smoothing

    if (renderer.currentScaleMode !== src.scaleMode)
    {
        renderer.currentScaleMode = src.scaleMode;
    }

    var dx = frame.x - (src.originX * src.width);
    var dy = frame.y - (src.originY * src.height);

    ctx.save();
    ctx.translate(dx, dy);
    ctx.translate(src.x - camera.scrollX * src.scrollFactorX, src.y - camera.scrollY * src.scrollFactorY);
    ctx.fillStyle = src.canvasPattern;
    ctx.translate(-this.tilePositionX, -this.tilePositionY);
    ctx.fillRect(this.tilePositionX, this.tilePositionY, src.width, src.height);
    ctx.restore();
};

module.exports = TileSpriteCanvasRenderer;
