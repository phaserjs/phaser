/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Identity = require('../../renderer/webgl/mvp/Identity');
var Scale = require('../../renderer/webgl/mvp/Scale');
var Translate = require('../../renderer/webgl/mvp/Translate');
var ViewIdentity = require('../../renderer/webgl/mvp/ViewIdentity');
var ViewLoad2D = require('../../renderer/webgl/mvp/ViewLoad2D');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 *
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * A Static Tilemap Layer renders immediately and does not use any batching.
 *
 * @method Phaser.Tilemaps.StaticTilemapLayer#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.Tilemaps.StaticTilemapLayer} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var StaticTilemapLayerWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var gl = renderer.gl;
    var pipeline = src.pipeline;

    //  Restore when we're done
    var pipelineVertexBuffer = pipeline.vertexBuffer;

    Identity(pipeline);
    Translate(pipeline, src.x - (camera.scrollX * src.scrollFactorX), src.y - (camera.scrollY * src.scrollFactorY), 0);
    Scale(pipeline, src.scaleX, src.scaleY, 1);
    ViewLoad2D(pipeline, camera.matrix.matrix);

    //  This calls mvpUpdate during pipeline.bind, so make sure we call it _after_ setting the MVP stuff above
    renderer.setPipeline(pipeline);

    for (var i = 0; i < src.tileset.length; i++)
    {
        var tileset = src.tileset[i];
        var vertexCount = src.vertexCount[i];

        src.upload(camera, i);

        if (vertexCount > 0)
        {
            if (pipeline.forceZero)
            {
                //  Light Pipeline, or similar
                pipeline.setGameObject(src, tileset);
            }
            else
            {
                renderer.setTextureZero(tileset.glTexture);
            }

            gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        }
    }

    //  Restore the pipeline
    pipeline.vertexBuffer = pipelineVertexBuffer;

    ViewIdentity(pipeline);
    Identity(pipeline);
};

module.exports = StaticTilemapLayerWebGLRenderer;
