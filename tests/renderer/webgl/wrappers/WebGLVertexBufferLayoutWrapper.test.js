var WebGLVertexBufferLayoutWrapper = require('../../../../src/renderer/webgl/wrappers/WebGLVertexBufferLayoutWrapper');

// GL enum constants used in mocks
var GL_FLOAT = 0x1406;
var GL_UNSIGNED_BYTE = 0x1401;
var GL_UNSIGNED_SHORT = 0x1403;
var GL_STATIC_DRAW = 0x88B4;
var GL_DYNAMIC_DRAW = 0x88B8;

function makeMockRenderer (overrides)
{
    var defaults = {
        gl: {
            FLOAT: GL_FLOAT,
            UNSIGNED_BYTE: GL_UNSIGNED_BYTE,
            UNSIGNED_SHORT: GL_UNSIGNED_SHORT,
            STATIC_DRAW: GL_STATIC_DRAW,
            DYNAMIC_DRAW: GL_DYNAMIC_DRAW
        },
        shaderSetters: {
            constants: {
                // FLOAT: size 1 (scalar), 4 bytes
                [GL_FLOAT]: { size: 1, bytes: 4 },
                // UNSIGNED_BYTE: size 1, 1 byte
                [GL_UNSIGNED_BYTE]: { size: 1, bytes: 1 },
                // UNSIGNED_SHORT: size 1, 2 bytes
                [GL_UNSIGNED_SHORT]: { size: 1, bytes: 2 }
            }
        },
        createVertexBuffer: function (arrayBuffer, usage)
        {
            return { byteLength: arrayBuffer.byteLength };
        }
    };

    return Object.assign({}, defaults, overrides);
}

function makeLayout (layoutAttribs, count, usage)
{
    return {
        layout: layoutAttribs,
        count: count || 100,
        usage: usage !== undefined ? usage : GL_STATIC_DRAW
    };
}

