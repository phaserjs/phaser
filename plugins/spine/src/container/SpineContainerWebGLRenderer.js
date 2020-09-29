/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CounterClockwise = require('../../../../src/math/angle/CounterClockwise');
var Clamp = require('../../../../src/math/Clamp');
var RadToDeg = require('../../../../src/math/RadToDeg');
var Wrap = require('../../../../src/math/Wrap');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method SpineContainerWebGLRenderer#renderWebGL
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Container} container - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpineContainerWebGLRenderer = function (renderer, container, camera, parentMatrix)
{
    var plugin = container.plugin;
    var sceneRenderer = plugin.sceneRenderer;
    var children = container.list;

    if (children.length === 0)
    {
        if (sceneRenderer.batcher.isDrawing && renderer.finalType)
        {
            sceneRenderer.end();

            renderer.pipelines.rebind();
        }

        return;
    }

    var transformMatrix = container.localTransform;

    if (parentMatrix)
    {
        transformMatrix.loadIdentity();
        transformMatrix.multiply(parentMatrix);
        transformMatrix.translate(container.x, container.y);
        transformMatrix.rotate(container.rotation);
        transformMatrix.scale(container.scaleX, container.scaleY);
    }
    else
    {
        transformMatrix.applyITRS(container.x, container.y, container.rotation, container.scaleX, container.scaleY);
    }

    var alpha = container.alpha;
    var scrollFactorX = container.scrollFactorX;
    var scrollFactorY = container.scrollFactorY;

    var GameObjectRenderMask = 15;

    if (renderer.newType)
    {
        //  flush + clear if this is a new type
        renderer.pipelines.clear();

        sceneRenderer.begin();
    }

    for (var i = 0; i < children.length; i++)
    {
        var src = children[i];

        var skeleton = src.skeleton;
        var childAlpha = skeleton.color.a;

        var willRender = !(GameObjectRenderMask !== src.renderFlags || (src.cameraFilter !== 0 && (src.cameraFilter & camera.id)) || childAlpha === 0);

        if (!skeleton || !willRender)
        {
            continue;
        }

        var camMatrix = renderer._tempMatrix1;
        var spriteMatrix = renderer._tempMatrix2;
        var calcMatrix = renderer._tempMatrix3;

        spriteMatrix.applyITRS(src.x, src.y, src.rotation, Math.abs(src.scaleX), Math.abs(src.scaleY));

        camMatrix.copyFrom(camera.matrix);

        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(transformMatrix, -camera.scrollX * scrollFactorX, -camera.scrollY * scrollFactorY);

        //  Undo the camera scroll
        spriteMatrix.e = src.x;
        spriteMatrix.f = src.y;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        var viewportHeight = renderer.height;

        skeleton.x = calcMatrix.tx;
        skeleton.y = viewportHeight - calcMatrix.ty;

        skeleton.scaleX = calcMatrix.scaleX;
        skeleton.scaleY = calcMatrix.scaleY;

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

        if (camera.renderToTexture || renderer.currentFramebuffer !== null)
        {
            skeleton.y = calcMatrix.ty;
            skeleton.scaleY *= -1;
        }

        //  Add autoUpdate option
        skeleton.updateWorldTransform();

        skeleton.color.a = Clamp(childAlpha * alpha, 0, 1);

        //  Draw the current skeleton
        sceneRenderer.drawSkeleton(skeleton, src.preMultipliedAlpha);

        //  Restore alpha
        skeleton.color.a = childAlpha;
    }

    if (!renderer.nextTypeMatch)
    {
        //  The next object in the display list is not a Spine Game Object or Spine Container, so we end the batch
        sceneRenderer.end();

        //  And rebind the previous pipeline
        renderer.pipelines.rebind();
    }
};

module.exports = SpineContainerWebGLRenderer;
