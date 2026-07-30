var WebGLBufferWrapper = require('../../../../src/renderer/webgl/wrappers/WebGLBufferWrapper');

// GL enum constants matching WebGL spec
var ARRAY_BUFFER = 34962;
var ELEMENT_ARRAY_BUFFER = 34963;
var DYNAMIC_DRAW = 35048;
var STATIC_DRAW = 35044;

function makeMockGl ()
{
    return {
        ARRAY_BUFFER: ARRAY_BUFFER,
        ELEMENT_ARRAY_BUFFER: ELEMENT_ARRAY_BUFFER,
        createBuffer: vi.fn().mockReturnValue({ id: 'mock-buffer' }),
        bufferData: vi.fn(),
        bufferSubData: vi.fn(),
        deleteBuffer: vi.fn()
    };
}

function makeMockRenderer (gl)
{
    return {
        gl: gl,
        glWrapper: {
            updateBindingsArrayBuffer: vi.fn(),
            updateBindingsElementArrayBuffer: vi.fn()
        }
    };
}

function makeWrapper (bytesOrBuffer, bufferType, bufferUsage, renderer)
{
    var dataBuffer = (bytesOrBuffer instanceof ArrayBuffer)
        ? bytesOrBuffer
        : new ArrayBuffer(bytesOrBuffer || 16);

    if (!bufferType) { bufferType = ARRAY_BUFFER; }
    if (!bufferUsage) { bufferUsage = DYNAMIC_DRAW; }

    var gl = makeMockGl();
    var r = renderer || makeMockRenderer(gl);

    return new WebGLBufferWrapper(r, dataBuffer, bufferType, bufferUsage);
}

