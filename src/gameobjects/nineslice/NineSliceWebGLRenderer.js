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

    // var test = {
    //     x: src.x,
    //     y: src.y,
    //     rotation: src.rotation,
    //     scaleX: src.scaleX,
    //     scaleY: src.scaleY,
    //     scrollFactorX: src.scrollFactorX,
    //     scrollFactorY: src.scrollFactorY
    // };

    // var calcMatrix = GetCalcMatrix(test, camera, parentMatrix).calc;

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var textureUnit = pipeline.setGameObject(src);

    var F32 = pipeline.vertexViewF32;
    var U32 = pipeline.vertexViewU32;

    var vertexOffset = (pipeline.vertexCount * pipeline.currentShader.vertexComponentCount) - 1;

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;

    var a = calcMatrix.a;
    var b = calcMatrix.b;
    var c = calcMatrix.c;
    var d = calcMatrix.d;
    // var e = -dx + calcMatrix.e;
    // var f = -dy + calcMatrix.f;
    var e = calcMatrix.e;
    var f = calcMatrix.f;

    var roundPixels = camera.roundPixels;

    var tintEffect = src.tintFill;
    var alpha = camera.alpha * src.alpha;
    var color = Utils.getTintAppendFloatAlpha(src.tint, alpha);

    renderer.pipelines.preBatch(src);

    var available = pipeline.vertexAvailable();
    var flushCount = -1;

    if (available < totalVerts)
    {
        flushCount = available;
    }

    for (var i = 0; i < totalVerts; i++)
    {
        var vert = verts[i].update(a, b, c, d, e, f, roundPixels, alpha);

        if (i === flushCount)
        {
            pipeline.flush();

            if (!pipeline.currentBatch)
            {
                textureUnit = pipeline.setGameObject(src);
            }

            vertexOffset = 0;
        }

        F32[++vertexOffset] = vert.tx;
        F32[++vertexOffset] = vert.ty;
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
