/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBlocky-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Blocky filter effect, which pixelates the
 * rendered output by dividing it into rectangular blocks of a configurable
 * size. Each block is filled with a uniform color sampled from the source
 * texture, producing a retro, low-resolution appearance. The block dimensions
 * and positional offset are driven by the associated
 * {@link Phaser.Filters.Blocky} controller.
 * See {@link Phaser.Filters.Blocky}.
 *
 * @class FilterBlocky
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBlocky = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBlocky (manager)
    {
        BaseFilterShader.call(this, 'FilterBlocky', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the WebGL shader uniforms required by the Blocky filter.
     *
     * Passes the current render target dimensions as `resolution`, and a
     * combined `uSizeAndOffset` vector containing the clamped block width,
     * block height, and the x/y positional offset. The block size values are
     * clamped to a minimum of 1 to prevent division-by-zero in the shader.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBlocky#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Blocky} controller - The filter controller providing block size and offset values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context, used to read the render target dimensions.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        var sizeX = Math.max(1, controller.size.x);
        var sizeY = Math.max(1, controller.size.y);

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('uSizeAndOffset', [ sizeX, sizeY, controller.offset.x, controller.offset.y ]);
    }

});

module.exports = FilterBlocky;
