/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterCombineColorMatrix-frag.js');

/**
 * @classdesc
 * A RenderNode that applies the Combine Color Matrix filter effect, as defined
 * by {@link Phaser.Filters.CombineColorMatrix}.
 *
 * This effect blends two independent color matrices: one applied to the game
 * object itself (`colorMatrixSelf`) and one sourced from an external transfer
 * texture (`colorMatrixTransfer`). Each matrix has its own alpha multiplier,
 * and additional per-channel addition and multiplication values can be supplied
 * to further adjust the final color output.
 *
 * Use this filter when you need to composite or blend colour-grading from two
 * separate sources in a single WebGL pass, for example combining a base
 * desaturation pass with a tinted overlay texture.
 *
 * @class FilterCombineColorMatrix
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterCombineColorMatrix = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterColorMatrix (manager)
    {
        BaseFilterShader.call(this, 'FilterCombineColorMatrix', manager, null, ShaderSourceFS);
    },

    /**
     * Binds the transfer texture required by the shader.
     *
     * Assigns the controller's pre-rendered GL texture to texture slot 1, which
     * the fragment shader reads via the `uTransferSampler` uniform as the source
     * for the transfer color matrix pass.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterCombineColorMatrix#setupTextures
     * @since 4.0.0
     * @param {Phaser.Filters.CombineColorMatrix} controller - The filter controller providing the transfer GL texture.
     * @param {WebGLTexture[]} textures - The texture array used by the shader. The transfer texture is written to index 1.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context (unused by this method).
     */
    setupTextures: function (controller, textures, _drawingContext)
    {
        textures[1] = controller.glTexture;
    },

    /**
     * Uploads all shader uniforms required by the Combine Color Matrix effect.
     *
     * Sets the following uniforms on the active shader program:
     *
     * - `uTransferSampler` — texture unit index for the transfer texture.
     * - `uColorMatrixSelf` — the 4×5 color matrix applied to the game object itself.
     * - `uColorMatrixTransfer` — the 4×5 color matrix applied to the transfer texture.
     * - `uAlphaSelf` — the global alpha multiplier for the self color matrix.
     * - `uAlphaTransfer` — the global alpha multiplier for the transfer color matrix.
     * - `uAdditions` — per-channel additive offsets applied after matrix multiplication.
     * - `uMultiplications` — per-channel multiplicative factors applied after matrix multiplication.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterCombineColorMatrix#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.CombineColorMatrix} controller - The filter controller supplying color matrix data, alpha values, additions, and multiplications.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uTransferSampler', 1);
        programManager.setUniform('uColorMatrixSelf[0]', controller.colorMatrixSelf.getData());
        programManager.setUniform('uColorMatrixTransfer[0]', controller.colorMatrixTransfer.getData());
        programManager.setUniform('uAlphaSelf', controller.colorMatrixSelf.alpha);
        programManager.setUniform('uAlphaTransfer', controller.colorMatrixTransfer.alpha);
        programManager.setUniform('uAdditions', controller.additions);
        programManager.setUniform('uMultiplications', controller.multiplications);
    }
});

module.exports = FilterCombineColorMatrix;
