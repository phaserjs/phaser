/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Shader#renderWebGL
 * @since 3.17.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Shader} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ShaderWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    if (!src.shader)
    {
        return;
    }

    var pipeline = renderer.currentPipeline;

    renderer.clearPipeline();

    if (src.renderToTexture)
    {
        src.load();
        src.flush();
    }
    else
    {
        var camMatrix = src._tempMatrix1;
        var shapeMatrix = src._tempMatrix2;
        var calcMatrix = src._tempMatrix3;
    
        shapeMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);
    
        camMatrix.copyFrom(camera.matrix);
    
        if (parentMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);
    
            //  Undo the camera scroll
            shapeMatrix.e = src.x;
            shapeMatrix.f = src.y;
        }
        else
        {
            shapeMatrix.e -= camera.scrollX * src.scrollFactorX;
            shapeMatrix.f -= camera.scrollY * src.scrollFactorY;
        }
    
        camMatrix.multiply(shapeMatrix, calcMatrix);
    
        //  Renderer size changed?
        if (renderer.width !== src._rendererWidth || renderer.height !== src._rendererHeight)
        {
            src.projOrtho(0, renderer.width, renderer.height, 0);
        }
    
        src.load(calcMatrix.matrix);
        src.flush();
    }

    renderer.rebindPipeline(pipeline);
};

module.exports = ShaderWebGLRenderer;
