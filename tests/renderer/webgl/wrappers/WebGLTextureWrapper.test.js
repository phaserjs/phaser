var WebGLTextureWrapper = require('../../../../src/renderer/webgl/wrappers/WebGLTextureWrapper');

function makeMockGl (overrides)
{
    var gl = {
        isContextLost: vi.fn().mockReturnValue(false),
        createTexture: vi.fn().mockReturnValue({ __SPECTOR_Metadata: {} }),
        deleteTexture: vi.fn(),
        texParameteri: vi.fn(),
        texImage2D: vi.fn(),
        compressedTexImage2D: vi.fn(),
        generateMipmap: vi.fn(),
        TEXTURE_2D: 3553,
        TEXTURE_MIN_FILTER: 10241,
        TEXTURE_MAG_FILTER: 10240,
        TEXTURE_WRAP_S: 10242,
        TEXTURE_WRAP_T: 10243,
        UNSIGNED_BYTE: 5121,
        REPEAT: 10497,
        CLAMP_TO_EDGE: 33071,
        LINEAR: 9729,
        NEAREST: 9728,
        RGBA: 6408
    };

    if (overrides)
    {
        Object.assign(gl, overrides);
    }

    return gl;
}

function makeMockRenderer (glOverrides)
{
    var gl = makeMockGl(glOverrides);

    return {
        config: {
            antialias: true
        },
        gl: gl,
        glTextureUnits: {
            bind: vi.fn()
        },
        glWrapper: {
            updateTexturing: vi.fn()
        }
    };
}

function makeWrapper (options)
{
    options = options || {};

    var renderer = options.renderer || makeMockRenderer();
    var mipLevel = options.mipLevel !== undefined ? options.mipLevel : 0;
    var minFilter = options.minFilter !== undefined ? options.minFilter : 9729;
    var magFilter = options.magFilter !== undefined ? options.magFilter : 9729;
    var wrapT = options.wrapT !== undefined ? options.wrapT : 33071;
    var wrapS = options.wrapS !== undefined ? options.wrapS : 33071;
    var format = options.format !== undefined ? options.format : 6408;
    var pixels = options.pixels !== undefined ? options.pixels : null;
    var width = options.width !== undefined ? options.width : 256;
    var height = options.height !== undefined ? options.height : 256;
    var pma = options.pma !== undefined ? options.pma : true;
    var forceSize = options.forceSize !== undefined ? options.forceSize : false;
    var flipY = options.flipY !== undefined ? options.flipY : true;

    return new WebGLTextureWrapper(renderer, mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height, pma, forceSize, flipY);
}

