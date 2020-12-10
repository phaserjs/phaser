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
 * @method Phaser.GameObjects.Layer3D#renderWebGL
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Layer3D} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var Layer3DWebGLRenderer = function (renderer, src)
{
    var models = src.models;
    var totalModels = models.length;

    if (totalModels === 0)
    {
        return;
    }

    renderer.pipelines.clear();

    src.camera.update();

    var pipeline = renderer.pipelines.set(src.pipeline, src);

    for (var m = 0; m < totalModels; m++)
    {
        var model = models[m];

        if (model.visible && model.vertexCount > 0)
        {
            pipeline.drawModel(src, model);
        }
    }

    src.resetDirtyFlags();

    renderer.pipelines.rebind();
};

module.exports = Layer3DWebGLRenderer;