describe('WebGLVertexBufferLayoutWrapper', function ()
{
    describe('constructor', function ()
    {
        it('should store the renderer reference', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(wrapper.renderer).toBe(renderer);
        });

        it('should store the layout reference', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(wrapper.layout).toBe(layout);
        });

        it('should call completeLayout during construction', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ]);
            // stride should be set after construction (it is set by completeLayout)
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            // 2 components * 1 baseSize * 4 bytes = 8
            expect(layout.stride).toBe(8);
        });

        it('should create a buffer via renderer when none is provided', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ], 10);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            // stride=8, count=10 -> 80 bytes
            expect(wrapper.buffer).toBeDefined();
            expect(wrapper.buffer.byteLength).toBe(80);
        });

        it('should use the provided buffer when it is large enough', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ], 10);
            var existingBuffer = { byteLength: 9999 };
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout, existingBuffer);
            expect(wrapper.buffer).toBe(existingBuffer);
        });

        it('should throw when the provided buffer is too small', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ], 100);
            // stride=8, count=100 -> needs 800 bytes; give only 10
            var tinyBuffer = { byteLength: 10 };
            expect(function ()
            {
                return new WebGLVertexBufferLayoutWrapper(renderer, layout, tinyBuffer);
            }).toThrow('Buffer too small for layout');
        });

        it('should not throw when the provided buffer is exactly the right size', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ], 10);
            // stride=8, count=10 -> 80 bytes exactly
            var exactBuffer = { byteLength: 80 };
            expect(function ()
            {
                return new WebGLVertexBufferLayoutWrapper(renderer, layout, exactBuffer);
            }).not.toThrow();
        });
    });

    describe('completeLayout', function ()
    {
        it('should set stride to zero for an empty layout', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([], 0);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.stride).toBe(0);
        });

        it('should compute stride for a single FLOAT attribute', function ()
        {
            var renderer = makeMockRenderer();
            // size=3 (vec3), type=FLOAT -> 3 * 1 * 4 = 12
            var layout = makeLayout([
                { name: 'a_position', size: 3, type: GL_FLOAT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.stride).toBe(12);
        });

        it('should compute stride for a single UNSIGNED_BYTE attribute', function ()
        {
            var renderer = makeMockRenderer();
            // size=4, type=UNSIGNED_BYTE -> 4 * 1 * 1 = 4
            var layout = makeLayout([
                { name: 'a_color', size: 4, type: GL_UNSIGNED_BYTE }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.stride).toBe(4);
        });

        it('should compute stride for multiple attributes', function ()
        {
            var renderer = makeMockRenderer();
            // a_position: size=2, FLOAT -> 2 * 1 * 4 = 8
            // a_texcoord: size=2, FLOAT -> 2 * 1 * 4 = 8
            // a_color:    size=4, UNSIGNED_BYTE -> 4 * 1 * 1 = 4
            // total stride = 20
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT },
                { name: 'a_texcoord', size: 2, type: GL_FLOAT },
                { name: 'a_color', size: 4, type: GL_UNSIGNED_BYTE }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.stride).toBe(20);
        });

        it('should set offset to 0 for the first attribute', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT },
                { name: 'a_texcoord', size: 2, type: GL_FLOAT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.layout[0].offset).toBe(0);
        });

        it('should set correct offsets for sequential attributes', function ()
        {
            var renderer = makeMockRenderer();
            // a_position: size=2, FLOAT -> 8 bytes; offset=0
            // a_texcoord: size=2, FLOAT -> 8 bytes; offset=8
            // a_color:    size=4, UNSIGNED_BYTE -> 4 bytes; offset=16
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT },
                { name: 'a_texcoord', size: 2, type: GL_FLOAT },
                { name: 'a_color', size: 4, type: GL_UNSIGNED_BYTE }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.layout[0].offset).toBe(0);
            expect(layout.layout[1].offset).toBe(8);
            expect(layout.layout[2].offset).toBe(16);
        });

        it('should set attribute.bytes from typeData', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT },
                { name: 'a_color', size: 4, type: GL_UNSIGNED_BYTE }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.layout[0].bytes).toBe(4);
            expect(layout.layout[1].bytes).toBe(1);
        });

        it('should convert string type to GL enum', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: 'FLOAT' }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.layout[0].type).toBe(GL_FLOAT);
        });

        it('should convert string usage to GL enum', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ], 10, 'STATIC_DRAW');
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout, { byteLength: 9999 });
            expect(layout.usage).toBe(GL_STATIC_DRAW);
        });

        it('should leave numeric usage unchanged', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ], 10, GL_DYNAMIC_DRAW);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout, { byteLength: 9999 });
            expect(layout.usage).toBe(GL_DYNAMIC_DRAW);
        });

        it('should account for columns when computing stride', function ()
        {
            var renderer = makeMockRenderer();
            // size=4, columns=4 (mat4), FLOAT -> 4 * 4 * 4 * 1 = 64
            var layout = makeLayout([
                { name: 'a_matrix', size: 4, columns: 4, type: GL_FLOAT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.stride).toBe(64);
        });

        it('should treat missing columns as 1', function ()
        {
            var renderer = makeMockRenderer();
            // size=3, no columns -> columns defaults to 1; FLOAT -> 3 * 1 * 4 * 1 = 12
            var layout = makeLayout([
                { name: 'a_position', size: 3, type: GL_FLOAT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.stride).toBe(12);
        });

        it('should compute correct stride with mixed columns', function ()
        {
            var renderer = makeMockRenderer();
            // a_vec2: size=2, columns=1, FLOAT -> 2 * 1 * 4 = 8
            // a_mat2: size=2, columns=2, FLOAT -> 2 * 2 * 4 = 16
            // total = 24
            var layout = makeLayout([
                { name: 'a_vec2', size: 2, columns: 1, type: GL_FLOAT },
                { name: 'a_mat2', size: 2, columns: 2, type: GL_FLOAT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.stride).toBe(24);
        });

        it('should compute correct offsets with columns', function ()
        {
            var renderer = makeMockRenderer();
            // a_vec2: size=2, columns=1, FLOAT -> 8 bytes; offset=0
            // a_mat2: size=2, columns=2, FLOAT -> 16 bytes; offset=8
            var layout = makeLayout([
                { name: 'a_vec2', size: 2, columns: 1, type: GL_FLOAT },
                { name: 'a_mat2', size: 2, columns: 2, type: GL_FLOAT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.layout[0].offset).toBe(0);
            expect(layout.layout[1].offset).toBe(8);
        });

        it('should work when called again after construction', function ()
        {
            var renderer = makeMockRenderer();
            var layout = makeLayout([
                { name: 'a_position', size: 2, type: GL_FLOAT }
            ], 10, GL_STATIC_DRAW);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout, { byteLength: 9999 });

            // Create a new layout object and call completeLayout again directly
            var layout2 = {
                layout: [
                    { name: 'a_color', size: 4, type: GL_UNSIGNED_BYTE }
                ],
                count: 10,
                usage: GL_STATIC_DRAW
            };
            wrapper.completeLayout(layout2);
            // 4 * 1 * 1 = 4
            expect(layout2.stride).toBe(4);
            expect(layout2.layout[0].offset).toBe(0);
            expect(layout2.layout[0].bytes).toBe(1);
        });

        it('should handle UNSIGNED_SHORT type correctly', function ()
        {
            var renderer = makeMockRenderer();
            // size=2, UNSIGNED_SHORT -> 2 * 1 * 2 = 4
            var layout = makeLayout([
                { name: 'a_indices', size: 2, type: GL_UNSIGNED_SHORT }
            ]);
            var wrapper = new WebGLVertexBufferLayoutWrapper(renderer, layout);
            expect(layout.stride).toBe(4);
            expect(layout.layout[0].bytes).toBe(2);
        });
    });
});
