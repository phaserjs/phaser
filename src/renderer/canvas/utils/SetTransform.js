/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../../../gameobjects/GetCalcMatrix');

/**
 * Takes a reference to the Canvas Renderer, a Canvas Rendering Context, a Game Object, a Camera and a parent matrix
 * and then performs the following steps:
 *
 * 1. Checks the alpha of the source combined with the Camera alpha. If 0 or less it aborts.
 * 2. Takes the Camera and Game Object matrix and multiplies them, combined with the parent matrix if given.
 * 3. Sets the blend mode of the context to be that used by the Game Object.
 * 4. Sets the alpha value of the context to be that used by the Game Object combined with the Camera.
 * 5. Saves the context state.
 * 6. Sets the final matrix values into the context via setTransform.
 * 7. If the Game Object has a texture frame, imageSmoothingEnabled is set based on frame.source.scaleMode.
 * 8. If the Game Object does not have a texture frame, imageSmoothingEnabled is set based on Renderer.antialias.
 *
 * This function is only meant to be used internally. Most of the Canvas Renderer classes use it.
 *
 * @function Phaser.Renderer.Canvas.SetTransform
 * @since 3.12.0
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {CanvasRenderingContext2D} ctx - The canvas context to set the transform on.
 * @param {Phaser.GameObjects.GameObject} src - The Game Object being rendered. Can be any type that extends the base class.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - A parent transform matrix to apply to the Game Object before rendering.
 *
 * @return {boolean} `true` if the Game Object context was set, otherwise `false`.
 */
var SetTransform = function (renderer, ctx, src, camera, parentMatrix)
{
    var alpha = camera.alpha * src.alpha;

    if (alpha <= 0)
    {
        //  Nothing to see, so don't waste time calculating stuff
        return false;
    }

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    //  Blend Mode
    ctx.globalCompositeOperation = renderer.blendModes[src.blendMode];

    //  Alpha
    ctx.globalAlpha = alpha;

    ctx.save();

    calcMatrix.setToContext(ctx);

    ctx.imageSmoothingEnabled = src.frame ? !src.frame.source.scaleMode : renderer.antialias;

    return true;
};

module.exports = SetTransform;
