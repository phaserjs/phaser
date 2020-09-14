/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
var MeshWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    var pipeline = renderer.pipelines.set(this.pipeline, src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var vertices = src.vertices;
    var vertexCount = Math.floor(vertices.length);

    if (pipeline.vertexCount + vertexCount > pipeline.vertexCapacity)
    {
        pipeline.flush();
    }

    var textureUnit = pipeline.setGameObject(src);

    var vertexViewF32 = pipeline.vertexViewF32;
    var vertexViewU32 = pipeline.vertexViewU32;

    var vertexOffset = (pipeline.vertexCount * pipeline.vertexComponentCount) - 1;

    var tintEffect = src.tintFill;

    var debugCallback = src.debugCallback;
    var debugVerts = [];

    for (var i = 0; i < vertexCount; i++)
    {
        var vertex = vertices[i];

        var tx = vertex.x * calcMatrix.a + vertex.y * calcMatrix.c + calcMatrix.e;
        var ty = vertex.x * calcMatrix.b + vertex.y * calcMatrix.d + calcMatrix.f;

        if (camera.roundPixels)
        {
            tx = Math.round(tx);
            ty = Math.round(ty);
        }

        if (debugCallback)
        {
            debugVerts.push(tx, ty);
        }

        vertexViewF32[++vertexOffset] = tx;
        vertexViewF32[++vertexOffset] = ty;
        vertexViewF32[++vertexOffset] = vertex.u;
        vertexViewF32[++vertexOffset] = vertex.v;
        vertexViewF32[++vertexOffset] = textureUnit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = Utils.getTintAppendFloatAlpha(vertex.color, camera.alpha * src.alpha * vertex.alpha);
    }

    pipeline.vertexCount += vertexCount;

    if (debugCallback)
    {
        debugCallback.call(src, src, vertexCount * 2, debugVerts);
    }
};

module.exports = MeshWebGLRenderer;
