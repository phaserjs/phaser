var WebGLBlendParametersFactory = require('../../../../src/renderer/webgl/parameters/WebGLBlendParametersFactory');

describe('WebGLBlendParametersFactory', function ()
{
    var mockRenderer;

    beforeEach(function ()
    {
        mockRenderer = {
            gl: {
                FUNC_ADD: 32774,
                ONE: 1,
                ONE_MINUS_SRC_ALPHA: 771,
                FUNC_SUBTRACT: 32778,
                FUNC_REVERSE_SUBTRACT: 32779,
                ZERO: 0,
                SRC_ALPHA: 770,
                DST_ALPHA: 772
            }
        };
    });

    describe('createCombined', function ()
    {
        it('should return an object with default values when no optional args are given', function ()
        {
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer);

            expect(result.enabled).toBe(true);
            expect(result.color).toEqual([ 0, 0, 0, 0 ]);
            expect(result.equation).toEqual([ 32774, 32774 ]);
            expect(result.func).toEqual([ 1, 771, 1, 771 ]);
        });

        it('should set enabled to false when passed false', function ()
        {
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer, false);

            expect(result.enabled).toBe(false);
        });

        it('should use the provided color array', function ()
        {
            var color = [ 0.5, 0.25, 0.1, 1.0 ];
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer, true, color);

            expect(result.color).toBe(color);
            expect(result.color).toEqual([ 0.5, 0.25, 0.1, 1.0 ]);
        });

        it('should apply the same equation to both RGB and alpha channels', function ()
        {
            var gl = mockRenderer.gl;
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer, true, undefined, gl.FUNC_SUBTRACT);

            expect(result.equation[0]).toBe(gl.FUNC_SUBTRACT);
            expect(result.equation[1]).toBe(gl.FUNC_SUBTRACT);
        });

        it('should apply funcSrc to both RGB and alpha source slots', function ()
        {
            var gl = mockRenderer.gl;
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer, true, undefined, undefined, gl.SRC_ALPHA);

            expect(result.func[0]).toBe(gl.SRC_ALPHA);
            expect(result.func[2]).toBe(gl.SRC_ALPHA);
        });

        it('should apply funcDst to both RGB and alpha destination slots', function ()
        {
            var gl = mockRenderer.gl;
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer, true, undefined, undefined, undefined, gl.DST_ALPHA);

            expect(result.func[1]).toBe(gl.DST_ALPHA);
            expect(result.func[3]).toBe(gl.DST_ALPHA);
        });

        it('should return equation as a 2-element array', function ()
        {
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer);

            expect(Array.isArray(result.equation)).toBe(true);
            expect(result.equation.length).toBe(2);
        });

        it('should return func as a 4-element array', function ()
        {
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer);

            expect(Array.isArray(result.func)).toBe(true);
            expect(result.func.length).toBe(4);
        });

        it('should accept all custom values', function ()
        {
            var gl = mockRenderer.gl;
            var color = [ 1, 0, 0, 1 ];
            var result = WebGLBlendParametersFactory.createCombined(
                mockRenderer,
                false,
                color,
                gl.FUNC_REVERSE_SUBTRACT,
                gl.SRC_ALPHA,
                gl.DST_ALPHA
            );

            expect(result.enabled).toBe(false);
            expect(result.color).toBe(color);
            expect(result.equation).toEqual([ gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_REVERSE_SUBTRACT ]);
            expect(result.func).toEqual([ gl.SRC_ALPHA, gl.DST_ALPHA, gl.SRC_ALPHA, gl.DST_ALPHA ]);
        });

        it('should use gl.ZERO when passed as funcSrc', function ()
        {
            var gl = mockRenderer.gl;
            var result = WebGLBlendParametersFactory.createCombined(mockRenderer, true, undefined, undefined, gl.ZERO);

            expect(result.func[0]).toBe(gl.ZERO);
            expect(result.func[2]).toBe(gl.ZERO);
        });
    });

    describe('createSeparate', function ()
    {
        it('should return an object with default values when no optional args are given', function ()
        {
            var result = WebGLBlendParametersFactory.createSeparate(mockRenderer);

            expect(result.enabled).toBe(true);
            expect(result.color).toEqual([ 0, 0, 0, 0 ]);
            expect(result.equation).toEqual([ 32774, 32774 ]);
            expect(result.func).toEqual([ 1, 771, 1, 771 ]);
        });

        it('should set enabled to false when passed false', function ()
        {
            var result = WebGLBlendParametersFactory.createSeparate(mockRenderer, false);

            expect(result.enabled).toBe(false);
        });

        it('should use the provided color array', function ()
        {
            var color = [ 0.2, 0.4, 0.6, 0.8 ];
            var result = WebGLBlendParametersFactory.createSeparate(mockRenderer, true, color);

            expect(result.color).toBe(color);
            expect(result.color).toEqual([ 0.2, 0.4, 0.6, 0.8 ]);
        });

        it('should store equationRGB at index 0 and equationAlpha at index 1', function ()
        {
            var gl = mockRenderer.gl;
            var result = WebGLBlendParametersFactory.createSeparate(
                mockRenderer, true, undefined, gl.FUNC_SUBTRACT, gl.FUNC_REVERSE_SUBTRACT
            );

            expect(result.equation[0]).toBe(gl.FUNC_SUBTRACT);
            expect(result.equation[1]).toBe(gl.FUNC_REVERSE_SUBTRACT);
        });

        it('should allow different RGB and alpha equations', function ()
        {
            var gl = mockRenderer.gl;
            var result = WebGLBlendParametersFactory.createSeparate(
                mockRenderer, true, undefined, gl.FUNC_ADD, gl.FUNC_SUBTRACT
            );

            expect(result.equation[0]).toBe(gl.FUNC_ADD);
            expect(result.equation[1]).toBe(gl.FUNC_SUBTRACT);
        });

        it('should store func values in correct order: [srcRGB, dstRGB, srcAlpha, dstAlpha]', function ()
        {
            var gl = mockRenderer.gl;
            var result = WebGLBlendParametersFactory.createSeparate(
                mockRenderer,
                true,
                undefined,
                undefined,
                undefined,
                gl.SRC_ALPHA,
                gl.DST_ALPHA,
                gl.ONE,
                gl.ZERO
            );

            expect(result.func[0]).toBe(gl.SRC_ALPHA);
            expect(result.func[1]).toBe(gl.DST_ALPHA);
            expect(result.func[2]).toBe(gl.ONE);
            expect(result.func[3]).toBe(gl.ZERO);
        });

        it('should allow different RGB and alpha blend functions', function ()
        {
            var gl = mockRenderer.gl;
            var result = WebGLBlendParametersFactory.createSeparate(
                mockRenderer,
                true,
                undefined,
                undefined,
                undefined,
                gl.SRC_ALPHA,
                gl.ONE_MINUS_SRC_ALPHA,
                gl.ONE,
                gl.ZERO
            );

            expect(result.func[0]).toBe(gl.SRC_ALPHA);
            expect(result.func[1]).toBe(gl.ONE_MINUS_SRC_ALPHA);
            expect(result.func[2]).toBe(gl.ONE);
            expect(result.func[3]).toBe(gl.ZERO);
        });

        it('should return equation as a 2-element array', function ()
        {
            var result = WebGLBlendParametersFactory.createSeparate(mockRenderer);

            expect(Array.isArray(result.equation)).toBe(true);
            expect(result.equation.length).toBe(2);
        });

        it('should return func as a 4-element array', function ()
        {
            var result = WebGLBlendParametersFactory.createSeparate(mockRenderer);

            expect(Array.isArray(result.func)).toBe(true);
            expect(result.func.length).toBe(4);
        });

        it('should accept all custom values', function ()
        {
            var gl = mockRenderer.gl;
            var color = [ 0, 1, 0, 1 ];
            var result = WebGLBlendParametersFactory.createSeparate(
                mockRenderer,
                false,
                color,
                gl.FUNC_SUBTRACT,
                gl.FUNC_REVERSE_SUBTRACT,
                gl.SRC_ALPHA,
                gl.DST_ALPHA,
                gl.ONE,
                gl.ZERO
            );

            expect(result.enabled).toBe(false);
            expect(result.color).toBe(color);
            expect(result.equation).toEqual([ gl.FUNC_SUBTRACT, gl.FUNC_REVERSE_SUBTRACT ]);
            expect(result.func).toEqual([ gl.SRC_ALPHA, gl.DST_ALPHA, gl.ONE, gl.ZERO ]);
        });

        it('should produce different results from createCombined when separate equations differ', function ()
        {
            var gl = mockRenderer.gl;
            var combined = WebGLBlendParametersFactory.createCombined(
                mockRenderer, true, undefined, gl.FUNC_ADD
            );
            var separate = WebGLBlendParametersFactory.createSeparate(
                mockRenderer, true, undefined, gl.FUNC_ADD, gl.FUNC_SUBTRACT
            );

            expect(combined.equation[0]).toBe(combined.equation[1]);
            expect(separate.equation[0]).not.toBe(separate.equation[1]);
        });
    });
});
