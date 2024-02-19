/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../GetCalcMatrix');
var Utils = require('../../renderer/webgl/Utils');

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

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, false).calc;

    //  This causes a flush if the NineSlice has a Post Pipeline
    renderer.pipelines.preBatch(src);

    var textureUnit = pipeline.setGameObject(src);

    var F32 = pipeline.vertexViewF32;
    var U32 = pipeline.vertexViewU32;

    var vertexOffset = (pipeline.vertexCount * pipeline.currentShader.vertexComponentCount) - 1;

    var roundPixels = camera.roundPixels;

    var tintEffect = src.tintFill;
    var alpha = camera.alpha * src.alpha;
    var color = Utils.getTintAppendFloatAlpha(src.tint, alpha);

    var available = pipeline.vertexAvailable();
    var flushCount = -1;

    if (available < totalVerts)
    {
        flushCount = available;
    }

    for (var i = 0; i < totalVerts; i++)
    {
        var vert = verts[i];

        if (i === flushCount)
        {
            pipeline.flush();

            textureUnit = pipeline.setGameObject(src);

            vertexOffset = 0;
        }

        F32[++vertexOffset] = calcMatrix.getXRound(vert.vx, vert.vy, roundPixels);
        F32[++vertexOffset] = calcMatrix.getYRound(vert.vx, vert.vy, roundPixels);
        F32[++vertexOffset] = vert.u;
        F32[++vertexOffset] = vert.v;
        F32[++vertexOffset] = textureUnit;
        F32[++vertexOffset] = tintEffect;
        U32[++vertexOffset] = color;

        pipeline.vertexCount++;

        pipeline.currentBatch.count = (pipeline.vertexCount - pipeline.currentBatch.start);
    }

    renderer.pipelines.postBatch(src);
};

module.exports = NineSliceWebGLRenderer;
