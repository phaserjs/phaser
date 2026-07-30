/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterShadow-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Shadow filter effect, producing a directional
 * light-ray glow that emanates from a light source position toward the Game
 * Object. It uploads all shader uniforms required by the Shadow fragment
 * shader, including the light position (converted to WebGL UV space), decay,
 * power, color, sample count, and intensity values sourced from the
 * {@link Phaser.Filters.Shadow} controller.
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

    /**
     * Sets the shader uniforms for the Shadow filter effect.
     *
     * This method is called automatically before rendering. It reads values
     * from the Shadow filter controller and uploads them to the WebGL program,
     * including the light source position (with the Y axis inverted to match
     * WebGL UV coordinates), decay, power (normalized by sample count), shadow
     * color, sample count, and intensity.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterShadow#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Shadow} controller - The Shadow filter controller providing the uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
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
