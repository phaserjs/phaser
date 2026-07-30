var WebGLTextureUnitsWrapper = require('../../../../src/renderer/webgl/wrappers/WebGLTextureUnitsWrapper');

function createMockRenderer (maxTextures)
{
    var glTexture = {};
    var gl = {
        TEXTURE_2D: 0x0DE1,
        RGBA: 0x1908,
        UNSIGNED_BYTE: 0x1401,
        createTexture: vi.fn(function () { return glTexture; }),
        bindTexture: vi.fn(),
        texImage2D: vi.fn()
    };

    return {
        gl: gl,
        maxTextures: maxTextures !== undefined ? maxTextures : 4,
        glWrapper: {
            updateBindingsActiveTexture: vi.fn()
        }
    };
}

function createMockTexture (id)
{
    return {
        webGLTexture: { id: id || 'texture' }
    };
}

describe('WebGLTextureUnitsWrapper', function ()
{
    var renderer;
    var wrapper;

    beforeEach(function ()
    {
        renderer = createMockRenderer(4);
        wrapper = new WebGLTextureUnitsWrapper(renderer);
    });

    describe('constructor', function ()
    {
        it('should store the renderer reference', function ()
        {
            expect(wrapper.renderer).toBe(renderer);
        });

        it('should initialize units as an array', function ()
        {
            expect(Array.isArray(wrapper.units)).toBe(true);
        });

        it('should initialize unitIndices as an array', function ()
        {
            expect(Array.isArray(wrapper.unitIndices)).toBe(true);
        });

        it('should call init during construction', function ()
        {
            expect(renderer.gl.createTexture).toHaveBeenCalled();
        });
    });

    describe('init', function ()
    {
        it('should set units array length to maxTextures', function ()
        {
            expect(wrapper.units.length).toBe(renderer.maxTextures);
        });

        it('should set unitIndices array length to maxTextures', function ()
        {
            expect(wrapper.unitIndices.length).toBe(renderer.maxTextures);
        });

        it('should populate unitIndices with sequential indices', function ()
        {
            for (var i = 0; i < renderer.maxTextures; i++)
            {
                expect(wrapper.unitIndices[i]).toBe(i);
            }
        });

        it('should set all units to undefined', function ()
        {
            for (var i = 0; i < renderer.maxTextures; i++)
            {
                expect(wrapper.units[i]).toBeUndefined();
            }
        });

        it('should call gl.createTexture once', function ()
        {
            expect(renderer.gl.createTexture).toHaveBeenCalledTimes(1);
        });

        it('should call gl.bindTexture for each texture unit', function ()
        {
            expect(renderer.gl.bindTexture).toHaveBeenCalledTimes(renderer.maxTextures);
        });

        it('should call gl.texImage2D once', function ()
        {
            expect(renderer.gl.texImage2D).toHaveBeenCalledTimes(1);
        });

        it('should call updateBindingsActiveTexture for each unit during init', function ()
        {
            expect(renderer.glWrapper.updateBindingsActiveTexture).toHaveBeenCalledTimes(renderer.maxTextures);
        });

        it('should reset units and unitIndices when called again', function ()
        {
            wrapper.units[0] = createMockTexture('old');
            renderer.gl.createTexture.mockClear();
            renderer.gl.bindTexture.mockClear();
            renderer.gl.texImage2D.mockClear();
            renderer.glWrapper.updateBindingsActiveTexture.mockClear();

            wrapper.init();

            expect(wrapper.units.length).toBe(renderer.maxTextures);
            expect(wrapper.unitIndices.length).toBe(renderer.maxTextures);
            expect(wrapper.units[0]).toBeUndefined();
        });

        it('should work with maxTextures of 1', function ()
        {
            var r = createMockRenderer(1);
            var w = new WebGLTextureUnitsWrapper(r);
            expect(w.units.length).toBe(1);
            expect(w.unitIndices.length).toBe(1);
            expect(w.unitIndices[0]).toBe(0);
        });

        it('should work with maxTextures of 8', function ()
        {
            var r = createMockRenderer(8);
            var w = new WebGLTextureUnitsWrapper(r);
            expect(w.units.length).toBe(8);
            expect(w.unitIndices.length).toBe(8);
            for (var i = 0; i < 8; i++)
            {
                expect(w.unitIndices[i]).toBe(i);
            }
        });
    });

    describe('bind', function ()
    {
        beforeEach(function ()
        {
            // Set units to undefined so binding new textures triggers needsBind
            for (var i = 0; i < renderer.maxTextures; i++)
            {
                wrapper.units[i] = undefined;
            }
            renderer.gl.bindTexture.mockClear();
            renderer.glWrapper.updateBindingsActiveTexture.mockClear();
        });

        it('should update the unit to the given texture', function ()
        {
            var texture = createMockTexture('tex0');
            wrapper.bind(texture, 0);
            expect(wrapper.units[0]).toBe(texture);
        });

        it('should call gl.bindTexture with the texture webGLTexture', function ()
        {
            var texture = createMockTexture('tex1');
            wrapper.bind(texture, 1);
            expect(renderer.gl.bindTexture).toHaveBeenCalledWith(renderer.gl.TEXTURE_2D, texture.webGLTexture);
        });

        it('should call gl.bindTexture with null when texture is null', function ()
        {
            wrapper.units[0] = createMockTexture('existing');
            renderer.gl.bindTexture.mockClear();
            wrapper.bind(null, 0);
            expect(renderer.gl.bindTexture).toHaveBeenCalledWith(renderer.gl.TEXTURE_2D, null);
        });

        it('should set unit to null when binding null', function ()
        {
            wrapper.units[0] = createMockTexture('existing');
            wrapper.bind(null, 0);
            expect(wrapper.units[0]).toBeNull();
        });

        it('should not call gl.bindTexture when same texture is already bound and force is false', function ()
        {
            var texture = createMockTexture('same');
            wrapper.units[2] = texture;
            renderer.gl.bindTexture.mockClear();
            wrapper.bind(texture, 2, false);
            expect(renderer.gl.bindTexture).not.toHaveBeenCalled();
        });

        it('should call gl.bindTexture when same texture is already bound but force is true', function ()
        {
            var texture = createMockTexture('forced');
            wrapper.units[1] = texture;
            renderer.gl.bindTexture.mockClear();
            wrapper.bind(texture, 1, true);
            expect(renderer.gl.bindTexture).toHaveBeenCalledWith(renderer.gl.TEXTURE_2D, texture.webGLTexture);
        });

        it('should call updateBindingsActiveTexture when binding a new texture', function ()
        {
            var texture = createMockTexture('new');
            wrapper.units[0] = undefined;
            wrapper.bind(texture, 0);
            expect(renderer.glWrapper.updateBindingsActiveTexture).toHaveBeenCalled();
        });

        it('should call updateBindingsActiveTexture with the correct unit', function ()
        {
            var texture = createMockTexture('new');
            wrapper.bind(texture, 2);
            var lastCall = renderer.glWrapper.updateBindingsActiveTexture.mock.calls[
                renderer.glWrapper.updateBindingsActiveTexture.mock.calls.length - 1
            ];
            expect(lastCall[0].bindings.activeTexture).toBe(2);
        });

        it('should call updateBindingsActiveTexture when forceActive is not false', function ()
        {
            var texture = createMockTexture('tex');
            wrapper.units[0] = texture;
            renderer.glWrapper.updateBindingsActiveTexture.mockClear();
            // same texture, no force, but forceActive defaults to true
            wrapper.bind(texture, 0, false, true);
            expect(renderer.glWrapper.updateBindingsActiveTexture).toHaveBeenCalled();
        });

        it('should not call updateBindingsActiveTexture when texture is same, no force, and forceActive is false', function ()
        {
            var texture = createMockTexture('tex');
            wrapper.units[0] = texture;
            renderer.glWrapper.updateBindingsActiveTexture.mockClear();
            wrapper.bind(texture, 0, false, false);
            expect(renderer.glWrapper.updateBindingsActiveTexture).not.toHaveBeenCalled();
        });

        it('should bind different textures to different units independently', function ()
        {
            var tex0 = createMockTexture('t0');
            var tex1 = createMockTexture('t1');
            wrapper.bind(tex0, 0);
            wrapper.bind(tex1, 1);
            expect(wrapper.units[0]).toBe(tex0);
            expect(wrapper.units[1]).toBe(tex1);
        });
    });

    describe('bindUnits', function ()
    {
        beforeEach(function ()
        {
            for (var i = 0; i < renderer.maxTextures; i++)
            {
                wrapper.units[i] = undefined;
            }
            renderer.gl.bindTexture.mockClear();
            renderer.glWrapper.updateBindingsActiveTexture.mockClear();
        });

        it('should bind each provided texture to its corresponding unit', function ()
        {
            var tex0 = createMockTexture('t0');
            var tex1 = createMockTexture('t1');
            wrapper.bindUnits([ tex0, tex1 ]);
            expect(wrapper.units[0]).toBe(tex0);
            expect(wrapper.units[1]).toBe(tex1);
        });

        it('should skip undefined entries', function ()
        {
            var tex0 = createMockTexture('t0');
            wrapper.bindUnits([ tex0, undefined, undefined, undefined ]);
            expect(wrapper.units[0]).toBe(tex0);
            expect(wrapper.units[1]).toBeUndefined();
            expect(wrapper.units[2]).toBeUndefined();
        });

        it('should bind null values to unbind a unit', function ()
        {
            var tex0 = createMockTexture('t0');
            wrapper.units[0] = tex0;
            wrapper.bindUnits([ null ]);
            expect(wrapper.units[0]).toBeNull();
        });

        it('should respect maxTextures and ignore extra entries', function ()
        {
            var textures = [];
            for (var i = 0; i <= renderer.maxTextures; i++)
            {
                textures.push(createMockTexture('t' + i));
            }
            renderer.gl.bindTexture.mockClear();
            wrapper.bindUnits(textures);
            // Only maxTextures number of binds should occur (some units may already be bound)
            expect(renderer.gl.bindTexture.mock.calls.length).toBeLessThanOrEqual(renderer.maxTextures);
        });

        it('should use force flag when provided', function ()
        {
            var tex0 = createMockTexture('t0');
            wrapper.units[0] = tex0;
            renderer.gl.bindTexture.mockClear();
            wrapper.bindUnits([ tex0 ], true);
            expect(renderer.gl.bindTexture).toHaveBeenCalled();
        });

        it('should handle an empty array without errors', function ()
        {
            expect(function ()
            {
                wrapper.bindUnits([]);
            }).not.toThrow();
        });

        it('should bind textures to all units when array fills maxTextures', function ()
        {
            var textures = [];
            for (var i = 0; i < renderer.maxTextures; i++)
            {
                textures.push(createMockTexture('t' + i));
            }
            wrapper.bindUnits(textures);
            for (var j = 0; j < renderer.maxTextures; j++)
            {
                expect(wrapper.units[j]).toBe(textures[j]);
            }
        });
    });

    describe('unbindTexture', function ()
    {
        it('should unbind the texture from the unit it is bound to', function ()
        {
            var texture = createMockTexture('target');
            wrapper.units[1] = texture;
            wrapper.unbindTexture(texture);
            expect(wrapper.units[1]).toBeNull();
        });

        it('should unbind the texture from multiple units if bound to several', function ()
        {
            var texture = createMockTexture('multi');
            wrapper.units[0] = texture;
            wrapper.units[2] = texture;
            wrapper.unbindTexture(texture);
            expect(wrapper.units[0]).toBeNull();
            expect(wrapper.units[2]).toBeNull();
        });

        it('should not affect units bound to other textures', function ()
        {
            var target = createMockTexture('target');
            var other = createMockTexture('other');
            wrapper.units[0] = target;
            wrapper.units[1] = other;
            wrapper.unbindTexture(target);
            expect(wrapper.units[1]).toBe(other);
        });

        it('should not affect units that are null', function ()
        {
            var texture = createMockTexture('t');
            wrapper.units[0] = null;
            wrapper.units[1] = texture;
            wrapper.unbindTexture(texture);
            expect(wrapper.units[0]).toBeNull();
            expect(wrapper.units[1]).toBeNull();
        });

        it('should do nothing when texture is not bound to any unit', function ()
        {
            var texture = createMockTexture('unbound');
            var other = createMockTexture('other');
            wrapper.units[0] = other;
            wrapper.unbindTexture(texture);
            expect(wrapper.units[0]).toBe(other);
        });

        it('should call gl.bindTexture with null for each matching unit', function ()
        {
            var texture = createMockTexture('t');
            wrapper.units[0] = texture;
            wrapper.units[3] = texture;
            renderer.gl.bindTexture.mockClear();
            wrapper.unbindTexture(texture);
            var nullBindCalls = renderer.gl.bindTexture.mock.calls.filter(function (call)
            {
                return call[1] === null;
            });
            expect(nullBindCalls.length).toBe(2);
        });
    });

    describe('unbindAllUnits', function ()
    {
        it('should set all units to null', function ()
        {
            var tex0 = createMockTexture('t0');
            var tex1 = createMockTexture('t1');
            wrapper.units[0] = tex0;
            wrapper.units[1] = tex1;
            wrapper.unbindAllUnits();
            for (var i = 0; i < wrapper.units.length; i++)
            {
                expect(wrapper.units[i]).toBeNull();
            }
        });

        it('should call gl.bindTexture with null for every unit', function ()
        {
            renderer.gl.bindTexture.mockClear();
            wrapper.unbindAllUnits();
            expect(renderer.gl.bindTexture).toHaveBeenCalledTimes(wrapper.units.length);
            renderer.gl.bindTexture.mock.calls.forEach(function (call)
            {
                expect(call[1]).toBeNull();
            });
        });

        it('should work when all units are already null', function ()
        {
            for (var i = 0; i < renderer.maxTextures; i++)
            {
                wrapper.units[i] = null;
            }
            expect(function ()
            {
                wrapper.unbindAllUnits();
            }).not.toThrow();
            for (var j = 0; j < renderer.maxTextures; j++)
            {
                expect(wrapper.units[j]).toBeNull();
            }
        });

        it('should work when units are a mix of textures, null, and undefined', function ()
        {
            var texture = createMockTexture('mixed');
            wrapper.units[0] = texture;
            wrapper.units[1] = null;
            wrapper.units[2] = undefined;
            wrapper.unbindAllUnits();
            for (var i = 0; i < 3; i++)
            {
                expect(wrapper.units[i]).toBeNull();
            }
        });
    });
});
