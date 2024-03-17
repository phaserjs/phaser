/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Factory for creating a WebGLStencilParameters.
 */
var WebGLStencilParametersFactory = {
    /**
    * Creates a new WebGLStencilParameters.
    *
    * @method Phaser.Renderer.WebGL.WebGLStencilParameters#create
    * @param {Phaser.Renderers.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLStencilParameters for.
    * @param {GLboolean} [enabled=false] - Whether the stencil test is enabled.
    * @param {object} [func] - Stencil function parameters.
    * @param {GLenum} [func.func=GL_ALWAYS] - The comparison function.
    * @param {GLint} [func.ref=0] - The reference value for the stencil test.
    * @param {GLuint} [func.mask=0xFF] - The mask to apply to the stencil test.
    * @param {object} [op] - Stencil operation parameters.
    * @param {GLenum} [op.fail=GL_KEEP] - The operation to perform if the stencil test fails.
    * @param {GLenum} [op.zfail=GL_KEEP] - The operation to perform if the depth test fails.
    * @param {GLenum} [op.zpass=GL_KEEP] - The operation to perform if the stencil test passes and the depth test passes or is disabled.
    * @param {GLint} [clear=0] - The value to clear the stencil buffer to.
    * @returns {Phaser.Types.Renderer.WebGL.WebGLStencilParameters} The created WebGLStencilParameters.
    * @since 3.90.0
    */
    create: function (renderer, enabled, func, op, clear)
    {
        var gl = renderer.gl;
        if (enabled === undefined) { enabled = false; }
        if (func === undefined) { func = {}; }
        if (func.func === undefined) { func.func = gl.ALWAYS; }
        if (func.ref === undefined) { func.ref = 0; }
        if (func.mask === undefined) { func.mask = 0xFF; }
        if (op === undefined) { op = {}; }
        if (op.fail === undefined) { op.fail = gl.KEEP; }
        if (op.zfail === undefined) { op.zfail = gl.KEEP; }
        if (op.zpass === undefined) { op.zpass = gl.KEEP; }
        if (clear === undefined) { clear = 0; }
        var parameters = {
            enabled: enabled,
            func: func,
            op: op,
            clear: clear
        };

        return parameters;
    }
};

module.exports = WebGLStencilParametersFactory;
