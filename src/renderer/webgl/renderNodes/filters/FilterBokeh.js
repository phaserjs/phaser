/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBokeh-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Bokeh filter effect.
 * See {@link Phaser.Filters.Bokeh}.
 *
 * @class FilterBokeh
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBokeh = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBokeh (manager)
    {
        BaseFilterShader.call(this, 'FilterBokeh', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('radius', controller.radius);
        programManager.setUniform('amount', controller.amount);
        programManager.setUniform('contrast', controller.contrast);
        programManager.setUniform('strength', controller.strength);
        programManager.setUniform('blur', [ controller.blurX, controller.blurY ]);
        programManager.setUniform('isTiltShift', controller.isTiltShift);
        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
    }
});

module.exports = FilterBokeh;
