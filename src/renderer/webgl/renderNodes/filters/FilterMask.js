/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterMask-frag.js');

/**
 * @classdesc
 * A RenderNode that renders the Mask filter effect, used to selectively show
 * or hide regions of a Game Object using a mask texture.
 *
 * The mask is sourced from a {@link Phaser.Filters.Mask} controller, which can
 * provide either a static GL texture or a dynamically rendered Game Object as
 * the mask. When a mask Game Object is used, this node will re-render it into
 * a texture each frame if `autoUpdate` is enabled, or when `needsUpdate` is
 * flagged. The mask can optionally be inverted so that masked areas are
 * revealed instead of hidden.
 *
 * This node binds the source image to texture unit 0 and the mask texture to
 * texture unit 1, then passes the `invert` flag to the fragment shader to
 * control mask polarity.
 *
 * See {@link Phaser.Filters.Mask}.
 *
 * @class FilterMask
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterMask = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterMask (manager)
    {
        BaseFilterShader.call(this, 'FilterMask', manager, null, ShaderSourceFS);
    },

    /**
     * Prepares the texture slots required by the mask filter shader.
     *
     * Texture unit 0 is the source image (bound by the base class). This method
     * assigns the mask GL texture to unit 1. If the controller has a mask Game
     * Object and either `autoUpdate` or `needsUpdate` is set, the dynamic
     * texture is re-rendered at the current drawing context dimensions before
     * being bound.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterMask#setupTextures
     * @since 4.0.0
     * @param {Phaser.Filters.Mask} controller - The filter controller providing the mask texture and update flags.
     * @param {WebGLTexture[]} textures - The texture array to populate. The mask texture is written to index 1.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context, used to determine the dimensions for dynamic texture updates.
     */
    setupTextures: function (controller, textures, drawingContext)
    {
        // Update dynamic texture if necessary.
        if (controller.maskGameObject && (controller.needsUpdate || controller.autoUpdate))
        {
            controller.updateDynamicTexture(drawingContext.width, drawingContext.height);
        }

        // Mask texture.
        textures[1] = controller.glTexture;
    },

    /**
     * Sets the shader uniforms required by the mask filter.
     *
     * Binds the `uMaskSampler` uniform to texture unit 1 so the fragment shader
     * samples from the mask texture, and passes the `invert` boolean flag to
     * control whether the mask is applied normally or inverted.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterMask#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Mask} controller - The filter controller providing the `invert` flag.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uMaskSampler', 1);
        programManager.setUniform('invert', controller.invert);
    }
});

module.exports = FilterMask;
