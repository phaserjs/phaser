/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
var MeshWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    var models = src.models;
    var totalModels = models.length;

    if (totalModels === 0)
    {
        return;
    }

    var pipeline = renderer.pipelines.set(src.pipeline, src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var vertexOffset = (pipeline.vertexCount * pipeline.vertexComponentCount) - 1;

    var debugVerts;
    var debugCallback = src.debugCallback;

    var a = calcMatrix.a;
    var b = calcMatrix.b;
    var c = calcMatrix.c;
    var d = calcMatrix.d;
    var e = calcMatrix.e;
    var f = calcMatrix.f;

    var F32 = pipeline.vertexViewF32;
    var U32 = pipeline.vertexViewU32;

    var globalAlpha = camera.alpha * src.alpha;

    for (var m = 0; m < totalModels; m++)
    {
        var model = models[m];

        var faces = model.faces;
        var totalFaces = faces.length;
        var alpha = globalAlpha * model.alpha;

        if (totalFaces === 0 || !model.visible || alpha <= 0)
        {
            continue;
        }

        if (debugCallback)
        {
            debugVerts = [];
        }

        var tintEffect = model.tintFill;
        var textureUnit = pipeline.setGameObject(model);

        for (var i = 0; i < totalFaces; i++)
        {
            var face = faces[i];

            if (model.hideCCW && !face.isCounterClockwise())
            {
                continue;
            }

            if (pipeline.shouldFlush(3))
            {
                pipeline.flush();

                vertexOffset = 0;
            }

            vertexOffset = face.vertex1.load(F32, U32, vertexOffset, textureUnit, tintEffect, alpha, a, b, c, d, e, f);
            vertexOffset = face.vertex2.load(F32, U32, vertexOffset, textureUnit, tintEffect, alpha, a, b, c, d, e, f);
            vertexOffset = face.vertex3.load(F32, U32, vertexOffset, textureUnit, tintEffect, alpha, a, b, c, d, e, f);

            pipeline.vertexCount += 3;

            if (debugCallback && model.drawDebug)
            {
                debugVerts.push(
                    F32[vertexOffset - 20],
                    F32[vertexOffset - 19],
                    F32[vertexOffset - 13],
                    F32[vertexOffset - 12],
                    F32[vertexOffset - 6],
                    F32[vertexOffset - 5]
                );
            }
        }

        if (debugCallback && model.drawDebug)
        {
            debugCallback.call(src, src, debugVerts);
        }
    }
};

module.exports = MeshWebGLRenderer;
