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

    renderer.flush();

    renderer.currentProgram = null;
    renderer.currentVertexBuffer = null;

    var mvp = src.mvp;
    var plugin = src.plugin;
    var shader = plugin.shader;
    var batcher = plugin.batcher;
    var runtime = src.runtime;
    var skeletonRenderer = plugin.skeletonRenderer;

    mvp.ortho(0, renderer.width, 0, renderer.height, 0, 1);

    // var originX = camera.width * camera.originX;
    // var originY = camera.height * camera.originY;
    // mvp.translateXYZ(((camera.x - originX) - camera.scrollX) + src.x, renderer.height - (((camera.y + originY) - camera.scrollY) + src.y), 0);
    // mvp.rotateZ(-(camera.rotation + src.rotation));
    // mvp.scaleXYZ(camera.zoom * src.scaleX, camera.zoom * src.scaleY, 1);

    mvp.translateXYZ(src.x, renderer.height - src.y, 0);
    mvp.rotateZ(-src.rotation);
    mvp.scaleXYZ(src.scaleX, src.scaleY, 1);

    // spriteMatrix.e -= camera.scrollX * sprite.scrollFactorX;
    // spriteMatrix.f -= camera.scrollY * sprite.scrollFactorY;

    // 12,13 = tx/ty
    // 0,5 = scale x/y

    // var localA = mvp.val[0];
    // var localB = mvp.val[1];
    // var localC = mvp.val[2];
    // var localD = mvp.val[3];
    // var localE = mvp.val[4];
    // var localF = mvp.val[5];

    // var sourceA = camMatrix.matrix[0];
    // var sourceB = camMatrix.matrix[1];
    // var sourceC = camMatrix.matrix[2];
    // var sourceD = camMatrix.matrix[3];
    // var sourceE = camMatrix.matrix[4];
    // var sourceF = camMatrix.matrix[5];

    // mvp.val[0] = (sourceA * localA) + (sourceB * localC);
    // mvp.val[1] = (sourceA * localB) + (sourceB * localD);
    // mvp.val[2] = (sourceC * localA) + (sourceD * localC);
    // mvp.val[3] = (sourceC * localB) + (sourceD * localD);
    // mvp.val[4] = (sourceE * localA) + (sourceF * localC) + localE;
    // mvp.val[5] = (sourceE * localB) + (sourceF * localD) + localF;

    src.skeleton.updateWorldTransform();

    //  Bind the shader and set the texture and model-view-projection matrix.

    shader.bind();
    shader.setUniformi(runtime.webgl.Shader.SAMPLER, 0);
    shader.setUniform4x4f(runtime.webgl.Shader.MVP_MATRIX, mvp.val);

    //  Start the batch and tell the SkeletonRenderer to render the active skeleton.
    batcher.begin(shader);

    plugin.skeletonRenderer.vertexEffect = null;

    skeletonRenderer.premultipliedAlpha = false;

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

    renderer.currentPipeline = pipeline;
    renderer.currentPipeline.bind();
    renderer.currentPipeline.onBind();
    renderer.setBlankTexture(true);
};

module.exports = SpineGameObjectWebGLRenderer;
