var WebGLGlobalWrapper = require('../../../../src/renderer/webgl/wrappers/WebGLGlobalWrapper');

function createMockGl ()
{
    return {
        TEXTURE0: 0x84C0,
        ARRAY_BUFFER: 0x8892,
        ELEMENT_ARRAY_BUFFER: 0x8893,
        FRAMEBUFFER: 0x8D40,
        RENDERBUFFER: 0x8D41,
        BLEND: 0x0BE2,
        CULL_FACE: 0x0B44,
        DEPTH_TEST: 0x0B71,
        SCISSOR_TEST: 0x0C11,
        STENCIL_TEST: 0x0B90,
        UNPACK_FLIP_Y_WEBGL: 0x9240,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
        ALWAYS: 0x0207,
        KEEP: 0x1E00,
        activeTexture: vi.fn(),
        bindBuffer: vi.fn(),
        bindFramebuffer: vi.fn(),
        bindRenderbuffer: vi.fn(),
        useProgram: vi.fn(),
        blendColor: vi.fn(),
        blendEquationSeparate: vi.fn(),
        blendFuncSeparate: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
        clearColor: vi.fn(),
        colorMask: vi.fn(),
        clearStencil: vi.fn(),
        stencilFunc: vi.fn(),
        stencilOp: vi.fn(),
        stencilMask: vi.fn(),
        pixelStorei: vi.fn(),
        bindVertexArray: vi.fn(),
        viewport: vi.fn(),
        scissor: vi.fn()
    };
}

function createMockRenderer ()
{
    var gl = createMockGl();
    return {
        gl: gl,
        blendModes: [
            // index 0 = NORMAL blend mode
            {
                enabled: true,
                color: [ 0, 0, 0, 0 ],
                equation: [ 0x8006, 0x8006 ],
                func: [ 0x0302, 0x0303, 1, 0x0303 ]
            }
        ]
    };
}

