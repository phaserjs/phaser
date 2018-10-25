/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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
    var pipeline = renderer.currentPipeline;

    renderer.clearPipeline();

    var camMatrix = renderer._tempMatrix1;
    var spriteMatrix = renderer._tempMatrix2;
    var calcMatrix = renderer._tempMatrix3;

    spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);

    spriteMatrix.e -= camera.scrollX * src.scrollFactorX;
    spriteMatrix.f -= camera.scrollY * src.scrollFactorY;

    //  Multiply by the Sprite matrix, store result in calcMatrix
    camMatrix.multiply(spriteMatrix, calcMatrix);

    var plugin = src.plugin;
    var mvp = plugin.mvp;

    var shader = plugin.shader;
    var batcher = plugin.batcher;
    var runtime = src.runtime;
    var skeleton = src.skeleton;
    var skeletonRenderer = plugin.skeletonRenderer;

    // skeleton.flipX = src.flipX;
    // skeleton.flipY = src.flipY;

    mvp.ortho(0, renderer.width, 0, renderer.height, 0, 1);

    var data = calcMatrix.decomposeMatrix();

    mvp.translateXYZ(data.translateX, renderer.height - data.translateY, 0);
    mvp.rotateZ(data.rotation * -1);
    mvp.scaleXYZ(data.scaleX, data.scaleY, 1);

    // skeleton.updateWorldTransform();

    shader.bind();
    shader.setUniformi(runtime.webgl.Shader.SAMPLER, 0);
    shader.setUniform4x4f(runtime.webgl.Shader.MVP_MATRIX, mvp.val);

    batcher.begin(shader);

    skeletonRenderer.draw(batcher, skeleton);

    batcher.end();

    shader.unbind();

    if (plugin.drawDebug || src.drawDebug)
    {
        var debugShader = plugin.debugShader;
        var debugRenderer = plugin.debugRenderer;
        var shapes = plugin.shapes;

        debugShader.bind();
        debugShader.setUniform4x4f(runtime.webgl.Shader.MVP_MATRIX, mvp.val);

        shapes.begin(debugShader);

        debugRenderer.draw(shapes, skeleton);

        shapes.end();

        debugShader.unbind();
    }

    renderer.rebindPipeline(pipeline);
};

module.exports = SpineGameObjectWebGLRenderer;
