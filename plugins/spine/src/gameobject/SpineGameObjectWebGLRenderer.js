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
    var mvp = plugin.mvp;

    var shader = plugin.shader;
    var batcher = plugin.batcher;
    var runtime = plugin.runtime;
    var skeleton = src.skeleton;
    var skeletonRenderer = plugin.skeletonRenderer;

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

    //  - 90 degrees to account for the difference in Spine vs. Phaser rotation
    spriteMatrix.applyITRS(src.x, src.y, src.rotation - 1.5707963267948966, src.scaleX, src.scaleY);

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

    var width = renderer.width;
    var height = renderer.height;

    skeleton.x = calcMatrix.tx;
    skeleton.scaleX = calcMatrix.scaleX;

    if (camera.renderToTexture)
    {
        skeleton.y = calcMatrix.ty;
        skeleton.scaleY = calcMatrix.scaleY * -1;
    }
    else
    {
        skeleton.y = height - calcMatrix.ty;
        skeleton.scaleY = calcMatrix.scaleY;
    }

    src.root.rotation = RadToDeg(CounterClockwise(calcMatrix.rotation));

    //  Add autoUpdate option
    skeleton.updateWorldTransform();

    if (renderer.newType)
    {
        mvp.ortho(0, width, 0, height, 0, 1);

        shader.bind();
        shader.setUniformi(runtime.Shader.SAMPLER, 0);
        shader.setUniform4x4f(runtime.Shader.MVP_MATRIX, mvp.val);

        skeletonRenderer.premultipliedAlpha = true;

        batcher.begin(shader);
    }

    if (renderer.nextTypeMatch)
    {
        // batcher.isDrawing = false;
    }

    //  Draw the current skeleton
    skeletonRenderer.draw(batcher, skeleton);

    if (!renderer.nextTypeMatch)
    {
        //  The next object in the display list is not a Spine object, so we end the batch
        batcher.isDrawing = true;

        batcher.end();

        shader.unbind();

        renderer.rebindPipeline(renderer.pipelines.TextureTintPipeline);
    }

    /*
    var drawDebug = (plugin.drawDebug || src.drawDebug);

    if (drawDebug)
    {
        var debugShader = plugin.debugShader;
        var debugRenderer = plugin.debugRenderer;
        var shapes = plugin.shapes;

        debugShader.bind();
        debugShader.setUniform4x4f(runtime.Shader.MVP_MATRIX, mvp.val);

        shapes.begin(debugShader);

        debugRenderer.draw(shapes, skeleton);

        shapes.end();

        debugShader.unbind();
    }
    */
};

module.exports = SpineGameObjectWebGLRenderer;
