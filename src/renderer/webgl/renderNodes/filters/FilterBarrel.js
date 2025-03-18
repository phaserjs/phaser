/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBarrel-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Barrel filter effect.
 * See {@link Phaser.Filters.Barrel}.
 *
 * @class FilterBarrel
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBarrel = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBarrel (manager)
    {
        BaseFilterShader.call(this, 'FilterBarrel', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('amount', controller.amount);
    }
});

module.exports = FilterBarrel;
