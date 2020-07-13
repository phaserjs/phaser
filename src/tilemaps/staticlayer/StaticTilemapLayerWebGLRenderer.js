/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var StaticTilemapLayerWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var tilesets = src.tileset;

    var pipeline = src.pipeline;
    var pipelineVertexBuffer = pipeline.vertexBuffer;

    renderer.setPipeline(pipeline);

    var camMatrix = renderer._tempMatrix1;
    var layerMatrix = renderer._tempMatrix2;
    var calcMatrix = renderer._tempMatrix3;

    layerMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        layerMatrix.e = src.x;
        layerMatrix.f = src.y;

        //  Multiply by the layer matrix, store result in calcMatrix
        camMatrix.multiply(layerMatrix, calcMatrix);
    }
    else
    {
        layerMatrix.e -= camera.scrollX * src.scrollFactorX;
        layerMatrix.f -= camera.scrollY * src.scrollFactorY;

        //  Multiply by the layer matrix, store result in calcMatrix
        camMatrix.multiply(layerMatrix, calcMatrix);
    }

    var modelMatrix = pipeline.modelIdentity().modelMatrix;
    modelMatrix[0] = calcMatrix.a;
    modelMatrix[1] = calcMatrix.b;
    modelMatrix[4] = calcMatrix.c;
    modelMatrix[5] = calcMatrix.d;
    modelMatrix[12] = calcMatrix.e;
    modelMatrix[13] = calcMatrix.f;

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
