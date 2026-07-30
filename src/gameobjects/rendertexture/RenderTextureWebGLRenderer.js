/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ImageWebGLRenderer = require('../image/ImageWebGLRenderer');
var RenderTextureRenderModes = require('./RenderTextureRenderModes');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.RenderTexture#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.RenderTexture} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RenderTextureWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    if (src.isCurrentlyRendering)
    {
        return;
    }
    src.isCurrentlyRendering = true;

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
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);
    }

    src.isCurrentlyRendering = false;
};

module.exports = RenderTextureWebGLRenderer;
