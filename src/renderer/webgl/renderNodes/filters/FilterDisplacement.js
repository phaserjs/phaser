/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterDisplacement-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Displacement filter effect.
 * See {@link Phaser.Filters.Displacement}.
 *
 * @class FilterDisplacement
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterDisplacement = class extends BaseFilterShader {

    constructor(manager)
    {
        super('FilterDisplacement', manager, null, ShaderSourceFS);
    }

    setupTextures(controller, textures)
    {
        // Displacement texture.
        textures[1] = controller.glTexture;
    }

    setupUniforms(controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uDisplacementSampler', 1);
        programManager.setUniform('amount', [ controller.x, controller.y ]);
    }
};

module.exports = FilterDisplacement;
