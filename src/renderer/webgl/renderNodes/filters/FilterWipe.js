/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterWipe-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Wipe filter effect, which creates a directional
 * transition that sweeps across the screen to reveal or hide a second texture.
 * The wipe can travel along either axis and in either direction, with a
 * configurable edge softness (wipe width). It is used by the
 * {@link Phaser.Filters.Wipe} filter controller to produce scene transitions
 * or in-game reveal effects.
 * See {@link Phaser.Filters.Wipe}.
 *
 * @class FilterWipe
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterWipe = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterWipe (manager)
    {
        BaseFilterShader.call(this, 'FilterWipe', manager, null, ShaderSourceFS);
    },

    /**
     * Binds the wipe reveal texture to texture slot 1, making it available
     * to the fragment shader as the secondary sampler that will be blended
     * in as the wipe progresses.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterWipe#setupTextures
     * @since 4.0.0
     * @param {Phaser.Filters.Wipe} controller - The filter controller providing the wipe texture.
     * @param {WebGLTexture[]} textures - The texture array for this render node. Index 1 is set to the reveal texture.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context (unused).
     */
    setupTextures: function (controller, textures, _drawingContext)
    {
        // Reveal texture
        textures[1] = controller.wipeTexture.get().glTexture;
    },

    /**
     * Uploads the wipe shader uniforms derived from the filter controller.
     * Sets the secondary texture sampler unit, and passes a vec4 containing
     * the current progress (0–1), the wipe edge softness width, the wipe
     * direction (1 or -1), and the axis (0 for horizontal, 1 for vertical).
     * Also uploads the reveal flag, which determines whether the wipe
     * uncovers the secondary texture (reveal) or covers it (hide).
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterWipe#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Wipe} controller - The filter controller providing wipe parameters.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context (unused).
     */
    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uMainSampler2', 1);
        programManager.setUniform('uProgress_WipeWidth_Direction_Axis', [ controller.progress, controller.wipeWidth, controller.direction, controller.axis ]);
        programManager.setUniform('uReveal', controller.reveal);
    }
});

module.exports = FilterWipe;
