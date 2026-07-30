/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterDisplacement-frag.js');

/**
 * @classdesc
 * A RenderNode that applies a displacement filter effect to the WebGL rendering pipeline.
 *
 * Displacement filtering offsets the pixels of the source image using a
 * displacement map texture. The red channel of the map controls horizontal
 * offset and the green channel controls vertical offset. The magnitude of the
 * displacement is scaled by the controller's `x` and `y` amount values,
 * allowing you to create ripple, wave, heat-haze, and similar distortion
 * effects at runtime.
 *
 * This node is used internally by {@link Phaser.Filters.Displacement} and is
 * not typically instantiated directly. Use the Displacement filter on a Game
 * Object or Camera to apply this effect.
 *
 * @class FilterDisplacement
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterDisplacement = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterDisplacement (manager)
    {
        BaseFilterShader.call(this, 'FilterDisplacement', manager, null, ShaderSourceFS);
    },

    /**
     * Binds the displacement map texture used by this filter.
     *
     * Assigns the controller's WebGL displacement texture to texture slot 1,
     * which maps to the `uDisplacementSampler` uniform in the fragment shader.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterDisplacement#setupTextures
     * @since 4.0.0
     * @param {Phaser.Filters.Displacement} controller - The Displacement filter controller providing the displacement map texture.
     * @param {WebGLTexture[]} textures - The textures array for this render pass. The displacement texture is written to index 1.
     */
    setupTextures: function (controller, textures)
    {
        // Displacement texture.
        textures[1] = controller.glTexture;
    },

    /**
     * Sets the shader uniforms required by the displacement filter.
     *
     * Passes the displacement sampler index and the displacement amount vector
     * to the fragment shader. The amount vector is a two-component value whose
     * x and y components scale the horizontal and vertical displacement
     * respectively, as defined on the {@link Phaser.Filters.Displacement}
     * controller.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterDisplacement#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Displacement} controller - The Displacement filter controller providing the displacement amount values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uDisplacementSampler', 1);
        programManager.setUniform('amount', [ controller.x, controller.y ]);
    }
});

module.exports = FilterDisplacement;
