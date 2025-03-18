/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterColorMatrix-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Color Matrix filter effect.
 * See {@link Phaser.Filters.ColorMatrix}.
 *
 * @class FilterColorMatrix
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterColorMatrix = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterColorMatrix (manager)
    {
        BaseFilterShader.call(this, 'FilterColorMatrix', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uColorMatrix[0]', controller.colorMatrix.getData());
        programManager.setUniform('uAlpha', controller.colorMatrix.alpha);
    }
});

module.exports = FilterColorMatrix;
