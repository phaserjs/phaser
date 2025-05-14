/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var WebGLGlobalParametersFactory = require('../parameters/WebGLGlobalParametersFactory');

/**
 * @classdesc
 * Wrapper for the WebGL global state.
 *
 * @class WebGLGlobalWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLGlobalWrapper for.
 */
var WebGLGlobalWrapper = new Class({

    initialize:

    function WebGLGlobalWrapper (renderer)
    {
        /**
         * The WebGLRenderer this WebGLGlobalWrapper is associated with.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The current state of the WebGL global state.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#state
         * @type {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters}
         * @since 4.0.0
         */
        this.state = WebGLGlobalParametersFactory.getDefault(renderer);
    },

    /**
     * Sets the global WebGL state. Parameters are updated on the
     * WebGLRenderingContext only if they are defined in the input `state`,
     * and different from the current state.
     *
     * When `force` is true, and `state` is defined, parameters on `state`
     * are always set, regardless of the current state.
     *
     * When `force` is true, and `state` is undefined, the current state is
     * used to reset all the parameters.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#update
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} [state] - The state to set. If undefined, the current state is used when `force` is `true`.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     * @param {boolean} [vaoLast=false] - If `true`, the VAO will be set last.
     * Otherwise, it will be set first. This is useful when performing state
     * changes that will affect a VAO, such as `bindings.elementArrayBuffer`.
     */
    update: function (state, force, vaoLast)
    {
        if (state === undefined)
        {
            if (!force)
            {
                return;
            }
            state = this.state;
        }
        if (force === undefined) { force = false; }
        if (vaoLast === undefined) { vaoLast = false; }

        if (state.vao !== undefined && !vaoLast)
        {
            this.updateVAO(state, force);
        }
        if (state.bindings !== undefined)
        {
            this.updateBindings(state, force);
        }
        if (state.blend !== undefined)
        {
            this.updateBlend(state, force);
        }
        if (state.colorClearValue !== undefined)
        {
            this.updateColorClearValue(state, force);
        }
        if (state.colorWritemask !== undefined)
        {
            this.updateColorWritemask(state, force);
        }
        if (state.cullFace !== undefined)
        {
            this.updateCullFace(state, force);
        }
        if (state.depthTest !== undefined)
        {
            this.updateDepthTest(state, force);
        }
        if (state.scissor !== undefined)
        {
            // Must happen after setting the framebuffer.
            this.updateScissor(state, force);
        }
        if (state.stencil !== undefined)
        {
            this.updateStencil(state, force);
        }
        if (state.texturing !== undefined)
        {
            this.updateTexturing(state, force);
        }
        if (state.viewport !== undefined)
        {
            this.updateViewport(state, force);
        }
        if (state.vao !== undefined && vaoLast)
        {
            this.updateVAO(state, force);
        }
    },

    /**
     * Updates the bindings state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBindings
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBindings: function (state, force)
    {
        var bindings = state.bindings;

        if (bindings.activeTexture !== undefined)
        {
            this.updateBindingsActiveTexture(state, force);
        }
        if (bindings.arrayBuffer !== undefined)
        {
            this.updateBindingsArrayBuffer(state, force);
        }
        if (bindings.elementArrayBuffer !== undefined)
        {
            this.updateBindingsElementArrayBuffer(state, force);
        }
        if (bindings.framebuffer !== undefined)
        {
            this.updateBindingsFramebuffer(state, force);
        }
        if (bindings.program !== undefined)
        {
            this.updateBindingsProgram(state, force);
        }
        if (bindings.renderbuffer !== undefined)
        {
            this.updateBindingsRenderbuffer(state, force);
        }
    },

    /**
     * Updates the active texture unit state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBindingsActiveTexture
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBindingsActiveTexture: function (state, force)
    {
        var activeTexture = state.bindings.activeTexture;

        var different = activeTexture !== this.state.bindings.activeTexture;

        if (different)
        {
            this.state.bindings.activeTexture = activeTexture;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            gl.activeTexture(gl.TEXTURE0 + activeTexture);
        }
    },

    /**
     * Updates the vertex array buffer state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBindingsArrayBuffer
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBindingsArrayBuffer: function (state, force)
    {
        var arrayBuffer = state.bindings.arrayBuffer;
        var gl = this.renderer.gl;
        if (
            arrayBuffer !== null &&
            arrayBuffer.bufferType !== gl.ARRAY_BUFFER
        )
        {
            throw new Error('Invalid buffer type for ARRAY_BUFFER');
        }

        var different = arrayBuffer !== this.state.bindings.arrayBuffer;

        if (different)
        {
            this.state.bindings.arrayBuffer = arrayBuffer;
        }
        if (different || force)
        {
            var webGLBuffer = arrayBuffer ? arrayBuffer.webGLBuffer : null;
            gl.bindBuffer(gl.ARRAY_BUFFER, webGLBuffer);
        }
    },

    /**
     * Updates the index array buffer state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBindingsElementArrayBuffer
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBindingsElementArrayBuffer: function (state, force)
    {
        var elementArrayBuffer = state.bindings.elementArrayBuffer;
        var gl = this.renderer.gl;
        if (
            elementArrayBuffer !== null &&
            elementArrayBuffer.bufferType !== gl.ELEMENT_ARRAY_BUFFER
        )
        {
            throw new Error('Invalid buffer type for ELEMENT_ARRAY_BUFFER');
        }

        var different = elementArrayBuffer !== this.state.bindings.elementArrayBuffer;

        if (different)
        {
            this.state.bindings.elementArrayBuffer = elementArrayBuffer;
        }
        if (different || force)
        {
            var webGLBuffer = elementArrayBuffer ? elementArrayBuffer.webGLBuffer : null;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLBuffer);
        }
    },

    /**
     * Updates the framebuffer state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBindingsFramebuffer
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBindingsFramebuffer: function (state, force)
    {
        var framebuffer = state.bindings.framebuffer;

        var different = framebuffer !== this.state.bindings.framebuffer;

        if (different)
        {
            this.state.bindings.framebuffer = framebuffer;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            var webGLFramebuffer = framebuffer ? framebuffer.webGLFramebuffer : null;
            gl.bindFramebuffer(gl.FRAMEBUFFER, webGLFramebuffer);
        }
    },

    /**
     * Updates the program state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBindingsProgram
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBindingsProgram: function (state, force)
    {
        var program = state.bindings.program;

        var different = program !== this.state.bindings.program;

        if (different)
        {
            this.state.bindings.program = program;
        }
        if (different || force)
        {
            var webGLProgram = program ? program.webGLProgram : null;
            this.renderer.gl.useProgram(webGLProgram);
        }
    },

    /**
     * Updates the renderbuffer state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBindingsRenderbuffer
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBindingsRenderbuffer: function (state, force)
    {
        var renderbuffer = state.bindings.renderbuffer;

        var different = renderbuffer !== this.state.bindings.renderbuffer;

        if (different)
        {
            this.state.bindings.renderbuffer = renderbuffer;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            var webGLRenderbuffer = renderbuffer || null;
            gl.bindRenderbuffer(gl.RENDERBUFFER, webGLRenderbuffer);
        }
    },

    /**
     * Updates the blend state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBlend
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBlend: function (state, force)
    {
        var blend = state.blend;
        if (blend.enabled !== undefined)
        {
            this.updateBlendEnabled(state, force);
        }
        if (blend.color !== undefined)
        {
            this.updateBlendColor(state, force);
        }
        if (blend.equation !== undefined)
        {
            this.updateBlendEquation(state, force);
        }
        if (blend.func !== undefined)
        {
            this.updateBlendFunc(state, force);
        }
    },

    /**
     * Updates the blend color.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBlendColor
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBlendColor: function (state, force)
    {
        var color = state.blend.color;
        var r = color[0];
        var g = color[1];
        var b = color[2];
        var a = color[3];

        var different = r !== this.state.blend.color[0] ||
            g !== this.state.blend.color[1] ||
            b !== this.state.blend.color[2] ||
            a !== this.state.blend.color[3];

        if (different)
        {
            this.state.blend.color = [ r, g, b, a ];
        }
        if (different || force)
        {
            this.renderer.gl.blendColor(r, g, b, a);
        }
    },

    /**
     * Updates the blend enabled state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBlendEnabled
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBlendEnabled: function (state, force)
    {
        var enabled = state.blend.enabled;

        var different = enabled !== this.state.blend.enabled;

        if (different)
        {
            this.state.blend.enabled = enabled;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            if (enabled)
            {
                gl.enable(gl.BLEND);
            }
            else
            {
                gl.disable(gl.BLEND);
            }
        }
    },

    /**
     * Updates the blend equation state.
     *
     * Equations are always treated as separate.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBlendEquation
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBlendEquation: function (state, force)
    {
        var equation = state.blend.equation;

        var different = equation[0] !== this.state.blend.equation[0] ||
            equation[1] !== this.state.blend.equation[1];

        if (different)
        {
            this.state.blend.equation = [ equation[0], equation[1] ];
        }
        if (different || force)
        {
            this.renderer.gl.blendEquationSeparate(equation[0], equation[1]);
        }
    },

    /**
     * Updates the blend function state.
     *
     * Functions are always treated as separate.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateBlendFunc
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateBlendFunc: function (state, force)
    {
        var func = state.blend.func;

        var different =
            func[0] !== this.state.blend.func[0] ||
            func[1] !== this.state.blend.func[1] ||
            func[2] !== this.state.blend.func[2] ||
            func[3] !== this.state.blend.func[3];

        if (different)
        {
            this.state.blend.func = [ func[0], func[1], func[2], func[3] ];
        }
        if (different || force)
        {
            this.renderer.gl.blendFuncSeparate(func[0], func[1], func[2], func[3]);
        }
    },

    /**
     * Updates the color clear value.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateColorClearValue
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateColorClearValue: function (state, force)
    {
        var colorClearValue = state.colorClearValue;
        var r = colorClearValue[0];
        var g = colorClearValue[1];
        var b = colorClearValue[2];
        var a = colorClearValue[3];

        var different = r !== this.state.colorClearValue[0] ||
            g !== this.state.colorClearValue[1] ||
            b !== this.state.colorClearValue[2] ||
            a !== this.state.colorClearValue[3];

        if (different)
        {
            this.state.colorClearValue = [ r, g, b, a ];
        }

        if (different || force)
        {
            this.renderer.gl.clearColor(r, g, b, a);
        }
    },

    /**
     * Updates the color writemask.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateColorWritemask
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateColorWritemask: function (state, force)
    {
        var colorWritemask = state.colorWritemask;
        var r = colorWritemask[0];
        var g = colorWritemask[1];
        var b = colorWritemask[2];
        var a = colorWritemask[3];

        var different = r !== this.state.colorWritemask[0] ||
            g !== this.state.colorWritemask[1] ||
            b !== this.state.colorWritemask[2] ||
            a !== this.state.colorWritemask[3];

        if (different)
        {
            this.state.colorWritemask = [ r, g, b, a ];
        }
        if (different || force)
        {
            this.renderer.gl.colorMask(r, g, b, a);
        }
    },

    /**
     * Updates the cull face state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateCullFace
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateCullFace: function (state, force)
    {
        var cullFace = !!state.cullFace;

        var different = cullFace !== this.state.cullFace;

        if (different)
        {
            this.state.cullFace = cullFace;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            if (cullFace)
            {
                gl.enable(gl.CULL_FACE);
            }
            else
            {
                gl.disable(gl.CULL_FACE);
            }
        }
    },

    /**
     * Updates the depth test state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateDepthTest
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateDepthTest: function (state, force)
    {
        var depthTest = !!state.depthTest;

        var different = depthTest !== this.state.depthTest;

        if (different)
        {
            this.state.depthTest = depthTest;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            if (depthTest)
            {
                gl.enable(gl.DEPTH_TEST);
            }
            else
            {
                gl.disable(gl.DEPTH_TEST);
            }
        }
    },

    /**
     * Updates the scissor state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateScissor
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateScissor: function (state, force)
    {
        var scissor = state.scissor;
        if (scissor.enable !== undefined)
        {
            this.updateScissorEnabled(state, force);
        }
        if (scissor.box !== undefined)
        {
            this.updateScissorBox(state, force);
        }
    },

    /**
     * Updates the scissor enabled state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateScissorEnabled
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateScissorEnabled: function (state, force)
    {
        var enable = state.scissor.enable;

        var different = enable !== this.state.scissor.enable;

        if (different)
        {
            this.state.scissor.enable = enable;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            if (enable)
            {
                gl.enable(gl.SCISSOR_TEST);
            }
            else
            {
                gl.disable(gl.SCISSOR_TEST);
            }
        }
    },

    /**
     * Updates the scissor box state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateScissorBox
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateScissorBox: function (state, force)
    {
        var scissorBox = state.scissor.box;
        var x = scissorBox[0];
        var y = scissorBox[1];
        var width = scissorBox[2];
        var height = scissorBox[3];

        var different = x !== this.state.scissor.box[0] ||
            y !== this.state.scissor.box[1] ||
            width !== this.state.scissor.box[2] ||
            height !== this.state.scissor.box[3];

        if (different)
        {
            this.state.scissor.box = [ x, y, width, height ];
        }
        if (different || force)
        {
            this.renderer.gl.scissor(
                x,
                y,
                width,
                height
            );
        }
    },

    /**
     * Updates the stencil state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateStencil
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateStencil: function (state, force)
    {
        var stencil = state.stencil;
        if (stencil.clear !== undefined)
        {
            this.updateStencilClear(state, force);
        }
        if (stencil.enabled !== undefined)
        {
            this.updateStencilEnabled(state, force);
        }
        if (stencil.func !== undefined)
        {
            this.updateStencilFunc(state, force);
        }
        if (stencil.op !== undefined)
        {
            this.updateStencilOp(state, force);
        }
    },

    /**
     * Updates the stencil clear state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateStencilClear
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateStencilClear: function (state, force)
    {
        var clear = state.stencil.clear;

        var different = clear !== this.state.stencil.clear;

        if (different)
        {
            this.state.stencil.clear = clear;
        }
        if (different || force)
        {
            this.renderer.gl.clearStencil(clear);
        }
    },

    /**
     * Updates the stencil enabled state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateStencilEnabled
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateStencilEnabled: function (state, force)
    {
        var enabled = state.stencil.enabled;

        var different = enabled !== this.state.stencil.enabled;

        if (different)
        {
            this.state.stencil.enabled = enabled;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            if (enabled)
            {
                gl.enable(gl.STENCIL_TEST);
            }
            else
            {
                gl.disable(gl.STENCIL_TEST);
            }
        }
    },

    /**
     * Updates the stencil function state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateStencilFunc
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateStencilFunc: function (state, force)
    {
        var func = state.stencil.func;

        var different = func.func !== this.state.stencil.func.func ||
            func.ref !== this.state.stencil.func.ref ||
            func.mask !== this.state.stencil.func.mask;

        if (different)
        {
            this.state.stencil.func = { func: func.func, ref: func.ref, mask: func.mask };
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            gl.stencilFunc(func.func, func.ref, func.mask);
        }
    },

    /**
     * Updates the stencil operation state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateStencilOp
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateStencilOp: function (state, force)
    {
        var op = state.stencil.op;

        var different = op.fail !== this.state.stencil.op.fail ||
            op.zfail !== this.state.stencil.op.zfail ||
            op.zpass !== this.state.stencil.op.zpass;

        if (different)
        {
            this.state.stencil.op = { fail: op.fail, zfail: op.zfail, zpass: op.zpass };
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            gl.stencilOp(op.fail, op.zfail, op.zpass);
        }
    },

    /**
     * Updates the texturing state, which takes effect when creating a texture.
     * This includes `flipY` and `premultiplyAlpha`.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateTexturing
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateTexturing: function (state, force)
    {
        var texturing = state.texturing;
        if (texturing.flipY !== undefined)
        {
            this.updateTexturingFlipY(state, force);
        }
        if (texturing.premultiplyAlpha !== undefined)
        {
            this.updateTexturingPremultiplyAlpha(state, force);
        }
    },

    /**
     * Updates the texture flipY state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateTexturingFlipY
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateTexturingFlipY: function (state, force)
    {
        var flipY = state.texturing.flipY;

        var different = flipY !== this.state.texturing.flipY;

        if (different)
        {
            this.state.texturing.flipY = flipY;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        }
    },

    /**
     * Updates the texture premultiplyAlpha state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateTexturingPremultiplyAlpha
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateTexturingPremultiplyAlpha: function (state, force)
    {
        var premultiplyAlpha = state.texturing.premultiplyAlpha;

        var different = premultiplyAlpha !== this.state.texturing.premultiplyAlpha;

        if (different)
        {
            this.state.texturing.premultiplyAlpha = premultiplyAlpha;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
    },

    /**
     * Updates the vertex array object state.
     *
     * Note that the VAO is automatically affected by
     * bindings of `elementArrayBuffer` and any attribute settings,
     * as written in WebGL. When binding the VAO, ensure that other
     * bindings come before or after, as you intend.
     * When using `update`, the VAO is set first by default.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateVAO
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateVAO: function (state, force)
    {
        var vao = state.vao;

        var different = vao !== this.state.vao;

        if (different)
        {
            this.state.vao = vao;
        }
        if (different || force)
        {
            var gl = this.renderer.gl;

            if (vao)
            {
                gl.bindVertexArray(vao.vertexArrayObject);
            }
            else
            {
                gl.bindVertexArray(null);
            }
        }
    },

    /**
     * Updates the viewport state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#updateViewport
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} state - The state to set.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     */
    updateViewport: function (state, force)
    {
        var viewport = state.viewport;
        var x = viewport[0];
        var y = viewport[1];
        var width = viewport[2];
        var height = viewport[3];

        var different = x !== this.state.viewport[0] ||
            y !== this.state.viewport[1] ||
            width !== this.state.viewport[2] ||
            height !== this.state.viewport[3];

        if (different)
        {
            this.state.viewport = [ x, y, width, height ];
        }
        if (different || force)
        {
            this.renderer.gl.viewport(x, y, width, height);
        }
    }
});

module.exports = WebGLGlobalWrapper;
