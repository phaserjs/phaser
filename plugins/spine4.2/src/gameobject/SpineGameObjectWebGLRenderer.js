/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../../../../src/math/Clamp');
var CounterClockwise = require('../../../../src/math/angle/CounterClockwise');
var GetCalcMatrix = require('../../../../src/gameobjects/GetCalcMatrix');
var RadToDeg = require('../../../../src/math/RadToDeg');
var Wrap = require('../../../../src/math/Wrap');

var computeRootRotationDeg = function (scaleX, scaleY, rotationRad, useWebGLPath)
{
    var rotationDeg = RadToDeg(rotationRad);
    var ccwDeg = RadToDeg(CounterClockwise(rotationRad));
    var result;

    if (scaleX < 0)
    {
        result = useWebGLPath ? Wrap(rotationDeg - 180, 0, 360) : Wrap(rotationDeg, 0, 360);
    }
    else
    {
        result = Wrap(ccwDeg + 90, 0, 360);
    }

    if (scaleY < 0)
    {
        var adjustment = rotationDeg * 2;

        result += (scaleX < 0) ? -adjustment : adjustment;
    }

    return Wrap(result, 0, 360);
};

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method SpineGameObject#renderWebGL
 * @since 3.19.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {SpineGameObject} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 * @param {SpineContainer} [container] - If this Spine object is in a Spine Container, this is a reference to it.
 */
var SpineGameObjectWebGLRenderer = function (renderer, src, camera, parentMatrix, container)
{
    var plugin = src.plugin;
    var skeleton = src.skeleton;
    var sceneRenderer = plugin.sceneRenderer;

    if (renderer.newType)
    {
        //  flush + clear previous pipeline if this is a new type
        renderer.pipelines.clear();

        sceneRenderer.begin();
    }

    var scrollFactorX = src.scrollFactorX;
    var scrollFactorY = src.scrollFactorY;
    var alpha = skeleton.color.a;

    if (container)
    {
        src.scrollFactorX = container.scrollFactorX;
        src.scrollFactorY = container.scrollFactorY;

        skeleton.color.a = Clamp(alpha * container.alpha, 0, 1);
    }

    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var viewportHeight = renderer.height;

    skeleton.x = calcMatrix.tx;
    skeleton.y = viewportHeight - calcMatrix.ty;

    skeleton.scaleX = calcMatrix.scaleX;
    skeleton.scaleY = calcMatrix.scaleY;

    var computedRotation = computeRootRotationDeg(src.scaleX, src.scaleY, calcMatrix.rotationNormalized, true);
    var defaultRotation = computeRootRotationDeg(src.scaleX, src.scaleY, 0, true);

    if (src.scaleX < 0)
    {
        skeleton.scaleX *= -1;
    }

    if (src.scaleY < 0)
    {
        skeleton.scaleY *= -1;
    }

    var setupRotation = (typeof src._rootSetupRotation === 'number') ? src._rootSetupRotation : 0;
    var finalRotation = computedRotation + (setupRotation - defaultRotation);

    src.root.rotation = Wrap(finalRotation, 0, 360);

    /*
    if (renderer.currentFramebuffer !== null)
    {
        skeleton.y = calcMatrix.ty;
        skeleton.scaleY *= -1;
    }
    */

    var physics = 2; // 目前未知這個應該抓哪個設置檔，暫時先固定 0. 0-none;1-reset;2-update;3-pose

    skeleton.updateWorldTransform(physics);

    //  Draw the current skeleton

    sceneRenderer.drawSkeleton(skeleton, src.preMultipliedAlpha);

    if (container)
    {
        src.scrollFactorX = scrollFactorX;
        src.scrollFactorY = scrollFactorY;
        skeleton.color.a = alpha;
    }

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
        //  The next object in the display list is not a Spine Game Object or Spine Container, so we end the batch
        sceneRenderer.end();

        //  And rebind the previous pipeline
        renderer.pipelines.rebind();
    }
};

module.exports = SpineGameObjectWebGLRenderer;
