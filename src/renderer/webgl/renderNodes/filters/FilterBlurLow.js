/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBlurLow-frag.js');

/**
 * @classdesc
 * This RenderNode renders the BlurLow filter effect.
 * This is a low quality blur filter.
 * It should not be used directly.
 * It is intended to be called by the FilterBlur filter
 * based on the quality setting of the controller it is running.
 *
 * @class FilterBlurLow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBlurLow = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBlurLow (manager)
    {
        BaseFilterShader.call(this, 'FilterBlurLow', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('strength', controller.strength);
        programManager.setUniform('color', controller.color);
        programManager.setUniform('offset', [ controller.x, controller.y ]);
    }
});

module.exports = FilterBlurLow;
