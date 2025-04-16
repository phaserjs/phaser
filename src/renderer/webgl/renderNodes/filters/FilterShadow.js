/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterShadow-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Shadow filter effect.
 * See {@link Phaser.Filters.Shadow}.
 *
 * @class FilterShadow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterShadow = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterShadow (manager)
    {
        BaseFilterShader.call(this, 'FilterShadow', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;
        var samples = controller.samples;

        programManager.setUniform('lightPosition', [ controller.x, 1 - controller.y ]);
        programManager.setUniform('decay', controller.decay);
        programManager.setUniform('power', controller.power / samples);
        programManager.setUniform('color', controller.glcolor);
        programManager.setUniform('samples', samples);
        programManager.setUniform('intensity', controller.intensity);
    }
});

module.exports = FilterShadow;
