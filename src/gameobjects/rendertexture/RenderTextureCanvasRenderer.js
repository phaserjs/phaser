/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ImageCanvasRenderer = require('../image/ImageCanvasRenderer');
var RenderTextureRenderModes = require('./RenderTextureRenderModes');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.RenderTexture#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.RenderTexture} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RenderTextureCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    var redraw = true;
    var render = true;
    if (src.renderMode === RenderTextureRenderModes.REDRAW)
    {
        render = false;
    }
    else if (src.renderMode === RenderTextureRenderModes.RENDER)
    {
        redraw = false;
    }

    if (redraw)
    {
        src.render();
    }

    if (render)
    {
        ImageCanvasRenderer(renderer, src, camera, parentMatrix);
    }
};

module.exports = RenderTextureCanvasRenderer;
