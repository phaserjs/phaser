var WebGLGlobalParametersFactory = require('../../../../src/renderer/webgl/parameters/WebGLGlobalParametersFactory');

describe('WebGLGlobalParametersFactory', function ()
{
    var mockRenderer;
    var mockBlendMode;

    beforeEach(function ()
    {
        mockBlendMode = {
            equation: 32774,
            srcRGB: 1,
            dstRGB: 771,
            srcAlpha: 1,
            dstAlpha: 771
        };

        mockRenderer = {
            blendModes: [ mockBlendMode ],
            gl: {
                ALWAYS: 519,
                KEEP: 7680
            }
        };
    });

    describe('getDefault', function ()
    {
        it('should return an object', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
        });

        it('should return an object with all expected top-level properties', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result).toHaveProperty('bindings');
            expect(result).toHaveProperty('blend');
            expect(result).toHaveProperty('colorClearValue');
            expect(result).toHaveProperty('colorWritemask');
            expect(result).toHaveProperty('cullFace');
            expect(result).toHaveProperty('depthTest');
            expect(result).toHaveProperty('scissor');
            expect(result).toHaveProperty('stencil');
            expect(result).toHaveProperty('texturing');
            expect(result).toHaveProperty('vao');
            expect(result).toHaveProperty('viewport');
        });

        it('should set bindings.activeTexture to 0', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.bindings.activeTexture).toBe(0);
        });

        it('should set bindings.arrayBuffer to null', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.bindings.arrayBuffer).toBeNull();
        });

        it('should set bindings.elementArrayBuffer to null', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.bindings.elementArrayBuffer).toBeNull();
        });

        it('should set bindings.framebuffer to null', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.bindings.framebuffer).toBeNull();
        });

        it('should set bindings.program to null', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.bindings.program).toBeNull();
        });

        it('should set bindings.renderbuffer to null', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.bindings.renderbuffer).toBeNull();
        });

        it('should set blend to a deep copy of the NORMAL blend mode', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.blend).toEqual(mockBlendMode);
        });

        it('should set blend to a new object, not the same reference', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.blend).not.toBe(mockBlendMode);
        });

        it('should not share the blend reference across multiple calls', function ()
        {
            var result1 = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            var result2 = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result1.blend).not.toBe(result2.blend);
        });

        it('should set colorClearValue to [ 0, 0, 0, 1 ]', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.colorClearValue).toEqual([ 0, 0, 0, 1 ]);
        });

        it('should set colorWritemask to [ true, true, true, true ]', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.colorWritemask).toEqual([ true, true, true, true ]);
        });

        it('should set cullFace to false', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.cullFace).toBe(false);
        });

        it('should set depthTest to false', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.depthTest).toBe(false);
        });

        it('should set scissor.enable to true', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.scissor.enable).toBe(true);
        });

        it('should set scissor.box to [ 0, 0, 0, 0 ]', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.scissor.box).toEqual([ 0, 0, 0, 0 ]);
        });

        it('should set stencil.enabled to true', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.stencil.enabled).toBe(true);
        });

        it('should set stencil.func.ref to 0', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.stencil.func.ref).toBe(0);
        });

        it('should set stencil.func.mask to 0xFF', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.stencil.func.mask).toBe(0xFF);
        });

        it('should set stencil.clear to 0', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.stencil.clear).toBe(0);
        });

        it('should set texturing.flipY to false', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.texturing.flipY).toBe(false);
        });

        it('should set texturing.premultiplyAlpha to false', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.texturing.premultiplyAlpha).toBe(false);
        });

        it('should set vao to null', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.vao).toBeNull();
        });

        it('should set viewport to [ 0, 0, 0, 0 ]', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.viewport).toEqual([ 0, 0, 0, 0 ]);
        });

        it('should reflect changes to renderer blend mode in the copy at call time', function ()
        {
            mockRenderer.blendModes[0] = { equation: 9999, srcRGB: 2, dstRGB: 3, srcAlpha: 4, dstAlpha: 5 };
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            expect(result.blend.equation).toBe(9999);
        });

        it('should not reflect post-call mutations to renderer blend mode', function ()
        {
            var result = WebGLGlobalParametersFactory.getDefault(mockRenderer);
            mockBlendMode.equation = 9999;
            expect(result.blend.equation).toBe(32774);
        });
    });
});
