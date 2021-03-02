/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CounterClockwise = require('../../../../src/math/angle/CounterClockwise');
var RadToDeg = require('../../../../src/math/RadToDeg');
var Wrap = require('../../../../src/math/Wrap');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method SpineGameObject#renderCanvas
 * @since 3.19.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {SpineGameObject} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpineGameObjectCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    var context = renderer.currentContext;

    var plugin = src.plugin;
    var skeleton = src.skeleton;
    var skeletonRenderer = plugin.skeletonRenderer;

    var camMatrix = renderer._tempMatrix1;
    var spriteMatrix = renderer._tempMatrix2;
    var calcMatrix = renderer._tempMatrix3;

    camera.addToRenderList(src);

    spriteMatrix.applyITRS(src.x, src.y, src.rotation, Math.abs(src.scaleX), Math.abs(src.scaleY));

    camMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        spriteMatrix.e = src.x;
        spriteMatrix.f = src.y;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);
    }
    else
    {
        spriteMatrix.e -= camera.scrollX * src.scrollFactorX;
        spriteMatrix.f -= camera.scrollY * src.scrollFactorY;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);
    }

    skeleton.x = calcMatrix.tx;
    skeleton.y = calcMatrix.ty;

    skeleton.scaleX = calcMatrix.scaleX;

    //  Inverse or we get upside-down skeletons
    skeleton.scaleY = calcMatrix.scaleY * -1;

    if (src.scaleX < 0)
    {
        skeleton.scaleX *= -1;

        src.root.rotation = RadToDeg(calcMatrix.rotationNormalized);
    }
    else
    {
        //  +90 degrees to account for the difference in Spine vs. Phaser rotation
        src.root.rotation = Wrap(RadToDeg(CounterClockwise(calcMatrix.rotationNormalized)) + 90, 0, 360);
    }

    if (src.scaleY < 0)
    {
        skeleton.scaleY *= -1;

        if (src.scaleX < 0)
        {
            src.root.rotation -= (RadToDeg(calcMatrix.rotationNormalized) * 2);
        }
        else
        {
            src.root.rotation += (RadToDeg(calcMatrix.rotationNormalized) * 2);
        }
    }

    if (camera.renderToTexture)
    {
        skeleton.y = calcMatrix.ty;
        skeleton.scaleY *= -1;
    }

    skeleton.updateWorldTransform();

    skeletonRenderer.ctx = context;
    skeletonRenderer.debugRendering = (plugin.drawDebug || src.drawDebug);

    context.save();

    skeletonRenderer.draw(skeleton);

    context.restore();
};

module.exports = SpineGameObjectCanvasRenderer;
