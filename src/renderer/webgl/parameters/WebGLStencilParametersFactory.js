/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A factory object that creates `WebGLStencilParameters` configuration objects.
 * These objects describe the complete stencil buffer state required by the
 * WebGL renderer, covering the stencil test function, per-operation behaviour,
 * and the value used to clear the stencil buffer. Use this factory whenever
 * you need to define or reset stencil state for a render pass.
 *
 * @namespace Phaser.Renderer.WebGL.WebGLStencilParametersFactory
 * @webglOnly
 * @since 4.0.0
 */
var WebGLStencilParametersFactory = {
    /**
    * Creates a new `WebGLStencilParameters` object that encapsulates the full
    * stencil buffer configuration for a WebGL render pass. The returned object
    * groups the arguments into the three sub-objects expected by the renderer:
    * `func` (passed to `gl.stencilFunc`), `op` (passed to `gl.stencilOp`), and
    * `clear` (the value written when the stencil buffer is cleared). All
    * parameters are optional and fall back to sensible no-op defaults so the
    * stencil buffer behaves as if it were disabled.
    *
    * @method Phaser.Renderer.WebGL.WebGLStencilParametersFactory#create
    * @since 4.0.0
    *
    * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLStencilParameters for.
    * @param {GLboolean} [enabled=true] - Whether the stencil test is enabled.
    * @param {GLenum} [func=GL_EQUAL] - The stencil comparison function used to compare the reference value against the current stencil buffer value.
    * @param {GLint} [funcRef=0] - The reference value against which the stencil buffer value is compared during the stencil test.
    * @param {GLuint} [funcMask=0xFF] - The bitwise mask applied to both the reference value and the stencil buffer value before they are compared.
    * @param {GLenum} [opFail=GL_KEEP] - The operation to perform if the stencil test fails.
    * @param {GLenum} [opZfail=GL_KEEP] - The operation to perform if the stencil test passes but the depth test fails.
    * @param {GLenum} [opZpass=GL_KEEP] - The operation to perform if the stencil test passes and the depth test passes or is disabled.
    * @param {GLint} [clear=0] - The value to clear the stencil buffer to.
    * @param {GLuint} [writeMask=0xFF] - The mask applied to the stencil buffer value when it is written. Set to 0 to prevent writing. Set to 0xFF to allow full writing.
    *
    * @return {Phaser.Types.Renderer.WebGL.WebGLStencilParameters} The created WebGLStencilParameters.
    */
    create: function (renderer, enabled, func, funcRef, funcMask, opFail, opZfail, opZpass, clear, writeMask)
    {
        var gl = renderer.gl;
        if (enabled === undefined) { enabled = true; }
        if (func === undefined) { func = gl.EQUAL; }
        if (funcRef === undefined) { funcRef = 0; }
        if (funcMask === undefined) { funcMask = 0xFF; }
        if (opFail === undefined) { opFail = gl.KEEP; }
        if (opZfail === undefined) { opZfail = gl.KEEP; }
        if (opZpass === undefined) { opZpass = gl.KEEP; }
        if (clear === undefined) { clear = 0; }
        if (writeMask === undefined) { writeMask = 0xFF; }
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
            clear: clear,
            writeMask: writeMask
        };

        return parameters;
    }
};

module.exports = WebGLStencilParametersFactory;