describe('WebGLGlobalWrapper', function ()
{
    var renderer;
    var wrapper;

    beforeEach(function ()
    {
        renderer = createMockRenderer();
        wrapper = new WebGLGlobalWrapper(renderer);
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should store the renderer reference', function ()
        {
            expect(wrapper.renderer).toBe(renderer);
        });

        it('should initialise state from the factory', function ()
        {
            expect(wrapper.state).toBeDefined();
            expect(wrapper.state.bindings).toBeDefined();
            expect(wrapper.state.blend).toBeDefined();
            expect(wrapper.state.viewport).toBeDefined();
        });

        it('should initialise bindings to null by default', function ()
        {
            expect(wrapper.state.bindings.arrayBuffer).toBeNull();
            expect(wrapper.state.bindings.framebuffer).toBeNull();
            expect(wrapper.state.bindings.program).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // update
    // -------------------------------------------------------------------------

    describe('update', function ()
    {
        it('should do nothing when called with no arguments and force is false', function ()
        {
            wrapper.update();
            expect(renderer.gl.viewport).not.toHaveBeenCalled();
            expect(renderer.gl.clearColor).not.toHaveBeenCalled();
        });

        it('should reset all current state when called with no state and force is true', function ()
        {
            wrapper.state.viewport = [ 0, 0, 800, 600 ];
            wrapper.update(undefined, true);
            expect(renderer.gl.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
        });

        it('should call updateVAO first by default (vaoLast=false)', function ()
        {
            var callOrder = [];
            renderer.gl.bindVertexArray = vi.fn(function () { callOrder.push('vao'); });
            renderer.gl.viewport = vi.fn(function () { callOrder.push('viewport'); });

            var mockVao = { vertexArrayObject: {} };
            wrapper.update({ vao: mockVao, viewport: [ 10, 20, 100, 200 ] }, true);

            expect(callOrder[0]).toBe('vao');
            expect(callOrder[callOrder.length - 1]).toBe('viewport');
        });

        it('should call updateVAO last when vaoLast is true', function ()
        {
            var callOrder = [];
            renderer.gl.bindVertexArray = vi.fn(function () { callOrder.push('vao'); });
            renderer.gl.viewport = vi.fn(function () { callOrder.push('viewport'); });

            var mockVao = { vertexArrayObject: {} };
            wrapper.update({ vao: mockVao, viewport: [ 10, 20, 100, 200 ] }, true, true);

            expect(callOrder[0]).toBe('viewport');
            expect(callOrder[callOrder.length - 1]).toBe('vao');
        });

        it('should only call methods for properties present in state', function ()
        {
            wrapper.update({ viewport: [ 1, 2, 3, 4 ] }, true);
            expect(renderer.gl.viewport).toHaveBeenCalled();
            expect(renderer.gl.clearColor).not.toHaveBeenCalled();
            expect(renderer.gl.colorMask).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // updateBindingsActiveTexture
    // -------------------------------------------------------------------------

    describe('updateBindingsActiveTexture', function ()
    {
        it('should call gl.activeTexture with TEXTURE0 offset when value changes', function ()
        {
            var gl = renderer.gl;
            wrapper.updateBindingsActiveTexture({ bindings: { activeTexture: 2 } });
            expect(gl.activeTexture).toHaveBeenCalledWith(gl.TEXTURE0 + 2);
        });

        it('should update state.bindings.activeTexture when value changes', function ()
        {
            wrapper.updateBindingsActiveTexture({ bindings: { activeTexture: 3 } });
            expect(wrapper.state.bindings.activeTexture).toBe(3);
        });

        it('should not call gl.activeTexture when value is unchanged', function ()
        {
            wrapper.state.bindings.activeTexture = 5;
            wrapper.updateBindingsActiveTexture({ bindings: { activeTexture: 5 } });
            expect(renderer.gl.activeTexture).not.toHaveBeenCalled();
        });

        it('should call gl.activeTexture when force is true even if value is unchanged', function ()
        {
            var gl = renderer.gl;
            wrapper.state.bindings.activeTexture = 5;
            wrapper.updateBindingsActiveTexture({ bindings: { activeTexture: 5 } }, true);
            expect(gl.activeTexture).toHaveBeenCalledWith(gl.TEXTURE0 + 5);
        });
    });

    // -------------------------------------------------------------------------
    // updateBindingsArrayBuffer
    // -------------------------------------------------------------------------

    describe('updateBindingsArrayBuffer', function ()
    {
        it('should throw when given a buffer with wrong bufferType', function ()
        {
            var gl = renderer.gl;
            var badBuffer = { bufferType: gl.ELEMENT_ARRAY_BUFFER, webGLBuffer: {} };
            expect(function ()
            {
                wrapper.updateBindingsArrayBuffer({ bindings: { arrayBuffer: badBuffer } });
            }).toThrow('Invalid buffer type for ARRAY_BUFFER');
        });

        it('should bind null when arrayBuffer is null', function ()
        {
            var gl = renderer.gl;
            // Set current to something non-null so it's "different"
            wrapper.state.bindings.arrayBuffer = { bufferType: gl.ARRAY_BUFFER, webGLBuffer: {} };
            wrapper.updateBindingsArrayBuffer({ bindings: { arrayBuffer: null } });
            expect(gl.bindBuffer).toHaveBeenCalledWith(gl.ARRAY_BUFFER, null);
        });

        it('should bind the webGLBuffer when arrayBuffer is a valid buffer', function ()
        {
            var gl = renderer.gl;
            var buf = { bufferType: gl.ARRAY_BUFFER, webGLBuffer: { id: 42 } };
            wrapper.updateBindingsArrayBuffer({ bindings: { arrayBuffer: buf } });
            expect(gl.bindBuffer).toHaveBeenCalledWith(gl.ARRAY_BUFFER, buf.webGLBuffer);
            expect(wrapper.state.bindings.arrayBuffer).toBe(buf);
        });
    });

    // -------------------------------------------------------------------------
    // updateBindingsFramebuffer
    // -------------------------------------------------------------------------

    describe('updateBindingsFramebuffer', function ()
    {
        it('should bind null when framebuffer is null', function ()
        {
            var gl = renderer.gl;
            var fb = { webGLFramebuffer: {} };
            wrapper.state.bindings.framebuffer = fb;
            wrapper.updateBindingsFramebuffer({ bindings: { framebuffer: null } });
            expect(gl.bindFramebuffer).toHaveBeenCalledWith(gl.FRAMEBUFFER, null);
        });

        it('should bind webGLFramebuffer when framebuffer changes', function ()
        {
            var gl = renderer.gl;
            var fb = { webGLFramebuffer: { id: 7 } };
            wrapper.updateBindingsFramebuffer({ bindings: { framebuffer: fb } });
            expect(gl.bindFramebuffer).toHaveBeenCalledWith(gl.FRAMEBUFFER, fb.webGLFramebuffer);
        });
    });

    // -------------------------------------------------------------------------
    // updateBindingsProgram
    // -------------------------------------------------------------------------

    describe('updateBindingsProgram', function ()
    {
        it('should call gl.useProgram with null when program is null', function ()
        {
            var prog = { webGLProgram: {} };
            wrapper.state.bindings.program = prog;
            wrapper.updateBindingsProgram({ bindings: { program: null } });
            expect(renderer.gl.useProgram).toHaveBeenCalledWith(null);
        });

        it('should call gl.useProgram with the webGLProgram object', function ()
        {
            var prog = { webGLProgram: { id: 3 } };
            wrapper.updateBindingsProgram({ bindings: { program: prog } });
            expect(renderer.gl.useProgram).toHaveBeenCalledWith(prog.webGLProgram);
        });
    });

    // -------------------------------------------------------------------------
    // updateBlendEnabled
    // -------------------------------------------------------------------------

    describe('updateBlendEnabled', function ()
    {
        it('should call gl.disable(BLEND) when blend is disabled', function ()
        {
            var gl = renderer.gl;
            // Default state has enabled=true, so false is different
            wrapper.updateBlendEnabled({ blend: { enabled: false } });
            expect(gl.disable).toHaveBeenCalledWith(gl.BLEND);
            expect(wrapper.state.blend.enabled).toBe(false);
        });

        it('should call gl.enable(BLEND) when blend is enabled', function ()
        {
            var gl = renderer.gl;
            wrapper.state.blend.enabled = false;
            wrapper.updateBlendEnabled({ blend: { enabled: true } });
            expect(gl.enable).toHaveBeenCalledWith(gl.BLEND);
            expect(wrapper.state.blend.enabled).toBe(true);
        });

        it('should not call gl when value is unchanged and force is false', function ()
        {
            var gl = renderer.gl;
            wrapper.state.blend.enabled = true;
            wrapper.updateBlendEnabled({ blend: { enabled: true } });
            expect(gl.enable).not.toHaveBeenCalled();
            expect(gl.disable).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // updateBlendColor
    // -------------------------------------------------------------------------

    describe('updateBlendColor', function ()
    {
        it('should call gl.blendColor and update state when color changes', function ()
        {
            var gl = renderer.gl;
            wrapper.updateBlendColor({ blend: { color: [ 0.5, 0.25, 0.1, 1.0 ] } });
            expect(gl.blendColor).toHaveBeenCalledWith(0.5, 0.25, 0.1, 1.0);
            expect(wrapper.state.blend.color).toEqual([ 0.5, 0.25, 0.1, 1.0 ]);
        });

        it('should not call gl.blendColor when color is unchanged', function ()
        {
            wrapper.state.blend.color = [ 1, 0, 0, 1 ];
            wrapper.updateBlendColor({ blend: { color: [ 1, 0, 0, 1 ] } });
            expect(renderer.gl.blendColor).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // updateColorClearValue
    // -------------------------------------------------------------------------

    describe('updateColorClearValue', function ()
    {
        it('should call gl.clearColor and update state when value changes', function ()
        {
            var gl = renderer.gl;
            wrapper.updateColorClearValue({ colorClearValue: [ 0.1, 0.2, 0.3, 1.0 ] });
            expect(gl.clearColor).toHaveBeenCalledWith(0.1, 0.2, 0.3, 1.0);
            expect(wrapper.state.colorClearValue).toEqual([ 0.1, 0.2, 0.3, 1.0 ]);
        });

        it('should not call gl.clearColor when value is unchanged', function ()
        {
            wrapper.state.colorClearValue = [ 0, 0, 0, 1 ];
            wrapper.updateColorClearValue({ colorClearValue: [ 0, 0, 0, 1 ] });
            expect(renderer.gl.clearColor).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // updateCullFace
    // -------------------------------------------------------------------------

    describe('updateCullFace', function ()
    {
        it('should coerce truthy value to true and enable CULL_FACE', function ()
        {
            var gl = renderer.gl;
            wrapper.updateCullFace({ cullFace: 1 });
            expect(gl.enable).toHaveBeenCalledWith(gl.CULL_FACE);
            expect(wrapper.state.cullFace).toBe(true);
        });

        it('should coerce falsy value to false and disable CULL_FACE', function ()
        {
            var gl = renderer.gl;
            wrapper.state.cullFace = true;
            wrapper.updateCullFace({ cullFace: 0 });
            expect(gl.disable).toHaveBeenCalledWith(gl.CULL_FACE);
            expect(wrapper.state.cullFace).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // updateDepthTest
    // -------------------------------------------------------------------------

    describe('updateDepthTest', function ()
    {
        it('should enable DEPTH_TEST when depthTest is truthy', function ()
        {
            var gl = renderer.gl;
            wrapper.updateDepthTest({ depthTest: true });
            expect(gl.enable).toHaveBeenCalledWith(gl.DEPTH_TEST);
        });

        it('should disable DEPTH_TEST when depthTest is falsy', function ()
        {
            var gl = renderer.gl;
            wrapper.state.depthTest = true;
            wrapper.updateDepthTest({ depthTest: false });
            expect(gl.disable).toHaveBeenCalledWith(gl.DEPTH_TEST);
        });
    });

    // -------------------------------------------------------------------------
    // updateScissorEnabled / updateScissorBox
    // -------------------------------------------------------------------------

    describe('updateScissorEnabled', function ()
    {
        it('should call gl.disable(SCISSOR_TEST) when enable becomes false', function ()
        {
            var gl = renderer.gl;
            // Default state has scissor.enable=true
            wrapper.updateScissorEnabled({ scissor: { enable: false } });
            expect(gl.disable).toHaveBeenCalledWith(gl.SCISSOR_TEST);
            expect(wrapper.state.scissor.enable).toBe(false);
        });

        it('should call gl.enable(SCISSOR_TEST) when enable becomes true', function ()
        {
            var gl = renderer.gl;
            wrapper.state.scissor.enable = false;
            wrapper.updateScissorEnabled({ scissor: { enable: true } });
            expect(gl.enable).toHaveBeenCalledWith(gl.SCISSOR_TEST);
        });
    });

    describe('updateScissorBox', function ()
    {
        it('should call gl.scissor and update state when box changes', function ()
        {
            var gl = renderer.gl;
            wrapper.updateScissorBox({ scissor: { box: [ 10, 20, 300, 400 ] } });
            expect(gl.scissor).toHaveBeenCalledWith(10, 20, 300, 400);
            expect(wrapper.state.scissor.box).toEqual([ 10, 20, 300, 400 ]);
        });

        it('should not call gl.scissor when box is unchanged', function ()
        {
            wrapper.state.scissor.box = [ 5, 5, 100, 100 ];
            wrapper.updateScissorBox({ scissor: { box: [ 5, 5, 100, 100 ] } });
            expect(renderer.gl.scissor).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // updateStencilEnabled / updateStencilFunc / updateStencilOp
    // -------------------------------------------------------------------------

    describe('updateStencilEnabled', function ()
    {
        it('should enable STENCIL_TEST when enabled changes to true', function ()
        {
            var gl = renderer.gl;
            wrapper.state.stencil.enabled = false;
            wrapper.updateStencilEnabled({ stencil: { enabled: true } });
            expect(gl.enable).toHaveBeenCalledWith(gl.STENCIL_TEST);
            expect(wrapper.state.stencil.enabled).toBe(true);
        });

        it('should disable STENCIL_TEST when enabled changes to false', function ()
        {
            var gl = renderer.gl;
            wrapper.state.stencil.enabled = true;
            wrapper.updateStencilEnabled({ stencil: { enabled: false } });
            expect(gl.disable).toHaveBeenCalledWith(gl.STENCIL_TEST);
            expect(wrapper.state.stencil.enabled).toBe(false);
        });
    });

    describe('updateStencilFunc', function ()
    {
        it('should call gl.stencilFunc and update state when func changes', function ()
        {
            var gl = renderer.gl;
            var func = { func: 0x0202, ref: 1, mask: 0xFF };
            wrapper.updateStencilFunc({ stencil: { func: func } });
            expect(gl.stencilFunc).toHaveBeenCalledWith(0x0202, 1, 0xFF);
            expect(wrapper.state.stencil.func).toEqual({ func: 0x0202, ref: 1, mask: 0xFF });
        });

        it('should not call gl.stencilFunc when func is unchanged', function ()
        {
            wrapper.state.stencil.func = { func: 0x0202, ref: 1, mask: 0xFF };
            wrapper.updateStencilFunc({ stencil: { func: { func: 0x0202, ref: 1, mask: 0xFF } } });
            expect(renderer.gl.stencilFunc).not.toHaveBeenCalled();
        });
    });

    describe('updateStencilOp', function ()
    {
        it('should call gl.stencilOp and update state when op changes', function ()
        {
            var gl = renderer.gl;
            var op = { fail: 0x1E01, zfail: 0x1E02, zpass: 0x1E03 };
            wrapper.updateStencilOp({ stencil: { op: op } });
            expect(gl.stencilOp).toHaveBeenCalledWith(0x1E01, 0x1E02, 0x1E03);
            expect(wrapper.state.stencil.op).toEqual(op);
        });
    });

    // -------------------------------------------------------------------------
    // updateTexturingFlipY / updateTexturingPremultiplyAlpha
    // -------------------------------------------------------------------------

    describe('updateTexturingFlipY', function ()
    {
        it('should call gl.pixelStorei with UNPACK_FLIP_Y_WEBGL when flipY changes', function ()
        {
            var gl = renderer.gl;
            wrapper.updateTexturingFlipY({ texturing: { flipY: true } });
            expect(gl.pixelStorei).toHaveBeenCalledWith(gl.UNPACK_FLIP_Y_WEBGL, true);
            expect(wrapper.state.texturing.flipY).toBe(true);
        });

        it('should not call gl.pixelStorei when flipY is unchanged', function ()
        {
            wrapper.state.texturing.flipY = true;
            wrapper.updateTexturingFlipY({ texturing: { flipY: true } });
            expect(renderer.gl.pixelStorei).not.toHaveBeenCalled();
        });
    });

    describe('updateTexturingPremultiplyAlpha', function ()
    {
        it('should call gl.pixelStorei with UNPACK_PREMULTIPLY_ALPHA_WEBGL when value changes', function ()
        {
            var gl = renderer.gl;
            wrapper.updateTexturingPremultiplyAlpha({ texturing: { premultiplyAlpha: true } });
            expect(gl.pixelStorei).toHaveBeenCalledWith(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            expect(wrapper.state.texturing.premultiplyAlpha).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // updateVAO
    // -------------------------------------------------------------------------

    describe('updateVAO', function ()
    {
        it('should call gl.bindVertexArray(null) when vao is null and state differs', function ()
        {
            var gl = renderer.gl;
            var fakeVao = { vertexArrayObject: {} };
            wrapper.state.vao = fakeVao;
            wrapper.updateVAO({ vao: null });
            expect(gl.bindVertexArray).toHaveBeenCalledWith(null);
            expect(wrapper.state.vao).toBeNull();
        });

        it('should call gl.bindVertexArray with vertexArrayObject when vao changes', function ()
        {
            var gl = renderer.gl;
            var vaoObj = { id: 99 };
            var vao = { vertexArrayObject: vaoObj };
            wrapper.updateVAO({ vao: vao });
            expect(gl.bindVertexArray).toHaveBeenCalledWith(vaoObj);
            expect(wrapper.state.vao).toBe(vao);
        });

        it('should not call gl.bindVertexArray when vao is unchanged and force is false', function ()
        {
            var gl = renderer.gl;
            var vao = { vertexArrayObject: {} };
            wrapper.state.vao = vao;
            wrapper.updateVAO({ vao: vao });
            expect(gl.bindVertexArray).not.toHaveBeenCalled();
        });

        it('should call gl.bindVertexArray when force is true even if vao is unchanged', function ()
        {
            var gl = renderer.gl;
            var vao = { vertexArrayObject: { id: 5 } };
            wrapper.state.vao = vao;
            wrapper.updateVAO({ vao: vao }, true);
            expect(gl.bindVertexArray).toHaveBeenCalledWith(vao.vertexArrayObject);
        });
    });

    // -------------------------------------------------------------------------
    // updateViewport
    // -------------------------------------------------------------------------

    describe('updateViewport', function ()
    {
        it('should call gl.viewport and update state when values change', function ()
        {
            var gl = renderer.gl;
            wrapper.updateViewport({ viewport: [ 0, 0, 800, 600 ] });
            expect(gl.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
            expect(wrapper.state.viewport).toEqual([ 0, 0, 800, 600 ]);
        });

        it('should not call gl.viewport when values are unchanged', function ()
        {
            wrapper.state.viewport = [ 0, 0, 800, 600 ];
            wrapper.updateViewport({ viewport: [ 0, 0, 800, 600 ] });
            expect(renderer.gl.viewport).not.toHaveBeenCalled();
        });

        it('should call gl.viewport when force is true even if values are unchanged', function ()
        {
            var gl = renderer.gl;
            wrapper.state.viewport = [ 0, 0, 800, 600 ];
            wrapper.updateViewport({ viewport: [ 0, 0, 800, 600 ] }, true);
            expect(gl.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
        });

        it('should detect change in any single viewport component', function ()
        {
            var gl = renderer.gl;
            wrapper.state.viewport = [ 0, 0, 800, 600 ];
            wrapper.updateViewport({ viewport: [ 0, 0, 800, 601 ] });
            expect(gl.viewport).toHaveBeenCalledWith(0, 0, 800, 601);
        });
    });
});
