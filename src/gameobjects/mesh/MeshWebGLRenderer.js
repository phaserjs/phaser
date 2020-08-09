/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var MeshWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var pipeline = this.pipeline;

    renderer.setPipeline(pipeline, src);

    var camMatrix = pipeline._tempMatrix1;
    var spriteMatrix = pipeline._tempMatrix2;
    var calcMatrix = pipeline._tempMatrix3;

    spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

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

    var frame = src.frame;
    var texture = frame.glTexture;

    var vertices = src.vertices;
    var uvs = src.uv;
    var colors = src.colors;
    var alphas = src.alphas;

    var meshVerticesLength = vertices.length;
    var vertexCount = Math.floor(meshVerticesLength * 0.5);

    if (pipeline.vertexCount + vertexCount > pipeline.vertexCapacity)
    {
        pipeline.flush();
    }

    pipeline.setTexture2D(texture, 0);

    var vertexViewF32 = pipeline.vertexViewF32;
    var vertexViewU32 = pipeline.vertexViewU32;

    var vertexOffset = (pipeline.vertexCount * pipeline.vertexComponentCount) - 1;

    var colorIndex = 0;
    var tintEffect = src.tintFill;

    for (var i = 0; i < meshVerticesLength; i += 2)
    {
        var x = vertices[i + 0];
        var y = vertices[i + 1];

        var tx = x * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty = x * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        if (camera.roundPixels)
        {
            tx = Math.round(tx);
            ty = Math.round(ty);
        }

        vertexViewF32[++vertexOffset] = tx;
        vertexViewF32[++vertexOffset] = ty;
        vertexViewF32[++vertexOffset] = uvs[i + 0];
        vertexViewF32[++vertexOffset] = uvs[i + 1];
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = Utils.getTintAppendFloatAlpha(colors[colorIndex], camera.alpha * alphas[colorIndex]);

        colorIndex++;
    }

    pipeline.vertexCount += vertexCount;
};

module.exports = MeshWebGLRenderer;
