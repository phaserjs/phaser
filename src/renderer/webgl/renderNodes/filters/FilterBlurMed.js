/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBlurMed-frag.js');

/**
 * @classdesc
 * This RenderNode renders the BlurMed filter effect.
 * This is a medium quality blur filter.
 * It should not be used directly.
 * It is intended to be called by the FilterBlur filter
 * based on the quality setting of the controller it is running.
 *
 * @class FilterBlurMed
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBlurMed = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBlurMed (manager)
    {
        BaseFilterShader.call(this, 'FilterBlurMed', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the WebGL shader uniforms required by the blur fragment shader.
     *
     * Called once per render pass before the blur is drawn. It uploads the
     * current render target dimensions as `resolution`, the blur spread
     * amount as `strength`, the tint as `color`, and the directional
     * blur axis as `offset` (a two-component vector containing the
     * horizontal and vertical offset values from the controller).
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBlurMed#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Blur} controller - The Blur filter controller providing the uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context, used to read the render target dimensions.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('strength', controller.strength);
        programManager.setUniform('color', controller.color);
        programManager.setUniform('offset', [ controller.x, controller.y ]);
    }
});

module.exports = FilterBlurMed;