describe('WebGLBufferWrapper', function ()
{
    describe('constructor', function ()
    {
        it('should store the renderer reference', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            expect(wrapper.renderer).toBe(renderer);
        });

        it('should store the dataBuffer reference', function ()
        {
            var buf = new ArrayBuffer(16);
            var wrapper = makeWrapper(buf);

            expect(wrapper.dataBuffer).toBe(buf);
        });

        it('should store bufferType', function ()
        {
            var wrapper = makeWrapper(16, ELEMENT_ARRAY_BUFFER, DYNAMIC_DRAW);

            expect(wrapper.bufferType).toBe(ELEMENT_ARRAY_BUFFER);
        });

        it('should store bufferUsage', function ()
        {
            var wrapper = makeWrapper(16, ARRAY_BUFFER, STATIC_DRAW);

            expect(wrapper.bufferUsage).toBe(STATIC_DRAW);
        });

        it('should set webGLBuffer from createResource', function ()
        {
            var wrapper = makeWrapper(16);

            expect(wrapper.webGLBuffer).not.toBeNull();
        });

        it('should create viewU8 as a Uint8Array over the dataBuffer', function ()
        {
            var buf = new ArrayBuffer(16);
            var wrapper = makeWrapper(buf);

            expect(wrapper.viewU8).toBeInstanceOf(Uint8Array);
            expect(wrapper.viewU8.buffer).toBe(buf);
            expect(wrapper.viewU8.byteLength).toBe(16);
        });

        it('should create viewF32 when byteLength is divisible by 4', function ()
        {
            var wrapper = makeWrapper(new ArrayBuffer(16));

            expect(wrapper.viewF32).toBeInstanceOf(Float32Array);
            expect(wrapper.viewF32.length).toBe(4);
        });

        it('should set viewF32 to null when byteLength is not divisible by 4', function ()
        {
            var wrapper = makeWrapper(new ArrayBuffer(6));

            expect(wrapper.viewF32).toBeNull();
        });

        it('should create viewU16 when byteLength is divisible by 2', function ()
        {
            var wrapper = makeWrapper(new ArrayBuffer(6));

            expect(wrapper.viewU16).toBeInstanceOf(Uint16Array);
            expect(wrapper.viewU16.length).toBe(3);
        });

        it('should set viewU16 to null when byteLength is odd', function ()
        {
            var wrapper = makeWrapper(new ArrayBuffer(3));

            expect(wrapper.viewU16).toBeNull();
        });

        it('should create viewU32 when byteLength is divisible by 4', function ()
        {
            var wrapper = makeWrapper(new ArrayBuffer(8));

            expect(wrapper.viewU32).toBeInstanceOf(Uint32Array);
            expect(wrapper.viewU32.length).toBe(2);
        });

        it('should set viewU32 to null when byteLength is not divisible by 4', function ()
        {
            var wrapper = makeWrapper(new ArrayBuffer(6));

            expect(wrapper.viewU32).toBeNull();
        });

        it('should call gl.createBuffer during construction', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            expect(gl.createBuffer).toHaveBeenCalledOnce();
        });

        it('should call gl.bufferData during construction', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var buf = new ArrayBuffer(16);
            new WebGLBufferWrapper(renderer, buf, ARRAY_BUFFER, DYNAMIC_DRAW);

            expect(gl.bufferData).toHaveBeenCalledWith(ARRAY_BUFFER, buf, DYNAMIC_DRAW);
        });
    });

    describe('createResource', function ()
    {
        it('should replace webGLBuffer with a new buffer from gl.createBuffer', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            var firstBuffer = { id: 'second-buffer' };
            gl.createBuffer.mockReturnValueOnce(firstBuffer);

            wrapper.createResource();

            expect(wrapper.webGLBuffer).toBe(firstBuffer);
        });

        it('should call gl.bufferData with current dataBuffer and bufferUsage', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var buf = new ArrayBuffer(16);
            var wrapper = new WebGLBufferWrapper(renderer, buf, ARRAY_BUFFER, STATIC_DRAW);

            gl.bufferData.mockClear();

            wrapper.createResource();

            expect(gl.bufferData).toHaveBeenCalledWith(ARRAY_BUFFER, buf, STATIC_DRAW);
        });

        it('should bind and then unbind the buffer during createResource', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsArrayBuffer.mockClear();

            wrapper.createResource();

            // bind called with this wrapper, then unbind called with null
            var calls = renderer.glWrapper.updateBindingsArrayBuffer.mock.calls;
            expect(calls.length).toBe(2);
            expect(calls[0][0].bindings.arrayBuffer).toBe(wrapper);
            expect(calls[1][0].bindings.arrayBuffer).toBeNull();
        });
    });

    describe('bind', function ()
    {
        it('should call updateBindingsArrayBuffer when bufferType is ARRAY_BUFFER', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsArrayBuffer.mockClear();

            wrapper.bind();

            expect(renderer.glWrapper.updateBindingsArrayBuffer).toHaveBeenCalledOnce();
            expect(renderer.glWrapper.updateBindingsElementArrayBuffer).not.toHaveBeenCalled();
        });

        it('should pass the wrapper itself when binding', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsArrayBuffer.mockClear();

            wrapper.bind();

            var call = renderer.glWrapper.updateBindingsArrayBuffer.mock.calls[0];
            expect(call[0].bindings.arrayBuffer).toBe(wrapper);
        });

        it('should pass null when unbinding (unbind=true)', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsArrayBuffer.mockClear();

            wrapper.bind(true);

            var call = renderer.glWrapper.updateBindingsArrayBuffer.mock.calls[0];
            expect(call[0].bindings.arrayBuffer).toBeNull();
        });

        it('should call updateBindingsElementArrayBuffer when bufferType is ELEMENT_ARRAY_BUFFER', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ELEMENT_ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsElementArrayBuffer.mockClear();

            wrapper.bind();

            expect(renderer.glWrapper.updateBindingsElementArrayBuffer).toHaveBeenCalledOnce();
            expect(renderer.glWrapper.updateBindingsArrayBuffer).not.toHaveBeenCalled();
        });

        it('should pass the wrapper itself for ELEMENT_ARRAY_BUFFER when binding', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ELEMENT_ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsElementArrayBuffer.mockClear();

            wrapper.bind();

            var call = renderer.glWrapper.updateBindingsElementArrayBuffer.mock.calls[0];
            expect(call[0].bindings.elementArrayBuffer).toBe(wrapper);
        });

        it('should pass null for ELEMENT_ARRAY_BUFFER when unbinding', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ELEMENT_ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsElementArrayBuffer.mockClear();

            wrapper.bind(true);

            var call = renderer.glWrapper.updateBindingsElementArrayBuffer.mock.calls[0];
            expect(call[0].bindings.elementArrayBuffer).toBeNull();
        });

        it('should not call either update method for an unknown bufferType', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), 9999, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsArrayBuffer.mockClear();
            renderer.glWrapper.updateBindingsElementArrayBuffer.mockClear();

            wrapper.bind();

            expect(renderer.glWrapper.updateBindingsArrayBuffer).not.toHaveBeenCalled();
            expect(renderer.glWrapper.updateBindingsElementArrayBuffer).not.toHaveBeenCalled();
        });
    });

    describe('update', function ()
    {
        it('should call bind before uploading data', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsArrayBuffer.mockClear();

            wrapper.update();

            expect(renderer.glWrapper.updateBindingsArrayBuffer).toHaveBeenCalled();
        });

        it('should call gl.bufferSubData with the entire dataBuffer when bytes is undefined', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var buf = new ArrayBuffer(16);
            var wrapper = new WebGLBufferWrapper(renderer, buf, ARRAY_BUFFER, DYNAMIC_DRAW);

            wrapper.update();

            var lastCall = gl.bufferSubData.mock.calls[gl.bufferSubData.mock.calls.length - 1];
            expect(lastCall[0]).toBe(ARRAY_BUFFER);
            expect(lastCall[1]).toBe(0);
            expect(lastCall[2]).toBe(buf);
        });

        it('should use offset=0 by default when offset is undefined', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            wrapper.update(8);

            var lastCall = gl.bufferSubData.mock.calls[gl.bufferSubData.mock.calls.length - 1];
            expect(lastCall[1]).toBe(0);
        });

        it('should call gl.bufferSubData with a subarray when bytes is specified', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            wrapper.update(8, 0);

            var lastCall = gl.bufferSubData.mock.calls[gl.bufferSubData.mock.calls.length - 1];
            expect(lastCall[0]).toBe(ARRAY_BUFFER);
            expect(lastCall[2]).toBeInstanceOf(Uint8Array);
            expect(lastCall[2].byteLength).toBe(8);
        });

        it('should pass the given offset to gl.bufferSubData', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            wrapper.update(4, 4);

            var lastCall = gl.bufferSubData.mock.calls[gl.bufferSubData.mock.calls.length - 1];
            expect(lastCall[1]).toBe(4);
        });

        it('should upload a subarray starting at offset when bytes and offset are specified', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            wrapper.update(4, 8);

            var lastCall = gl.bufferSubData.mock.calls[gl.bufferSubData.mock.calls.length - 1];
            var subarray = lastCall[2];
            expect(subarray).toBeInstanceOf(Uint8Array);
            expect(subarray.byteLength).toBe(4);
        });
    });

    describe('resize', function ()
    {
        it('should replace dataBuffer with a new ArrayBuffer of the specified size', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);
            var oldBuffer = wrapper.dataBuffer;

            wrapper.resize(32);

            expect(wrapper.dataBuffer).not.toBe(oldBuffer);
            expect(wrapper.dataBuffer.byteLength).toBe(32);
        });

        it('should recreate viewU8 to reflect the new size', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.resize(32);

            expect(wrapper.viewU8).toBeInstanceOf(Uint8Array);
            expect(wrapper.viewU8.byteLength).toBe(32);
        });

        it('should recreate viewF32 when new size is divisible by 4', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.resize(20);

            expect(wrapper.viewF32).toBeInstanceOf(Float32Array);
            expect(wrapper.viewF32.length).toBe(5);
        });

        it('should set viewF32 to null when new size is not divisible by 4', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.resize(6);

            expect(wrapper.viewF32).toBeNull();
        });

        it('should recreate viewU16 when new size is divisible by 2', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.resize(6);

            expect(wrapper.viewU16).toBeInstanceOf(Uint16Array);
            expect(wrapper.viewU16.length).toBe(3);
        });

        it('should set viewU16 to null when new size is odd', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.resize(3);

            expect(wrapper.viewU16).toBeNull();
        });

        it('should recreate viewU32 when new size is divisible by 4', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.resize(8);

            expect(wrapper.viewU32).toBeInstanceOf(Uint32Array);
            expect(wrapper.viewU32.length).toBe(2);
        });

        it('should set viewU32 to null when new size is not divisible by 4', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.resize(6);

            expect(wrapper.viewU32).toBeNull();
        });

        it('should call gl.bufferData with the new dataBuffer after resize', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            gl.bufferData.mockClear();

            wrapper.resize(32);

            expect(gl.bufferData).toHaveBeenCalledWith(ARRAY_BUFFER, wrapper.dataBuffer, DYNAMIC_DRAW);
        });

        it('should bind the buffer during resize', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);

            renderer.glWrapper.updateBindingsArrayBuffer.mockClear();

            wrapper.resize(32);

            expect(renderer.glWrapper.updateBindingsArrayBuffer).toHaveBeenCalled();
        });
    });

    describe('destroy', function ()
    {
        it('should call gl.deleteBuffer with the current webGLBuffer', function ()
        {
            var gl = makeMockGl();
            var renderer = makeMockRenderer(gl);
            var wrapper = new WebGLBufferWrapper(renderer, new ArrayBuffer(16), ARRAY_BUFFER, DYNAMIC_DRAW);
            var buffer = wrapper.webGLBuffer;

            wrapper.destroy();

            expect(gl.deleteBuffer).toHaveBeenCalledWith(buffer);
        });

        it('should set webGLBuffer to null', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.destroy();

            expect(wrapper.webGLBuffer).toBeNull();
        });

        it('should set dataBuffer to null', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.destroy();

            expect(wrapper.dataBuffer).toBeNull();
        });

        it('should set viewF32 to null', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.destroy();

            expect(wrapper.viewF32).toBeNull();
        });

        it('should set viewU8 to null', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.destroy();

            expect(wrapper.viewU8).toBeNull();
        });

        it('should set viewU16 to null', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.destroy();

            expect(wrapper.viewU16).toBeNull();
        });

        it('should set viewU32 to null', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.destroy();

            expect(wrapper.viewU32).toBeNull();
        });

        it('should set renderer to null', function ()
        {
            var wrapper = makeWrapper(16);

            wrapper.destroy();

            expect(wrapper.renderer).toBeNull();
        });
    });
});
