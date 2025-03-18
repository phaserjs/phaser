/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Factory for creating a WebGLBlendParameters.
 *
 * @namespace Phaser.Renderer.WebGL.WebGLBlendParametersFactory
 * @webglOnly
 * @since 4.0.0
 */
var WebGLBlendParametersFactory = {
    /**
     * Create a new WebGLBlendParameters object.
     *
     * Default values are for a normal blend mode.
     * - enabled: true
     * - color: [ 0, 0, 0, 0 ]
     * - equation: gl.FUNC_ADD
     * - funcSrc: gl.ONE
     * - funcDst: gl.ONE_MINUS_SRC_ALPHA
     *
     * Where `equation`, `funcSrc`, and `funcDst` are the same for RGB and alpha.
     *
     * @method Phaser.Renderer.WebGL.WebGLBlendParametersFactory#createCombined
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLBlendParameters for.
     * @param {GLboolean} [enabled=true] - Whether blending is enabled.
     * @param {GLclampf[]} [color=[0, 0, 0, 0]] - The blend color (array of 4 channels, 0-1).
     * @param {GLenum} [equation=gl.FUNC_ADD] - The blend equation.
     * @param {GLenum} [funcSrc=gl.ONE] - The source blend function.
     * @param {GLenum} [funcDst=gl.ONE_MINUS_SRC_ALPHA] - The destination blend function.
     * @returns {Phaser.Types.Renderer.WebGL.WebGLBlendParameters} The created WebGLBlendParameters.
     * @since 4.0.0
     */
    createCombined: function (renderer, enabled, color, equation, funcSrc, funcDst)
    {
        var gl = renderer.gl;
        if (enabled === undefined) { enabled = true; }
        if (color === undefined) { color = [ 0, 0, 0, 0 ]; }
        if (equation === undefined) { equation = gl.FUNC_ADD; }
        if (funcSrc === undefined) { funcSrc = gl.ONE; }
        if (funcDst === undefined) { funcDst = gl.ONE_MINUS_SRC_ALPHA; }
        var parameters = {
            enabled: enabled,
            color: color,
            equation: [ equation, equation ],
            func: [ funcSrc, funcDst, funcSrc, funcDst ]
        };

        return parameters;
    },

    /**
     * Create a new WebGLBlendParameters object.
     *
     * Default values are for a normal blend mode.
     * - enabled: true
     * - color: [ 0, 0, 0, 0 ]
     * - equation: gl.FUNC_ADD
     * - funcSrc: gl.ONE
     * - funcDst: gl.ONE_MINUS_SRC_ALPHA
     *
     * Where `equation`, `funcSrc`, and `funcDst` are the same for RGB and alpha.
     *
     * @method Phaser.Renderer.WebGL.WebGLBlendParametersFactory#createSeparate
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLBlendParameters for.
     * @param {GLboolean} [enabled=true] - Whether blending is enabled.
     * @param {GLclampf[]} [color=[0, 0, 0, 0]] - The blend color (array of 4 channels, 0-1).
     * @param {GLenum} [equationRGB=gl.FUNC_ADD] - The RGB blend equation.
     * @param {GLenum} [equationAlpha=gl.FUNC_ADD] - The alpha blend equation.
     * @param {GLenum} [funcSrcRGB=gl.ONE] - The RGB source blend function.
     * @param {GLenum} [funcDstRGB=gl.ONE_MINUS_SRC_ALPHA] - The RGB destination blend function.
     * @param {GLenum} [funcSrcAlpha=gl.ONE] - The alpha source blend function.
     * @param {GLenum} [funcDstAlpha=gl.ONE_MINUS_SRC_ALPHA] - The alpha destination blend function.
     * @returns {Phaser.Types.Renderer.WebGL.WebGLBlendParameters} The created WebGLBlendParameters.
     * @since 4.0.0
     */
    createSeparate: function (renderer, enabled, color, equationRGB, equationAlpha, funcSrcRGB, funcDstRGB, funcSrcAlpha, funcDstAlpha)
    {
        var gl = renderer.gl;
        if (enabled === undefined) { enabled = true; }
        if (color === undefined) { color = [ 0, 0, 0, 0 ]; }
        if (equationRGB === undefined) { equationRGB = gl.FUNC_ADD; }
        if (equationAlpha === undefined) { equationAlpha = gl.FUNC_ADD; }
        if (funcSrcRGB === undefined) { funcSrcRGB = gl.ONE; }
        if (funcDstRGB === undefined) { funcDstRGB = gl.ONE_MINUS_SRC_ALPHA; }
        if (funcSrcAlpha === undefined) { funcSrcAlpha = gl.ONE; }
        if (funcDstAlpha === undefined) { funcDstAlpha = gl.ONE_MINUS_SRC_ALPHA; }
        var parameters = {
            enabled: enabled,
            color: color,
            equation: [ equationRGB, equationAlpha ],
            func: [ funcSrcRGB, funcDstRGB, funcSrcAlpha, funcDstAlpha ]
        };

        return parameters;
    }
};

module.exports = WebGLBlendParametersFactory;
