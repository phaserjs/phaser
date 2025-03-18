/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterThreshold-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Threshold filter effect.
 * See {@link Phaser.Filters.Threshold}.
 *
 * @class FilterThreshold
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterThreshold = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterThreshold (manager)
    {
        BaseFilterShader.call(this, 'FilterThreshold', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('edge1', controller.edge1);
        programManager.setUniform('edge2', controller.edge2);
        programManager.setUniform('invert', controller.invert);
    }
});

module.exports = FilterThreshold;
