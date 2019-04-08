/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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

    pipeline.modelIdentity();
    pipeline.modelTranslate(src.x - (camera.scrollX * src.scrollFactorX), src.y - (camera.scrollY * src.scrollFactorY), 0);
    pipeline.modelScale(src.scaleX, src.scaleY, 1);
    pipeline.viewLoad2D(camera.matrix.matrix);

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

    pipeline.viewIdentity();
    pipeline.modelIdentity();
};

module.exports = StaticTilemapLayerWebGLRenderer;
