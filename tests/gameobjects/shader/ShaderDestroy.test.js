// Match the renderer-first module order used by the Phaser bundle.
require('../../../src/renderer');

var Shader = require('../../../src/gameobjects/shader/Shader');
var WebGLRenderer = require('../../../src/renderer/webgl/WebGLRenderer');
var WebGLVAOWrapper = require('../../../src/renderer/webgl/wrappers/WebGLVAOWrapper');

describe('Shader destruction', function ()
{
    function createFixture (variantCount)
    {
        var sharedProgram = { destroy: vi.fn() };
        var sharedIndexBuffer = { destroy: vi.fn() };
        var unrelatedBuffer = { destroy: vi.fn() };
        var vertexBuffer = { destroy: vi.fn() };
        var unrelatedVAO = { destroy: vi.fn() };
        var inputTexture = { destroy: vi.fn() };
        var renderer = {
            gl: { deleteVertexArray: vi.fn() },
            glVAOWrappers: [ unrelatedVAO ],
            glBufferWrappers: [ sharedIndexBuffer, unrelatedBuffer, vertexBuffer ],
            deleteBuffer: WebGLRenderer.prototype.deleteBuffer
        };
        var programs = {};
        var vaos = [];

        for (var i = 0; i < variantCount; i++)
        {
            var vao = Object.create(WebGLVAOWrapper.prototype);

            vao.renderer = renderer;
            vao.vertexArrayObject = { variant: i };
            vao.indexBuffer = sharedIndexBuffer;
            vao.attributeBufferLayouts = [ { buffer: vertexBuffer } ];
            vao.glState = { vao: vao };
            renderer.glVAOWrappers.push(vao);
            programs['variant' + i] = { program: sharedProgram, vao: vao };
            vaos.push(vao);
        }

        var shader = Object.create(Shader.prototype);

        shader.renderNode = {
            renderer: renderer,
            programManager: { programs: programs },
            vertexBufferLayout: { buffer: vertexBuffer },
            indexBuffer: sharedIndexBuffer
        };
        shader.textures = [ inputTexture ];
        shader.drawingContext = null;

        return {
            shader: shader,
            renderer: renderer,
            vertexBuffer: vertexBuffer,
            sharedProgram: sharedProgram,
            sharedIndexBuffer: sharedIndexBuffer,
            unrelatedBuffer: unrelatedBuffer,
            unrelatedVAO: unrelatedVAO,
            inputTexture: inputTexture,
            vaos: vaos
        };
    }

    it('releases its vertex buffer even if the shader never rendered', function ()
    {
        var fixture = createFixture(0);

        fixture.shader.preDestroy();

        expect(fixture.vertexBuffer.destroy).toHaveBeenCalledOnce();
        expect(fixture.renderer.glBufferWrappers).toEqual([
            fixture.sharedIndexBuffer, fixture.unrelatedBuffer
        ]);
        expect(fixture.renderer.gl.deleteVertexArray).not.toHaveBeenCalled();
    });

    it('releases every owned VAO without destroying shared or unrelated resources', function ()
    {
        var fixture = createFixture(2);
        var handles = fixture.vaos.map(function (vao) { return vao.vertexArrayObject; });

        fixture.shader.preDestroy();

        expect(fixture.renderer.glVAOWrappers).toEqual([ fixture.unrelatedVAO ]);
        expect(fixture.renderer.gl.deleteVertexArray).toHaveBeenCalledTimes(2);
        expect(fixture.renderer.gl.deleteVertexArray).toHaveBeenCalledWith(handles[0]);
        expect(fixture.renderer.gl.deleteVertexArray).toHaveBeenCalledWith(handles[1]);
        expect(fixture.vaos[0].renderer).toBeNull();
        expect(fixture.vaos[1].renderer).toBeNull();
        expect(fixture.vertexBuffer.destroy).toHaveBeenCalledOnce();
        expect(fixture.sharedProgram.destroy).not.toHaveBeenCalled();
        expect(fixture.sharedIndexBuffer.destroy).not.toHaveBeenCalled();
        expect(fixture.unrelatedBuffer.destroy).not.toHaveBeenCalled();
        expect(fixture.unrelatedVAO.destroy).not.toHaveBeenCalled();
        expect(fixture.inputTexture.destroy).not.toHaveBeenCalled();
        expect(fixture.shader.renderNode).toBeNull();
    });

    it('does not unregister an unrelated VAO if its own VAO was already removed', function ()
    {
        var fixture = createFixture(1);

        fixture.renderer.glVAOWrappers.pop();
        fixture.shader.preDestroy();

        expect(fixture.renderer.glVAOWrappers).toEqual([ fixture.unrelatedVAO ]);
        expect(fixture.renderer.gl.deleteVertexArray).toHaveBeenCalledOnce();
        expect(fixture.unrelatedVAO.destroy).not.toHaveBeenCalled();
    });

    it('does not release resources again when preDestroy is called twice', function ()
    {
        var fixture = createFixture(1);

        fixture.shader.preDestroy();
        fixture.shader.preDestroy();

        expect(fixture.vertexBuffer.destroy).toHaveBeenCalledOnce();
        expect(fixture.renderer.gl.deleteVertexArray).toHaveBeenCalledOnce();
    });

    it('continues to destroy its render-to-texture resources', function ()
    {
        var fixture = createFixture(1);
        var drawingContext = { destroy: vi.fn() };
        var texture = { destroy: vi.fn() };

        fixture.shader.drawingContext = drawingContext;
        fixture.shader.texture = texture;
        fixture.shader.glTexture = {};
        fixture.shader.preDestroy();

        expect(drawingContext.destroy).toHaveBeenCalledOnce();
        expect(texture.destroy).toHaveBeenCalledOnce();
        expect(fixture.shader.drawingContext).toBeNull();
        expect(fixture.shader.texture).toBeNull();
        expect(fixture.shader.glTexture).toBeNull();
        expect(fixture.vertexBuffer.destroy).toHaveBeenCalledOnce();
    });
});
