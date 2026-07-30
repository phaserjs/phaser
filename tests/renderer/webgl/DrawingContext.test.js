var DrawingContext = require('../../../src/renderer/webgl/DrawingContext');

function createMockFramebuffer ()
{
    return { resize: vi.fn() };
}

function createMockTexture ()
{
    return {};
}

function createMockRenderer (width, height)
{
    var framebuffer = createMockFramebuffer();
    var texture = createMockTexture();

    return {
        width: width !== undefined ? width : 800,
        height: height !== undefined ? height : 600,
        config: {
            antialias: true
        },
        gl: {
            COLOR_BUFFER_BIT: 16384,
            DEPTH_BUFFER_BIT: 256,
            STENCIL_BUFFER_BIT: 1024,
            clear: vi.fn()
        },
        blendModes: [
            { enable: false, equation: null, func: null },
            { enable: true, equation: 'ADD', func: [ 1, 1 ] },
            { enable: true, equation: 'MUL', func: [ 0, 1 ] }
        ],
        createTexture2D: vi.fn(function () { return texture; }),
        createFramebuffer: vi.fn(function () { return framebuffer; }),
        renderNodes: {
            finishBatch: vi.fn()
        },
        glTextureUnits: {
            unbindTexture: vi.fn()
        },
        glWrapper: {
            update: vi.fn()
        },
        deleteTexture: vi.fn(),
        deleteFramebuffer: vi.fn(),
        _mockFramebuffer: framebuffer,
        _mockTexture: texture
    };
}

