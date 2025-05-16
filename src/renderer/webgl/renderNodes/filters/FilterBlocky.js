/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBlocky-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Blocky filter effect.
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

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('uSizeAndOffset', [ controller.size.x, controller.size.y, controller.offset.x, controller.offset.y ]);
    }

});

module.exports = FilterBlocky;
