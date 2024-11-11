/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FXMask-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Mask filter effect.
 * See {@link Phaser.Filters.Mask}.
 *
 * @class FilterMask
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes.Filters
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterMask = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterMask (manager)
    {
        BaseFilterShader.call(this, 'FilterMask', manager, null, ShaderSourceFS);
    },

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

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uMaskSampler', 1);
        programManager.setUniform('invert', controller.invert);
    }
});

module.exports = FilterMask;
