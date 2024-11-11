/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FXShadow-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Shadow filter effect.
 * See {@link Phaser.Filters.Shadow}.
 *
 * @class FilterShadow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes.Filters
 * @constructor
 * @since 3.90.0
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

        programManager.setUniform('lightPosition', [ controller.x, controller.y ]);
        programManager.setUniform('decay', controller.decay);
        programManager.setUniform('power', controller.power / samples);
        programManager.setUniform('color', controller.glcolor);
        programManager.setUniform('samples', samples);
        programManager.setUniform('intensity', controller.intensity);
    }
});

module.exports = FilterShadow;
