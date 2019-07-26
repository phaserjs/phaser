/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CounterClockwise = require('../../../../src/math/angle/CounterClockwise');
var RadToDeg = require('../../../../src/math/RadToDeg');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.SpineGameObject#renderCanvas
 * @since 3.16.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.SpineGameObject} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpineGameObjectWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var plugin = src.plugin;
    var skeleton = src.skeleton;
    var sceneRenderer = plugin.sceneRenderer;

    if (!skeleton)
    {
        return;
    }

    if (renderer.newType)
    {
        renderer.clearPipeline();
    }

    var camMatrix = renderer._tempMatrix1;
    var spriteMatrix = renderer._tempMatrix2;
    var calcMatrix = renderer._tempMatrix3;

    spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

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

    var viewportWidth = renderer.width;
    var viewportHeight = renderer.height;

    skeleton.x = calcMatrix.tx;
    skeleton.scaleX = calcMatrix.scaleX;

    if (camera.renderToTexture)
    {
        skeleton.y = calcMatrix.ty;
        skeleton.scaleY = calcMatrix.scaleY * -1;
    }
    else
    {
        skeleton.y = viewportHeight - calcMatrix.ty;
        skeleton.scaleY = calcMatrix.scaleY;
    }

    //  +90 degrees to account for the difference in Spine vs. Phaser rotation
    src.root.rotation = RadToDeg(CounterClockwise(calcMatrix.rotation)) + 90;

    sceneRenderer.camera.position.x = viewportWidth / 2;
    sceneRenderer.camera.position.y = viewportHeight / 2;

    sceneRenderer.camera.viewportWidth = viewportWidth;
    sceneRenderer.camera.viewportHeight = viewportHeight;

    //  Add autoUpdate option
    skeleton.updateWorldTransform();

    if (renderer.newType)
    {
        sceneRenderer.begin();
    }

    //  Draw the current skeleton
    sceneRenderer.drawSkeleton(skeleton, src.preMultipliedAlpha);

    if (plugin.drawDebug || src.drawDebug)
    {
        //  Because if we don't, the bones render positions are completely wrong (*sigh*)
        var oldX = skeleton.x;
        var oldY = skeleton.y;

        skeleton.x = 0;
        skeleton.y = 0;

        sceneRenderer.drawSkeletonDebug(skeleton, src.preMultipliedAlpha);

        skeleton.x = oldX;
        skeleton.y = oldY;
    }

    if (!renderer.nextTypeMatch)
    {
        //  The next object in the display list is not a Spine object, so we end the batch
        sceneRenderer.end();

        renderer.rebindPipeline(renderer.pipelines.TextureTintPipeline);
    }
};

module.exports = SpineGameObjectWebGLRenderer;
