var WebGLFramebufferWrapper = require('../../../../src/renderer/webgl/wrappers/WebGLFramebufferWrapper');

function createMockGL ()
{
    var mockFramebuffer = { _type: 'framebuffer' };
    var mockRenderbuffer = { _type: 'renderbuffer' };

    return {
        COLOR_ATTACHMENT0: 36064,
        DEPTH_STENCIL_ATTACHMENT: 33306,
        DEPTH_ATTACHMENT: 36096,
        STENCIL_ATTACHMENT: 36128,
        DEPTH_STENCIL: 34041,
        DEPTH_COMPONENT16: 33189,
        STENCIL_INDEX8: 36168,
        FRAMEBUFFER: 36160,
        FRAMEBUFFER_COMPLETE: 36053,
        RENDERBUFFER: 36161,
        TEXTURE_2D: 3553,
        createFramebuffer: vi.fn(function () { return mockFramebuffer; }),
        deleteFramebuffer: vi.fn(),
        createRenderbuffer: vi.fn(function () { return mockRenderbuffer; }),
        deleteRenderbuffer: vi.fn(),
        framebufferTexture2D: vi.fn(),
        checkFramebufferStatus: vi.fn(function () { return 36053; }),
        renderbufferStorage: vi.fn(),
        framebufferRenderbuffer: vi.fn()
    };
}

function createMockGLWrapper ()
{
    return {
        updateBindingsFramebuffer: vi.fn(),
        updateBindingsRenderbuffer: vi.fn()
    };
}

function createMockRenderer (gl, glWrapper)
{
    return {
        gl: gl || createMockGL(),
        glWrapper: glWrapper || createMockGLWrapper(),
        deleteTexture: vi.fn()
    };
}

function createMockTexture (width, height)
{
    return {
        width: width !== undefined ? width : 256,
        height: height !== undefined ? height : 256,
        webGLTexture: { _type: 'texture' },
        isRenderTexture: false,
        resize: vi.fn()
    };
}

