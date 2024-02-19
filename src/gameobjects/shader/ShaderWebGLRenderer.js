/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../GetCalcMatrix');

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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ShaderWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    if (!src.shader)
    {
        return;
    }

    camera.addToRenderList(src);

    renderer.pipelines.clear();

    if (src.renderToTexture)
    {
        src.load();
        src.flush();
    }
    else
    {
        var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

        //  Renderer size changed?
        if (renderer.width !== src._rendererWidth || renderer.height !== src._rendererHeight)
        {
            src.projOrtho(0, renderer.width, renderer.height, 0);
        }

        src.load(calcMatrix.matrix);
        src.flush();
    }

    renderer.pipelines.rebind();
};

module.exports = ShaderWebGLRenderer;
