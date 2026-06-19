var WebGLStencilParametersFactory = require('../../../../src/renderer/webgl/parameters/WebGLStencilParametersFactory');

describe('WebGLStencilParametersFactory', function ()
{
    var mockRenderer;

    beforeEach(function ()
    {
        mockRenderer = {
            gl: {
                ALWAYS: 0x0207,
                EQUAL: 0x0200,
                KEEP: 0x1E00
            }
        };
    });

    describe('create', function ()
    {
        it('should return an object with enabled, func, op, and clear properties', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result).toHaveProperty('enabled');
            expect(result).toHaveProperty('func');
            expect(result).toHaveProperty('op');
            expect(result).toHaveProperty('clear');
        });

        it('should default enabled to true', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result.enabled).toBe(true);
        });

        it('should default func.func to gl.EQUAL', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result.func.func).toBe(mockRenderer.gl.EQUAL);
        });

        it('should default func.ref to 0', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result.func.ref).toBe(0);
        });

        it('should default func.mask to 0xFF', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result.func.mask).toBe(0xFF);
        });

        it('should default op.fail to gl.KEEP', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result.op.fail).toBe(mockRenderer.gl.KEEP);
        });

        it('should default op.zfail to gl.KEEP', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result.op.zfail).toBe(mockRenderer.gl.KEEP);
        });

        it('should default op.zpass to gl.KEEP', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result.op.zpass).toBe(mockRenderer.gl.KEEP);
        });

        it('should default clear to 0', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result.clear).toBe(0);
        });

        it('should use provided enabled value', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, true);

            expect(result.enabled).toBe(true);
        });

        it('should use provided func value', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0201);

            expect(result.func.func).toBe(0x0201);
        });

        it('should use provided funcRef value', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0207, 42);

            expect(result.func.ref).toBe(42);
        });

        it('should use provided funcMask value', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0207, 0, 0x0F);

            expect(result.func.mask).toBe(0x0F);
        });

        it('should use provided opFail value', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0207, 0, 0xFF, 0x1E01);

            expect(result.op.fail).toBe(0x1E01);
        });

        it('should use provided opZfail value', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0207, 0, 0xFF, 0x1E00, 0x1E01);

            expect(result.op.zfail).toBe(0x1E01);
        });

        it('should use provided opZpass value', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0207, 0, 0xFF, 0x1E00, 0x1E00, 0x1E01);

            expect(result.op.zpass).toBe(0x1E01);
        });

        it('should use provided clear value', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0207, 0, 0xFF, 0x1E00, 0x1E00, 0x1E00, 255);

            expect(result.clear).toBe(255);
        });

        it('should create func as a nested object with func, ref, and mask', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, true, 0x0202, 1, 0x0F);

            expect(result.func.func).toBe(0x0202);
            expect(result.func.ref).toBe(1);
            expect(result.func.mask).toBe(0x0F);
        });

        it('should create op as a nested object with fail, zfail, and zpass', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, true, 0x0207, 0, 0xFF, 0x1E01, 0x1E02, 0x1E03);

            expect(result.op.fail).toBe(0x1E01);
            expect(result.op.zfail).toBe(0x1E02);
            expect(result.op.zpass).toBe(0x1E03);
        });

        it('should return a new object on each call', function ()
        {
            var result1 = WebGLStencilParametersFactory.create(mockRenderer);
            var result2 = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result1).not.toBe(result2);
        });

        it('should not share func sub-objects between calls', function ()
        {
            var result1 = WebGLStencilParametersFactory.create(mockRenderer);
            var result2 = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result1.func).not.toBe(result2.func);
        });

        it('should not share op sub-objects between calls', function ()
        {
            var result1 = WebGLStencilParametersFactory.create(mockRenderer);
            var result2 = WebGLStencilParametersFactory.create(mockRenderer);

            expect(result1.op).not.toBe(result2.op);
        });

        it('should handle funcRef of zero explicitly', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0207, 0);

            expect(result.func.ref).toBe(0);
        });

        it('should handle clear of zero explicitly', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false, 0x0207, 0, 0xFF, 0x1E00, 0x1E00, 0x1E00, 0);

            expect(result.clear).toBe(0);
        });

        it('should handle enabled as false explicitly', function ()
        {
            var result = WebGLStencilParametersFactory.create(mockRenderer, false);

            expect(result.enabled).toBe(false);
        });
    });
});