describe('WebGLFramebufferWrapper', function ()
{
    describe('constructor', function ()
    {
        it('should set useCanvas to true when colorAttachments is null', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            expect(wrapper.useCanvas).toBe(true);
        });

        it('should set useCanvas to true when colorAttachments is empty array', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, []);

            expect(wrapper.useCanvas).toBe(true);
        });

        it('should set useCanvas to false when colorAttachments has entries', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            expect(wrapper.useCanvas).toBe(false);
        });

        it('should store a reference to the renderer', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            expect(wrapper.renderer).toBe(renderer);
        });

        it('should have null webGLFramebuffer when using canvas', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            expect(wrapper.webGLFramebuffer).toBeNull();
        });

        it('should have null renderTexture when using canvas', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            expect(wrapper.renderTexture).toBeNull();
        });

        it('should have zero width and height when using canvas', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            expect(wrapper.width).toBe(0);
            expect(wrapper.height).toBe(0);
        });

        it('should have empty attachments array when using canvas', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            expect(wrapper.attachments.length).toBe(0);
        });

        it('should set width and height from first color attachment', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture(512, 256);
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            expect(wrapper.width).toBe(512);
            expect(wrapper.height).toBe(256);
        });

        it('should set renderTexture from the first color attachment', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            expect(wrapper.renderTexture).toBe(texture);
        });

        it('should create an attachment entry for each color attachment', function ()
        {
            var renderer = createMockRenderer();
            var texture1 = createMockTexture(128, 128);
            var texture2 = createMockTexture(128, 128);
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture1, texture2 ]);

            expect(wrapper.attachments[0].texture).toBe(texture1);
            expect(wrapper.attachments[0].attachmentPoint).toBe(renderer.gl.COLOR_ATTACHMENT0);
            expect(wrapper.attachments[1].texture).toBe(texture2);
            expect(wrapper.attachments[1].attachmentPoint).toBe(renderer.gl.COLOR_ATTACHMENT0 + 1);
        });

        it('should throw when color attachments have different dimensions', function ()
        {
            var renderer = createMockRenderer();
            var texture1 = createMockTexture(256, 256);
            var texture2 = createMockTexture(128, 128);

            expect(function ()
            {
                new WebGLFramebufferWrapper(renderer, [ texture1, texture2 ]);
            }).toThrow('Color attachments must have the same dimensions');
        });

        it('should add a DEPTH_STENCIL attachment when both depth and stencil are requested', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ], true, true);

            var lastAttachment = wrapper.attachments[wrapper.attachments.length - 1];
            expect(lastAttachment.attachmentPoint).toBe(gl.DEPTH_STENCIL_ATTACHMENT);
            expect(lastAttachment.internalFormat).toBe(gl.DEPTH_STENCIL);
        });

        it('should add a DEPTH attachment when only depth is requested', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ], false, true);

            var lastAttachment = wrapper.attachments[wrapper.attachments.length - 1];
            expect(lastAttachment.attachmentPoint).toBe(gl.DEPTH_ATTACHMENT);
            expect(lastAttachment.internalFormat).toBe(gl.DEPTH_COMPONENT16);
        });

        it('should add a STENCIL attachment when only stencil is requested', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ], true, false);

            var lastAttachment = wrapper.attachments[wrapper.attachments.length - 1];
            expect(lastAttachment.attachmentPoint).toBe(gl.STENCIL_ATTACHMENT);
            expect(lastAttachment.internalFormat).toBe(gl.STENCIL_INDEX8);
        });

        it('should not add depth or stencil attachments when neither is requested', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ], false, false);

            expect(wrapper.attachments.length).toBe(1);
        });

        it('should not add depth or stencil attachments when using canvas', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null, true, true);

            expect(wrapper.attachments.length).toBe(0);
        });
    });

    describe('createResource', function ()
    {
        it('should return early without modifying webGLFramebuffer when useCanvas is true', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            wrapper.createResource();

            expect(wrapper.webGLFramebuffer).toBeNull();
            expect(gl.createFramebuffer).not.toHaveBeenCalled();
        });

        it('should create a WebGL framebuffer and assign it', function ()
        {
            var gl = createMockGL();
            var glWrapper = createMockGLWrapper();
            var renderer = createMockRenderer(gl, glWrapper);
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            expect(gl.createFramebuffer).toHaveBeenCalled();
            expect(wrapper.webGLFramebuffer).not.toBeNull();
        });

        it('should call updateBindingsFramebuffer after creating the framebuffer', function ()
        {
            var gl = createMockGL();
            var glWrapper = createMockGLWrapper();
            var renderer = createMockRenderer(gl, glWrapper);
            var texture = createMockTexture();
            new WebGLFramebufferWrapper(renderer, [ texture ]);

            expect(glWrapper.updateBindingsFramebuffer).toHaveBeenCalled();
        });

        it('should mark texture as isRenderTexture when attaching', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture();
            new WebGLFramebufferWrapper(renderer, [ texture ]);

            expect(texture.isRenderTexture).toBe(true);
        });

        it('should call framebufferTexture2D for each texture attachment', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            new WebGLFramebufferWrapper(renderer, [ texture ]);

            expect(gl.framebufferTexture2D).toHaveBeenCalledWith(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D,
                texture.webGLTexture,
                0
            );
        });

        it('should delete the existing framebuffer if one already exists when called again', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            var firstFramebuffer = wrapper.webGLFramebuffer;
            gl.deleteFramebuffer.mockClear();

            wrapper.createResource();

            expect(gl.deleteFramebuffer).toHaveBeenCalledWith(firstFramebuffer);
        });

        it('should create a renderbuffer for non-texture attachments', function ()
        {
            var gl = createMockGL();
            var glWrapper = createMockGLWrapper();
            var renderer = createMockRenderer(gl, glWrapper);
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ], false, true);

            var depthAttachment = wrapper.attachments[1];
            expect(depthAttachment.renderbuffer).not.toBeUndefined();
            expect(gl.createRenderbuffer).toHaveBeenCalled();
            expect(gl.renderbufferStorage).toHaveBeenCalled();
            expect(gl.framebufferRenderbuffer).toHaveBeenCalled();
        });

        it('should throw when framebuffer status is incomplete before attaching renderbuffer', function ()
        {
            var gl = createMockGL();
            gl.checkFramebufferStatus = vi.fn(function () { return 36054; }); // Incomplete Attachment
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();

            expect(function ()
            {
                new WebGLFramebufferWrapper(renderer, [ texture ], false, true);
            }).toThrow('Framebuffer status: Incomplete Attachment');
        });

        it('should throw with the raw status code when the error code is unknown', function ()
        {
            var gl = createMockGL();
            gl.checkFramebufferStatus = vi.fn(function () { return 99999; });
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();

            expect(function ()
            {
                new WebGLFramebufferWrapper(renderer, [ texture ], false, true);
            }).toThrow('Framebuffer status: 99999');
        });

        it('should delete existing renderbuffers when recreating', function ()
        {
            var gl = createMockGL();
            var glWrapper = createMockGLWrapper();
            var renderer = createMockRenderer(gl, glWrapper);
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ], false, true);

            var oldRenderbuffer = wrapper.attachments[1].renderbuffer;
            gl.deleteRenderbuffer.mockClear();

            wrapper.createResource();

            expect(gl.deleteRenderbuffer).toHaveBeenCalledWith(oldRenderbuffer);
        });
    });

    describe('resize', function ()
    {
        it('should return early without changing dimensions when useCanvas is true', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            wrapper.resize(800, 600);

            expect(wrapper.width).toBe(0);
            expect(wrapper.height).toBe(0);
        });

        it('should update width and height', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture(256, 256);
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            wrapper.resize(800, 600);

            expect(wrapper.width).toBe(800);
            expect(wrapper.height).toBe(600);
        });

        it('should call resize on the renderTexture', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture(256, 256);
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            wrapper.resize(800, 600);

            expect(texture.resize).toHaveBeenCalledWith(800, 600);
        });

        it('should call createResource after resizing', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture(256, 256);
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            var callCount = gl.createFramebuffer.mock.calls.length;
            wrapper.resize(128, 128);

            expect(gl.createFramebuffer.mock.calls.length).toBeGreaterThan(callCount);
        });

        it('should not call renderTexture.resize when useCanvas is true', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            // renderTexture is null for canvas mode; resize returns early,
            // so no attempt to call a method on null should occur
            expect(function ()
            {
                wrapper.resize(800, 600);
            }).not.toThrow();
        });
    });

    describe('destroy', function ()
    {
        it('should return early without throwing when renderer is already null', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);
            wrapper.renderer = null;

            expect(function ()
            {
                wrapper.destroy();
            }).not.toThrow();
        });

        it('should set renderer to null', function ()
        {
            var renderer = createMockRenderer();
            var wrapper = new WebGLFramebufferWrapper(renderer, null);

            wrapper.destroy();

            expect(wrapper.renderer).toBeNull();
        });

        it('should set webGLFramebuffer to null', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            wrapper.destroy();

            expect(wrapper.webGLFramebuffer).toBeNull();
        });

        it('should set renderTexture to null', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            wrapper.destroy();

            expect(wrapper.renderTexture).toBeNull();
        });

        it('should empty the attachments array', function ()
        {
            var renderer = createMockRenderer();
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            wrapper.destroy();

            expect(wrapper.attachments.length).toBe(0);
        });

        it('should call deleteFramebuffer on the GL context', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);
            var fb = wrapper.webGLFramebuffer;

            wrapper.destroy();

            expect(gl.deleteFramebuffer).toHaveBeenCalledWith(fb);
        });

        it('should call deleteTexture for texture attachments', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            wrapper.destroy();

            expect(renderer.deleteTexture).toHaveBeenCalledWith(texture);
        });

        it('should call framebufferTexture2D with null when detaching texture', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            wrapper.destroy();

            expect(gl.framebufferTexture2D).toHaveBeenCalledWith(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D,
                null,
                0
            );
        });

        it('should call deleteRenderbuffer for renderbuffer attachments', function ()
        {
            var gl = createMockGL();
            var glWrapper = createMockGLWrapper();
            var renderer = createMockRenderer(gl, glWrapper);
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ], false, true);

            var renderbuffer = wrapper.attachments[1].renderbuffer;
            gl.deleteRenderbuffer.mockClear();

            wrapper.destroy();

            expect(gl.deleteRenderbuffer).toHaveBeenCalledWith(renderbuffer);
        });

        it('should call updateBindingsFramebuffer to clear global bindings', function ()
        {
            var gl = createMockGL();
            var glWrapper = createMockGLWrapper();
            var renderer = createMockRenderer(gl, glWrapper);
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            glWrapper.updateBindingsFramebuffer.mockClear();
            wrapper.destroy();

            var calls = glWrapper.updateBindingsFramebuffer.mock.calls;
            var lastCall = calls[calls.length - 1];
            expect(lastCall[0].bindings.framebuffer).toBeNull();
        });

        it('should be idempotent - second destroy is a no-op', function ()
        {
            var gl = createMockGL();
            var renderer = createMockRenderer(gl, createMockGLWrapper());
            var texture = createMockTexture();
            var wrapper = new WebGLFramebufferWrapper(renderer, [ texture ]);

            wrapper.destroy();
            gl.deleteFramebuffer.mockClear();

            expect(function ()
            {
                wrapper.destroy();
            }).not.toThrow();

            expect(gl.deleteFramebuffer).not.toHaveBeenCalled();
        });
    });
});
