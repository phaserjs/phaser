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
    var tilesets = src.tileset;

    var pipeline = src.pipeline;
    var pipelineVertexBuffer = pipeline.vertexBuffer;

    renderer.setPipeline(pipeline);

    Identity(pipeline);
    Translate(pipeline, src.x - (camera.scrollX * src.scrollFactorX), src.y - (camera.scrollY * src.scrollFactorY), 0);
    Scale(pipeline, src.scaleX, src.scaleY, 1);
    ViewLoad2D(pipeline, camera.matrix.matrix);

    for (var i = 0; i < tilesets.length; i++)
    {
        src.upload(camera, i);

        if (src.vertexCount[i] > 0)
        {
            if (renderer.currentPipeline && renderer.currentPipeline.vertexCount > 0)
            {
                renderer.flush();
            }

            pipeline.vertexBuffer = src.vertexBuffer[i];

            renderer.setPipeline(pipeline);

            renderer.setTexture2D(tilesets[i].glTexture, 0);

            renderer.gl.drawArrays(pipeline.topology, 0, src.vertexCount[i]);
        }
    }

    //  Restore the pipeline
    pipeline.vertexBuffer = pipelineVertexBuffer;

    ViewIdentity(pipeline);
    Identity(pipeline);
};

module.exports = StaticTilemapLayerWebGLRenderer;
