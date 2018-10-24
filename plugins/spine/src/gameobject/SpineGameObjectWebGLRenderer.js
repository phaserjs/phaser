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
    var plugin = src.plugin;
    var mvp = plugin.mvp;
    var shader = plugin.shader;
    var batcher = plugin.batcher;
    var runtime = src.runtime;
    var skeletonRenderer = plugin.skeletonRenderer;

    // spriteMatrix.applyITRS(sprite.x, sprite.y, sprite.rotation, sprite.scaleX, sprite.scaleY);

    src.mvp.identity();

    src.mvp.ortho(0, 0 + 800, 0, 0 + 600, 0, 1);

    src.mvp.translate({ x: src.x, y: 600 - src.y, z: 0 });

    src.mvp.rotateX(src.rotation);

    src.mvp.scale({ x: src.scaleX, y: src.scaleY, z: 1 });

    // mvp.translate(-src.x, src.y, 0);
    // mvp.ortho2d(-250, 0, 800, 600);

    // var camMatrix = renderer._tempMatrix1;
    // var spriteMatrix = renderer._tempMatrix2;
    // var calcMatrix = renderer._tempMatrix3;

    // spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    // mvp.values[0] = spriteMatrix[0];
    // mvp.values[1] = spriteMatrix[1];
    // mvp.values[2] = spriteMatrix[2];
    // mvp.values[4] = spriteMatrix[3];
    // mvp.values[5] = spriteMatrix[4];
    // mvp.values[6] = spriteMatrix[5];
    // mvp.values[8] = spriteMatrix[6];
    // mvp.values[9] = spriteMatrix[7];
    // mvp.values[10] = spriteMatrix[8];

    //  Const = Array Index = Identity
    // M00 = 0 = 1
    // M01 = 4 = 0
    // M02 = 8 = 0
    // M03 = 12 = 0
    // M10 = 1 = 0
    // M11 = 5 = 1
    // M12 = 9 = 0
    // M13 = 13 = 0
    // M20 = 2 = 0
    // M21 = 6 = 0
    // M22 = 10 = 1
    // M23 = 14 = 0
    // M30 = 3 = 0
    // M31 = 7 = 0
    // M32 = 11 = 0
    // M33 = 15 = 1

    mvp.values[0] = src.mvp.val[0];
    mvp.values[1] = src.mvp.val[1];
    mvp.values[2] = src.mvp.val[2];
    mvp.values[3] = src.mvp.val[3];
    mvp.values[4] = src.mvp.val[4];
    mvp.values[5] = src.mvp.val[5];
    mvp.values[6] = src.mvp.val[6];
    mvp.values[7] = src.mvp.val[7];
    mvp.values[8] = src.mvp.val[8];
    mvp.values[9] = src.mvp.val[9];
    mvp.values[10] = src.mvp.val[10];
    mvp.values[11] = src.mvp.val[11];
    mvp.values[12] = src.mvp.val[12];
    mvp.values[13] = src.mvp.val[13];
    mvp.values[14] = src.mvp.val[14];
    mvp.values[15] = src.mvp.val[15];

    //  Array Order - Index
    // M00 = 0
    // M10 = 1
    // M20 = 2
    // M30 = 3
    // M01 = 4
    // M11 = 5
    // M21 = 6
    // M31 = 7
    // M02 = 8
    // M12 = 9
    // M22 = 10
    // M32 = 11
    // M03 = 12
    // M13 = 13
    // M23 = 14
    // M33 = 15


    // mvp.ortho(-250, -250 + 1600, 0, 0 + 1200, 0, 1);

    src.skeleton.updateWorldTransform();

    //  Bind the shader and set the texture and model-view-projection matrix.

    shader.bind();
    shader.setUniformi(runtime.webgl.Shader.SAMPLER, 0);
    shader.setUniform4x4f(runtime.webgl.Shader.MVP_MATRIX, mvp.values);

    //  Start the batch and tell the SkeletonRenderer to render the active skeleton.
    batcher.begin(shader);

    plugin.skeletonRenderer.vertexEffect = null;

    skeletonRenderer.premultipliedAlpha = true;

    skeletonRenderer.draw(batcher, src.skeleton);

    batcher.end();

    shader.unbind();

    /*
    if (debug) {
        debugShader.bind();
        debugShader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);
        debugRenderer.premultipliedAlpha = premultipliedAlpha;
        shapes.begin(debugShader);
        debugRenderer.draw(shapes, skeleton);
        shapes.end();
        debugShader.unbind();
    }
    */
};

module.exports = SpineGameObjectWebGLRenderer;
