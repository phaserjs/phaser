/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Factory for creating a WebGLStencilParameters.
 *
 * @namespace Phaser.Renderer.WebGL.WebGLStencilParametersFactory
 * @webglOnly
 * @since 4.0.0
 */
var WebGLStencilParametersFactory = {
    /**
    * Creates a new WebGLStencilParameters.
    *
    * @method Phaser.Renderer.WebGL.WebGLStencilParametersFactory#create
    * @since 4.0.0
    *
    * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLStencilParameters for.
    * @param {GLboolean} [enabled=false] - Whether the stencil test is enabled.
    * @param {GLenum} [func=GL_ALWAYS] - The comparison function.
    * @param {GLint} [funcRef=0] - The reference value for the stencil test.
    * @param {GLuint} [funcMask=0xFF] - The mask to apply to the stencil test.
    * @param {GLenum} [opFail=GL_KEEP] - The operation to perform if the stencil test fails.
    * @param {GLenum} [opZfail=GL_KEEP] - The operation to perform if the depth test fails.
    * @param {GLenum} [opZpass=GL_KEEP] - The operation to perform if the stencil test passes and the depth test passes or is disabled.
    * @param {GLint} [clear=0] - The value to clear the stencil buffer to.
    *
    * @returns {Phaser.Types.Renderer.WebGL.WebGLStencilParameters} The created WebGLStencilParameters.
    */
    create: function (renderer, enabled, func, funcRef, funcMask, opFail, opZfail, opZpass, clear)
    {
        var gl = renderer.gl;
        if (enabled === undefined) { enabled = false; }
        if (func === undefined) { func = gl.ALWAYS; }
        if (funcRef === undefined) { funcRef = 0; }
        if (funcMask === undefined) { funcMask = 0xFF; }
        if (opFail === undefined) { opFail = gl.KEEP; }
        if (opZfail === undefined) { opZfail = gl.KEEP; }
        if (opZpass === undefined) { opZpass = gl.KEEP; }
        if (clear === undefined) { clear = 0; }
        var parameters = {
            enabled: enabled,
            func: {
                func: func,
                ref: funcRef,
                mask: funcMask
            },
            op: {
                fail: opFail,
                zfail: opZfail,
                zpass: opZpass
            },
            clear: clear
        };

        return parameters;
    }
};

module.exports = WebGLStencilParametersFactory;
