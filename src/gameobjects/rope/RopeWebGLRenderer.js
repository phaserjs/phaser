/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../GetCalcMatrix');
var Utils = require('../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Rope#renderWebGL
 * @since 3.23.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Rope} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RopeWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var pipeline = renderer.pipelines.set(src.pipeline, src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var vertices = src.vertices;
    var uvs = src.uv;
    var colors = src.colors;
    var alphas = src.alphas;
    var alpha = src.alpha;
    var getTint = Utils.getTintAppendFloatAlpha;
    var roundPixels = camera.roundPixels;

    var meshVerticesLength = vertices.length;
    var vertexCount = Math.floor(meshVerticesLength * 0.5);

    //  Because it's a triangle strip and we don't want lots of degenerate triangles joining things up
    pipeline.flush();

    renderer.pipelines.preBatch(src);

    var textureUnit = pipeline.setGameObject(src);

    var vertexViewF32 = pipeline.vertexViewF32;
    var vertexViewU32 = pipeline.vertexViewU32;

    var vertexOffset = (pipeline.vertexCount * pipeline.currentShader.vertexComponentCount) - 1;

    var colorIndex = 0;

    var tintEffect = src.tintFill;

    if (src.dirty)
    {
        src.updateVertices();
    }

    var debugCallback = src.debugCallback;
    var debugVerts = [];

    for (var i = 0; i < meshVerticesLength; i += 2)
    {
        var x = vertices[i + 0];
        var y = vertices[i + 1];

        var tx = x * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty = x * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        if (roundPixels)
        {
            tx = Math.round(tx);
            ty = Math.round(ty);
        }

        vertexViewF32[++vertexOffset] = tx;
        vertexViewF32[++vertexOffset] = ty;
        vertexViewF32[++vertexOffset] = uvs[i + 0];
        vertexViewF32[++vertexOffset] = uvs[i + 1];
        vertexViewF32[++vertexOffset] = textureUnit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = getTint(colors[colorIndex], camera.alpha * (alphas[colorIndex] * alpha));

        colorIndex++;

        if (debugCallback)
        {
            debugVerts[i + 0] = tx;
            debugVerts[i + 1] = ty;
        }
    }

    if (debugCallback)
    {
        debugCallback.call(src, src, meshVerticesLength, debugVerts);
    }

    pipeline.vertexCount += vertexCount;

    pipeline.currentBatch.count = (pipeline.vertexCount - pipeline.currentBatch.start);

    renderer.pipelines.postBatch(src);
};

module.exports = RopeWebGLRenderer;
