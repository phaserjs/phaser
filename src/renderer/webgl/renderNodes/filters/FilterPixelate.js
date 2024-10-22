/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FXPixelate-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Pixelate filter effect.
 * See {@link Phaser.Filters.Pixelate}.
 *
 * @class FilterPixelate
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes.Filters
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterPixelate = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterPixelate (manager)
    {
        BaseFilterShader.call(this, 'FilterPixelate', manager, ShaderSourceFS);
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('amount', controller.amount);
        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
    }
});

module.exports = FilterPixelate;
