/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../GetCalcMatrix');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Mesh#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Mesh} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var NineSliceWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    var verts = src.vertices;
    var totalVerts = verts.length;

    if (totalVerts === 0)
    {
        return;
    }

    camera.addToRenderList(src);

    var pipeline = renderer.pipelines.set(src.pipeline, src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var textureUnit = pipeline.setGameObject(src);

    var F32 = pipeline.vertexViewF32;
    var U32 = pipeline.vertexViewU32;

    var vertexOffset = (pipeline.vertexCount * pipeline.currentShader.vertexComponentCount) - 1;

    var tintEffect = src.tintFill;

    var a = calcMatrix.a;
    var b = calcMatrix.b;
    var c = calcMatrix.c;
    var d = calcMatrix.d;
    var e = calcMatrix.e;
    var f = calcMatrix.f;

    var roundPixels = camera.roundPixels;
    var alpha = camera.alpha * src.alpha;

    renderer.pipelines.preBatch(src);

    for (var i = 0; i < totalVerts; i++)
    {
        var vert = verts[i].update(a, b, c, d, e, f, roundPixels, alpha);

        if (vert.alpha === 0)
        {
            continue;
        }

        if (pipeline.shouldFlush(1))
        {
            pipeline.flush();

            if (!pipeline.currentBatch)
            {
                textureUnit = pipeline.setGameObject(src);
            }

            vertexOffset = 0;
        }

        vertexOffset = vert.load(F32, U32, vertexOffset, textureUnit, tintEffect);

        pipeline.vertexCount++;

        pipeline.currentBatch.count = (pipeline.vertexCount - pipeline.currentBatch.start);
    }

    renderer.pipelines.postBatch(src);
};

module.exports = NineSliceWebGLRenderer;