describe('WebGLTextureWrapper', function ()
{
    describe('Constructor', function ()
    {
        it('should store the renderer reference', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer });

            expect(wrapper.renderer).toBe(renderer);
        });

        it('should store constructor parameters as properties', function ()
        {
            var wrapper = makeWrapper({
                mipLevel: 1,
                minFilter: 9728,
                magFilter: 9728,
                wrapT: 10497,
                wrapS: 10497,
                format: 6408,
                width: 128,
                height: 64
            });

            expect(wrapper.mipLevel).toBe(1);
            expect(wrapper.minFilter).toBe(9728);
            expect(wrapper.magFilter).toBe(9728);
            expect(wrapper.wrapT).toBe(10497);
            expect(wrapper.wrapS).toBe(10497);
            expect(wrapper.format).toBe(6408);
            expect(wrapper.width).toBe(128);
            expect(wrapper.height).toBe(64);
        });

        it('should default pma to true when undefined', function ()
        {
            var wrapper = makeWrapper({ pma: undefined });

            expect(wrapper.pma).toBe(true);
        });

        it('should default pma to true when null', function ()
        {
            var wrapper = makeWrapper({ pma: null });

            expect(wrapper.pma).toBe(true);
        });

        it('should store pma as false when explicitly set', function ()
        {
            var wrapper = makeWrapper({ pma: false });

            expect(wrapper.pma).toBe(false);
        });

        it('should cast forceSize to boolean', function ()
        {
            var wrapper = makeWrapper({ forceSize: 1 });

            expect(wrapper.forceSize).toBe(true);
        });

        it('should default forceSize to false when undefined', function ()
        {
            var wrapper = makeWrapper({ forceSize: undefined });

            expect(wrapper.forceSize).toBe(false);
        });

        it('should cast flipY to boolean', function ()
        {
            var wrapper = makeWrapper({ flipY: 1 });

            expect(wrapper.flipY).toBe(true);
        });

        it('should default flipY to true when undefined', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = new WebGLTextureWrapper(renderer, 0, 9729, 9729, 33071, 33071, 6408, null, 256, 256);

            expect(wrapper.flipY).toBe(true);
        });

        it('should initialise isRenderTexture to false', function ()
        {
            var wrapper = makeWrapper();

            expect(wrapper.isRenderTexture).toBe(false);
        });

        it('should initialise batchUnit to -1', function ()
        {
            var wrapper = makeWrapper();

            expect(wrapper.batchUnit).toBe(-1);
        });

        it('should initialise __SPECTOR_Metadata to an empty object', function ()
        {
            var wrapper = makeWrapper();

            expect(wrapper.__SPECTOR_Metadata).toEqual({});
        });

        it('should call createResource during construction', function ()
        {
            var renderer = makeMockRenderer();

            new WebGLTextureWrapper(renderer, 0, 9729, 9729, 33071, 33071, 6408, null, 256, 256);

            expect(renderer.gl.createTexture).toHaveBeenCalled();
        });
    });

    describe('createResource', function ()
    {
        it('should not create a texture when context is lost', function ()
        {
            var renderer = makeMockRenderer({ isContextLost: vi.fn().mockReturnValue(true) });

            var wrapper = new WebGLTextureWrapper(renderer, 0, 9729, 9729, 33071, 33071, 6408, null, 256, 256);

            expect(renderer.gl.createTexture).not.toHaveBeenCalled();
            expect(wrapper.webGLTexture).toBeNull();
        });

        it('should create a WebGLTexture and assign it when context is valid', function ()
        {
            var fakeTexture = { __SPECTOR_Metadata: {} };
            var renderer = makeMockRenderer({ createTexture: vi.fn().mockReturnValue(fakeTexture) });

            var wrapper = makeWrapper({ renderer: renderer });

            expect(wrapper.webGLTexture).toBe(fakeTexture);
        });

        it('should use the source texture when pixels is a WebGLTextureWrapper', function ()
        {
            var sourceRenderer = makeMockRenderer();
            var fakeTexture = { __SPECTOR_Metadata: {} };
            sourceRenderer.gl.createTexture.mockReturnValue(fakeTexture);

            var sourceWrapper = makeWrapper({ renderer: sourceRenderer });

            var consumerRenderer = makeMockRenderer();
            var consumerWrapper = makeWrapper({
                renderer: consumerRenderer,
                pixels: sourceWrapper
            });

            expect(consumerWrapper.webGLTexture).toBe(sourceWrapper.webGLTexture);
            expect(consumerRenderer.gl.createTexture).not.toHaveBeenCalled();
        });

        it('should set __SPECTOR_Metadata on the created texture', function ()
        {
            var fakeTexture = { __SPECTOR_Metadata: {} };
            var renderer = makeMockRenderer({ createTexture: vi.fn().mockReturnValue(fakeTexture) });

            var wrapper = makeWrapper({ renderer: renderer });
            wrapper.__SPECTOR_Metadata = { url: 'test.png' };

            // Recreate resource with the metadata set
            wrapper.webGLTexture = null;
            wrapper.createResource();

            expect(fakeTexture.__SPECTOR_Metadata).toEqual({ url: 'test.png' });
        });
    });

    describe('resize', function ()
    {
        it('should not update dimensions when size is unchanged', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer, width: 128, height: 128 });
            var callsBefore = renderer.gl.texParameteri.mock.calls.length;

            wrapper.resize(128, 128);

            expect(wrapper.width).toBe(128);
            expect(wrapper.height).toBe(128);
            expect(renderer.gl.texParameteri.mock.calls.length).toBe(callsBefore);
        });

        it('should update width and height', function ()
        {
            var wrapper = makeWrapper({ width: 128, height: 128 });

            wrapper.resize(512, 256);

            expect(wrapper.width).toBe(512);
            expect(wrapper.height).toBe(256);
        });

        it('should set REPEAT wrap modes for power-of-two dimensions', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer, width: 128, height: 128 });

            wrapper.resize(256, 256);

            expect(wrapper.wrapS).toBe(renderer.gl.REPEAT);
            expect(wrapper.wrapT).toBe(renderer.gl.REPEAT);
        });

        it('should set CLAMP_TO_EDGE wrap modes for non-power-of-two dimensions', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer, width: 128, height: 128 });

            wrapper.resize(300, 200);

            expect(wrapper.wrapS).toBe(renderer.gl.CLAMP_TO_EDGE);
            expect(wrapper.wrapT).toBe(renderer.gl.CLAMP_TO_EDGE);
        });

        it('should call _processTexture after resizing', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer, width: 128, height: 128 });
            var callsBefore = renderer.gl.texParameteri.mock.calls.length;

            wrapper.resize(64, 64);

            expect(renderer.gl.texParameteri.mock.calls.length).toBeGreaterThan(callsBefore);
        });
    });

    describe('update', function ()
    {
        it('should not update when width is zero', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer, width: 128, height: 128 });
            var callsBefore = renderer.gl.texParameteri.mock.calls.length;

            wrapper.update(null, 0, 128, true, 33071, 33071, 9729, 9729, 6408);

            expect(wrapper.width).toBe(128);
            expect(renderer.gl.texParameteri.mock.calls.length).toBe(callsBefore);
        });

        it('should not update when height is zero', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer, width: 128, height: 128 });
            var callsBefore = renderer.gl.texParameteri.mock.calls.length;

            wrapper.update(null, 128, 0, true, 33071, 33071, 9729, 9729, 6408);

            expect(wrapper.height).toBe(128);
            expect(renderer.gl.texParameteri.mock.calls.length).toBe(callsBefore);
        });

        it('should update all texture properties', function ()
        {
            var wrapper = makeWrapper({ width: 128, height: 128 });
            var newPixels = { width: 64, height: 64 };

            wrapper.update(newPixels, 64, 64, false, 10497, 10497, 9728, 9728, 6408);

            expect(wrapper.pixels).toBe(newPixels);
            expect(wrapper.width).toBe(64);
            expect(wrapper.height).toBe(64);
            expect(wrapper.flipY).toBe(false);
            expect(wrapper.wrapS).toBe(10497);
            expect(wrapper.wrapT).toBe(10497);
            expect(wrapper.minFilter).toBe(9728);
            expect(wrapper.magFilter).toBe(9728);
            expect(wrapper.format).toBe(6408);
        });

        it('should call _processTexture after updating', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer, width: 128, height: 128 });
            var callsBefore = renderer.gl.texParameteri.mock.calls.length;

            wrapper.update(null, 256, 256, true, 33071, 33071, 9729, 9729, 6408);

            expect(renderer.gl.texParameteri.mock.calls.length).toBeGreaterThan(callsBefore);
        });

        it('should allow null source without throwing', function ()
        {
            var wrapper = makeWrapper({ width: 128, height: 128 });

            expect(function ()
            {
                wrapper.update(null, 64, 64, true, 33071, 33071, 9729, 9729, 6408);
            }).not.toThrow();
        });
    });

    describe('destroy', function ()
    {
        it('should do nothing when webGLTexture is already null', function ()
        {
            var renderer = makeMockRenderer();
            var wrapper = makeWrapper({ renderer: renderer });
            wrapper.webGLTexture = null;

            wrapper.destroy();

            expect(renderer.gl.deleteTexture).not.toHaveBeenCalled();
        });

        it('should delete the WebGLTexture from the GPU', function ()
        {
            var fakeTexture = { __SPECTOR_Metadata: {} };
            var renderer = makeMockRenderer({ createTexture: vi.fn().mockReturnValue(fakeTexture) });
            var wrapper = makeWrapper({ renderer: renderer });

            wrapper.destroy();

            expect(renderer.gl.deleteTexture).toHaveBeenCalledWith(fakeTexture);
        });

        it('should set webGLTexture to null after destroy', function ()
        {
            var wrapper = makeWrapper();

            wrapper.destroy();

            expect(wrapper.webGLTexture).toBeNull();
        });

        it('should set pixels to null after destroy', function ()
        {
            var wrapper = makeWrapper({ pixels: null });

            wrapper.destroy();

            expect(wrapper.pixels).toBeNull();
        });

        it('should set renderer to null after destroy', function ()
        {
            var wrapper = makeWrapper();

            wrapper.destroy();

            expect(wrapper.renderer).toBeNull();
        });

        it('should not call deleteTexture when pixels is a WebGLTextureWrapper', function ()
        {
            var sourceRenderer = makeMockRenderer();
            var sourceWrapper = makeWrapper({ renderer: sourceRenderer });

            var consumerRenderer = makeMockRenderer();
            var consumerWrapper = makeWrapper({
                renderer: consumerRenderer,
                pixels: sourceWrapper
            });

            consumerWrapper.destroy();

            expect(consumerRenderer.gl.deleteTexture).not.toHaveBeenCalled();
        });

        it('should still null out properties when pixels is a WebGLTextureWrapper', function ()
        {
            var sourceWrapper = makeWrapper({ renderer: makeMockRenderer() });
            var consumerRenderer = makeMockRenderer();
            var consumerWrapper = makeWrapper({
                renderer: consumerRenderer,
                pixels: sourceWrapper
            });

            consumerWrapper.destroy();

            expect(consumerWrapper.webGLTexture).toBeNull();
            expect(consumerWrapper.pixels).toBeNull();
            expect(consumerWrapper.renderer).toBeNull();
        });
    });
});