describe('DrawingContext', function ()
{
    var renderer;

    beforeEach(function ()
    {
        renderer = createMockRenderer();
    });

    describe('constructor', function ()
    {
        it('should create with default values when no options given', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(ctx.renderer).toBe(renderer);
            expect(ctx.camera).toBeNull();
            expect(ctx.useCanvas).toBe(false);
            expect(ctx.texture).toBe(renderer._mockTexture);
            expect(ctx.pool).toBeNull();
            expect(ctx.lastUsed).toBe(0);
            expect(ctx.blendMode).toBe(0);
        });

        it('should set width and height from renderer when no options given', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(ctx.width).toBe(800);
            expect(ctx.height).toBe(600);
        });

        it('should use custom width and height from options', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 400, height: 300 });

            expect(ctx.width).toBe(400);
            expect(ctx.height).toBe(300);
        });

        it('should set clearColor from options', function ()
        {
            var ctx = new DrawingContext(renderer, { clearColor: [ 1, 0, 0, 1 ] });

            expect(ctx.state.colorClearValue).toEqual([ 1, 0, 0, 1 ]);
        });

        it('should default clearColor to [0, 0, 0, 0]', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(ctx.state.colorClearValue).toEqual([ 0, 0, 0, 0 ]);
        });

        it('should set autoClear by default (color, depth, stencil)', function ()
        {
            var ctx = new DrawingContext(renderer);
            var gl = renderer.gl;

            expect(ctx.autoClear).toBe(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        });

        it('should disable autoClear when options.autoClear is false', function ()
        {
            var ctx = new DrawingContext(renderer, { autoClear: false });

            expect(ctx.autoClear).toBe(0);
        });

        it('should apply autoClear from array options', function ()
        {
            var gl = renderer.gl;
            var ctx = new DrawingContext(renderer, { autoClear: [ true, false, false ] });

            expect(ctx.autoClear).toBe(gl.COLOR_BUFFER_BIT);
        });

        it('should set useCanvas from options', function ()
        {
            var ctx = new DrawingContext(renderer, { useCanvas: true });

            expect(ctx.useCanvas).toBe(true);
        });

        it('should set pool from options', function ()
        {
            var pool = { add: vi.fn() };
            var ctx = new DrawingContext(renderer, { pool: pool });

            expect(ctx.pool).toBe(pool);
        });

        it('should set camera from options', function ()
        {
            var camera = { id: 'cam1' };
            var ctx = new DrawingContext(renderer, { camera: camera });

            expect(ctx.camera).toBe(camera);
        });

        it('should set blendMode from options', function ()
        {
            var ctx = new DrawingContext(renderer, { blendMode: 1 });

            expect(ctx.blendMode).toBe(1);
        });

        it('should initialise _locks as an empty array', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(ctx._locks).toEqual([]);
        });

        it('should set initial scissor box to match dimensions', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 200, height: 100 });

            expect(ctx.state.scissor.box).toEqual([ 0, 0, 200, 100 ]);
        });

        it('should set initial viewport to match dimensions', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 200, height: 100 });

            expect(ctx.state.viewport).toEqual([ 0, 0, 200, 100 ]);
        });

        it('should enable scissor by default', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(ctx.state.scissor.enable).toBe(true);
        });

        it('should copy from another context when copyFrom option provided', function ()
        {
            var source = new DrawingContext(renderer, { width: 128, height: 64 });
            var ctx = new DrawingContext(renderer, { copyFrom: source });

            expect(ctx.width).toBe(128);
            expect(ctx.height).toBe(64);
            expect(ctx.framebuffer).toBe(source.framebuffer);
        });

        it('should create a canvas framebuffer when useCanvas is true', function ()
        {
            var ctx = new DrawingContext(renderer, { useCanvas: true });

            expect(renderer.createFramebuffer).toHaveBeenCalledWith(null);
            expect(ctx.framebuffer).toBe(renderer._mockFramebuffer);
            expect(ctx.texture).toBeNull();
        });
    });

    describe('resize', function ()
    {
        it('should update width and height', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 100, height: 100 });
            ctx.resize(400, 300);

            expect(ctx.width).toBe(400);
            expect(ctx.height).toBe(300);
        });

        it('should update scissor box to new dimensions', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.resize(320, 240);

            expect(ctx.state.scissor.box).toEqual([ 0, 0, 320, 240 ]);
        });

        it('should update viewport to new dimensions', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.resize(320, 240);

            expect(ctx.state.viewport).toEqual([ 0, 0, 320, 240 ]);
        });

        it('should round fractional width and height', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.resize(100.7, 200.3);

            expect(ctx.width).toBe(101);
            expect(ctx.height).toBe(200);
        });

        it('should clamp width to 1 when zero or negative', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.resize(0, 100);

            expect(ctx.width).toBe(1);
        });

        it('should clamp height to 1 when zero or negative', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.resize(100, -5);

            expect(ctx.height).toBe(1);
        });

        it('should call framebuffer.resize when framebuffer already exists', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(ctx.framebuffer).toBeTruthy();

            ctx.resize(512, 256);

            expect(renderer._mockFramebuffer.resize).toHaveBeenCalledWith(512, 256);
        });

        it('should update state.bindings.framebuffer to match framebuffer', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.resize(200, 200);

            expect(ctx.state.bindings.framebuffer).toBe(ctx.framebuffer);
        });

        it('should create texture and framebuffer if none exist (non-canvas)', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 50, height: 50 });

            expect(renderer.createTexture2D).toHaveBeenCalled();
            expect(renderer.createFramebuffer).toHaveBeenCalled();
        });
    });

    describe('copy', function ()
    {
        it('should copy width and height from source', function ()
        {
            var source = new DrawingContext(renderer, { width: 256, height: 128 });
            var ctx = new DrawingContext(renderer, { width: 10, height: 10 });
            ctx.copy(source);

            expect(ctx.width).toBe(256);
            expect(ctx.height).toBe(128);
        });

        it('should copy framebuffer and texture references from source', function ()
        {
            var source = new DrawingContext(renderer, { width: 64, height: 64 });
            var ctx = new DrawingContext(renderer, { width: 10, height: 10 });
            ctx.copy(source);

            expect(ctx.framebuffer).toBe(source.framebuffer);
            expect(ctx.texture).toBe(source.texture);
        });

        it('should copy camera reference from source', function ()
        {
            var camera = { id: 'testCam' };
            var source = new DrawingContext(renderer, { camera: camera });
            var ctx = new DrawingContext(renderer);
            ctx.copy(source);

            expect(ctx.camera).toBe(camera);
        });

        it('should copy blendMode from source', function ()
        {
            var source = new DrawingContext(renderer, { blendMode: 1 });
            var ctx = new DrawingContext(renderer);
            ctx.copy(source);

            expect(ctx.blendMode).toBe(1);
        });

        it('should copy autoClear from source', function ()
        {
            var source = new DrawingContext(renderer, { autoClear: false });
            var ctx = new DrawingContext(renderer);
            ctx.copy(source);

            expect(ctx.autoClear).toBe(0);
        });

        it('should deep-copy colorClearValue so mutations do not affect source', function ()
        {
            var source = new DrawingContext(renderer, { clearColor: [ 0.5, 0.5, 0.5, 1 ] });
            var ctx = new DrawingContext(renderer);
            ctx.copy(source);

            ctx.state.colorClearValue[0] = 0;

            expect(source.state.colorClearValue[0]).toBe(0.5);
        });

        it('should deep-copy scissor box so mutations do not affect source', function ()
        {
            var source = new DrawingContext(renderer, { width: 200, height: 200 });
            var ctx = new DrawingContext(renderer);
            ctx.copy(source);

            ctx.state.scissor.box[0] = 99;

            expect(source.state.scissor.box[0]).toBe(0);
        });

        it('should deep-copy viewport so mutations do not affect source', function ()
        {
            var source = new DrawingContext(renderer, { width: 200, height: 200 });
            var ctx = new DrawingContext(renderer);
            ctx.copy(source);

            ctx.state.viewport[0] = 99;

            expect(source.state.viewport[0]).toBe(0);
        });

        it('should copy scissor enable from source', function ()
        {
            var source = new DrawingContext(renderer);
            source.setScissorEnable(false);
            var ctx = new DrawingContext(renderer);
            ctx.copy(source);

            expect(ctx.state.scissor.enable).toBe(false);
        });
    });

    describe('getClone', function ()
    {
        it('should return a new DrawingContext instance', function ()
        {
            var ctx = new DrawingContext(renderer);
            var clone = ctx.getClone();

            expect(clone).toBeInstanceOf(DrawingContext);
            expect(clone).not.toBe(ctx);
        });

        it('should share the same framebuffer as the source', function ()
        {
            var ctx = new DrawingContext(renderer);
            var clone = ctx.getClone();

            expect(clone.framebuffer).toBe(ctx.framebuffer);
        });

        it('should set autoClear to 0 by default', function ()
        {
            var ctx = new DrawingContext(renderer);
            var clone = ctx.getClone();

            expect(clone.autoClear).toBe(0);
        });

        it('should preserve autoClear when preserveAutoClear is true', function ()
        {
            var ctx = new DrawingContext(renderer);
            var clone = ctx.getClone(true);

            expect(clone.autoClear).toBe(ctx.autoClear);
        });

        it('should copy width and height from source', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 128, height: 64 });
            var clone = ctx.getClone();

            expect(clone.width).toBe(128);
            expect(clone.height).toBe(64);
        });
    });

    describe('setAutoClear', function ()
    {
        it('should set autoClear to COLOR_BUFFER_BIT when only color is true', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setAutoClear(true, false, false);

            expect(ctx.autoClear).toBe(renderer.gl.COLOR_BUFFER_BIT);
        });

        it('should set autoClear to DEPTH_BUFFER_BIT when only depth is true', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setAutoClear(false, true, false);

            expect(ctx.autoClear).toBe(renderer.gl.DEPTH_BUFFER_BIT);
        });

        it('should set autoClear to STENCIL_BUFFER_BIT when only stencil is true', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setAutoClear(false, false, true);

            expect(ctx.autoClear).toBe(renderer.gl.STENCIL_BUFFER_BIT);
        });

        it('should combine all bits when all are true', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setAutoClear(true, true, true);
            var gl = renderer.gl;

            expect(ctx.autoClear).toBe(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        });

        it('should set autoClear to 0 when all are false', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setAutoClear(false, false, false);

            expect(ctx.autoClear).toBe(0);
        });
    });

    describe('setBlendMode', function ()
    {
        it('should update blendMode property', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setBlendMode(1);

            expect(ctx.blendMode).toBe(1);
        });

        it('should update state blend data from renderer blendModes', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setBlendMode(1);

            expect(ctx.state.blend.enable).toBe(renderer.blendModes[1].enable);
            expect(ctx.state.blend.equation).toBe(renderer.blendModes[1].equation);
            expect(ctx.state.blend.func).toBe(renderer.blendModes[1].func);
        });

        it('should not update if the same blendMode is set again', function ()
        {
            var ctx = new DrawingContext(renderer, { blendMode: 1 });
            var callsBefore = renderer.blendModes[1].func;

            ctx.setBlendMode(1);

            expect(ctx.blendMode).toBe(1);
        });

        it('should set blend color when blendColor is provided', function ()
        {
            var ctx = new DrawingContext(renderer);
            var color = [ 1, 0, 0, 1 ];
            ctx.setBlendMode(1, color);

            expect(ctx.state.blend.color).toBe(color);
        });

        it('should clear blend color when no blendColor is provided', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setBlendMode(1, [ 1, 0, 0, 1 ]);
            ctx.setBlendMode(2);

            expect(ctx.state.blend.color).toBeUndefined();
        });
    });

    describe('setCamera', function ()
    {
        it('should set the camera property', function ()
        {
            var ctx = new DrawingContext(renderer);
            var camera = { id: 'cam' };
            ctx.setCamera(camera);

            expect(ctx.camera).toBe(camera);
        });

        it('should accept null', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setCamera({ id: 'cam' });
            ctx.setCamera(null);

            expect(ctx.camera).toBeNull();
        });
    });

    describe('setClearColor', function ()
    {
        it('should update colorClearValue', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setClearColor(1, 0, 0, 1);

            expect(ctx.state.colorClearValue).toEqual([ 1, 0, 0, 1 ]);
        });

        it('should not update if the same color is set again', function ()
        {
            var ctx = new DrawingContext(renderer, { clearColor: [ 1, 0, 0, 1 ] });
            var before = ctx.state.colorClearValue;
            ctx.setClearColor(1, 0, 0, 1);

            expect(ctx.state.colorClearValue).toBe(before);
        });

        it('should update when any component differs', function ()
        {
            var ctx = new DrawingContext(renderer, { clearColor: [ 1, 0, 0, 1 ] });
            ctx.setClearColor(1, 0, 0, 0.5);

            expect(ctx.state.colorClearValue[3]).toBeCloseTo(0.5);
        });
    });

    describe('setScissorBox', function ()
    {
        it('should set the scissor box', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 800, height: 600 });
            ctx.setScissorBox(10, 20, 200, 100);

            expect(ctx.state.scissor.box[0]).toBe(10);
            expect(ctx.state.scissor.box[2]).toBe(200);
            expect(ctx.state.scissor.box[3]).toBe(100);
        });

        it('should convert Y coordinate to WebGL space (bottom-left origin)', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 800, height: 600 });
            ctx.setScissorBox(0, 50, 800, 100);

            // y = height - y - boxHeight = 600 - 50 - 100 = 450
            expect(ctx.state.scissor.box[1]).toBe(450);
        });

        it('should handle Y = 0 correctly', function ()
        {
            var ctx = new DrawingContext(renderer, { width: 800, height: 600 });
            ctx.setScissorBox(0, 0, 800, 600);

            // y = 600 - 0 - 600 = 0
            expect(ctx.state.scissor.box[1]).toBe(0);
        });

        it('should store the correct box array length', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setScissorBox(5, 10, 100, 200);

            expect(ctx.state.scissor.box.length).toBe(4);
        });
    });

    describe('setScissorEnable', function ()
    {
        it('should enable the scissor box', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setScissorEnable(false);
            ctx.setScissorEnable(true);

            expect(ctx.state.scissor.enable).toBe(true);
        });

        it('should disable the scissor box', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.setScissorEnable(false);

            expect(ctx.state.scissor.enable).toBe(false);
        });
    });

    describe('lock', function ()
    {
        it('should add a key to _locks', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.lock('keyA');

            expect(ctx._locks).toContain('keyA');
        });

        it('should not add the same key twice', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.lock('keyA');
            ctx.lock('keyA');

            expect(ctx._locks.length).toBe(1);
        });

        it('should support multiple distinct keys', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.lock('keyA');
            ctx.lock('keyB');

            expect(ctx._locks.length).toBe(2);
        });

        it('should support non-string keys', function ()
        {
            var ctx = new DrawingContext(renderer);
            var obj = {};
            ctx.lock(obj);

            expect(ctx._locks).toContain(obj);
        });
    });

    describe('unlock', function ()
    {
        it('should remove the key from _locks', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.lock('keyA');
            ctx.unlock('keyA');

            expect(ctx._locks).not.toContain('keyA');
        });

        it('should not throw when key is not present', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(function () { ctx.unlock('nonexistent'); }).not.toThrow();
        });

        it('should only remove the specified key', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.lock('keyA');
            ctx.lock('keyB');
            ctx.unlock('keyA');

            expect(ctx._locks).not.toContain('keyA');
            expect(ctx._locks).toContain('keyB');
        });

        it('should call release when release param is true and no locks remain', function ()
        {
            var pool = { add: vi.fn() };
            var ctx = new DrawingContext(renderer, { pool: pool });
            ctx.lock('keyA');
            ctx.unlock('keyA', true);

            expect(pool.add).toHaveBeenCalledWith(ctx);
        });

        it('should not call release when other locks still exist', function ()
        {
            var pool = { add: vi.fn() };
            var ctx = new DrawingContext(renderer, { pool: pool });
            ctx.lock('keyA');
            ctx.lock('keyB');
            ctx.unlock('keyA', true);

            expect(pool.add).not.toHaveBeenCalled();
        });
    });

    describe('isLocked', function ()
    {
        it('should return false when there are no locks', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(ctx.isLocked()).toBe(false);
        });

        it('should return true when locked', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.lock('key');

            expect(ctx.isLocked()).toBe(true);
        });

        it('should return false after all locks are removed', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.lock('keyA');
            ctx.lock('keyB');
            ctx.unlock('keyA');
            ctx.unlock('keyB');

            expect(ctx.isLocked()).toBe(false);
        });
    });

    describe('release', function ()
    {
        it('should add to pool when pool exists and no locks', function ()
        {
            var pool = { add: vi.fn() };
            var ctx = new DrawingContext(renderer, { pool: pool });
            ctx.release();

            expect(pool.add).toHaveBeenCalledWith(ctx);
        });

        it('should update lastUsed when returned to pool', function ()
        {
            var pool = { add: vi.fn() };
            var ctx = new DrawingContext(renderer, { pool: pool });
            var before = Date.now();
            ctx.release();

            expect(ctx.lastUsed).toBeGreaterThanOrEqual(before);
        });

        it('should not add to pool when locked', function ()
        {
            var pool = { add: vi.fn() };
            var ctx = new DrawingContext(renderer, { pool: pool });
            ctx.lock('key');
            ctx.release();

            expect(pool.add).not.toHaveBeenCalled();
        });

        it('should not add to pool when no pool is set', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(function () { ctx.release(); }).not.toThrow();
        });

        it('should call renderNodes.finishBatch', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.release();

            expect(renderer.renderNodes.finishBatch).toHaveBeenCalled();
        });
    });

    describe('use', function ()
    {
        it('should call renderNodes.finishBatch', function ()
        {
            var ctx = new DrawingContext(renderer, { autoClear: false });
            ctx.use();

            expect(renderer.renderNodes.finishBatch).toHaveBeenCalled();
        });

        it('should call clear when autoClear is set', function ()
        {
            var ctx = new DrawingContext(renderer);

            expect(ctx.autoClear).toBeGreaterThan(0);

            ctx.use();

            expect(renderer.gl.clear).toHaveBeenCalled();
        });

        it('should not call clear when autoClear is 0', function ()
        {
            var ctx = new DrawingContext(renderer, { autoClear: false });
            ctx.use();

            expect(renderer.gl.clear).not.toHaveBeenCalled();
        });
    });

    describe('beginDraw', function ()
    {
        it('should call glWrapper.update with state', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.beginDraw();

            expect(renderer.glWrapper.update).toHaveBeenCalledWith(ctx.state);
        });

        it('should call glTextureUnits.unbindTexture when framebuffer exists', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.beginDraw();

            expect(renderer.glTextureUnits.unbindTexture).toHaveBeenCalledWith(ctx.texture);
        });
    });

    describe('clear', function ()
    {
        it('should call gl.clear with autoClear bits by default', function ()
        {
            var ctx = new DrawingContext(renderer);
            var gl = renderer.gl;
            var expected = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT;
            ctx.clear();

            expect(gl.clear).toHaveBeenCalledWith(expected);
        });

        it('should call gl.clear with provided bits', function ()
        {
            var ctx = new DrawingContext(renderer);
            var gl = renderer.gl;
            ctx.clear(gl.COLOR_BUFFER_BIT);

            expect(gl.clear).toHaveBeenCalledWith(gl.COLOR_BUFFER_BIT);
        });

        it('should call glWrapper.update before clearing', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.clear();

            expect(renderer.glWrapper.update).toHaveBeenCalled();
        });
    });

    describe('destroy', function ()
    {
        it('should null out renderer reference', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.destroy();

            expect(ctx.renderer).toBeNull();
        });

        it('should null out camera reference', function ()
        {
            var camera = { id: 'cam' };
            var ctx = new DrawingContext(renderer, { camera: camera });
            ctx.destroy();

            expect(ctx.camera).toBeNull();
        });

        it('should null out state', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.destroy();

            expect(ctx.state).toBeNull();
        });

        it('should null out framebuffer', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.destroy();

            expect(ctx.framebuffer).toBeNull();
        });

        it('should null out texture', function ()
        {
            var ctx = new DrawingContext(renderer);
            ctx.destroy();

            expect(ctx.texture).toBeNull();
        });

        it('should call renderer.deleteTexture', function ()
        {
            var ctx = new DrawingContext(renderer);
            var texture = ctx.texture;
            ctx.destroy();

            expect(renderer.deleteTexture).toHaveBeenCalledWith(texture);
        });

        it('should call renderer.deleteFramebuffer', function ()
        {
            var ctx = new DrawingContext(renderer);
            var fb = ctx.state.bindings.framebuffer;
            ctx.destroy();

            expect(renderer.deleteFramebuffer).toHaveBeenCalledWith(fb);
        });
    });
});
